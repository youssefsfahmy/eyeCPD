import { Box, Alert, Divider } from "@mui/material";
import { getActivitiesServerAction } from "../actions";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { createClient } from "@/app/lib/supabase/server";
import ActivitySummary from "./components/activity-summary";
import ActivityListClient from "./components/activity-list-client";
import ActionBar from "@/components/layout/action-bar";
import { CycleDraftProps } from "@/app/lib/types";

export default async function ActivityListPage({
  cycle,
  draft,
}: CycleDraftProps) {
  // Get user and activities
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Alert severity="error">You must be logged in to view activities.</Alert>
    );
  }

  const result = await getActivitiesServerAction(cycle, draft);
  const profile = await ProfileQueries.getProfileByUserId(user.id);

  if (result.error) {
    return <Alert severity="error">{result.error}</Alert>;
  }

  const activities = result.activities || [];

  return (
    <Box>
      <ActionBar
        title="My CPD Activities"
        description="Track your continuing professional development progress"
        button={{
          href: "/activity/create",
          text: "Add Activity",
          icon: "add",
        }}
        bottomRadius
        periodSelector
      />
      {/* Summary Section */}
      <ActivitySummary
        activities={activities}
        isTherapeuticallyEndorsed={profile?.isTherapeuticallyEndorsed || false}
      />
      <Divider sx={{ my: 3 }} />
      {/* Activities List with filtering and sorting */}
      <ActivityListClient activities={activities} />
    </Box>
  );
}
