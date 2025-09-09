import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  TextSnippet,
  AttachFile,
  Category,
  MoreHoriz,
} from "@mui/icons-material";
import { ActivityCompliance } from "../actions";

export default async function ActivityComplianceCard(props: {
  compliance: ActivityCompliance;
}) {
  const { compliance } = props;

  const totalActivities =
    compliance.compliantCount + compliance.nonCompliantCount;
  const complianceRate =
    totalActivities > 0
      ? ((compliance.compliantCount / totalActivities) * 100).toFixed(1)
      : "0";

  return (
    <Box>
      {/* Summary */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle color="success" />
            <Typography variant="h6">{compliance.compliantCount}</Typography>
            <Typography variant="body2" color="text.secondary">
              Compliant
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Error color="error" />
            <Typography variant="h6">{compliance.nonCompliantCount}</Typography>
            <Typography variant="body2" color="text.secondary">
              Non-compliant
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Chip
            label={`${complianceRate}% Compliance Rate`}
            color={
              Number(complianceRate) >= 90
                ? "success"
                : Number(complianceRate) >= 70
                ? "warning"
                : "error"
            }
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Non-compliance breakdown */}
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Non-compliance Reasons
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <TextSnippet fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Missing Reflection"
            secondary={`${compliance.nonCompliantReasons.missingReflection} activities`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <AttachFile fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="No Evidence"
            secondary={`${compliance.nonCompliantReasons.noEvidence} activities`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Category fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Wrong Category"
            secondary={`${compliance.nonCompliantReasons.wrongCategory} activities`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <MoreHoriz fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Other Issues"
            secondary={`${compliance.nonCompliantReasons.other} activities`}
          />
        </ListItem>
      </List>
    </Box>
  );
}
