import { useCallback } from "react";
import { ProfileUpdateData } from "@/lib/types/profile";
import { useProfile as useProfileContext } from "@/lib/context/profile-context";

interface UseProfileReturn {
  profile: ReturnType<typeof useProfileContext>["profile"];
  user: ReturnType<typeof useProfileContext>["user"];
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  createInitialProfile: () => Promise<void>;
  deleteProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { user, profile, isLoading, error, refreshProfile, signOut } =
    useProfileContext();

  const fetchProfile = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        // Refresh the profile data after successful update
        await refreshProfile();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        console.error("Error updating profile:", err);
        throw new Error(errorMessage);
      }
    },
    [refreshProfile]
  );

  const createInitialProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create initial profile");
      }

      // Refresh the profile data after successful creation
      await refreshProfile();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create profile";
      console.error("Error creating profile:", err);
      throw new Error(errorMessage);
    }
  }, [refreshProfile]);

  const deleteProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      // Refresh the profile data after successful deletion
      await refreshProfile();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete profile";
      console.error("Error deleting profile:", err);
      throw new Error(errorMessage);
    }
  }, [refreshProfile]);

  return {
    profile,
    user,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    createInitialProfile,
    deleteProfile,
    refreshProfile,
    signOut,
  };
}
