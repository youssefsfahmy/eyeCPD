"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/client";
import { ProfileData } from "@/lib/types/profile";

interface ProfileContextType {
  user: User | null;
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  isTherapeuticallyEndorsed: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        if (response.status === 404) {
          // Profile doesn't exist yet
          setProfile(null);
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();
      setProfile(result.profile);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
      console.error("Error fetching profile:", err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    setError(null);
    await fetchProfile();
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign out";
      setError(errorMessage);
      console.error("Error signing out:", err);
    }
  }, [supabase.auth]);

  useEffect(() => {
    let isMounted = true;
    let currentUserId: string | null = null;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setError(error.message);
          return;
        }

        if (session?.user && isMounted) {
          currentUserId = session.user.id;
          setUser(session.user);
          await fetchProfile();
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Authentication error";
          setError(errorMessage);
          console.error("Error initializing auth:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        // Only fetch profile if it's a different user
        const isDifferentUser = currentUserId !== session.user.id;
        currentUserId = session.user.id;
        setUser(session.user);

        if (isDifferentUser) {
          setIsLoading(true);
          await fetchProfile();
          setIsLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        currentUserId = null;
        setUser(null);
        setProfile(null);
        setError(null);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Only update user data, don't refetch profile for token refresh
        setUser(session.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth, fetchProfile]); // Keep minimal dependencies

  const value: ProfileContextType = {
    user,
    profile,
    isLoading,
    error,
    refreshProfile,
    signOut,
    isTherapeuticallyEndorsed: profile?.isTherapeuticallyEndorsed || false,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

// Higher-order component for pages that require authentication
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useProfile();

    if (isLoading) {
      return <div>Loading...</div>; // You can replace with a proper loading component
    }

    if (!user) {
      // Redirect to login or show unauthorized message
      // You might want to use Next.js router here
      return <div>Please log in to access this page.</div>;
    }

    return <Component {...props} />;
  };
}

// Hook for pages that need profile data
export function useRequireProfile() {
  const { user, profile, isLoading, error } = useProfile();

  return {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    needsProfileCompletion: !!user && !profile,
  };
}
