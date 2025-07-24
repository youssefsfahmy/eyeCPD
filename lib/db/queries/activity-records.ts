import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { ActivityRecord, activityRecords, NewActivityRecord } from "../schema";

export class ActivityRecordQueries {
  /**
   * Get activity record by user ID
   */
  static async getActivityRecordByUserId(
    userId: string
  ): Promise<ActivityRecord | null> {
    const result = await db
      .select()
      .from(activityRecords)
      .where(eq(activityRecords.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new activity record
   */
  static async createActivityRecord(
    activityRecord: NewActivityRecord
  ): Promise<ActivityRecord> {
    const result = await db
      .insert(activityRecords)
      .values(activityRecord)
      .returning();

    return result[0];
  }

  /**
   * Update an existing activity record
   */
  static async updateActivityRecord(
    userId: string,
    activityData: Partial<Omit<ActivityRecord, "id" | "userId" | "createdAt">>
  ): Promise<ActivityRecord | null> {
    const result = await db
      .update(activityRecords)
      .set({
        ...activityData,
        updatedAt: new Date(),
      })
      .where(eq(activityRecords.userId, userId))
      .returning();

    return result[0] || null;
  }
}
