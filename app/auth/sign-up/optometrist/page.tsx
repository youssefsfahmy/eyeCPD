"use client";

import { SignUpFormOptometrist } from "@/components/auth/sign-up-form-optometrist";
import { Box, Card, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import EmailVerificationStep from "@/components/auth/email-verification-step";
import CompleteProfileStep from "@/components/auth/complete-profile-step";
import { createClient } from "@/app/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const steps = ["Create Account", "Verify Email", "Complete Profile"];
  const [currentStep, setCurrentStep] = useState(0);

  // Update current step based on user state
  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, check if they need to complete profile
        setCurrentStep(2);
      } else {
        // No user, start from beginning
        setCurrentStep(0);
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-10">
        <div className="w-full max-w-md text-center">
          <Typography variant="body1">Loading...</Typography>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SignUpFormOptometrist
            setCurrentEmail={setEmail}
            nextStep={() => setCurrentStep(1)}
          />
        );
      case 1:
        return (
          <EmailVerificationStep email={email || "your-email@example.com"} />
        );
      case 2:
        return <CompleteProfileStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center w-full p-6 min-h-[80vh] md:p-1 bg-primary-50">
      <div className="my-6 w-full max-w-md text-center">
        <Typography variant="h4" component="h1" mb={4} textAlign={"center"}>
          Sign Up as Optometrist
        </Typography>

        <Box sx={{ width: "100%", mb: 4 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Card
          sx={{
            justifyItems: "center",
            borderRadius: 1,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            position: "relative",
            border: "1px solid #e0e0e0",
          }}
          className="max-w-md"
        >
          {renderStepContent()}
        </Card>
      </div>
    </div>
  );
}
