import { useState, useCallback } from "react";
import { ProfileData, ProfileUpdateData } from "@/lib/types/profile";
import { User } from "@supabase/supabase-js";

interface UseProfileReturn {
  profile: ProfileData | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  createInitialProfile: () => Promise<void>;
  deleteProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();
      setUser(result.user);
      setProfile(result.profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      setProfile(result.profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      console.error("Error updating profile:", err);
      throw err; // Re-throw so calling components can handle it
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInitialProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to create profile");
      }

      const result = await response.json();
      setProfile(result.profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create profile";
      setError(errorMessage);
      console.error("Error creating profile:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to delete profile");
      }

      setProfile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete profile";
      setError(errorMessage);
      console.error("Error deleting profile:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    user,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    createInitialProfile,
    deleteProfile,
  };
}
