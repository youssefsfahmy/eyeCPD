import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Event } from "@mui/icons-material";

export default async function DaysLeftCard(props: {
  cpdSummary: {
    daysLeftInCycle: number;
    cycleEndDate: Date;
  };
}) {
  const { cpdSummary } = props;
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card sx={{ minHeight: 170 }}>
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
              mb="auto"
            >
              Days Left in CPD Cycle
            </Typography>
            <Typography variant="h4">{cpdSummary.daysLeftInCycle}</Typography>
            <Typography variant="body2" color="text.secondary">
              Cycle ends {formatDate(cpdSummary.cycleEndDate)}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "info.main" }}>
            <Event />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
