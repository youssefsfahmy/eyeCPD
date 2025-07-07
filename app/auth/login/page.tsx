import { LoginForm } from "@/components/auth/login-form";
import { UnprotectedRoute } from "@/components/auth/unprotected-page";
import { Card, Typography } from "@mui/material";

export default function Page() {
  return (
    <UnprotectedRoute redirectTo="/opt">
      <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-10">
        <div className="w-full max-w-sm">
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          <Typography
            variant="body2"
            mb={8}
            color="text.secondary"
            align="center"
          >
            Enter your email below to login to your account
          </Typography>
          <Card
            sx={{
              maxWidth: 400,
              mx: "auto",
              boxShadow: 3,
            }}
          >
            <LoginForm />
          </Card>
        </div>
      </div>
    </UnprotectedRoute>
  );
}
