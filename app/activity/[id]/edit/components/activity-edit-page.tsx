"use client";

import { Box, Typography, Button, Paper, Chip } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActivityWithTags } from "@/lib/db/schema";
import ActivityForm from "@/components/activity/activity-form";

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #0d3b66, #124a78)",
          color: "white",
          p: 4,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h5">Edit: {activity.name}</Typography>
            {activity.isDraft && (
              <Chip
                label="Draft"
                size="small"
                color="warning"
                variant="filled"
                sx={{ color: "white" }}
              />
            )}
          </Box>
          <Typography variant="body1">
            Update your CPD activity details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            href={`/activity/${activity.id}`}
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBack />}
          >
            Back to Activity
          </Button>
          <Button
            component={Link}
            href="/activity/list"
            variant="outlined"
            color="inherit"
          >
            All Activities
          </Button>
        </Box>
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
