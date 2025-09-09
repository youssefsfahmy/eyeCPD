import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography } from "@mui/material";
import { MonthlyProgress } from "../actions";

export default async function MonthlyProgressChart(props: {
  monthlyData: MonthlyProgress[];
}) {
  const { monthlyData } = props;
  const months = monthlyData.map((item) => item.month);
  const hours = monthlyData.map((item) => item.hours);

  const maxHours = Math.max(...hours);

  if (maxHours === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No CPD hours recorded yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <LineChart
        xAxis={[
          {
            data: months,
            scaleType: "point",
          },
        ]}
        series={[
          {
            data: hours,
            label: "CPD Hours",
            color: "#1976d2",
            curve: "linear",
            area: true,
          },
        ]}
        width={600}
        height={300}
        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
        grid={{ vertical: true, horizontal: true }}
      />
    </Box>
  );
}
