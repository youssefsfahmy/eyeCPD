import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { Schedule, TrendingUp } from "@mui/icons-material";
import { CPDSummary } from "../actions";

interface TotalCPDHoursCardProps {
  summary: CPDSummary;
}

export default function TotalCPDHoursCard({ summary }: TotalCPDHoursCardProps) {
  const progressPercentage = (summary.totalHours / summary.requiredHours) * 100;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Total CPD Hours Completed
            </Typography>
            <Typography variant="h4">
              {summary.totalHours.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              of {summary.requiredHours} required hours
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <TrendingUp
                sx={{ color: "success.main", mr: 0.5 }}
                fontSize="small"
              />
              <Typography variant="body2" color="success.main">
                {progressPercentage.toFixed(1)}% complete
              </Typography>
            </Box>
          </Box>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Schedule />
          </Avatar>
        </Box>
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(progressPercentage, 100)}
            color={
              progressPercentage >= 100
                ? "success"
                : progressPercentage >= 75
                ? "primary"
                : "warning"
            }
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
