import { Typography, Card, CardHeader, CardContent, Box } from "@mui/material";
import ActivityForm from "./components/activity-form";

export default async function CreateActivityPage() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add New CPD Activity
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Record your continuing professional development activities to track your
        progress toward certification requirements.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Activity Details" />
        <CardContent>
          <ActivityForm />
        </CardContent>
      </Card>
    </Box>
  );
}

