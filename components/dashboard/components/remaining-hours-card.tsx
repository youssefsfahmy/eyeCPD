import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Assignment } from "@mui/icons-material";

export default async function RemainingHoursCard(props: {
  cpdSummary: { remainingHours: number; daysLeftInCycle: number };
}) {
  const { cpdSummary } = props;
  return (
    <Card sx={{ minHeight: 170 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box sx={{ height: "100%" }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Remaining Hours Needed
            </Typography>
            <Typography variant="h4" mt="auto">
              {cpdSummary.remainingHours.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cpdSummary.remainingHours === 0
                ? "Requirements met!"
                : `${cpdSummary.daysLeftInCycle} days remaining`}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <Assignment />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
