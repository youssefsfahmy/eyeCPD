import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

export default async function InteractiveVsSelfPacedChart(props: {
  breakdown: { interactive: number; selfPaced: number };
}) {
  const { breakdown } = props;

  const data = [
    {
      id: 0,
      value: breakdown.interactive,
      label: "Interactive",
      color: "#2e7d32",
    },
    {
      id: 1,
      value: breakdown.selfPaced,
      label: "Self-paced",
      color: "#ed6c02",
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
    <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
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
      />
    </Box>
  );
}
