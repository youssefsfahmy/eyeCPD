// import { createClient } from "@/lib/supabase/server";
// import { User } from "@supabase/supabase-js";
// import { SubscriptionQueries } from "@/lib/db/queries/subscription";
// import { stripe } from "@/lib/payments/stripe";
// import {
//   Subscription,
//   NewSubscription,
//   SubscriptionStatus,
// } from "@/lib/db/schema";

// export class SubscriptionService {
//   private async getSupabase() {
//     return await createClient();
//   }

//   /**
//    * Get the current authenticated user
//    */
//   async getCurrentUser(): Promise<User | null> {
//     const supabase = await this.getSupabase();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     return user;
//   }

//   /**
//    * Get subscription for a specific user
//    */
//   async getSubscription(userId: string): Promise<Subscription | null> {
//     try {
//       return await SubscriptionQueries.getSubscriptionByUserId(userId);
//     } catch (error) {
//       console.error("Error fetching subscription:", error);
//       return null;
//     }
//   }

//   /**
//    * Get subscription for current user
//    */
//   async getSubscriptionForCurrentUser(): Promise<{
//     user: User;
//     subscription: Subscription | null;
//   } | null> {
//     const user = await this.getCurrentUser();
//     if (!user) return null;

//     const subscription = await this.getSubscription(user.id);
//     return { user, subscription };
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
