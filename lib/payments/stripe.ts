import Stripe from "stripe";
import { SubscriptionQueries } from "@/lib/queries/subscription";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

// Extended Stripe subscription interface to include the period properties
export interface StripeSubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
}

/**
 * Handle subscription changes from Stripe webhooks
 */
export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  try {
    // Find existing subscription by Stripe subscription ID
    const existingSubscription =
      await SubscriptionQueries.getSubscriptionByStripeSubscriptionId(
        subscription.id
      );

    if (!existingSubscription) {
      console.error(
        `No subscription found for Stripe subscription ID: ${subscription.id}`
      );
      return;
    }

    const subscriptionWithPeriods =
      subscription as StripeSubscriptionWithPeriods;

    // Update subscription with new data
    const updatedSubscription =
      await SubscriptionQueries.updateSubscriptionByStripeId(subscription.id, {
        status: subscription.status,
        currentPeriodStart: new Date(
          subscriptionWithPeriods.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          subscriptionWithPeriods.current_period_end * 1000
        ),
        cancelAtPeriodEnd: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
      });

    console.log(
      `Updated subscription for user: ${existingSubscription.userId}`,
      updatedSubscription
    );
  } catch (error) {
    console.error("Error handling subscription change:", error);
    throw error;
  }
}
