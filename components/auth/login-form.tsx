"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Box,
  Button,
  CardContent,
  TextField,
  Typography,
  Link as MuiLink,
  Divider,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/opt");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    setIsGoogleLoading(true);
    setError(null);

    try {
      console.log(`${window.location.origin}/auth/confirm`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <CardContent sx={{ width: "100%" }}>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={3}>
            {/* Google Sign In Button */}
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
              onClick={handleGoogleSignIn}
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
                ? "Signing in with Google..."
                : "Sign in with Google"}
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
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isGoogleLoading}
            />

            {/* Password Field */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  component="label"
                  htmlFor="password"
                >
                  Password
                </Typography>
                <Link href="/auth/forgot-password" passHref>
                  <MuiLink variant="body2" underline="hover">
                    Forgot your password?
                  </MuiLink>
                </Link>
              </Box>
              <TextField
                id="password"
                type="password"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" variant="outlined">
                {error}
              </Alert>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || isGoogleLoading}
              sx={{ py: 1.5 }}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Sign Up Link */}
            <Typography variant="body2" align="center" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Link href="/" passHref>
                <MuiLink underline="hover">Sign up</MuiLink>
              </Link>
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </>
  );
}
