import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";
import { CategoryBreakdown } from "../actions";

export default async function CategoryBreakdownChart(props: {
  breakdown: CategoryBreakdown;
}) {
  const { breakdown } = props;
  const data = [
    { id: 0, value: breakdown.clinical, label: "Clinical", color: "#1976d2" },
    {
      id: 1,
      value: breakdown.nonClinical,
      label: "Non-Clinical",
      color: "#dc004e",
    },
  ];

  // Filter out zero values
  const filteredData = data.filter((item) => item.value > 0);

  if (filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No CPD hours recorded yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <PieChart
        series={[
          {
            data: filteredData,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
          },
        ]}
        width={300}
        height={200}
        slotProps={{
          legend: { direction: "horizontal", sx: { mb: 2 } },
        }}
      />
    </Box>
  );
}
