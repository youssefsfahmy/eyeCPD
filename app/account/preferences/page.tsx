"use client";

import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
  Alert,
  Button,
  Box,
} from "@mui/material";

export default function PreferencesTab() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Account Preferences
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Notifications" />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications for new CPD opportunities"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Reminder emails for upcoming deadlines"
            />
            <FormControlLabel control={<Switch />} label="SMS notifications" />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Weekly progress reports"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Privacy Settings" />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Make my profile visible to other professionals"
            />
            <FormControlLabel
              control={<Switch />}
              label="Allow data sharing for research purposes"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable analytics to improve experience"
            />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Danger Zone" />
        <CardContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            These actions cannot be undone. Please proceed with caution.
          </Alert>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" color="error">
              Delete Account
            </Button>
            <Button variant="outlined" color="warning">
              Export Data
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
