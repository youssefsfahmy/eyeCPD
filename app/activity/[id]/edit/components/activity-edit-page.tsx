"use client";

import { Box, Paper, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { ActivityWithTags } from "@/lib/db/schema";
import ActivityForm from "@/components/activity/activity-form";
import ActionBar from "@/components/layout/action-bar";

interface ActivityEditPageProps {
  activity: ActivityWithTags;
}

export default function ActivityEditPage({ activity }: ActivityEditPageProps) {
  const router = useRouter();

  const handleEditSuccess = () => {
    // Redirect to view page after successful edit
    router.push(`/activity/${activity.id}`);
  };

  const handleEditCancel = () => {
    // Go back to view page if user cancels
    router.push(`/activity/${activity.id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <ActionBar
          title={`Edit: ${activity.name}`}
          description="Update your CPD activity details"
          button={{
            href: "/activity/list",
            text: "All Activities",
          }}
          secondaryButton={{
            href: `/activity/${activity.id}`,
            text: "Back to Activity",
            icon: "back",
          }}
        />
        {activity.isDraft && (
          <Box>
            <Chip
              label="Draft"
              size="small"
              color="warning"
              variant="filled"
              sx={{ color: "white" }}
            />
          </Box>
        )}
      </Box>

      {/* Edit Form */}
      <Paper sx={{ p: 4 }}>
        <ActivityForm
          activity={activity}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </Paper>
    </Box>
  );
}
