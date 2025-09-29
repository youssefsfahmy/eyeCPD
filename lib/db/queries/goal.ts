import { eq, desc, and } from "drizzle-orm";
import { db } from "../drizzle";
import { goals, type Goal, type NewGoal } from "../schema";

export class GoalQueries {
  /**
   * Get all goals for a user
   */
  static async getGoalsByUserId(userId: string): Promise<Goal[]> {
    const result = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.year), desc(goals.createdAt));

    return result;
  }

  /**
   * Get goals by user ID and year
   */
  static async getGoalsByUserIdAndYear(
    userId: string,
    year: string
  ): Promise<Goal[]> {
    const result = await db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.year, year)))
      .orderBy(desc(goals.createdAt));

    return result;
  }

  /**
   * Get goal by ID and user ID
   */
  static async getGoalById(id: number, userId: string): Promise<Goal | null> {
    const result = await db
      .select()
      .from(goals)
      .where(eq(goals.id, id))
      .limit(1);

    // Verify the goal belongs to the user
    const goal = result[0];
    if (goal && goal.userId === userId) {
      return goal;
    }
    return null;
  }

  /**
   * Create a new goal record
   */
  static async createGoal(goalData: NewGoal): Promise<Goal> {
    const result = await db.insert(goals).values(goalData).returning();
    return result[0];
  }

  /**
   * Update an existing goal record
   */
  static async updateGoal(
    id: number,
    userId: string,
    goalData: Partial<Omit<Goal, "id" | "userId" | "createdAt">>
  ): Promise<Goal | null> {
    const result = await db
      .update(goals)
      .set({
        ...goalData,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, id))
      .returning();

    // Verify the goal belongs to the user
    const goal = result[0];
    if (goal && goal.userId === userId) {
      return goal;
    }
    return null;
  }

  /**
   * Delete a goal record
   */
  static async deleteGoal(id: number, userId: string): Promise<boolean> {
    // First verify the goal belongs to the user
    const goal = await this.getGoalById(id, userId);
    if (!goal) {
      return false;
    }

    const result = await db.delete(goals).where(eq(goals.id, id)).returning();

    return result.length > 0;
  }

  /**
   * Get goal statistics for a user
   */
  static async getGoalStats(
    userId: string,
    year?: string
  ): Promise<{
    totalGoals: number;
    goalsByType: {
      clinical: number;
      nonClinical: number;
      interactive: number;
      therapeutic: number;
    };
    totalTargetHours: number;
  }> {
    let userGoals: Goal[];

    if (year) {
      userGoals = await this.getGoalsByUserIdAndYear(userId, year);
    } else {
      userGoals = await this.getGoalsByUserId(userId);
    }

    const stats = userGoals.reduce(
      (acc, goal) => {
        acc.totalGoals += 1;

        // Count goals by type (goals can have multiple types)
        if (goal.clinical) acc.goalsByType.clinical += 1;
        if (goal.nonClinical) acc.goalsByType.nonClinical += 1;
        if (goal.interactive) acc.goalsByType.interactive += 1;
        if (goal.therapeutic) acc.goalsByType.therapeutic += 1;

        if (goal.targetHours) {
          acc.totalTargetHours += parseFloat(goal.targetHours);
        }

        return acc;
      },
      {
        totalGoals: 0,
        goalsByType: {
          clinical: 0,
          nonClinical: 0,
          interactive: 0,
          therapeutic: 0,
        },
        totalTargetHours: 0,
      }
    );

    return stats;
  }
}
