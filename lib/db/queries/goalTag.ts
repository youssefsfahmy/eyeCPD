// Goal tag queries for managing goal-tag relationships
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { Tag, goalsToTags } from "../schema";

export class GoalTagQueries {
  /**
   * Link tags to a goal
   */
  static async linkTagsToGoal(goalId: number, tags: Tag[]): Promise<void> {
    await db
      .insert(goalsToTags)
      .values(
        tags.map((tag) => ({
          goalId: goalId,
          tagId: tag.id!,
        }))
      )
      .onConflictDoNothing() // Avoid duplicate entries
      .execute();
  }

  /**
   * Unlink all tags from a goal
   */
  static async unlinkTagsFromGoal(goalId: number): Promise<void> {
    await db
      .delete(goalsToTags)
      .where(eq(goalsToTags.goalId, goalId))
      .execute();
  }
}
