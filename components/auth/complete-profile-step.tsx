"use client";

import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Link from "next/link";

export default function CompleteProfileStep() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [userData] = useState({
    firstName: "",
    lastName: "",
    registrationNumber: "",
    qualifications: "",
  });

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      console.log("Input changed:", e.target.value, field);
      setError("");
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChange = (field: string) => (event: any) => {
    console.log("Selected value:", event.target.value, field);
    setError("");
  };

  const handleComplete = async () => {
    // Validation
    if (!userData.firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!userData.lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!userData.registrationNumber.trim()) {
      setError("Registration number is required");
      return;
    }
    if (!userData.qualifications.trim()) {
      setError("Qualifications are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to complete registration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page or dashboard
      window.location.href = "/auth/sign-up-success";
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const qualificationOptions = [
    "Bachelor of Optometry",
    "Master of Optometry",
    "Doctor of Optometry",
    "Bachelor of Vision Science",
    "Master of Vision Science",
    "PhD in Optometry/Vision Science",
    "Other",
  ];

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
          value={userData.firstName}
          onChange={handleInputChange("firstName")}
          required
        />

        <TextField
          fullWidth
          label="Last Name"
          value={userData.lastName}
          onChange={handleInputChange("lastName")}
          required
        />
      </Box>

      <TextField
        fullWidth
        label="Registration Number"
        value={userData.registrationNumber}
        onChange={handleInputChange("registrationNumber")}
        helperText="Your professional registration number"
        required
      />

      <FormControl fullWidth required>
        <InputLabel>Highest Qualification</InputLabel>
        <Select
          value={userData.qualifications}
          label="Highest Qualification"
          onChange={handleSelectChange("qualifications")}
        >
          {qualificationOptions.map((qualification) => (
            <MenuItem key={qualification} value={qualification}>
              {qualification}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
              Completing Registration...
            </>
          ) : (
            "Complete Registration"
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
