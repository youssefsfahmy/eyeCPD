import { eq, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { profiles, type Profile, type NewProfile } from "../schema";

export class ProfileQueries {
  /**
   * Get profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    const result = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create a new profile
   */
  static async createProfile(profileData: NewProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profileData).returning();

    return result[0];
  }

  /**
   * Update an existing profile
   */
  static async updateProfile(
    userId: string,
    profileData: Partial<Omit<Profile, "id" | "userId" | "createdAt">>,
  ): Promise<Profile | null> {
    const result = await db
      .update(profiles)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return result[0] || null;
  }

  /**
   * Upsert (create or update) a profile
   */
  static async upsertProfile(
    userId: string,
    profileData: Omit<NewProfile, "userId">,
  ): Promise<Profile> {
    const existingProfile = await this.getProfileByUserId(userId);

    if (existingProfile) {
      const updated = await this.updateProfile(userId, profileData);
      if (!updated) {
        throw new Error("Failed to update profile");
      }
      return updated;
    } else {
      return await this.createProfile({
        userId,
        ...profileData,
      });
    }
  }

  /**
   * Delete a profile
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    const result = await db
      .delete(profiles)
      .where(eq(profiles.userId, userId))
      .returning({ id: profiles.id });

    return result.length > 0;
  }

  /**
   * Get all profiles (admin function)
   */
  static async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }

  /**
   * Get profiles by role (checks if role exists in roles array)
   */
  static async getProfilesByRole(role: string): Promise<Profile[]> {
    return await db
      .select()
      .from(profiles)
      .where(sql`${role} = ANY(${profiles.roles})`);
  }

  /**
   * Get Required Hours by User ID
   */
  static async getRequiredHoursByUserId(userId: string): Promise<number> {
    const profile = await this.getProfileByUserId(userId);
    const baseHours = 20;
    if (profile?.isTherapeuticallyEndorsed) {
      return baseHours + 10; // 30 hours for therapeutically endorsed users
    }
    return baseHours;
  }
}
