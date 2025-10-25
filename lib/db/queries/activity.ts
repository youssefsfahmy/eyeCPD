import { eq, desc, and, gte, lte } from "drizzle-orm";
import { db } from "../drizzle";
import {
  activityRecords,
  ActivityWithTags,
  type ActivityRecord,
  type NewActivityRecord,
} from "../schema";

export class ActivityQueries {
  /**
   * Get all activities for a user
   */
  static async getActivitiesByUserId(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    includeDraft?: boolean
  ): Promise<ActivityWithTags[]> {
    // Build where conditions dynamically
    const conditions = [eq(activityRecords.userId, userId)];

    if (startDate) {
      conditions.push(
        gte(activityRecords.date, startDate.toISOString().split("T")[0])
      );
    }

    if (endDate) {
      conditions.push(
        lte(activityRecords.date, endDate.toISOString().split("T")[0])
      );
    }
    if (!includeDraft) {
      conditions.push(eq(activityRecords.isDraft, false));
    }

    const result = await db.query.activityRecords.findMany({
      where: and(...conditions),
      with: {
        activityToTags: {
          with: { tag: true },
        },
        provider: true,
      },
      orderBy: [desc(activityRecords.date), desc(activityRecords.createdAt)],
    });

    return result;
  }

  /**
   * Get only published (non-draft) activities for a user
   */
  static async getPublishedActivitiesByUserId(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ActivityRecord[]> {
    // Build where conditions dynamically
    const conditions = [
      eq(activityRecords.userId, userId),
      eq(activityRecords.isDraft, false),
    ];

    if (startDate) {
      conditions.push(
        gte(activityRecords.date, startDate.toISOString().split("T")[0])
      );
    }

    if (endDate) {
      conditions.push(
        lte(activityRecords.date, endDate.toISOString().split("T")[0])
      );
    }

    const result = await db
      .select()
      .from(activityRecords)
      .where(and(...conditions))
      .orderBy(desc(activityRecords.date), desc(activityRecords.createdAt));

    return result;
  }

  /**
   * Get activity by ID and user ID
   */
  static async getActivityById(
    id: number,
    userId: string
  ): Promise<ActivityWithTags | null> {
    const row = await db.query.activityRecords.findFirst({
      where: (ar, { and, eq }) => and(eq(ar.id, id), eq(ar.userId, userId)),
      with: {
        activityToTags: {
          with: { tag: true }, // <— gives you the tag row
        },
        provider: true,
      },
    });

    return row || null;
  }

  /**
   * Create a new activity record
   */
  static async createActivity(
    activityData: NewActivityRecord
  ): Promise<ActivityRecord> {
    const result = await db
      .insert(activityRecords)
      .values(activityData)
      .returning();
    return result[0];
  }

  /**
   * Update an existing activity record
   */
  static async updateActivity(
    id: number,
    userId: string,
    activityData: Partial<Omit<ActivityRecord, "id" | "userId" | "createdAt">>
  ): Promise<ActivityRecord | null> {
    const result = await db
      .update(activityRecords)
      .set({
        ...activityData,
        updatedAt: new Date(),
      })
      .where(eq(activityRecords.id, id))
      .returning();

    // Verify the activity belongs to the user
    const activity = result[0];
    if (activity && activity.userId === userId) {
      return activity;
    }
    return null;
  }

  /**
   * Delete an activity record
   */
  static async deleteActivity(id: number, userId: string): Promise<boolean> {
    // First verify the activity belongs to the user
    const activity = await this.getActivityById(id, userId);
    if (!activity) {
      return false;
    }

    const result = await db
      .delete(activityRecords)
      .where(eq(activityRecords.id, id))
      .returning();

    return result.length > 0;
  }

  /**
   * Get activity statistics for a user (only published activities)
   */
  static async getActivityStats(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalHours: number;
    clinicalHours: number;
    nonClinicalHours: number;
    interactiveHours: number;
    therapeuticHours: number;
    totalActivities: number;
  }> {
    const activities = await this.getPublishedActivitiesByUserId(
      userId,
      startDate,
      endDate
    );

    const stats = activities.reduce(
      (acc, activity) => {
        const hours = parseFloat(activity.hours);
        acc.totalHours += hours;
        acc.totalActivities += 1;

        if (activity.clinical) acc.clinicalHours += hours;
        if (activity.nonClinical) acc.nonClinicalHours += hours;
        if (activity.interactive) acc.interactiveHours += hours;
        if (activity.therapeutic) acc.therapeuticHours += hours;

        return acc;
      },
      {
        totalHours: 0,
        clinicalHours: 0,
        nonClinicalHours: 0,
        interactiveHours: 0,
        therapeuticHours: 0,
        totalActivities: 0,
      }
    );

    return stats;
  }
}
