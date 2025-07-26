"use client";

import {
  TextField,
  Divider,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
} from "@mui/material";
import { Save, Cancel, Add } from "@mui/icons-material";
import { useActionState, useEffect } from "react";
import { ActivityActionState } from "@/app/activity/types/activity";
import {
  createActivityServerAction,
  updateActivityServerAction,
} from "@/app/activity/actions";
import { useRouter } from "next/navigation";
import { ActivityRecord } from "@/lib/db/schema";

interface ActivityFormProps {
  activity?: ActivityRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ActivityForm({
  activity,
  onSuccess,
  onCancel,
}: ActivityFormProps) {
  const router = useRouter();
  const isEditing = !!activity;

  const init: ActivityActionState = {
    isPending: false,
    success: false,
    message: "",
    error: "",
  };

  const [state, action, isPending] = useActionState(
    isEditing ? updateActivityServerAction : createActivityServerAction,
    init
  );

  useEffect(() => {
    if (state.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to activity list after successful creation/update
        setTimeout(() => {
          router.push("/activity/list");
        }, 1000);
      }
    }
  }, [state.success, onSuccess, router]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/activity/list");
    }
  };

  return (
    <form action={action}>
      {/* Hidden field for edit mode */}
      {isEditing && <input type="hidden" name="id" value={activity.id} />}

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}
      {state.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.message ||
            `Activity ${isEditing ? "updated" : "created"} successfully`}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Activity Name and Date */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            id="name"
            label="Activity Name"
            name="name"
            variant="outlined"
            sx={{ flex: 2, minWidth: 300 }}
            required
            defaultValue={activity?.name || ""}
            helperText="e.g., Clinical Workshop on Dry Eye Management"
          />
          <TextField
            id="date"
            label="Date"
            name="date"
            type="date"
            variant="outlined"
            sx={{ flex: 1, minWidth: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
            required
            defaultValue={activity?.date || ""}
          />
        </Box>

        {/* Hours */}
        <TextField
          id="hours"
          label="Hours"
          name="hours"
          type="number"
          variant="outlined"
          sx={{ maxWidth: 200 }}
          inputProps={{
            min: 0.25,
            step: 0.25,
          }}
          required
          defaultValue={activity?.hours || ""}
          helperText="Enter hours in 0.25 increments"
        />

        {/* Activity Types */}
        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Activity Types (select all that apply)
            </Typography>
          </FormLabel>
          <FormGroup>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="clinical"
                    defaultChecked={activity?.clinical || false}
                  />
                }
                label="Clinical"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="nonClinical"
                    defaultChecked={activity?.nonClinical || false}
                  />
                }
                label="Non-Clinical"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="interactive"
                    defaultChecked={activity?.interactive || false}
                  />
                }
                label="Interactive"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="therapeutic"
                    defaultChecked={activity?.therapeutic || false}
                  />
                }
                label="Therapeutic"
              />
            </Box>
          </FormGroup>
        </FormControl>

        {/* Description */}
        <TextField
          id="description"
          label="Description"
          name="description"
          variant="outlined"
          multiline
          rows={4}
          required
          defaultValue={activity?.description || ""}
          helperText="Provide a detailed description of the activity, including what was covered and key learning outcomes"
        />

        {/* Reflection */}
        <TextField
          id="reflection"
          label="Reflection"
          name="reflection"
          variant="outlined"
          multiline
          rows={4}
          required
          defaultValue={activity?.reflection || ""}
          helperText="Reflect on how this activity will impact your practice and what you learned"
        />

        {/* Evidence File - TODO: Implement file upload */}
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "grey.300",
            borderRadius: 1,
            backgroundColor: "grey.50",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            📎 Evidence File Upload (Coming Soon)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Upload certificates, screenshots, or other evidence to support this
            activity.
          </Typography>
          {activity?.evidenceFileUrl && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Current file:{" "}
              <a
                href={activity.evidenceFileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isPending}
          startIcon={isEditing ? <Save /> : <Add />}
        >
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
            ? "Save Changes"
            : "Create Activity"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isPending}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
}
