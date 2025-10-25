"use client";

import { Box, Typography, Button, Paper, Chip, Divider } from "@mui/material";
import { Edit, ArrowBack, AttachFile, Visibility } from "@mui/icons-material";
import Link from "next/link";
import { ActivityWithTags } from "@/lib/db/schema";

interface ActivityViewProps {
  activity: ActivityWithTags;
}

export default function ActivityView({ activity }: ActivityViewProps) {
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h4">{activity.name}</Typography>
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
            {formatDate(activity.date)} • {activity.hours} hours
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            href={`/activity/${activity.id}/edit`}
            variant="outlined"
            color="inherit"
            startIcon={<Edit />}
          >
            Edit Activity
          </Button>
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
      </Box>

      {/* Content */}
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Basic Info */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Activity Details
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  flex: 1,
                  minWidth: 200,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(activity.date)}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "grey.50",
                  flex: 1,
                  minWidth: 200,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Hours
                </Typography>
                <Typography variant="body1">{activity.hours}</Typography>
              </Paper>
              {activity.provider && (
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "grey.50",
                    flex: 1,
                    minWidth: 200,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Provider
                  </Typography>
                  <Typography variant="body1">
                    {activity.provider.name}
                  </Typography>
                </Paper>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Activity Types
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {getActivityTypes().map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>

            {activity.activityToTags && activity.activityToTags.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Topics/Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {activity.activityToTags.map((activityToTag, index) => (
                    <Chip
                      key={index}
                      label={activityToTag.tag.tag}
                      variant="filled"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Description */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {activity.description}
            </Typography>
          </Box>

          <Divider />

          {/* Reflection */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
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
                <Typography variant="h6" gutterBottom color="primary">
                  Evidence File
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    border: 1,
                    borderColor: "grey.300",
                    backgroundColor: "grey.50",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <AttachFile color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="medium">
                      Evidence Document
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Attached evidence file for this activity
                    </Typography>
                  </Box>
                  <Button
                    href={activity.evidenceFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<Visibility />}
                  >
                    View File
                  </Button>
                </Paper>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
