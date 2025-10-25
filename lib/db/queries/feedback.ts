// create fetch tag global tags and user-specific tags
import { eq, isNull, or } from "drizzle-orm";
import { db } from "../drizzle";
import {
  feedback,
  Feedback,
  FeedbackWithProfile,
  NewFeedback,
} from "../schema";

export class FeedbackQueries {
  /**
   * Get user specific feedback by user ID and global feedback (where userId is null)
   */
  static async getFeedbackByUserId(userId: string): Promise<Feedback[] | null> {
    const conditions = [eq(feedback.userId, userId), isNull(feedback.userId)];

    const result = await db
      .select()
      .from(feedback)
      .where(or(...conditions));

    return result || null;
  }

  /**
   * Create a new feedback record
   */
  static async createFeedback(feedbackData: NewFeedback): Promise<Feedback> {
    const result = await db.insert(feedback).values(feedbackData).returning();
    return result[0];
  }

  /**
   * Get all feedback records with user information ordered by creation date
   */
  static async getAllFeedback(): Promise<FeedbackWithProfile[]> {
    const rows = await db.query.feedback.findMany({
      with: {
        profile: true,
      },
    });

    return rows || [];
  }
}
