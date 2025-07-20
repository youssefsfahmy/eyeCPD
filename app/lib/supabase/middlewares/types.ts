import type { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { Profile, Subscription } from "@/lib/db/schema";

export interface SessionMiddlewareResult {
  response: NextResponse;
  user: User | null;
}
export interface SupabaseClaimsResult {
  sub: string;
  email: string;
  role: string;
  profile: Profile | null;
  subscription: Subscription | null;
}
