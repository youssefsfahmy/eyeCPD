"use client";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  IconButton,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  Assessment,
  Visibility,
  Event,
  NotificationsActive,
  MoreVert,
  Download,
} from "@mui/icons-material";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";

export default function DashboardPage() {
  const lineChartData = {
    xAxis: [
      {
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        scaleType: "point" as const,
      },
    ],
    series: [
      {
        data: [2400, 1398, 9800, 3908, 4800, 3800],
        label: "Patients",
        color: "#1976d2",
      },
      {
        data: [2210, 1180, 8600, 3200, 4100, 3300],
        label: "Appointments",
        color: "#dc004e",
      },
    ],
  };

  const barChartData = {
    xAxis: [
      {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        scaleType: "band" as const,
      },
    ],
    series: [
      {
        data: [45, 67, 89, 78, 56, 34],
        label: "Daily Appointments",
        color: "#2e7d32",
      },
    ],
  };

  const pieChartData = [
    { id: 0, value: 35, label: "Regular Checkups", color: "#1976d2" },
    { id: 1, value: 25, label: "Eye Exams", color: "#dc004e" },
    { id: 2, value: 20, label: "Contact Lens", color: "#2e7d32" },
    { id: 3, value: 20, label: "Emergency", color: "#ed6c02" },
  ];

  // Sample data for recent patients
  const recentPatients = [
    {
      name: "John Doe",
      time: "10:30 AM",
      type: "Regular Checkup",
      status: "Completed",
    },
    {
      name: "Sarah Smith",
      time: "11:15 AM",
      type: "Eye Exam",
      status: "In Progress",
    },
    {
      name: "Mike Johnson",
      time: "2:00 PM",
      type: "Contact Lens",
      status: "Scheduled",
    },
    {
      name: "Emma Wilson",
      time: "3:30 PM",
      type: "Emergency",
      status: "Urgent",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "Scheduled":
        return "default";
      case "Urgent":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%", width: "100%" }} py={3}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Optometrist Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here&apos;s what&apos;s happening with your practice
          today.
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Total Patients
                  </Typography>
                  <Typography variant="h4">1,284</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUp
                      sx={{ color: "success.main", mr: 0.5 }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="success.main">
                      +12.5% from last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Today&apos;s Appointments
                  </Typography>
                  <Typography variant="h4">23</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingDown
                      sx={{ color: "error.main", mr: 0.5 }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="error.main">
                      -3 from yesterday
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <Event />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h4">$12,450</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUp
                      sx={{ color: "success.main", mr: 0.5 }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="success.main">
                      +8.2% from last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <Assessment />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Pending Reviews
                  </Typography>
                  <Typography variant="h4">7</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <NotificationsActive
                      sx={{ color: "warning.main", mr: 0.5 }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="warning.main">
                      Requires attention
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <Visibility />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Patient & Appointment Trends</Typography>
              <Button startIcon={<Download />} size="small">
                Export
              </Button>
            </Box>
            <LineChart
              width={700}
              height={300}
              series={lineChartData.series}
              xAxis={lineChartData.xAxis}
            />
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Appointment Types
            </Typography>
            <PieChart
              series={[
                {
                  data: pieChartData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              width={350}
              height={250}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Recent Patients */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Today&apos;s Schedule</Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <List>
              {recentPatients.map((patient, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{patient.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={patient.name}
                      secondary={`${patient.time} • ${patient.type}`}
                    />
                    <Chip
                      label={patient.status}
                      size="small"
                      color={getStatusColor(patient.status)}
                      variant="outlined"
                    />
                  </ListItem>
                  {index < recentPatients.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Weekly Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Weekly Performance
            </Typography>
            <BarChart
              width={400}
              height={300}
              series={barChartData.series}
              xAxis={barChartData.xAxis}
            />

            {/* Performance Metrics */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                This Week&apos;s Goals
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Patient Satisfaction</Typography>
                  <Typography variant="body2">92%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  color="success"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Appointment Completion
                  </Typography>
                  <Typography variant="body2">87%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={87}
                  color="primary"
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Revenue Target</Typography>
                  <Typography variant="body2">76%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={76}
                  color="warning"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
