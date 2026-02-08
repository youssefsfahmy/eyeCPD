"use client";

import { Box, Typography, Button, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoalWithTags } from "@/lib/db/schema";
import GoalForm from "@/components/goal/goal-form";

interface GoalEditPageProps {
  goal: GoalWithTags;
}

export default function GoalEditPage({ goal }: GoalEditPageProps) {
  const router = useRouter();

  const handleEditSuccess = () => {
    // Redirect to view page after successful edit
    router.push(`/goal/list`);
  };

  const handleEditCancel = () => {
    // Go back to view page if user cancels
    router.push(`/goal/list`);
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
            <Typography variant="h5">Edit: {goal.title}</Typography>
          </Box>
          <Typography variant="body1">
            Update your CPD learning goal details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            href={`/goal/list`}
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBack />}
          >
            Back to Goals
          </Button>
        </Box>
      </Box>
      {/* Edit Form */}
      <Paper sx={{ p: 4 }}>
        <GoalForm
          goal={goal}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </Paper>
    </Box>
  );
}
