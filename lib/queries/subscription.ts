import { db } from "@/lib/db/drizzle";
import { subscriptions, Subscription, NewSubscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export class SubscriptionQueries {
  /**
   * Get subscription by user ID
   */
  static async getSubscriptionByUserId(
    userId: string
  ): Promise<Subscription | null> {
    try {
      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Error fetching subscription by user ID:", error);
      throw error;
    }
  }

  /**
   * Get subscription by Stripe customer ID
   */
  static async getSubscriptionByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<Subscription | null> {
    try {
      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error(
        "Error fetching subscription by Stripe customer ID:",
        error
      );
      throw error;
    }
  }

  /**
   * Get subscription by Stripe subscription ID
   */
  static async getSubscriptionByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null> {
    try {
      const result = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error(
        "Error fetching subscription by Stripe subscription ID:",
        error
      );
      throw error;
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(
    subscriptionData: NewSubscription
  ): Promise<Subscription> {
    try {
      const result = await db
        .insert(subscriptions)
        .values({
          ...subscriptionData,
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  /**
   * Update an existing subscription
   */
  static async updateSubscription(
    userId: string,
    updateData: Partial<Omit<Subscription, "id" | "userId" | "createdAt">>
  ): Promise<Subscription | null> {
    try {
      const result = await db
        .update(subscriptions)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }

  /**
   * Update subscription by Stripe subscription ID
   */
  static async updateSubscriptionByStripeId(
    stripeSubscriptionId: string,
    updateData: Partial<Omit<Subscription, "id" | "userId" | "createdAt">>
  ): Promise<Subscription | null> {
    try {
      const result = await db
        .update(subscriptions)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating subscription by Stripe ID:", error);
      throw error;
    }
  }

  /**
   * Delete a subscription
   */
  static async deleteSubscription(userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting subscription:", error);
      throw error;
    }
  }

  /**
   * Upsert subscription (create or update)
   */
  static async upsertSubscription(
    subscriptionData: NewSubscription
  ): Promise<Subscription> {
    try {
      // First try to find existing subscription
      const existing = await this.getSubscriptionByUserId(
        subscriptionData.userId
      );

      if (existing) {
        // Update existing subscription
        const updated = await this.updateSubscription(
          subscriptionData.userId,
          subscriptionData
        );
        return updated!;
      } else {
        // Create new subscription
        return await this.createSubscription(subscriptionData);
      }
    } catch (error) {
      console.error("Error upserting subscription:", error);
      throw error;
    }
  }

  /**
   * Get all subscriptions
   */
  static async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const result = await db.select().from(subscriptions);
      return result;
    } catch (error) {
      console.error("Error fetching all subscriptions:", error);
      throw error;
    }
  }
}
