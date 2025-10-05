import { Card, CardHeader, CardContent, Box } from "@mui/material";
import ProfileForm from "./components/profile-form";
import { getProfileServerAction } from "./actions/profile";
import ChangePassword from "./components/change-password";

export default async function ProfileTab() {
  const result = await getProfileServerAction();
  const profile = result.profile;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Personal Details" />
        <CardContent>
          <ProfileForm initialState={profile} />
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Change Password" />
        <CardContent>
          <ChangePassword userEmail={profile?.email || ""} />
        </CardContent>
      </Card>
    </Box>
  );
}
