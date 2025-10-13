// create fetch tag global tags and user-specific tags
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { Tag, activityToTags } from "../schema";

export class ActivityTagQueries {
  /**
   * Link tags to an activity
   */

  static async linkTagsToActivity(
    activityId: number,
    tags: Tag[]
  ): Promise<void> {
    await db
      .insert(activityToTags)
      .values(
        tags.map((tag) => ({
          activityRecordId: activityId,
          tagId: tag.id!,
        }))
      )
      .onConflictDoNothing() // Avoid duplicate entries
      .execute();
  }

  /**
   * Unlink all tags from an activity
   */
  static async unlinkTagsFromActivity(activityId: number): Promise<void> {
    await db
      .delete(activityToTags)
      .where(eq(activityToTags.activityRecordId, activityId))
      .execute();
  }
}
