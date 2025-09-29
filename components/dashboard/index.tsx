import { Box, Grid, Paper, Typography, Skeleton, Button } from "@mui/material";
import { Suspense } from "react";
import { getDashboardData } from "./actions";
import ActivityComplianceCard from "./components/activity-compliance-card";
import CategoryBreakdownChart from "./components/category-breakdown-chart";
import ComplianceStatusCard from "./components/compliance-status-card";
import DaysLeftCard from "./components/days-left-card";
import InteractiveVsSelfPacedChart from "./components/interactive-vs-selfpaced-chart";
import MonthlyProgressChart from "./components/monthly-progress-chart";
import RemainingHoursCard from "./components/remaining-hours-card";
import TotalCPDHoursCard from "./components/total-cpd-hours-card";
import RecentActivities from "./components/recent-activities";
import PeriodSelector from "./period-selector";

interface CPDDashboardProps {
  cycle?: string | null;
}

export default async function CPDDashboard({ cycle }: CPDDashboardProps) {
  // Fetch all dashboard data once
  const dashboardData = await getDashboardData(cycle);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "100%", width: "100%" }} py={3}>
      <Grid container spacing={1} sx={{ mb: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              CPD Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your Continuing Professional Development progress and
              compliance.
            </Typography>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{
            display: "flex",
            alignContent: "center",
            justifyItems: "flex-end",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            target="_blank"
            href={`/api/report/${cycle}`}
          >
            Generate Report
          </Button>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ alignContent: "center", justifyItems: "flex-end" }}
        >
          <PeriodSelector />
        </Grid>
      </Grid>

      {/* Key Metrics Cards */}
      <Grid container spacing={1} sx={{ mb: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TotalCPDHoursCard cpdSummary={dashboardData.summary} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <RemainingHoursCard cpdSummary={dashboardData.summary} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ComplianceStatusCard cpdSummary={dashboardData.summary} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DaysLeftCard cpdSummary={dashboardData.summary} />
        </Grid>
      </Grid>
      {/* Bottom Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Activity Compliance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activity Compliance
            </Typography>
            <Suspense
              fallback={<Skeleton variant="rectangular" height={200} />}
            >
              <ActivityComplianceCard compliance={dashboardData.compliance} />
            </Suspense>
          </Paper>
        </Grid>
        {/* Recent Activities */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Activities
            </Typography>
            <Suspense
              fallback={<Skeleton variant="rectangular" height={200} />}
            >
              <RecentActivities
                recentActivities={dashboardData.recentActivities}
              />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Monthly Progress Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Progress
            </Typography>
            <Suspense
              fallback={<Skeleton variant="rectangular" height={300} />}
            >
              <MonthlyProgressChart monthlyData={dashboardData.monthly} />
            </Suspense>
          </Paper>
        </Grid>

        {/* Category Breakdown */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Category Breakdown
            </Typography>
            <Suspense
              fallback={
                <Skeleton variant="circular" width={250} height={250} />
              }
            >
              <CategoryBreakdownChart breakdown={dashboardData.categories} />
            </Suspense>
          </Paper>
        </Grid>
        {/* Interactive vs Self-paced */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Learning Format Split
            </Typography>
            <Suspense
              fallback={
                <Skeleton variant="circular" width={250} height={250} />
              }
            >
              <InteractiveVsSelfPacedChart breakdown={dashboardData.formats} />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
