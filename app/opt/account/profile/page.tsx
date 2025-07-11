"use client";

import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Divider,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useProfile } from "@/lib/hooks/use-profile";
import { ProfileData } from "@/lib/types/profile";

type ProfileDataState = Omit<ProfileData, "createdAt" | "updatedAt" | "id">;

export default function ProfileTab() {
  const {
    profile: fetchedProfile,
    user,
    isLoading,
    error: profileError,
    fetchProfile,
    updateProfile,
  } = useProfile();

  const [profile, setProfile] = useState<ProfileDataState>({
    firstName: "",
    lastName: "",
    phone: "",
    registrationNumber: "",
    role: "",
    userId: "",
    isTherapeuticallyEndorsed: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (fetchedProfile) {
      setProfile(fetchedProfile);
    }
  }, [fetchedProfile]);

  useEffect(() => {
    if (profileError) {
      setError(profileError);
    }
  }, [profileError]);

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!user) throw new Error("No user found");

      await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || undefined,
        registrationNumber: profile.registrationNumber || undefined,
        isTherapeuticallyEndorsed: profile.isTherapeuticallyEndorsed,
      });

      setSuccess("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        p={4}
        height="100%"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile Information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Personal Details" />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="First Name"
                value={profile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                variant="outlined"
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                variant="outlined"
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Email"
                value={user?.email || ""}
                variant="outlined"
                disabled
                sx={{ flex: 1, minWidth: 200 }}
                helperText="Email cannot be changed from this page"
              />
              <TextField
                label="Role"
                value={profile.role}
                variant="outlined"
                disabled
                sx={{ flex: 1, minWidth: 200 }}
                helperText="Role cannot be changed from this page"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Phone"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                variant="outlined"
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="Registration Number"
                value={profile.registrationNumber}
                onChange={(e) =>
                  handleInputChange("registrationNumber", e.target.value)
                }
                variant="outlined"
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.isTherapeuticallyEndorsed}
                    onChange={(e) =>
                      handleInputChange(
                        "isTherapeuticallyEndorsed",
                        e.target.checked
                      )
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
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={20} /> : "Save Changes"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              disabled={saving}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
