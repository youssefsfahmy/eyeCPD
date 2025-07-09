import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import {
  subscriptions,
  type Subscription,
  type NewSubscription,
} from "../schema";

export class SubscriptionQueries {
  /**
   * Get subscription by user ID
   */
  static async getSubscriptionByUserId(
    userId: string
  ): Promise<Subscription | null> {
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get subscription by Stripe customer ID
   */
  static async getSubscriptionByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<Subscription | null> {
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get subscription by Stripe subscription ID
   */
  static async getSubscriptionByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null> {
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(
    subscriptionData: NewSubscription
  ): Promise<Subscription> {
    const result = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();

    return result[0];
  }

  /**
   * Update an existing subscription
   */
  static async updateSubscription(
    userId: string,
    subscriptionData: Partial<Omit<Subscription, "id" | "userId" | "createdAt">>
  ): Promise<Subscription | null> {
    const result = await db
      .update(subscriptions)
      .set({
        ...subscriptionData,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId))
      .returning();

    return result[0] || null;
  }

  /**
   * Update subscription by Stripe subscription ID
   */
  static async updateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    subscriptionData: Partial<Omit<Subscription, "id" | "createdAt">>
  ): Promise<Subscription | null> {
    const result = await db
      .update(subscriptions)
      .set({
        ...subscriptionData,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();

    return result[0] || null;
  }

  /**
   * Upsert (create or update) a subscription
   */
  static async upsertSubscription(
    userId: string,
    subscriptionData: Omit<NewSubscription, "userId">
  ): Promise<Subscription> {
    const existingSubscription = await this.getSubscriptionByUserId(userId);

    if (existingSubscription) {
      const updated = await this.updateSubscription(userId, subscriptionData);
      if (!updated) {
        throw new Error("Failed to update subscription");
      }
      return updated;
    } else {
      return await this.createSubscription({
        userId,
        ...subscriptionData,
      });
    }
  }

  /**
   * Delete a subscription
   */
  static async deleteSubscription(userId: string): Promise<boolean> {
    const result = await db
      .delete(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .returning({ id: subscriptions.id });

    return result.length > 0;
  }

  /**
   * Get all subscriptions (admin function)
   */
  static async getAllSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }

  /**
   * Get subscriptions by status
   */
  static async getSubscriptionsByStatus(
    status: string
  ): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, status));
  }

  /**
   * Get active subscriptions
   */
  static async getActiveSubscriptions(): Promise<Subscription[]> {
    return await this.getSubscriptionsByStatus("active");
  }

  /**
   * Cancel subscription (mark for cancellation at period end)
   */
  static async cancelSubscription(
    userId: string,
    cancelAtPeriodEnd: Date
  ): Promise<Subscription | null> {
    return await this.updateSubscription(userId, {
      cancelAtPeriodEnd,
      updatedAt: new Date(),
    });
  }
}
