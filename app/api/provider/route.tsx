import { createClient } from "@/app/lib/supabase/server";
import { ProviderQueries } from "@/lib/db/queries/provider";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const providers = await ProviderQueries.getProvidersByUserId(user.id);

  if (!providers) {
    console.error("Error fetching providers:", providers);
    throw new Error("Failed to fetch providers");
  }

  return NextResponse.json(providers);
}
