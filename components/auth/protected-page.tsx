// components/ProtectedRoute.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional: allow role-based protection too
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const protect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !data || !allowedRoles.includes(data.role)) {
          router.push("/unauthorized");
          return;
        }
      }

      setHasAccess(true);
      setLoading(false);
    };

    protect();
  }, [allowedRoles, router]);

  if (loading) return <p>Checking access...</p>;
  if (!hasAccess) return null;

  return <>{children}</>;
}
