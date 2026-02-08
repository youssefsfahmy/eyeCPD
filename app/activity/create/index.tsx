import { Card, CardHeader, CardContent, Box } from "@mui/material";
import ActivityForm from "@/components/activity/activity-form";
import ActionBar from "@/components/layout/action-bar";

export default async function CreateActivityPage() {
  return (
    <Box>
      <ActionBar
        title="Add New CPD Activity"
        description="Record your continuing professional development activities to track your progress toward certification requirements."
        button={{
          href: "/activity/list",
          text: "Back to Activities",
          icon: "back",
        }}
      />

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Activity Details" />
        <CardContent>
          <ActivityForm />
        </CardContent>
      </Card>
    </Box>
  );
}
