import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import ActivityForm from "@/components/activity/activity-form";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";

export default async function CreateActivityPage() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #2562ea, #1d4ed8)",
          color: "white",
          p: 4,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Add New CPD Activity
          </Typography>
          <Typography variant="body1">
            Record your continuing professional development activities to track
            your progress toward certification requirements.{" "}
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/activity/list"
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBack />}
        >
          Back to Activities
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Activity Details" />
        <CardContent>
          <ActivityForm />
        </CardContent>
      </Card>
    </Box>
  );
}
