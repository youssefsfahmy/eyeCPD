import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { CheckCircle, Warning, Error } from "@mui/icons-material";

export default async function ComplianceStatusCard(props: {
  cpdSummary: { complianceStatus: string };
}) {
  const { cpdSummary } = props;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "success";
      case "At Risk":
        return "warning";
      case "Non-compliant":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "On Track":
        return <CheckCircle />;
      case "At Risk":
        return <Warning />;
      case "Non-compliant":
        return <Error />;
      default:
        return <CheckCircle />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "On Track":
        return "Great progress!";
      case "At Risk":
        return "Needs attention";
      case "Non-compliant":
        return "Urgent action required";
      default:
        return "";
    }
  };

  return (
    <Card
      sx={{
        justifyContent: "space-between",
        minHeight: 170,
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
        paddingTop={2}
        paddingX={2}
      >
        Compliance Status
      </Typography>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ mt: 1, mb: 1 }}>
              <Chip
                label={cpdSummary.complianceStatus}
                color={getStatusColor(cpdSummary.complianceStatus)}
                variant="filled"
                size="medium"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {getStatusMessage(cpdSummary.complianceStatus)}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${getStatusColor(cpdSummary.complianceStatus)}.main`,
            }}
          >
            {getStatusIcon(cpdSummary.complianceStatus)}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
