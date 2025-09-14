import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { ActivityDataState } from "../../types/activity";

interface ActivitySummaryProps {
  activities: ActivityDataState[];
  isTherapeuticallyEndorsed?: boolean;
}

export default function ActivitySummary({
  activities,
  isTherapeuticallyEndorsed = false,
}: ActivitySummaryProps) {
  const calculateStats = () => {
    // Only include published activities (not drafts) in CPD calculations
    const publishedActivities = activities.filter(
      (activity) => !activity.isDraft
    );

    return publishedActivities.reduce(
      (acc, activity) => {
        const hours = parseFloat(activity.hours);
        acc.totalHours += hours;
        acc.totalActivities += 1;

        if (activity.clinical) acc.clinicalHours += hours;
        if (activity.nonClinical) acc.nonClinicalHours += hours;
        if (activity.interactive) acc.interactiveHours += hours;
        if (activity.therapeutic) {
          acc.therapeuticHours += hours;
          // Interactive therapeutic hours are both interactive AND therapeutic
          if (activity.interactive) {
            acc.interactiveTherapeuticHours += hours;
          }
        }

        return acc;
      },
      {
        totalHours: 0,
        clinicalHours: 0,
        nonClinicalHours: 0,
        interactiveHours: 0,
        therapeuticHours: 0,
        interactiveTherapeuticHours: 0,
        totalActivities: 0,
      }
    );
  };

  const stats = calculateStats();

  // CPD Requirements
  const requiredTotalHours = isTherapeuticallyEndorsed ? 30 : 20;
  const requiredClinicalHours = isTherapeuticallyEndorsed ? 25 : 15;
  const requiredInteractiveHours = 5; // Same for everyone
  const requiredTherapeuticHours = 10; // Only for therapeutically endorsed
  const requiredInteractiveTherapeuticHours = 2; // Min 2 out of 10 therapeutic hours
  const maxNonClinicalHours = 5; // Maximum allowed for everyone

  // Progress calculations
  const totalProgress = Math.min(
    (stats.totalHours / requiredTotalHours) * 100,
    100
  );
  const clinicalProgress = Math.min(
    (stats.clinicalHours / requiredClinicalHours) * 100,
    100
  );
  const interactiveProgress = Math.min(
    (stats.interactiveHours / requiredInteractiveHours) * 100,
    100
  );
  const therapeuticProgress = isTherapeuticallyEndorsed
    ? Math.min((stats.therapeuticHours / requiredTherapeuticHours) * 100, 100)
    : 100;
  const interactiveTherapeuticProgress = isTherapeuticallyEndorsed
    ? Math.min(
        (stats.interactiveTherapeuticHours /
          requiredInteractiveTherapeuticHours) *
          100,
        100
      )
    : 100;
  const nonClinicalUsage = (stats.nonClinicalHours / maxNonClinicalHours) * 100;

  const StatCard = ({
    title,
    value,
    target,
    progress,
    color = "primary",
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
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              {progress.toFixed(1)}% complete
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        py: 3,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
            lg: isTherapeuticallyEndorsed ? "repeat(6, 1fr)" : "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {/* Total Hours */}
        <StatCard
          title="Total Hours"
          value={stats.totalHours}
          target={requiredTotalHours}
          progress={totalProgress}
          color={
            totalProgress >= 100
              ? "success"
              : totalProgress >= 75
              ? "warning"
              : "primary"
          }
        />

        {/* Clinical Hours */}
        <StatCard
          title="Clinical Hours"
          value={stats.clinicalHours}
          target={requiredClinicalHours}
          progress={clinicalProgress}
          color={
            clinicalProgress >= 100
              ? "success"
              : clinicalProgress >= 75
              ? "warning"
              : "primary"
          }
        />

        {/* Interactive Hours */}
        <StatCard
          title="Interactive Hours"
          value={stats.interactiveHours}
          target={requiredInteractiveHours}
          progress={interactiveProgress}
          color={
            interactiveProgress >= 100
              ? "success"
              : interactiveProgress >= 75
              ? "warning"
              : "primary"
          }
        />

        {/* Therapeutic Hours (only for therapeutically endorsed) */}
        {isTherapeuticallyEndorsed && (
          <StatCard
            title="Therapeutic Hours"
            value={stats.therapeuticHours}
            target={requiredTherapeuticHours}
            progress={therapeuticProgress}
            color={
              therapeuticProgress >= 100
                ? "success"
                : therapeuticProgress >= 75
                ? "warning"
                : "secondary"
            }
          />
        )}

        {/* Interactive Therapeutic Hours (only for therapeutically endorsed) */}
        {isTherapeuticallyEndorsed && (
          <StatCard
            title="Interactive Therapeutic"
            value={stats.interactiveTherapeuticHours}
            target={requiredInteractiveTherapeuticHours}
            progress={interactiveTherapeuticProgress}
            color={
              interactiveTherapeuticProgress >= 100
                ? "success"
                : interactiveTherapeuticProgress >= 75
                ? "warning"
                : "secondary"
            }
          />
        )}

        {/* Non-Clinical Hours (showing usage vs max allowed) */}
        <StatCard
          title="Non-Clinical Hours"
          value={stats.nonClinicalHours}
          target={maxNonClinicalHours}
          progress={nonClinicalUsage}
          color={
            nonClinicalUsage > 100
              ? "error"
              : nonClinicalUsage >= 80
              ? "warning"
              : "success"
          }
        />
      </Box>

      {/* Requirements Info */}
      <Card
        sx={{
          mt: 2,
          backgroundColor: "info.light",
          color: "info.contrastText",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            📋 CPD Requirements
          </Typography>

          {isTherapeuticallyEndorsed ? (
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>Therapeutically Endorsed Requirements:</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ mb: 1, pl: 2 }}>
                <li>Total Hours: 30</li>
                <li>Clinical Hours: minimum 25</li>
                <li>Interactive Hours: minimum 5</li>
                <li>
                  Therapeutic Hours: minimum 10 (counts towards clinical hours)
                </li>
                <li>
                  Interactive Therapeutic Hours: minimum 2 (out of 10
                  therapeutic hours)
                </li>
                <li>Non-Clinical Hours: maximum 5</li>
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>Not Therapeutically Endorsed Requirements:</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ mb: 1, pl: 2 }}>
                <li>Total Hours: 20</li>
                <li>Clinical Hours: minimum 15</li>
                <li>Interactive Hours: minimum 5</li>
                <li>Non-Clinical Hours: maximum 5</li>
              </Typography>
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{ opacity: 0.8, display: "block", mt: 1 }}
          >
            Note: Only published activities count toward CPD requirements. Draft
            activities are excluded from calculations.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
