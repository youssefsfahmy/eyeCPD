"use client";

import { TextField, Divider, Button, Box, Alert } from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Goal } from "@/lib/db/schema";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ActivityCategories from "../categories/activity-categories";
interface GoalFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GoalForm({ goal, onSuccess, onCancel }: GoalFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState({
    clinical: goal?.clinical || false,
    nonClinical: goal?.nonClinical || false,
    interactive: goal?.interactive || false,
    therapeutic: goal?.therapeutic || false,
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom form submission handler for the new API route
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess(false);

    const formData = new FormData(event.currentTarget);

    // Add categories to form data
    formData.set("clinical", categories.clinical.toString());
    formData.set("nonClinical", categories.nonClinical.toString());
    formData.set("interactive", categories.interactive.toString());
    formData.set("therapeutic", categories.therapeutic.toString());

    try {
      const endpoint = `/api/goal/${goal.id}/update`;

      const response = await fetch(endpoint, {
        method: "Post",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormSuccess(true);

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/goal/list");
        }
      } else {
        setFormError(result.error || "Failed to save goal");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/goal/list");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {`Goal updated successfully`}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            sm: "column",
            md: "row",
            lg: "row",
          },
          gap: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flex: 2,
            height: "fit-content",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <DescriptionOutlinedIcon sx={{ color: "primary.main" }} /> Activity
            Details
          </Box>
          <Divider sx={{ mt: -1 }} />
          {/* Activity Name and Date */}
          <TextField
            id="title"
            label="Goal Title"
            name="title"
            variant="outlined"
            sx={{ flex: 2, minWidth: 300 }}
            required
            defaultValue={goal?.title || ""}
            helperText="e.g., Improve myopia management skills through latest research and training"
          />
          <TextField
            id="description"
            label="Description"
            name="description"
            variant="outlined"
            multiline
            rows={4}
            required
            defaultValue={goal?.description || ""}
            helperText="Provide a detailed description of your learning goal"
          />
          <TextField
            id="year"
            label="Registration Year"
            name="year"
            variant="outlined"
            sx={{ flex: 1, minWidth: 150 }}
            required
            defaultValue={goal?.year || ""}
            helperText="e.g., 2024, 2025"
          />

          <TextField
            id="targetHours"
            label="Target Hours (Optional)"
            name="targetHours"
            type="number"
            variant="outlined"
            sx={{ flex: 1 }}
            inputProps={{
              min: 0,
              step: 0.5,
            }}
            defaultValue={goal?.targetHours || ""}
            helperText="Enter target hours for this goal"
          />

          {/* Topics/Tags */}
          <TextField
            id="tags"
            label="Topics/Tags"
            name="tags"
            variant="outlined"
            multiline
            rows={2}
            defaultValue={goal?.tags?.join(", ") || ""}
            helperText="Provide a comma-separated list of topics or tags related to this goal, e.g., 'myopia, pediatric, technology'"
          />
        </Box>

        <ActivityCategories
          categories={categories}
          setCategories={setCategories}
          hours={parseFloat(goal?.targetHours || "0")}
          type="goal"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          startIcon={<Save />}
        >
          {isSubmitting ? "Saving..." : "Save Goal"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isSubmitting}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
}
