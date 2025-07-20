"use client";

import { createClient } from "@/app/lib/supabase/client";
import {
  Box,
  Button,
  CardContent,
  TextField,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SignUpFormOptometristProps {
  nextStep: () => void;
  setCurrentEmail: (email: string) => void;
}

export function SignUpFormOptometrist({
  nextStep,
  setCurrentEmail,
}: SignUpFormOptometristProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setCurrentEmail(email);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/sign-up/optometrist`,
        },
      });

      if (error) throw error;
      // router.push("/auth/sign-up/optometrist");
      nextStep?.();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/confirm?next=/auth/sign-up/optometrist`,
        },
      });
      if (error) {
        throw error;
        setIsGoogleLoading(false);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <>
      <CardContent sx={{ width: "100%" }}>
        <Box component="form" onSubmit={handleSignUp} noValidate>
          <Stack spacing={3}>
            {/* Google Sign Up Button */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={
                isGoogleLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Image
                    src={"/google.png"}
                    alt="Google"
                    width={20}
                    height={20}
                  />
                )
              }
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              sx={{
                py: 1.5,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
            >
              {isGoogleLoading
                ? "Signing up with Google..."
                : "Sign up with Google"}
            </Button>

            {/* Divider */}
            <Box sx={{ position: "relative", my: 2 }}>
              <Divider />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "background.paper",
                  px: 2,
                  color: "text.secondary",
                }}
              >
                Or continue with Email
              </Typography>
            </Box>

            {/* Email Field */}
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              required
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setCurrentEmail?.(e.target.value);
              }}
              disabled={isLoading || isGoogleLoading}
            />

            {/* Password Field */}
            <TextField
              id="password"
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
            />

            {/* Repeat Password Field */}
            <TextField
              id="repeat-password"
              label="Repeat Password"
              type="password"
              required
              fullWidth
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              error={repeatPassword !== "" && password !== repeatPassword}
              helperText={
                repeatPassword !== "" && password !== repeatPassword
                  ? "Passwords do not match"
                  : ""
              }
            />

            {/* Error Message */}
            {error && (
              <Alert severity="error" variant="outlined">
                {error}
              </Alert>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || isGoogleLoading}
              sx={{ py: 1.5 }}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? "Creating an account..." : "Sign up"}
            </Button>

            {/* Login Link */}
            <Typography variant="body2" align="center" color="text.secondary">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                passHref
                className="hover:underline text-primary"
              >
                Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </>
  );
}
