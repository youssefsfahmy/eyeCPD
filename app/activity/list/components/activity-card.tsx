"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DeleteOutline,
  Edit,
  AttachFile,
  Visibility,
} from "@mui/icons-material";
import { ActivityDataState } from "../../types/activity";
import { deleteActivityServerAction } from "../../actions";
import { useTransition } from "react";
import Link from "next/link";

interface ActivityCardProps {
  activity: ActivityDataState;
  onDelete?: () => void;
}

export default function ActivityCard({
  activity,
  onDelete,
}: ActivityCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      startTransition(async () => {
        try {
          await deleteActivityServerAction(activity.id!);
          onDelete?.();
        } catch (error) {
          console.error("Error deleting activity:", error);
          alert("Failed to delete activity");
        }
      });
    }
  };

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
    <Card sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="h6">{activity.name}</Typography>
              {activity.isDraft && (
                <Chip
                  label="Draft"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatDate(activity.date)} • {activity.hours} hours
              {activity.activityProvider && (
                <>
                  {" • "}
                  <span style={{ fontWeight: 500 }}>
                    {activity.activityProvider}
                  </span>
                </>
              )}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
            {activity.evidenceFileUrl && (
              <Tooltip title="Has evidence file">
                <IconButton size="small" color="primary">
                  <AttachFile fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="View activity details">
              <Link href={`/activity/${activity.id}`}>
                <IconButton size="small" color="primary">
                  <Visibility fontSize="small" />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip title="Edit activity">
              <Link href={`/activity/${activity.id}/edit`}>
                <IconButton size="small" color="primary">
                  <Edit fontSize="small" />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip title="Delete activity">
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
                disabled={isPending}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Activity Types */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {getActivityTypes().map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              variant="outlined"
              color={
                type === "Clinical"
                  ? "primary"
                  : type === "Therapeutic"
                  ? "secondary"
                  : type === "Interactive"
                  ? "success"
                  : "default"
              }
            />
          ))}
        </Box>

        {/* Tags */}
        {activity.activityToTags && activity.activityToTags.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
            {activity.activityToTags.map((activityToTags, index) => (
              <Chip
                key={index}
                label={activityToTags.tag.tag}
                size="small"
                variant="filled"
                sx={{
                  backgroundColor: "grey.100",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Box>
        )}

        {/* Description */}
        <Typography variant="body2" paragraph>
          <strong>Description:</strong> {activity.description}
        </Typography>

        {/* Reflection */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <strong>Reflection:</strong>{" "}
          {activity.reflection || "No reflection provided"}
        </Typography>
      </CardContent>
    </Card>
  );
}
