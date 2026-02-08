import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
  Button,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  School,
  Business,
  AccessTime,
  Description,
  AttachFile,
  Edit,
  Visibility,
  ArrowForward,
} from "@mui/icons-material";
import Link from "next/link";
import { RecentActivity } from "../actions";

interface RecentActivitiesProps {
  recentActivities: RecentActivity[];
}

export default function RecentActivities({
  recentActivities,
}: RecentActivitiesProps) {
  if (recentActivities.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          color: "text.secondary",
        }}
      >
        <School sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="body1">No recent activities found</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Start logging your CPD activities to see them here
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getActivityIcon = (activity: RecentActivity) => {
    if (activity.clinical) return <School />;
    if (activity.nonClinical) return <Business />;
    return <Description />;
  };

  const getActivityColor = (activity: RecentActivity) => {
    if (activity.clinical) return "primary";
    if (activity.nonClinical) return "secondary";
    return "default";
  };

  return (
    <Box>
      <List sx={{ p: 0 }}>
        {recentActivities.map((activity, index) => (
          <Box key={activity.id}>
            <Link href={`/activity/${activity.id}`} legacyBehavior passHref>
              <ListItem
                component="a"
                sx={{
                  px: 0,
                  py: 1.5,
                  alignItems: "flex-start",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  },
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: `${getActivityColor(activity)}.light`,
                    color: `${getActivityColor(activity)}.contrastText`,
                    width: 40,
                    height: 40,
                    mr: 2,
                    mt: 0.5,
                  }}
                >
                  {getActivityIcon(activity)}
                </Avatar>

                <ListItemText
                  sx={{ flex: 1, pr: 2 }}
                  secondaryTypographyProps={{ component: "div" }} // 👈 forces secondary to render as <div>
                  primary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {activity.name}
                    </Typography>
                  }
                  secondary={
                    <Box component="div">
                      <Stack spacing={1}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ flexWrap: "wrap" }}
                        >
                          <Chip
                            icon={<AccessTime />}
                            label={`${activity.hours} hrs`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                          />
                          {activity.clinical && (
                            <Chip
                              label="Clinical"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                          {activity.nonClinical && (
                            <Chip
                              label="Non-Clinical"
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                          {activity.interactive && (
                            <Chip
                              label="Interactive"
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          )}
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {formatDate(activity.date)}
                          </Typography>
                          {activity.evidenceFileUrl && (
                            <Tooltip title="Has evidence file">
                              <AttachFile
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                            </Tooltip>
                          )}
                          {activity.reflection && (
                            <Tooltip title="Has reflection">
                              <Description
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  }
                />

                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="View activity">
                      <Link
                        href={`/activity/${activity.id}`}
                        legacyBehavior
                        passHref
                      >
                        <IconButton
                          component="a"
                          size="small"
                          //   onClick={(e) => e.stopPropagation()}
                          sx={{ color: "text.secondary" }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Edit activity">
                      <Link
                        href={`/activity/${activity.id}/edit`}
                        legacyBehavior
                        passHref
                      >
                        <IconButton
                          component="a"
                          size="small"
                          //   onClick={(e) => e.stopPropagation()}
                          sx={{ color: "text.secondary" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
            {index < recentActivities.length - 1 && <Divider />}
          </Box>
        ))}
      </List>

      {/* View All Activities Button */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Link href="/activity/list" legacyBehavior passHref>
          <Button
            component="a"
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            View All Activities
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
