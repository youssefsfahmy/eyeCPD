import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress 
} from "@mui/material";
import { ActivityDataState } from "../../types/activity";

interface ActivitySummaryProps {
  activities: ActivityDataState[];
  isTherapeuticallyEndorsed?: boolean;
}

export default function ActivitySummary({ 
  activities, 
  isTherapeuticallyEndorsed = false 
}: ActivitySummaryProps) {
  
  const calculateStats = () => {
    return activities.reduce((acc, activity) => {
      const hours = parseFloat(activity.hours);
      acc.totalHours += hours;
      acc.totalActivities += 1;
      
      if (activity.clinical) acc.clinicalHours += hours;
      if (activity.nonClinical) acc.nonClinicalHours += hours;
      if (activity.interactive) acc.interactiveHours += hours;
      if (activity.therapeutic) acc.therapeuticHours += hours;
      
      return acc;
    }, {
      totalHours: 0,
      clinicalHours: 0,
      nonClinicalHours: 0,
      interactiveHours: 0,
      therapeuticHours: 0,
      totalActivities: 0,
    });
  };

  const stats = calculateStats();
  
  // CPD Requirements
  const requiredTotalHours = isTherapeuticallyEndorsed ? 30 : 20;
  const requiredTherapeuticHours = isTherapeuticallyEndorsed ? 10 : 0;
  
  const totalProgress = Math.min((stats.totalHours / requiredTotalHours) * 100, 100);
  const therapeuticProgress = requiredTherapeuticHours > 0 
    ? Math.min((stats.therapeuticHours / requiredTherapeuticHours) * 100, 100)
    : 100;

  const StatCard = ({ 
    title, 
    value, 
    target, 
    progress, 
    color = "primary" 
  }: { 
    title: string; 
    value: number; 
    target?: number; 
    progress?: number; 
    color?: "primary" | "secondary" | "success" | "warning" | "error";
  }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color={color} gutterBottom>
          {value}
          {target && (
            <Typography component="span" variant="h6" color="text.secondary">
              /{target}
            </Typography>
          )}
        </Typography>
        {progress !== undefined && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {progress.toFixed(1)}% complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        CPD Progress Summary
      </Typography>
      
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
        gap: 3 
      }}>
        <StatCard
          title="Total Hours"
          value={stats.totalHours}
          target={requiredTotalHours}
          progress={totalProgress}
          color={totalProgress >= 100 ? "success" : totalProgress >= 75 ? "warning" : "primary"}
        />
        
        <StatCard
          title="Activities"
          value={stats.totalActivities}
          color="primary"
        />
        
        {isTherapeuticallyEndorsed && (
          <StatCard
            title="Therapeutic Hours"
            value={stats.therapeuticHours}
            target={requiredTherapeuticHours}
            progress={therapeuticProgress}
            color={therapeuticProgress >= 100 ? "success" : therapeuticProgress >= 75 ? "warning" : "secondary"}
          />
        )}
        
        <StatCard
          title="Interactive Hours"
          value={stats.interactiveHours}
          color="success"
        />
      </Box>

      {/* Requirements Info */}
      <Card sx={{ mt: 2, backgroundColor: "info.light", color: "info.contrastText" }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            📋 CPD Requirements
          </Typography>
          <Typography variant="body2">
            {isTherapeuticallyEndorsed 
              ? "Therapeutically Endorsed: 30 hours total (including 10 therapeutic hours)"
              : "Not Therapeutically Endorsed: 20 hours total"
            }
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
