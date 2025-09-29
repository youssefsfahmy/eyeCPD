// app/api/reports/[year]/route.ts
import { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import ReportDocument from "@/lib/services/reports";
import { ActivityQueries } from "@/lib/db/queries/activity";
import { createClient } from "@/app/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { getCycleFromUrlOrCurrent } from "@/lib/utils";
import { ProfileQueries } from "@/lib/db/queries/profile";

export const dynamic = "force-dynamic";

// Helper function to get current user
async function getCurrentUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ year?: string }> }
) {
  const { year: yearParam } = await params;
  const selectedCycle = getCycleFromUrlOrCurrent(yearParam ?? null);
  const user = await getCurrentUser();
  const profile = await ProfileQueries.getProfileByUserId(user.id);
  if (!profile) {
    throw new Error("User profile not found");
  }

  const activities = await ActivityQueries.getActivitiesByUserId(
    user.id,
    selectedCycle.startDate,
    selectedCycle.endDate
  );

  const stream = await renderToStream(
    <ReportDocument
      selectedCycle={selectedCycle}
      activities={activities}
      profile={profile}
      user={user}
    />
  );

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cpd-report-${selectedCycle.label}.pdf"`,
    },
  });
}
