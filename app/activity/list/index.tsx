import { Typography, Box, Button, Alert, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import Link from "next/link";
import { getActivitiesServerAction } from "../actions";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { createClient } from "@/app/lib/supabase/server";
import ActivityCard from "./components/activity-card";
import ActivitySummary from "./components/activity-summary";

export default async function ActivityListPage() {
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

  const result = await getActivitiesServerAction();
  const profile = await ProfileQueries.getProfileByUserId(user.id);

  if (result.error) {
    return <Alert severity="error">{result.error}</Alert>;
  }

  const activities = result.activities || [];

  return (
    <Box>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #0d3b66, #1f6fb2)",
          color: "white",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            My CPD Activities
          </Typography>
          <Typography variant="body1" color="white">
            Track your continuing professional development progress
          </Typography>
        </Box>

        <Link href="/activity/create" legacyBehavior passHref>
          <Button
            component="a"
            variant="outlined"
            color="inherit"
            startIcon={<Add />}
            sx={{ minWidth: 150 }}
          >
            Add Activity
          </Button>
        </Link>
      </Box>
      {/* Summary Section */}
      <ActivitySummary
        activities={activities}
        isTherapeuticallyEndorsed={profile?.isTherapeuticallyEndorsed || false}
      />
      <Divider sx={{ my: 3 }} />
      {/* Activities List */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">
          Recent Activities ({activities.length})
        </Typography>
        {activities.some((activity) => activity.isDraft) && (
          <Typography variant="caption" color="text.secondary">
            Including {activities.filter((activity) => activity.isDraft).length}{" "}
            draft(s)
          </Typography>
        )}
      </Box>
      {activities.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "grey.50",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No activities recorded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start tracking your CPD by adding your first activity
          </Typography>
          <Link href="/activity/create" legacyBehavior passHref>
            <Button component="a" variant="contained" startIcon={<Add />}>
              Add Your First Activity
            </Button>
          </Link>
        </Box>
      ) : (
        <Box>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </Box>
      )}
    </Box>
  );
}
