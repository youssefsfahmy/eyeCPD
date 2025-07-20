import { getProfileServerAction } from "@/app/account/profile/actions/profile";
import ProfileForm from "@/app/account/profile/components/ProfileForm";
import { Typography, Card, Box, Step, StepLabel, Stepper } from "@mui/material";
const steps = ["Create Account", "Verify Email", "Complete Profile"];

export default async function ProfileTab() {
  const result = await getProfileServerAction();
  const profile = result.profile;

  return (
    <div className="flex items-center justify-center w-full p-6 min-h-svh md:p-1 bg-primary-50">
      <div className="w-full max-w-md text-center">
        <Typography variant="h4" component="h1" mb={4} textAlign={"center"}>
          Sign Up as Optometrist
        </Typography>
        <Box sx={{ width: "100%", mb: 4 }}>
          <Stepper activeStep={2} alternativeLabel>
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
          <ProfileForm initialState={profile} isCompleteProfileStep />
        </Card>
      </div>
    </div>
  );
}
