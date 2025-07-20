import { NextRequest, NextResponse } from "next/server";
import { SubscriptionQueries } from "@/lib/queries/subscription";
import { createClient } from "@/app/lib/supabase/server";
import { stripe } from "@/lib/payments/stripe";

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
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includePlans = searchParams.get("include_plans") === "true";

    // Get user's current subscription
    const subscription = await SubscriptionQueries.getSubscriptionByUserId(
      user.id
    );

    let availablePlans = null;
    let currentStripeSubscription = null;

    // If user wants to see available plans or has a subscription, fetch from Stripe
    if (includePlans) {
      // Get available subscription plans from Stripe
      const products = await stripe.products.list({
        active: true,
        expand: ["data.default_price"],
      });

      const prices = await stripe.prices.list({
        active: true,
        type: "recurring",
        expand: ["data.product"],
      });

      availablePlans = products.data
        .map((product) => {
          const productPrices = prices.data.filter(
            (price) =>
              typeof price.product === "object" &&
              price.product.id === product.id
          );

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            images: product.images,
            metadata: product.metadata,
            prices: productPrices.map((price) => ({
              id: price.id,
              currency: price.currency,
              unit_amount: price.unit_amount,
              recurring: price.recurring,
              nickname: price.nickname,
              metadata: price.metadata,
            })),
          };
        })
        .filter((plan) => plan.prices.length > 0);
    }

    // If user has a subscription, get detailed info from Stripe
    if (subscription?.stripeSubscriptionId) {
      try {
        currentStripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripeSubscriptionId,
          {
            expand: ["items.data.price.product"],
          }
        );
      } catch (stripeError) {
        console.error("Error fetching Stripe subscription:", stripeError);
        // Continue without Stripe data if there's an error
      }
    }

    return NextResponse.json({
      subscription,
      stripeSubscription: currentStripeSubscription,
      availablePlans,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Get user's current subscription
    const subscription = await SubscriptionQueries.getSubscriptionByUserId(
      user.id
    );

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Update subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "create_prorations" as const,
      }
    );

    // Update subscription in database
    const updatedDBSubscription = await SubscriptionQueries.updateSubscription(
      user.id,
      {
        stripePriceId: priceId,
        status: updatedSubscription.status,
        updatedAt: new Date(),
      }
    );

    return NextResponse.json({
      success: true,
      subscription: updatedDBSubscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
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
        { status: 401 }
      );
    }

    // Get user's current subscription
    const subscription = await SubscriptionQueries.getSubscriptionByUserId(
      user.id
    );

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Cancel subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update subscription in database
    await SubscriptionQueries.updateSubscription(user.id, {
      status: "canceled",
      cancelAtPeriodEnd: canceledSubscription.cancel_at
        ? new Date(canceledSubscription.cancel_at * 1000)
        : null,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      subscription: canceledSubscription,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
