import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../server";
import type { User } from "@supabase/supabase-js";
import { SupabaseClaimsResult } from "./types";
import { RoleBasedAccessControl, AuthUtils } from "../../rbac/rbac";

// specify which endpints are authorized to which roles and which subscription types

export async function authorizeMiddleware(
  request: NextRequest,
  user: User | null
) {
  console.log("authorizeMiddleware called", request.nextUrl?.pathname);
  const supabaseResponse = NextResponse.next({
    request,
  });

  // If no user is provided, we can skip authorization checks
  if (!user) {
    return supabaseResponse;
  }

  const supabase = await createClient();

  const res = await supabase.auth.getClaims();
  const claims: SupabaseClaimsResult | undefined = res.data
    ?.claims as unknown as SupabaseClaimsResult;

  if (!claims) {
    console.error("No claims found for user:", user.id);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate claims structure
  if (!AuthUtils.validateClaims(claims)) {
    console.error("Invalid or incomplete claims for user:", user.id);
    return NextResponse.json({ error: "Invalid user claims" }, { status: 401 });
  }

  // Create RBAC instance and check authorization
  const rbac = new RoleBasedAccessControl(claims);
  const isAuthorized = rbac.isAuthorized(request.nextUrl.pathname);

  if (!isAuthorized) {
    console.log(
      "Access denied for user:",
      rbac.getUserInfo(),
      "to URL:",
      request.nextUrl.pathname
    );
    return NextResponse.json(
      {
        error: "Access denied",
        message: "You do not have permission to access this resource",
      },
      { status: 403 }
    );
  }

  return supabaseResponse;
}
