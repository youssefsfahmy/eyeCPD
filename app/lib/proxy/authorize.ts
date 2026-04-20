import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { SupabaseClaimsResult } from "./types";
import { RoleBasedAccessControl } from "../rbac/rbac";

// specify which endpints are authorized to which roles and which subscription types

export async function authorizeMiddleware(
  request: NextRequest,
  user: User | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: any,
) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  // If no user is provided, we can skip authorization checks
  if (!user) {
    return supabaseResponse;
  }

  const res = await supabaseClient.auth.getClaims();
  const claims: SupabaseClaimsResult | undefined = res.data
    ?.claims as unknown as SupabaseClaimsResult;

  if (!claims) {
    console.error("No claims found for user:", user.id);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create RBAC instance and check authorization
  const rbac = new RoleBasedAccessControl(claims);
  const authResult = rbac.isAuthorized(request.nextUrl.pathname);

  if (!authResult.isAuthorized) {
    console.log(
      "Access denied for user:",
      rbac.getUserInfo(),
      "to URL:",
      request.nextUrl.pathname,
      "Reason:",
      authResult.reason,
    );

    // If there's a redirect URL, return a redirect response
    if (authResult.redirectUrl) {
      return NextResponse.redirect(
        new URL(authResult.redirectUrl, request.url),
      );
    }

    // Otherwise return a JSON error response
    return NextResponse.json(
      {
        error: "Access denied",
        message:
          authResult.message ||
          "You do not have permission to access this resource",
        reason: authResult.reason,
        redirectUrl: authResult.redirectUrl,
      },
      { status: 403 },
    );
  }

  return supabaseResponse;
}
