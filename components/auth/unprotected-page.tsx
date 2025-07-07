// components/auth/unprotected-page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UnprotectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // where to redirect if user is logged in (default: dashboard)
}

export function UnprotectedRoute({
  children,
  redirectTo = "/opt/dashboard",
}: UnprotectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // User is logged in, redirect them away from this page
        router.push(redirectTo);
        return;
      }

      // User is not logged in, they can access this page
      setHasAccess(true);
      setLoading(false);
    };

    checkAuth();
  }, [redirectTo, router]);

  if (loading) return <p>Checking authentication...</p>;
  if (!hasAccess) return null;

  return <>{children}</>;
}
