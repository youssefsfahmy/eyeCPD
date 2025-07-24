"use client";
import {
  TextField,
  Divider,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

import { createProfileServerAction } from "../actions/profile";
import { useActionState, useEffect } from "react";
import { ActionState, ProfileDataState } from "../types/profile";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function ProfileForm({
  initialState,
  isCompleteProfileStep = false,
}: {
  initialState: ProfileDataState;
  isCompleteProfileStep?: boolean;
}) {
  const router = useRouter();
  const init: ActionState = {
    profile: initialState,
    success: false,
    message: "",
    error: "",
    isPending: false,
  };
  const [state, action, isPending] = useActionState(
    createProfileServerAction,
    init
  );

  useEffect(() => {
    if (
      initialState.firstName.trim() &&
      initialState.lastName.trim() &&
      initialState.phone?.trim() &&
      initialState.registrationNumber?.trim() &&
      isCompleteProfileStep
    ) {
      router.push("/account/profile");
    }

    if (state.success && isCompleteProfileStep) {
      // Redirect to the next page after successful profile update
      const supabase = createClient();
      supabase.auth.refreshSession();
      setTimeout(() => {
        router.push("/opt");
      }, 1000);
    }
  }, [
    state.success,
    isCompleteProfileStep,
    initialState.firstName,
    initialState.lastName,
    initialState.phone,
    initialState.registrationNumber,
    router,
  ]);

  return (
    <form action={action}>
      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}
      {state.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.message || "Profile updated successfully"}
        </Alert>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            id="firstName"
            label="First Name"
            name="firstName"
            variant="outlined"
            defaultValue={state.profile.firstName || ""}
            sx={{ flex: 1, minWidth: 200 }}
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            variant="outlined"
            defaultValue={state?.profile.lastName || ""}
            sx={{ flex: 1, minWidth: 200 }}
            required
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Email"
            value={state?.profile.email || ""}
            variant="outlined"
            disabled
            sx={{ flex: 1, minWidth: 200 }}
            helperText="Email cannot be changed from this page"
          />
          <TextField
            label="Role"
            name="role"
            variant="outlined"
            disabled
            value={state?.profile.role || ""}
            sx={{ flex: 1, minWidth: 200 }}
            helperText="Role cannot be changed from this page"
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Phone"
            name="phone"
            variant="outlined"
            defaultValue={state?.profile.phone || ""}
            sx={{ flex: 1, minWidth: 200 }}
            required
          />
          <TextField
            label="Registration Number"
            name="registrationNumber"
            variant="outlined"
            defaultValue={state?.profile.registrationNumber || ""}
            helperText="This is your AHPRA registration number"
            sx={{ flex: 1, minWidth: 200 }}
            required
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControlLabel
            defaultChecked={state?.profile.isTherapeuticallyEndorsed || false}
            control={
              <Checkbox
                name="isTherapeuticallyEndorsed"
                id="isTherapeuticallyEndorsed"
                defaultChecked={
                  state?.profile.isTherapeuticallyEndorsed || false
                }
              />
            }
            label="Therapeutically Endorsed"
          />
          <Tooltip
            title="Indicates if the Optometrist is therapeutically endorsed. Endorsed: 30 hours total (including 10 therapeutic). Not endorsed: 20 hours total."
            arrow
            placement="right"
          >
            <IconButton size="small">
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          // onClick={handleSave}
          disabled={isPending}
        >
          save
          {/* {saving ? <CircularProgress size={20} /> : "Save Changes"} */}
        </Button>
        <Button
          variant="outlined"
          // onClick={() => window.location.reload()}
          // disabled={saving}
        >
          Cancel
        </Button>
      </Box>{" "}
    </form>
  );
}
