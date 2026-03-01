"use server";

import { createClient } from "@/app/lib/supabase/server";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { UserRole } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function toggleAdminRoleServerAction(
  targetUserId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify the current user is an admin
  const currentProfile = await ProfileQueries.getProfileByUserId(user.id);
  if (!currentProfile?.roles?.includes(UserRole.ADMIN)) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  // Prevent removing your own admin role
  if (targetUserId === user.id) {
    return { success: false, error: "You cannot modify your own admin role." };
  }

  // Get the target user's profile
  const targetProfile = await ProfileQueries.getProfileByUserId(targetUserId);
  if (!targetProfile) {
    return { success: false, error: "User not found." };
  }

  const currentRoles = targetProfile.roles || [];
  const isCurrentlyAdmin = currentRoles.includes(UserRole.ADMIN);

  let newRoles: string[];
  if (isCurrentlyAdmin) {
    // Remove admin role
    newRoles = currentRoles.filter((r) => r !== UserRole.ADMIN);
    // Ensure they still have at least one role
    if (newRoles.length === 0) {
      newRoles = [UserRole.OPTOMETRIST];
    }
  } else {
    // Add admin role
    newRoles = [...currentRoles, UserRole.ADMIN];
  }

  try {
    await ProfileQueries.updateProfile(targetUserId, { roles: newRoles });
    revalidatePath(`/admin/users/${targetUserId}`);
    revalidatePath("/admin/users/list");
    return { success: true };
  } catch (error) {
    console.error("Error toggling admin role:", error);
    return { success: false, error: "Failed to update user role." };
  }
}
