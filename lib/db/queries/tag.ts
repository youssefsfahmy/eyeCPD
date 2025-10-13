// create fetch tag global tags and user-specific tags
import { eq, isNull, or } from "drizzle-orm";
import { db } from "../drizzle";
import { tags, Tag, NewTag } from "../schema";

export class TagQueries {
  /**
   * Get user specific tags by user ID and global tags (where userId is null)
   */
  static async getTagsByUserId(userId: string): Promise<Tag[] | null> {
    const conditions = [eq(tags.userId, userId), isNull(tags.userId)];

    const result = await db
      .select()
      .from(tags)
      .where(or(...conditions));

    return result || null;
  }

  /**
   * Create a new tag record
   */
  static async createTag(tagData: NewTag): Promise<Tag> {
    const result = await db.insert(tags).values(tagData).returning();
    return result[0];
  }
}
