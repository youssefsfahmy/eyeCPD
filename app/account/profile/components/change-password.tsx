"use client";
import {
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";

interface ChangePasswordProps {
  userEmail: string;
}

export default function ChangePassword({ userEmail }: ChangePasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);

    try {
      const supabase = createClient();

      // First verify current password by attempting to sign in with it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        setPasswordError("Current password is incorrect");
        setIsChangingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        setPasswordError(updateError.message);
      } else {
        setPasswordSuccess("Password updated successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setPasswordError("An error occurred while updating password");
      console.error("Password change error:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClear = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  return (
    <div>
      {passwordError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {passwordError}
        </Alert>
      )}

      {passwordSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {passwordSuccess}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Current Password"
          type={showPassword ? "text" : "password"}
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
          variant="outlined"
          required
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData((prev) => ({
              ...prev,
              newPassword: e.target.value,
            }))
          }
          variant="outlined"
          required
          helperText="Password must be at least 6 characters long"
        />

        <TextField
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          variant="outlined"
          required
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePasswordChange}
            disabled={
              isChangingPassword ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleClear}
            disabled={isChangingPassword}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </div>
  );
}
