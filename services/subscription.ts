import { createClient } from "@/app/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { SubscriptionQueries } from "@/lib/queries/subscription";
import { stripe } from "@/lib/payments/stripe";
import {
  Subscription,
  NewSubscription,
  SubscriptionStatus,
} from "@/lib/db/schema";

interface BillingInvoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  period_start: number | null;
  period_end: number | null;
  description: string | null;
  number: string | null;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  metadata: Record<string, string>;
  prices: {
    id: string;
    currency: string;
    unit_amount: number | null;
    recurring: {
      interval: string;
      interval_count: number;
    } | null;
    nickname: string | null;
    metadata: Record<string, string>;
  }[];
}

export class SubscriptionService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    const supabase = await this.getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Get subscription for a specific user
   */
  async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      return await SubscriptionQueries.getSubscriptionByUserId(userId);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }
  }

  /**
   * Get subscription for current user
   */
  async getSubscriptionForCurrentUser(): Promise<{
    user: User;
    subscription: Subscription | null;
  } | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const subscription = await this.getSubscription(user.id);
    return { user, subscription };
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    subscriptionData: NewSubscription
  ): Promise<Subscription | null> {
    try {
      return await SubscriptionQueries.createSubscription(subscriptionData);
    } catch (error) {
      console.error("Error creating subscription:", error);
      return null;
    }
  }

  /**
   * Update an existing subscription
   */
  async updateSubscription(
    userId: string,
    updateData: Partial<Omit<Subscription, "id" | "userId" | "createdAt">>
  ): Promise<Subscription | null> {
    try {
      return await SubscriptionQueries.updateSubscription(userId, updateData);
    } catch (error) {
      console.error("Error updating subscription:", error);
      return null;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      if (!subscription?.stripeSubscriptionId) {
        return false;
      }

      // Cancel in Stripe
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update in database
      await this.updateSubscription(userId, {
        status: SubscriptionStatus.CANCELED,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      return false;
    }
  }

  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      if (!subscription?.stripeSubscriptionId) {
        return false;
      }

      // Reactivate in Stripe
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });

      // Update in database
      await this.updateSubscription(userId, {
        status: SubscriptionStatus.ACTIVE,
        cancelAtPeriodEnd: null,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      return false;
    }
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId);
    return (
      subscription?.status === SubscriptionStatus.ACTIVE ||
      subscription?.status === SubscriptionStatus.TRIALING
    );
  }

  /**
   * Get subscription billing history
   */
  async getBillingHistory(userId: string): Promise<BillingInvoice[]> {
    try {
      const subscription = await this.getSubscription(userId);
      if (!subscription?.stripeCustomerId) {
        return [];
      }

      const invoices = await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 20,
        status: "paid",
      });

      return invoices.data.map((invoice) => ({
        id: invoice.id || "",
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status || "unknown",
        created: invoice.created,
        hosted_invoice_url: invoice.hosted_invoice_url || null,
        invoice_pdf: invoice.invoice_pdf || null,
        period_start: invoice.period_start || null,
        period_end: invoice.period_end || null,
        description: invoice.description,
        number: invoice.number,
      }));
    } catch (error) {
      console.error("Error fetching billing history:", error);
      return [];
    }
  }

  /**
   * Create a Stripe checkout session
   */
  async createCheckoutSession(
    userId: string,
    priceId: string,
    userEmail?: string
  ): Promise<string | null> {
    try {
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
        client_reference_id: userId,
        customer_email: userEmail,

        metadata: {
          userId,
        },
      });

      return session.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return null;
    }
  }

  /**
   * Create a Stripe customer portal session
   */
  async createPortalSession(
    userId: string,
    returnUrl?: string
  ): Promise<string | null> {
    try {
      const subscription = await this.getSubscription(userId);
      if (!subscription?.stripeCustomerId) {
        return null;
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url:
          returnUrl ||
          `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscriptions`,
      });

      return session.url;
    } catch (error) {
      console.error("Error creating portal session:", error);
      return null;
    }
  }

  /**
   * Get available subscription plans from Stripe
   */
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const products = await stripe.products.list({
        active: true,
        expand: ["data.default_price"],
      });

      const prices = await stripe.prices.list({
        active: true,
        type: "recurring",
        expand: ["data.product"],
      });

      return products.data
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
    } catch (error) {
      console.error("Error fetching available plans:", error);
      return [];
    }
  }
}
//   }

//   /**
//    * Create a new subscription
//    */
//   async createSubscription(
//     subscriptionData: NewSubscription
//   ): Promise<Subscription> {
//     return await SubscriptionQueries.createSubscription(subscriptionData);
//   }

//   /**
//    * Update an existing subscription
//    */
//   async updateSubscription(
//     userId: string,
//     subscriptionData: Partial<Omit<Subscription, "id" | "userId" | "createdAt">>
//   ): Promise<Subscription> {
//     const updated = await SubscriptionQueries.updateSubscription(
//       userId,
//       subscriptionData
//     );
//     if (!updated) {
//       throw new Error("Subscription not found or failed to update");
//     }
//     return updated;
//   }

//   /**
//    * Cancel a subscription (immediately)
//    */
//   async cancelSubscription(userId: string): Promise<void> {
//     const subscription = await this.getSubscription(userId);
//     if (!subscription) {
//       throw new Error("Subscription not found");
//     }

//     // Cancel in Stripe first
//     if (subscription.stripeSubscriptionId) {
//       await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
//     }

//     // Update local database
//     await this.updateSubscription(userId, {
//       status: SubscriptionStatus.CANCELED,
//       cancelAtPeriodEnd: new Date(),
//     });
//   }

//   /**
//    * Mark subscription for cancellation at period end
//    */
//   async cancelAtPeriodEnd(userId: string): Promise<Subscription> {
//     const subscription = await this.getSubscription(userId);
//     if (!subscription) {
//       throw new Error("Subscription not found");
//     }

//     // Update in Stripe
//     if (subscription.stripeSubscriptionId) {
//       await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
//         cancel_at_period_end: true,
//       });
//     }

//     // Update local database
//     return await this.updateSubscription(userId, {
//       cancelAtPeriodEnd: subscription.currentPeriodEnd || new Date(),
//     });
//   }

//   /**
//    * Resume a subscription that was marked for cancellation
//    */
//   async resumeSubscription(userId: string): Promise<Subscription> {
//     const subscription = await this.getSubscription(userId);
//     if (!subscription) {
//       throw new Error("Subscription not found");
//     }

//     // Update in Stripe
//     if (subscription.stripeSubscriptionId) {
//       await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
//         cancel_at_period_end: false,
//       });
//     }

//     // Update local database
//     return await this.updateSubscription(userId, {
//       cancelAtPeriodEnd: null,
//       status: SubscriptionStatus.ACTIVE,
//     });
//   }

//   /**
//    * Check if subscription is active
//    */
//   async isSubscriptionActive(userId: string): Promise<boolean> {
//     const subscription = await this.getSubscription(userId);
//     if (!subscription) return false;

//     const activeStatuses = [
//       SubscriptionStatus.ACTIVE,
//       SubscriptionStatus.TRIALING,
//     ];

//     return activeStatuses.includes(subscription.status as SubscriptionStatus);
//   }

//   /**
//    * Get subscription status for current user
//    */
//   async getCurrentUserSubscriptionStatus(): Promise<{
//     hasSubscription: boolean;
//     isActive: boolean;
//     subscription: Subscription | null;
//   }> {
//     const user = await this.getCurrentUser();
//     if (!user) {
//       return { hasSubscription: false, isActive: false, subscription: null };
//     }

//     const subscription = await this.getSubscription(user.id);
//     const isActive = subscription
//       ? await this.isSubscriptionActive(user.id)
//       : false;

//     return {
//       hasSubscription: !!subscription,
//       isActive,
//       subscription,
//     };
//   }

//   /**
//    * Create a Stripe checkout session
//    */
//   async createCheckoutSession(
//     userId: string,
//     priceId: string,
//     successUrl: string,
//     cancelUrl: string
//   ): Promise<string> {
//     const user = await this.getCurrentUser();
//     if (!user || user.id !== userId) {
//       throw new Error("User not authenticated");
//     }

//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       client_reference_id: userId,
//       customer_email: user.email,
//     });

//     if (!session.url) {
//       throw new Error("Failed to create checkout session");
//     }

//     return session.url;
//   }

//   /**
//    * Create a Stripe customer portal session
//    */
//   async createCustomerPortalSession(
//     userId: string,
//     returnUrl: string
//   ): Promise<string> {
//     const subscription = await this.getSubscription(userId);
//     if (!subscription || !subscription.stripeCustomerId) {
//       throw new Error("No subscription or customer found");
//     }

//     const session = await stripe.billingPortal.sessions.create({
//       customer: subscription.stripeCustomerId,
//       return_url: returnUrl,
//     });

//     return session.url;
//   }
// }
