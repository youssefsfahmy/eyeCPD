"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Search,
  Visibility,
  People,
  CheckCircle,
  Cancel,
  AdminPanelSettings,
} from "@mui/icons-material";
import Link from "next/link";
import type { ProfileWithSubscription } from "@/lib/db/queries/profile";

interface UserListViewProps {
  users: ProfileWithSubscription[];
}

export default function UserListView({ users }: UserListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.registrationNumber?.toLowerCase() || "";
    const roles = user.roles?.join(" ").toLowerCase() || "";
    return (
      fullName.includes(query) || email.includes(query) || roles.includes(query)
    );
  });

  const totalUsers = users.length;
  const activeSubscriptions = users.filter(
    (u) =>
      u.subscription?.status === "active" ||
      u.subscription?.status === "trialing",
  ).length;
  const adminUsers = users.filter((u) => u.roles?.includes("admin")).length;

  const getSubscriptionChip = (user: ProfileWithSubscription) => {
    if (!user.subscription) {
      return (
        <Chip
          label="No Subscription"
          size="small"
          color="default"
          variant="outlined"
        />
      );
    }
    const status = user.subscription.status;
    const colorMap: Record<
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
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        color={colorMap[status] || "default"}
        variant="outlined"
      />
    );
  };

  const getRoleChips = (roles: string[] | null) => {
    if (!roles || roles.length === 0) return null;
    return roles.map((role) => (
      <Chip
        key={role}
        label={role.charAt(0).toUpperCase() + role.slice(1)}
        size="small"
        color={role === "admin" ? "secondary" : "primary"}
        variant="outlined"
        sx={{ mr: 0.5 }}
      />
    ));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            <AdminPanelSettings sx={{ mr: 1, verticalAlign: "middle" }} />
            User Management
          </Typography>
          <Typography variant="body1">
            View and manage all registered users
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 3 }}>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <People sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
          <Typography variant="h4" color="primary">
            {totalUsers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Users
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <CheckCircle sx={{ fontSize: 32, color: "success.main", mb: 1 }} />
          <Typography variant="h4" color="success.main">
            {activeSubscriptions}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Subscriptions
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <AdminPanelSettings
            sx={{ fontSize: 32, color: "secondary.main", mb: 1 }}
          />
          <Typography variant="h4" color="secondary.main">
            {adminUsers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin Users
          </Typography>
        </Paper>
      </Stack>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, registration number, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* User Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Registration #</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Therapeutically Endorsed</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery
                      ? "No users match your search"
                      : "No users found"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.firstName} {user.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.registrationNumber || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>{getRoleChips(user.roles)}</TableCell>
                  <TableCell>{getSubscriptionChip(user)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.subscription?.planName || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {user.isTherapeuticallyEndorsed ? (
                      <CheckCircle fontSize="small" color="success" />
                    ) : (
                      <Cancel fontSize="small" color="disabled" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View user details">
                      <Link href={`/admin/users/${user.userId}`}>
                        <IconButton size="small" color="primary">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredUsers.length} of {totalUsers} users
        </Typography>
      </Box>
    </Box>
  );
}
