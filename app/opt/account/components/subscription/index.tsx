import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  Button,
  Box,
} from "@mui/material";

// Subscriptions Tab Component
export default function SubscriptionsTab() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Subscription Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Current Plan" />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h6">Professional Plan</Typography>
            <Chip label="Active" color="success" />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Full access to all CPD features and resources
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Next billing date: January 15, 2025
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            $29.99/month
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary">
              Upgrade Plan
            </Button>
            <Button variant="outlined" color="error">
              Cancel Subscription
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Billing History" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No billing history available yet.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
