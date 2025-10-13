import { createClient } from "@/app/lib/supabase/server";
import { TagQueries } from "@/lib/db/queries/tag";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const tags = await TagQueries.getTagsByUserId(user.id);

  if (!tags) {
    console.error("Error fetching tags:", tags);
    throw new Error("Failed to fetch tags");
  }

  return NextResponse.json(tags);
}
