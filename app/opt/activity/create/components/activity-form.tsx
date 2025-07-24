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
import { useActionState, useEffect } from "react";
import { ActivityActionState } from "../../types/activity";
import { createActivityServerAction } from "../../actions";
import { useRouter } from "next/navigation";

interface ActivityFormProps {
  onSuccess?: () => void;
}

export default function ActivityForm({ onSuccess }: ActivityFormProps) {
  const router = useRouter();

  const init: ActivityActionState = {
    isPending: false,
    success: false,
    message: "",
    error: "",
  };

  const [state, action, isPending] = useActionState(
    createActivityServerAction,
    init
  );

  useEffect(() => {
    if (state.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to activity list after successful creation
        setTimeout(() => {
          router.push("/opt/activity/list");
        }, 1000);
      }
    }
  }, [state.success, onSuccess, router]);

  return (
    <form action={action}>
      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}
      {state.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.message || "Activity created successfully"}
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
                control={<Checkbox name="clinical" />}
                label="Clinical"
              />
              <FormControlLabel
                control={<Checkbox name="nonClinical" />}
                label="Non-Clinical"
              />
              <FormControlLabel
                control={<Checkbox name="interactive" />}
                label="Interactive"
              />
              <FormControlLabel
                control={<Checkbox name="therapeutic" />}
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
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Activity"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/opt/activity/list")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
}
