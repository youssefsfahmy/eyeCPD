"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  CreditCard,
  MenuBook,
  Flag,
  CheckCircle,
  Cancel,
  AttachFile,
  AdminPanelSettings,
  PersonRemove,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminUserDetail } from "@/lib/db/queries/profile";
import { toggleAdminRoleServerAction } from "../../actions";

interface AdminUserDetailViewProps {
  user: AdminUserDetail;
}

export default function AdminUserDetailView({
  user,
}: AdminUserDetailViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user.roles?.includes("admin") ?? false;

  const handleToggleAdmin = () => {
    const action = isAdmin ? "remove admin from" : "make admin";
    if (
      !window.confirm(
        `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await toggleAdminRoleServerAction(user.userId);
      if (!result.success) {
        setError(result.error || "Failed to update role");
      } else {
        router.refresh();
      }
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate activity stats (published only)
  const publishedActivities = user.activityRecords.filter((a) => !a.isDraft);
  const draftActivities = user.activityRecords.filter((a) => a.isDraft);
  const totalHours = publishedActivities.reduce(
    (sum, a) => sum + parseFloat(a.hours),
    0,
  );
  const clinicalHours = publishedActivities
    .filter((a) => a.clinical)
    .reduce((sum, a) => sum + parseFloat(a.hours), 0);
  const interactiveHours = publishedActivities
    .filter((a) => a.interactive)
    .reduce((sum, a) => sum + parseFloat(a.hours), 0);
  const therapeuticHours = publishedActivities
    .filter((a) => a.therapeutic)
    .reduce((sum, a) => sum + parseFloat(a.hours), 0);

  const getActivityTypes = (activity: {
    clinical: boolean;
    nonClinical: boolean;
    interactive: boolean;
    therapeutic: boolean;
  }) => {
    const types = [];
    if (activity.clinical) types.push("Clinical");
    if (activity.nonClinical) types.push("Non-Clinical");
    if (activity.interactive) types.push("Interactive");
    if (activity.therapeutic) types.push("Therapeutic");
    return types;
  };

  const getSubscriptionStatusColor = (
    status: string,
  ): "success" | "warning" | "error" | "info" | "default" => {
    const map: Record<
      string,
      "success" | "warning" | "error" | "info" | "default"
    > = {
      active: "success",
      trialing: "info",
      past_due: "warning",
      canceled: "error",
      incomplete: "warning",
      unpaid: "error",
    };
    return map[status] || "default";
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
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">
            {user.firstName} {user.lastName}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
            {user.roles?.map((role) => (
              <Chip
                key={role}
                label={role.charAt(0).toUpperCase() + role.slice(1)}
                size="small"
                color={role === "admin" ? "secondary" : "primary"}
                sx={{ color: "white" }}
              />
            ))}
            {user.isTherapeuticallyEndorsed && (
              <Chip
                label="Therapeutically Endorsed"
                size="small"
                color="success"
                sx={{ color: "white" }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={isAdmin ? <PersonRemove /> : <AdminPanelSettings />}
            onClick={handleToggleAdmin}
            disabled={isPending}
          >
            {isPending
              ? "Updating..."
              : isAdmin
                ? "Remove Admin"
                : "Make Admin"}
          </Button>
          <Button
            component={Link}
            href="/admin/users/list"
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBack />}
          >
            Back to Users
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Profile Info & Subscription side by side */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
        {/* Profile Info */}
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom color="primary">
            <Person sx={{ mr: 1, verticalAlign: "middle" }} />
            Profile Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography
                variant="body2"
                fontFamily="monospace"
                fontSize="0.75rem"
              >
                {user.userId}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Registration #
              </Typography>
              <Typography variant="body2">
                {user.registrationNumber || "—"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body2">{user.phone || "—"}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Therapeutically Endorsed
              </Typography>
              {user.isTherapeuticallyEndorsed ? (
                <CheckCircle fontSize="small" color="success" />
              ) : (
                <Cancel fontSize="small" color="disabled" />
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Joined
              </Typography>
              <Typography variant="body2">
                {formatDate(user.createdAt)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Subscription Info */}
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom color="primary">
            <CreditCard sx={{ mr: 1, verticalAlign: "middle" }} />
            Subscription
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {user.subscription ? (
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={
                    user.subscription.status.charAt(0).toUpperCase() +
                    user.subscription.status.slice(1)
                  }
                  size="small"
                  color={getSubscriptionStatusColor(user.subscription.status)}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Plan
                </Typography>
                <Typography variant="body2">
                  {user.subscription.planName || "—"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Current Period
                </Typography>
                <Typography variant="body2">
                  {formatShortDate(user.subscription.currentPeriodStart)} –{" "}
                  {formatShortDate(user.subscription.currentPeriodEnd)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Stripe Customer ID
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  fontSize="0.75rem"
                >
                  {user.subscription.stripeCustomerId}
                </Typography>
              </Box>
              {user.subscription.cancelAtPeriodEnd && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Cancels At
                  </Typography>
                  <Typography variant="body2" color="error">
                    {formatDate(user.subscription.cancelAtPeriodEnd)}
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CreditCard
                sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                No subscription found
              </Typography>
            </Box>
          )}
        </Paper>
      </Stack>

      {/* CPD Progress Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          CPD Progress Summary (All Time)
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Paper sx={{ p: 2, flex: 1, bgcolor: "grey.50" }}>
            <Typography variant="caption" color="text.secondary">
              Total Hours (Published)
            </Typography>
            <Typography variant="h5" color="primary">
              {totalHours.toFixed(1)}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, bgcolor: "grey.50" }}>
            <Typography variant="caption" color="text.secondary">
              Published Activities
            </Typography>
            <Typography variant="h5">{publishedActivities.length}</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, bgcolor: "grey.50" }}>
            <Typography variant="caption" color="text.secondary">
              Draft Activities
            </Typography>
            <Typography variant="h5">{draftActivities.length}</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, bgcolor: "grey.50" }}>
            <Typography variant="caption" color="text.secondary">
              Clinical Hours
            </Typography>
            <Typography variant="h5">{clinicalHours.toFixed(1)}</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, bgcolor: "grey.50" }}>
            <Typography variant="caption" color="text.secondary">
              Interactive Hours
            </Typography>
            <Typography variant="h5">{interactiveHours.toFixed(1)}</Typography>
          </Paper>
          {user.isTherapeuticallyEndorsed && (
            <Paper sx={{ p: 2, flex: 1, bgcolor: "grey.50" }}>
              <Typography variant="caption" color="text.secondary">
                Therapeutic Hours
              </Typography>
              <Typography variant="h5">
                {therapeuticHours.toFixed(1)}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>

      {/* Activities Table */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          <MenuBook sx={{ mr: 1, verticalAlign: "middle" }} />
          Activities ({user.activityRecords.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {user.activityRecords.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <MenuBook sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No activities recorded
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Types</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Evidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.activityRecords.map((activity) => (
                  <TableRow key={activity.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {activity.name}
                      </Typography>
                      {activity.provider && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Provider: {activity.provider.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatShortDate(activity.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{activity.hours}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {getActivityTypes(activity).map((type) => (
                          <Chip
                            key={type}
                            label={type}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {activity.activityToTags?.map((at, i) => (
                          <Chip
                            key={i}
                            label={at.tag.tag}
                            size="small"
                            variant="filled"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {activity.isDraft ? (
                        <Chip
                          label="Draft"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Published"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {activity.evidenceFileUrl ? (
                        <Tooltip title="View evidence file">
                          <IconButton
                            size="small"
                            href={activity.evidenceFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View evidence file"
                          >
                            <AttachFile fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Learning Goals */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          <Flag sx={{ mr: 1, verticalAlign: "middle" }} />
          Learning Goals ({user.goals.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {user.goals.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Flag sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No learning goals set
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {user.goals.map((goal) => (
              <Card key={goal.id} variant="outlined">
                <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {goal.title}
                      </Typography>
                      {goal.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {goal.description}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        ml: 2,
                      }}
                    >
                      <Chip label={goal.year} size="small" variant="outlined" />
                      {goal.targetHours && (
                        <Chip
                          label={`${goal.targetHours} hrs`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}
                  >
                    {getActivityTypes(goal).map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                    {goal.goalsToTags?.map((gt, i) => (
                      <Chip
                        key={i}
                        label={gt.tag.tag}
                        size="small"
                        variant="filled"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
