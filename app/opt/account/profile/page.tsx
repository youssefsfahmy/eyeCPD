import { Typography, Card, CardHeader, CardContent, Box } from "@mui/material";
import ProfileForm from "./components/ProfileForm";
import { getProfileServerAction } from "./actions/profile";

export default async function ProfileTab() {
  const result = await getProfileServerAction();
  const profile = result.profile;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile Information
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Personal Details" />
        <CardContent>
          <ProfileForm initialState={profile} />
        </CardContent>
      </Card>
    </Box>
  );
}
