"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Alert,
  Chip,
  Divider,
  Collapse,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import {
  Business,
  Add,
  ExpandMore,
  ExpandLess,
  Edit,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import type { Provider } from "@/lib/db/schema";
import {
  createGlobalProviderAction,
  updateGlobalProviderAction,
} from "../../actions";

interface AdminProvidersClientProps {
  globalProviders: Provider[];
  userProviders: Provider[];
}

export default function AdminProvidersClient({
  globalProviders,
  userProviders,
}: AdminProvidersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showUserProviders, setShowUserProviders] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProvider, setDialogProvider] = useState<Provider | null>(null);
  const [search, setSearch] = useState("");

  const query = search.toLowerCase();
  const filteredGlobal = globalProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.providerType?.toLowerCase().includes(query) ||
      p.contactName?.toLowerCase().includes(query) ||
      p.state?.toLowerCase().includes(query),
  );
  const filteredUser = userProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.providerType?.toLowerCase().includes(query),
  );

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = dialogProvider
        ? await updateGlobalProviderAction(dialogProvider.id, formData)
        : await createGlobalProviderAction(formData);
      if (result.success) {
        setSuccess(true);
        setDialogOpen(false);
        setDialogProvider(null);
        router.refresh();
      } else {
        setError(
          result.error ||
            `Failed to ${dialogProvider ? "update" : "create"} provider`,
        );
      }
    });
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
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "80vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              <Business sx={{ mr: 2, verticalAlign: "middle" }} />
              CPD Providers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage global CPD providers available to all users
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setDialogProvider(null);
              setDialogOpen(true);
              setSuccess(false);
              setError(null);
            }}
          >
            Add Provider
          </Button>
        </Box>
      </Box>

      {/* Success/Error alerts */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(false)}
        >
          Provider saved successfully.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 3 }}>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="primary">
            {globalProviders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global Providers
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="secondary.main">
            {userProviders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User-Created Providers
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="text.primary">
            {globalProviders.length + userProviders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Providers
          </Typography>
        </Paper>
      </Stack>
      {/* Search */}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, type, contact, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      {/* Global Providers Table */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">
            Global Providers ({filteredGlobal.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available to all users
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGlobal.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {search
                        ? "No providers match your search"
                        : "No global providers yet"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGlobal.map((provider) => (
                  <TableRow key={provider.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {provider.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {provider.providerType ? (
                        <Chip
                          label={provider.providerType}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {provider.contactName || "—"}
                      </Typography>
                      {provider.contactEmail && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {provider.contactEmail}
                        </Typography>
                      )}
                      {provider.contactNumber && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {provider.contactNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {[provider.address, provider.state]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(provider.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setDialogProvider(provider);
                          setDialogOpen(true);
                          setError(null);
                        }}
                        aria-label="Edit provider"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* User Providers (collapsed) */}
      <Paper>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowUserProviders(!showUserProviders)}
        >
          <Box>
            <Typography variant="h6">
              User-Created Providers ({filteredUser.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created by individual users for their own use
            </Typography>
          </Box>
          <IconButton
            aria-label={
              showUserProviders
                ? "Hide user-created providers"
                : "Show user-created providers"
            }
          >
            {showUserProviders ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={showUserProviders}>
          <Divider />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUser.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {search
                          ? "No providers match your search"
                          : "No user-created providers"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUser.map((provider) => (
                    <TableRow key={provider.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {provider.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {provider.providerType ? (
                          <Chip
                            label={provider.providerType}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontFamily="monospace"
                          fontSize="0.7rem"
                        >
                          {provider.userId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(provider.createdAt)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>

      {/* Provider Dialog (Add / Edit) */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setDialogProvider(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <form action={handleSubmit}>
          <DialogTitle>
            {dialogProvider ? "Edit Provider" : "New Global Provider"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                name="name"
                label="Provider Name"
                required
                fullWidth
                size="small"
                defaultValue={dialogProvider?.name ?? ""}
                key={`name-${dialogProvider?.id ?? "new"}`}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  name="providerType"
                  label="Provider Type"
                  fullWidth
                  size="small"
                  placeholder="e.g., Conference, Online Course, University"
                  defaultValue={dialogProvider?.providerType ?? ""}
                  key={`type-${dialogProvider?.id ?? "new"}`}
                />
                <TextField
                  name="contactName"
                  label="Contact Name"
                  fullWidth
                  size="small"
                  defaultValue={dialogProvider?.contactName ?? ""}
                  key={`cn-${dialogProvider?.id ?? "new"}`}
                />
              </Stack>
              <TextField
                name="address"
                label="Address"
                fullWidth
                size="small"
                multiline
                rows={3}
                defaultValue={dialogProvider?.address ?? ""}
                key={`addr-${dialogProvider?.id ?? "new"}`}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  name="state"
                  label="State"
                  fullWidth
                  size="small"
                  defaultValue={dialogProvider?.state ?? ""}
                  key={`st-${dialogProvider?.id ?? "new"}`}
                />
                <TextField
                  name="contactNumber"
                  label="Contact Number"
                  fullWidth
                  size="small"
                  defaultValue={dialogProvider?.contactNumber ?? ""}
                  key={`cnum-${dialogProvider?.id ?? "new"}`}
                />
                <TextField
                  name="contactEmail"
                  label="Contact Email"
                  fullWidth
                  size="small"
                  type="email"
                  defaultValue={dialogProvider?.contactEmail ?? ""}
                  key={`ce-${dialogProvider?.id ?? "new"}`}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => {
                setDialogOpen(false);
                setDialogProvider(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending
                ? "Saving..."
                : dialogProvider
                  ? "Save"
                  : "Create Provider"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
