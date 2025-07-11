import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { subscriptions } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { ProfileQueries } from "@/lib/db/queries/profile";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    if (!session) {
      throw new Error("No session found with the provided session ID.");
    }
    if (!session.customer || typeof session.customer === "string") {
      throw new Error("Invalid customer data from Stripe.");
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error("No subscription found for this session.");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error("No plan found for this subscription.");
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error("No product ID found for this subscription.");
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    // Verify user exists in Supabase auth
    const profile = await ProfileQueries.getProfileByUserId(userId);

    if (!profile) {
      throw new Error("User profile not found: " + userId);
    }

    // Create or update subscription for the user
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription.length > 0) {
      // Update existing subscription
      await db
        .update(subscriptions)
        .set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: plan.id,
          status: subscription.status,
          planName: (plan.product as Stripe.Product).name,
          currentPeriodStart: new Date(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (subscription as any).current_period_start * 1000
          ),
          currentPeriodEnd: new Date(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (subscription as any).current_period_end * 1000
          ),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId));
    } else {
      // Create new subscription
      await db.insert(subscriptions).values({
        userId: userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: plan.id,
        status: subscription.status,
        planName: (plan.product as Stripe.Product).name,
        // currentPeriodStart: new Date(subscription.current_period_start * 1000),
        // currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
    }

    return NextResponse.redirect(new URL("/opt", request.url));
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId } = body;

    // Validate required fields
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

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

    // Check if user already has an active subscription
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    if (
      existingSubscription.length > 0 &&
      existingSubscription[0].status === "active"
    ) {
      // Redirect to Stripe Customer Portal for subscription management
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: existingSubscription[0].stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/opt`,
      });

      return NextResponse.json({
        url: portalSession.url,
        message: "Redirecting to subscription management portal",
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/subscriptions/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      client_reference_id: user.id,
      customer_email: user.email,
      customer: existingSubscription[0]?.stripeCustomerId || undefined,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 14,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
