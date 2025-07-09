import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { SubscriptionQueries } from "@/lib/db/queries/subscription";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// Extended Stripe subscription interface to include the period properties
interface StripeSubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
}

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

    // Type assertion to access the subscription data directly
    const subscriptionData =
      subscription as unknown as StripeSubscriptionWithPeriods;

    const plan = subscriptionData.items.data[0]?.price;

    if (!plan) {
      throw new Error("No plan found for this subscription.");
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error("No product ID found for this subscription.");
    }

    const user_id = session.client_reference_id;
    if (!user_id) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    // Verify user exists in Supabase auth
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.admin.getUserById(user_id);

    if (authError || !user) {
      throw new Error("User not found in authentication system.");
    }

    // Check if profile exists
    const profile = await ProfileQueries.getProfileByUserId(user_id);
    if (!profile) {
      throw new Error("User profile not found.");
    }

    // Create or update subscription for the user
    const subscriptionPayload = {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: plan.id,
      status: subscriptionData.status,
      planName: (plan.product as Stripe.Product).name,
      // Note: Stripe timestamps are in seconds, convert to milliseconds for Date
      currentPeriodStart: new Date(
        subscriptionData.current_period_start * 1000
      ),
      currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
    };

    await SubscriptionQueries.upsertSubscription(user_id, subscriptionPayload);

    return NextResponse.redirect(new URL("/opt", request.url));
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
