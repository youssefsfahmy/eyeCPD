"use client";

import { Typography, Alert, Box } from "@mui/material";

export default function EmailVerificationStep({ email }: { email?: string }) {
  return (
    <Box className="space-y-4">
      <Typography variant="h6" className="text-center">
        Check Your Email
      </Typography>

      <Typography variant="body2" className="text-center text-gray-600">
        We&apos;ve sent a verification email to <strong>{email}</strong>
      </Typography>

      <Alert severity="info" icon={false} className="mb-4">
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Please check your email and click the verification link.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t see it? Check your spam folder. If you still can&apos;t
          find it, the email may already be in use — try signing in or using a
          different address.
        </Typography>
      </Alert>

      <Typography
        variant="caption"
        className="block mt-4 text-center text-gray-500"
      >
        After clicking the verification link in your email, you can proceed to
        the next step.
      </Typography>
    </Box>
  );
}
