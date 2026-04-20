"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Alert,
  Chip,
  Divider,
  Collapse,
  IconButton,
  Container,
} from "@mui/material";
import {
  Label,
  Add,
  ExpandMore,
  ExpandLess,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import type { Tag } from "@/lib/db/schema";
import { createGlobalTagAction } from "../../actions";

interface AdminTagsClientProps {
  globalTags: Tag[];
  userTags: Tag[];
}

export default function AdminTagsClient({
  globalTags,
  userTags,
}: AdminTagsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUserTags, setShowUserTags] = useState(false);
  const [search, setSearch] = useState("");

  const query = search.toLowerCase();
  const filteredGlobal = globalTags.filter((t) =>
    t.tag.toLowerCase().includes(query),
  );
  const filteredUser = userTags.filter((t) =>
    t.tag.toLowerCase().includes(query),
  );

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createGlobalTagAction(formData);
      if (result.success) {
        setSuccess(true);
        setShowForm(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to create tag");
      }
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
              <Label sx={{ mr: 2, verticalAlign: "middle" }} />
              Tags
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage global tags available to all users for categorising
              activities and goals
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setShowForm(!showForm);
              setSuccess(false);
              setError(null);
            }}
          >
            Add Tag
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(false)}
        >
          Tag created successfully.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Add Tag Form */}
      <Collapse in={showForm}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            New Global Tag
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Global tags (no user ID) are available to all users when tagging
            activities and goals.
          </Typography>
          <form action={handleSubmit}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                name="tag"
                label="Tag Name"
                required
                size="small"
                sx={{ flex: 1 }}
                placeholder="e.g., Myopia Management, Glaucoma, Contact Lenses"
              />
              <Button variant="outlined" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Collapse>

      {/* Search */}
      <TextField
        placeholder="Search tags..."
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <Search sx={{ color: "text.disabled", mr: 1 }} />,
        }}
      />

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 3 }}>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="primary">
            {globalTags.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global Tags
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="secondary.main">
            {userTags.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User-Created Tags
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="text.primary">
            {globalTags.length + userTags.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Tags
          </Typography>
        </Paper>
      </Stack>

      {/* Global Tags */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Global Tags ({filteredGlobal.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Available to all users
        </Typography>
        {filteredGlobal.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Label sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {search
                ? "No tags match your search"
                : "No global tags yet. Add one above."}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filteredGlobal.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.tag}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* User Tags (collapsed) */}
      <Paper>
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setShowUserTags(!showUserTags)}
        >
          <Box>
            <Typography variant="h6">
              User-Created Tags ({filteredUser.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created by individual users for their own use
            </Typography>
          </Box>
          <IconButton
            aria-label={
              showUserTags ? "Hide user-created tags" : "Show user-created tags"
            }
          >
            {showUserTags ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={showUserTags}>
          <Divider />
          <Box sx={{ p: 3 }}>
            {filteredUser.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {search ? "No tags match your search" : "No user-created tags"}
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {filteredUser.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.tag}
                    size="small"
                    variant="filled"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Container>
  );
}
