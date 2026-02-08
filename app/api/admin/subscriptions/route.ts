/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { SubscriptionQueries } from "@/lib/queries/subscription";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { createClient } from "@/app/lib/supabase/server";
import { UserRole } from "@/lib/db/schema";

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const profile = await ProfileQueries.getProfileByUserId(userId);
    return profile?.roles?.includes(UserRole.ADMIN) ?? false;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const startingAfter = searchParams.get("starting_after");
    const status = searchParams.get("status");

    // Get subscriptions from Stripe
    const stripeParams: any = {
      limit: Math.min(limit, 100), // Cap at 100 per Stripe limits
      expand: ["data.customer", "data.items.data.price.product"],
    };

    if (startingAfter) {
      stripeParams.starting_after = startingAfter;
    }

    if (status) {
      stripeParams.status = status;
    }

    const stripeSubscriptions = await stripe.subscriptions.list(stripeParams);

    // Get local subscription data for comparison
    const localSubscriptions = await SubscriptionQueries.getAllSubscriptions();

    // Combine Stripe and local data
    const combinedData = stripeSubscriptions.data.map((stripeSubscription) => {
      const localSubscription = localSubscriptions.find(
        (local) => local.stripeSubscriptionId === stripeSubscription.id,
      );

      return {
        stripe: {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          customer: stripeSubscription.customer,
          //   current_period_start: stripeSubscription.current_period_start,
          //   current_period_end: stripeSubscription.current_period_end,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          canceled_at: stripeSubscription.canceled_at,
          items: stripeSubscription.items,
          metadata: stripeSubscription.metadata,
        },
        local: localSubscription
          ? {
              id: localSubscription.id,
              userId: localSubscription.userId,
              status: localSubscription.status,
              planName: localSubscription.planName,
              currentPeriodStart: localSubscription.currentPeriodStart,
              currentPeriodEnd: localSubscription.currentPeriodEnd,
              cancelAtPeriodEnd: localSubscription.cancelAtPeriodEnd,
              createdAt: localSubscription.createdAt,
              updatedAt: localSubscription.updatedAt,
            }
          : null,
        synced: !!localSubscription,
      };
    });

    return NextResponse.json({
      subscriptions: combinedData,
      has_more: stripeSubscriptions.has_more,
      total_count: stripeSubscriptions.data.length,
    });
  } catch (error) {
    console.error("Error fetching all subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { action, subscriptionId } = body;

    if (action === "sync") {
      // Sync a specific subscription from Stripe to local database
      if (!subscriptionId) {
        return NextResponse.json(
          { error: "Subscription ID is required for sync" },
          { status: 400 },
        );
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscriptionId,
        {
          expand: ["customer", "items.data.price.product"],
        },
      );

      // Find customer's user ID (this would need to be implemented based on your customer mapping)
      const localSubscription =
        await SubscriptionQueries.getSubscriptionByStripeSubscriptionId(
          subscriptionId,
        );

      if (!localSubscription) {
        return NextResponse.json(
          {
            error:
              "Local subscription not found - cannot sync without user mapping",
          },
          { status: 404 },
        );
      }

      // Update local subscription with Stripe data
      const updated = await SubscriptionQueries.updateSubscriptionByStripeId(
        subscriptionId,
        {
          status: stripeSubscription.status,
          currentPeriodStart: new Date(
            (stripeSubscription as any).current_period_start * 1000,
          ),
          currentPeriodEnd: new Date(
            (stripeSubscription as any).current_period_end * 1000,
          ),
          cancelAtPeriodEnd: stripeSubscription.canceled_at
            ? new Date(stripeSubscription.canceled_at * 1000)
            : null,
        },
      );

      return NextResponse.json({
        message: "Subscription synced successfully",
        subscription: updated,
      });
    }

    if (action === "sync_all") {
      // Sync all subscriptions from Stripe
      let syncedCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Get all local subscriptions that have Stripe IDs
      const localSubscriptions =
        await SubscriptionQueries.getAllSubscriptions();
      const subscriptionsWithStripeIds = localSubscriptions.filter(
        (sub) => sub.stripeSubscriptionId,
      );

      for (const localSub of subscriptionsWithStripeIds) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            localSub.stripeSubscriptionId!,
            { expand: ["customer"] },
          );

          await SubscriptionQueries.updateSubscriptionByStripeId(
            localSub.stripeSubscriptionId!,
            {
              status: stripeSubscription.status,
              currentPeriodStart: new Date(
                (stripeSubscription as any).current_period_start * 1000,
              ),
              currentPeriodEnd: new Date(
                (stripeSubscription as any).current_period_end * 1000,
              ),
              cancelAtPeriodEnd: stripeSubscription.canceled_at
                ? new Date(stripeSubscription.canceled_at * 1000)
                : null,
            },
          );

          syncedCount++;
        } catch (error) {
          errorCount++;
          errors.push(
            `Failed to sync ${localSub.stripeSubscriptionId}: ${error}`,
          );
          console.error(
            `Error syncing subscription ${localSub.stripeSubscriptionId}:`,
            error,
          );
        }
      }

      return NextResponse.json({
        message: `Sync completed: ${syncedCount} successful, ${errorCount} errors`,
        synced_count: syncedCount,
        error_count: errorCount,
        errors: errors,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: sync, sync_all" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in subscription admin action:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 },
    );
  }
}
