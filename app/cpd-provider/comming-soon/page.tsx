import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import {
  Construction,
  ArrowBack,
  Schedule,
  School,
  Analytics,
  ManageAccounts,
  TrendingUp,
  NotificationsActive,
} from "@mui/icons-material";
import Link from "next/link";

export default function Page() {
  const features = [
    {
      icon: <ManageAccounts />,
      title: "Organization Profile",
      description: "Complete setup for your CPD organization",
    },
    {
      icon: <School />,
      title: "Course Management",
      description: "Create and manage CPD courses with ease",
    },
    {
      icon: <Analytics />,
      title: "Credit Tracking",
      description: "Automated CPD credit tracking and certificates",
    },
    {
      icon: <TrendingUp />,
      title: "Revenue Analytics",
      description: "Comprehensive reporting and analytics dashboard",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey.50",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 1000,
              textAlign: "center",
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Stack spacing={4} alignItems="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Construction sx={{ fontSize: 40, color: "white" }} />
                </Box>

                {/* Status Chip */}
                <Chip
                  icon={<Schedule />}
                  label="Coming Soon"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontSize: "0.875rem", px: 1 }}
                />

                {/* Main Title */}
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  CPD Provider Portal
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    maxWidth: 600,
                    lineHeight: 1.6,
                  }}
                >
                  We`&apos;`re crafting an exceptional platform for CPD
                  providers to create, manage, and deliver world-class
                  continuing education experiences for optometrists.
                </Typography>

                <Divider sx={{ width: "80%", my: 2 }} />

                {/* Features Grid */}
                <Box sx={{ width: "100%", mt: 4 }}>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ mb: 3 }}
                  >
                    What&apos;s Coming:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    {features.map((feature, index) => (
                      <Paper
                        key={index}
                        elevation={1}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          textAlign: "center",
                          height: "100%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: 2,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            backgroundColor: "secondary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          {React.cloneElement(feature.icon, {
                            sx: { fontSize: 24, color: "white" },
                          })}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                          color="text.secondary"
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 4 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<NotificationsActive />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    Get Notified
                  </Button>

                  <Link href="/" legacyBehavior passHref>
                    <Button
                      component="a"
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Back to Home
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
