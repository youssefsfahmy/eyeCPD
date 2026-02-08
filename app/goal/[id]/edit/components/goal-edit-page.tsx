"use client";

import { Box, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { GoalWithTags } from "@/lib/db/schema";
import GoalForm from "@/components/goal/goal-form";
import ActionBar from "@/components/layout/action-bar";

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
      <ActionBar
        title={`Edit: ${goal.title}`}
        description="Update your CPD learning goal details"
        button={{
          href: "/goal/list",
          text: "Back to Goals",
          icon: "back",
        }}
      />
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
