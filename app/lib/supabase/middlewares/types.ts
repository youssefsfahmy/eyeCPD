import type { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { SubscriptionStatus, UserRole } from "@/lib/db/schema";

export interface SessionMiddlewareResult {
  response: NextResponse;
  user: User | null;
}
export interface SupabaseClaimsResult {
  sub: string;
  email: string;
  role: string;
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    registration_number: string;
    is_therapeutically_endorsed: boolean;
    user_id: string;
    role: UserRole;
  };
  subscription: {
    status: SubscriptionStatus;
    trial_end: string | null;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: string | null;
    user_id: string;
    stripe_customer_id: string;
    stripe_subscription_id: string;
    stripe_price_id: string;
    id: number;
    plan_name: string;
  } | null;
}
