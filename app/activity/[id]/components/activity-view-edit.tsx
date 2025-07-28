"use client";

import { Box, Typography, Button, Paper, Chip, Divider } from "@mui/material";
import { Edit, ArrowBack } from "@mui/icons-material";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ActivityRecord } from "@/lib/db/schema";
import ActivityForm from "@/components/activity/activity-form";

interface ActivityViewEditProps {
  activity: ActivityRecord;
}

export default function ActivityViewEdit({ activity }: ActivityViewEditProps) {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true"
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getActivityTypes = () => {
    const types = [];
    if (activity.clinical) types.push("Clinical");
    if (activity.nonClinical) types.push("Non-Clinical");
    if (activity.interactive) types.push("Interactive");
    if (activity.therapeutic) types.push("Therapeutic");
    return types;
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(to right, #2562ea, #1d4ed8)",
            color: "white",
            p: 4,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Edit CPD Activity
            </Typography>
            <Typography variant="body1">
              Update your CPD activity details
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/activity/list"
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBack />}
          >
            Back to Activities
          </Button>
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

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            {activity.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            CPD Activity Details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            Edit Activity
          </Button>
          <Button
            component={Link}
            href="/activity/list"
            variant="outlined"
            startIcon={<ArrowBack />}
          >
            Back to Activities
          </Button>
        </Box>
      </Box>

      {/* Activity Details */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Basic Info */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Activity Information
            </Typography>
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(activity.date)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Hours
                </Typography>
                <Typography variant="body1">{activity.hours} hours</Typography>
              </Box>
            </Box>
          </Box>

          {/* Activity Types */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Activity Types
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {getActivityTypes().map((type) => (
                <Chip
                  key={type}
                  label={type}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Description */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {activity.description}
            </Typography>
          </Box>

          <Divider />

          {/* Reflection */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Reflection
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {activity.reflection}
            </Typography>
          </Box>

          {/* Evidence File */}
          {activity.evidenceFileUrl && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Evidence File
                </Typography>
                <Button
                  variant="outlined"
                  href={activity.evidenceFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Evidence File
                </Button>
              </Box>
            </>
          )}

          {/* Metadata */}
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Activity Metadata
            </Typography>
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {new Date(activity.createdAt).toLocaleDateString("en-AU")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(activity.updatedAt).toLocaleDateString("en-AU")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
