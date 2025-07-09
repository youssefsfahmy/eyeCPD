// import { createClient } from "@/lib/supabase/server";
// import { User } from "@supabase/supabase-js";
// import { ProfileQueries } from "@/lib/db/queries/profile";
// import {
//   ProfileData,
//   ProfileCreateData,
//   ProfileUpdateData,
// } from "@/lib/types/profile";

// export class ProfileService {
//   private async getSupabase() {
//     return await createClient();
//   }

//   /**
//    * Get the current authenticated user
//    */
//   async getCurrentUser(): Promise<User | null> {
//     const supabase = await this.getSupabase();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     return user;
//   }

//   /**
//    * Get profile data for a specific user
//    */
//   async getProfile(userId: string): Promise<ProfileData | null> {
//     try {
//       return await ProfileQueries.getProfileByUserId(userId);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       return null;
//     }
//   }

//   /**
//    * Create a new profile for a user
//    */
//   async createProfile(profileData: ProfileCreateData): Promise<ProfileData> {
//     return await ProfileQueries.createProfile(profileData);
//   }

//   /**
//    * Update an existing profile
//    */
//   async updateProfile(
//     userId: string,
//     profileData: ProfileUpdateData
//   ): Promise<ProfileData> {
//     const updated = await ProfileQueries.updateProfile(userId, profileData);
//     if (!updated) {
//       throw new Error("Profile not found or failed to update");
//     }
//     return updated;
//   }

//   /**
//    * Upsert (create or update) a profile
//    */
//   async upsertProfile(
//     userId: string,
//     profileData: ProfileUpdateData
//   ): Promise<ProfileData> {
//     // Convert ProfileUpdateData to the format expected by upsertProfile
//     const upsertData = {
//       first_name: profileData.first_name || "",
//       last_name: profileData.last_name || "",
//       phone: profileData.phone || "",
//       registration_number: profileData.registration_number || "",
//       role: profileData.role || "optometrist",
//     };

//     return await ProfileQueries.upsertProfile(userId, upsertData);
//   }

//   /**
//    * Create initial profile from user metadata
//    */
//   async createInitialProfile(user: User): Promise<ProfileData> {
//     const profileData: ProfileCreateData = {
//       userId: user.id,
//       first_name: user.user_metadata?.first_name || "",
//       last_name: user.user_metadata?.last_name || "",
//       phone: user.user_metadata?.phone || "",
//       registration_number: "",
//       role: user.user_metadata?.role || "optometrist",
//     };

//     return await this.createProfile(profileData);
//   }

//   /**
//    * Get or create profile for current user
//    */
//   async getProfileFromUser(): Promise<{
//     user: User;
//     profile: ProfileData | null;
//   } | null> {
//     const user = await this.getCurrentUser();
//     if (!user) return null;

//     const profile = await this.getProfile(user.id);

//     return { user, profile };
//   }

//   /**
//    * Delete a profile
//    */
//   async deleteProfile(userId: string): Promise<void> {
//     const deleted = await ProfileQueries.deleteProfile(userId);
//     if (!deleted) {
//       throw new Error("Profile not found or failed to delete");
//     }
//   }
// }
