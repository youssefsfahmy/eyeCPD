"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import Link from "next/link";
import ActivityCard from "./activity-card";
import { ActivityDataState } from "../../types/activity";

type SortField = "date" | "name" | "hours";
type SortDir = "asc" | "desc";
type Category = "clinical" | "nonClinical" | "interactive" | "therapeutic";
type StatusFilter = "all" | "published" | "draft";

const CATEGORY_LABELS: Record<Category, string> = {
  clinical: "Clinical",
  nonClinical: "Non-Clinical",
  interactive: "Interactive",
  therapeutic: "Therapeutic",
};

interface ActivityListClientProps {
  activities: ActivityDataState[];
}

export default function ActivityListClient({
  activities,
}: ActivityListClientProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [categoryFilters, setCategoryFilters] = useState<Category[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    let result = [...activities];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.activityToTags?.some((t) => t.tag.tag.toLowerCase().includes(q)) ||
          a.provider?.name.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (categoryFilters.length > 0) {
      result = result.filter((a) => categoryFilters.some((cat) => a[cat]));
    }

    // Status filter
    if (statusFilter === "draft") {
      result = result.filter((a) => a.isDraft);
    } else if (statusFilter === "published") {
      result = result.filter((a) => !a.isDraft);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === "hours") {
        cmp = parseFloat(a.hours) - parseFloat(b.hours);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [activities, search, sortField, sortDir, categoryFilters, statusFilter]);

  const draftCount = activities.filter((a) => a.isDraft).length;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6">
            Activities ({filtered.length}
            {filtered.length !== activities.length
              ? ` of ${activities.length}`
              : ""}
            )
          </Typography>
          {draftCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              Including {draftCount} draft(s)
            </Typography>
          )}
        </Box>
      </Box>

      {/* Filter / Sort bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
        alignItems={{ sm: "center" }}
        flexWrap="wrap"
        useFlexGap
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200, flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Category filter */}
        <FormControl size="small" sx={{ width: 160 }}>
          <InputLabel>Categories</InputLabel>
          <Select<Category[]>
            label="Categories"
            multiple
            value={categoryFilters}
            onChange={(e) => setCategoryFilters(e.target.value as Category[])}
            renderValue={(selected) =>
              selected.length === 1
                ? CATEGORY_LABELS[selected[0]]
                : `${selected.length} selected`
            }
          >
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <MenuItem key={cat} value={cat}>
                <Checkbox
                  size="small"
                  checked={categoryFilters.includes(cat)}
                />
                <ListItemText primary={CATEGORY_LABELS[cat]} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Drafts</MenuItem>
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            label="Sort by"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="hours">Hours</MenuItem>
          </Select>
        </FormControl>

        {/* Sort direction toggle */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={sortDir}
          onChange={(_, v) => v && setSortDir(v)}
        >
          <ToggleButton value="desc" sx={{ minWidth: 50 }}>
            Desc
          </ToggleButton>
          <ToggleButton value="asc" sx={{ minWidth: 50 }}>
            Asc
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Active filters */}
      {(search || categoryFilters.length > 0 || statusFilter !== "all") && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2 }}
          flexWrap="wrap"
          useFlexGap
        >
          {search && (
            <Chip
              label={`Search: "${search}"`}
              size="small"
              onDelete={() => setSearch("")}
            />
          )}
          {categoryFilters.map((cat) => (
            <Chip
              key={cat}
              label={CATEGORY_LABELS[cat]}
              size="small"
              onDelete={() =>
                setCategoryFilters((prev) => prev.filter((c) => c !== cat))
              }
            />
          ))}
          {statusFilter !== "all" && (
            <Chip
              label={`Status: ${statusFilter}`}
              size="small"
              onDelete={() => setStatusFilter("all")}
            />
          )}
        </Stack>
      )}

      {/* Activities list */}
      {filtered.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "grey.50",
            borderRadius: 2,
          }}
        >
          {activities.length === 0 ? (
            <>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No activities recorded yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start tracking your CPD by adding your first activity
              </Typography>
              <Link href="/activity/create" legacyBehavior passHref>
                <Button component="a" variant="contained" startIcon={<Add />}>
                  Add Your First Activity
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No activities match your filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <Box>
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </Box>
      )}
    </Box>
  );
}
