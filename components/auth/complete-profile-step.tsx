"use client";

import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import Link from "next/link";
import { ProfileData } from "@/lib/types/profile";
import { useProfile } from "@/lib/hooks/use-profile";
type ProfileDataState = Omit<ProfileData, "createdAt" | "updatedAt" | "id">;

export default function CompleteProfileStep() {
  const {
    profile: fetchedProfile,
    user,
    error: profileError,
    fetchProfile,
    updateProfile,
  } = useProfile();
  const [profile, setProfile] = useState<ProfileDataState>({
    firstName: "",
    lastName: "",
    phone: "",
    registrationNumber: "",
    roles: ["optometrist"],
    userId: "",
    isTherapeuticallyEndorsed: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setInitialLoading(true);
        await fetchProfile();
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
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
    value: string | boolean,
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleComplete = async () => {
    // Validation
    if (!profile.firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!profile.lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!profile.registrationNumber?.trim()) {
      setError("Registration number is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (!user) throw new Error("No user found");

      await updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || undefined,
        registrationNumber: profile.registrationNumber || undefined,
        isTherapeuticallyEndorsed: profile.isTherapeuticallyEndorsed,
      });

      // Redirect to dashboard
      window.location.href = "/opt";
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to complete profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <Typography variant="h6" className="text-center">
        Complete Your Profile
      </Typography>

      <Typography variant="body2" className="text-center text-gray-600">
        Please provide your professional details to complete your registration
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Box className="grid grid-cols-2 gap-4">
        <TextField
          fullWidth
          label="First Name"
          value={profile.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Last Name"
          value={profile.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          required
        />
      </Box>

      <TextField
        fullWidth
        label="Phone"
        value={profile.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        helperText="Your contact phone number"
      />

      <TextField
        fullWidth
        label="Registration Number"
        value={profile.registrationNumber}
        onChange={(e) =>
          handleInputChange("registrationNumber", e.target.value)
        }
        helperText="Your professional registration number"
        required
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={profile.isTherapeuticallyEndorsed}
              onChange={(e) =>
                handleInputChange("isTherapeuticallyEndorsed", e.target.checked)
              }
            />
          }
          label="Therapeutically Endorsed"
        />
        <Tooltip
          title="Therapeutically endorsed or not, this will determine whether they need to complete 20 or 30 (endorsed) hours of activities and this should be represented in the dashboard. Additionally, therapeutically endorsed Optometrists should complete 10 hours of therapeutic activities as part of the 30, whereas non therapeutically endorsed don't need to."
          arrow
          placement="right"
        >
          <IconButton size="small">
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box className="flex flex-col gap-3 mt-6">
        <Button
          variant="contained"
          onClick={handleComplete}
          disabled={isLoading}
          fullWidth
          size="large"
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} className="mr-2" />
              Completing Profile...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>

        <Link href="/opt" style={{ width: "100%", textDecoration: "none" }}>
          <Button
            variant="outlined"
            disabled={isLoading}
            fullWidth
            size="large"
          >
            Skip for now
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
