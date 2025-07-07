"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import { CustomThemeProvider, customColors } from "@/lib/mui/theme";
import { useCustomTheme } from "@/lib/mui/use-theme";

function ThemeDemo() {
  const { isDark, toggleTheme } = useCustomTheme();

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Stack spacing={3}>
        {/* Theme Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1">
            MUI Theme Demo
          </Typography>
          <Button variant="outlined" onClick={toggleTheme}>
            Switch to {isDark ? "Light" : "Dark"} Mode
          </Button>
        </Box>

        {/* Color Palette Demo */}
        <Card>
          <CardHeader>
            <Typography variant="h6">Color Palette</Typography>
          </CardHeader>
          <CardContent>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
              <Chip label="Primary" color="primary" />
              <Chip label="Secondary" color="secondary" />
              <Chip label="Success" color="success" />
              <Chip label="Warning" color="warning" />
              <Chip label="Error" color="error" />
            </Stack>
          </CardContent>
        </Card>

        {/* Buttons Demo */}
        <Card>
          <CardHeader>
            <Typography variant="h6">Buttons</Typography>
          </CardHeader>
          <CardContent>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
              <Button variant="contained" color="primary">
                Primary Button
              </Button>
              <Button variant="outlined" color="secondary">
                Secondary Button
              </Button>
              <Button variant="text" color="success">
                Success Button
              </Button>
              <Button variant="contained" color="warning">
                Warning Button
              </Button>
              <Button variant="contained" color="error">
                Error Button
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Form Demo */}
        <Card>
          <CardHeader>
            <Typography variant="h6">Form Elements</Typography>
          </CardHeader>
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                placeholder="Enter your email"
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                fullWidth
              />
              <TextField
                label="Message"
                multiline
                rows={4}
                placeholder="Enter your message"
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Typography Demo */}
        <Card>
          <CardHeader>
            <Typography variant="h6">Typography</Typography>
          </CardHeader>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="h6">Heading 6</Typography>
              <Typography variant="body1">
                Body 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Body 2: Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Custom Colors Demo */}
        <Card>
          <CardHeader>
            <Typography variant="h6">Custom Color Scale</Typography>
          </CardHeader>
          <CardContent>
            <Typography variant="body2" gutterBottom>
              Primary Color Scale:
            </Typography>
            <Stack direction="row" spacing={1} mb={2}>
              {Object.entries(customColors.primary).map(([shade, color]) => (
                <Paper
                  key={shade}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: color,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: parseInt(shade) > 500 ? "white" : "black",
                      fontSize: "10px",
                    }}
                  >
                    {shade}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default function MuiThemeDemo() {
  const { isDark, mounted } = useCustomTheme();

  if (!mounted) {
    return null;
  }

  return (
    <CustomThemeProvider isDark={isDark}>
      <ThemeDemo />
    </CustomThemeProvider>
  );
}
