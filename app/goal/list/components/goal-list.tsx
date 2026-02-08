"use client";

import { useState, useCallback } from "react";
import {
  Typography,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Warning,
  Info,
} from "@mui/icons-material";
import { getGoalsServerAction, deleteGoalServerAction } from "../../actions";
import AddGoalSteppedDialog from "../../../../components/goal/add-goal-stepped-dialog";
import Link from "next/link";
import { GoalWithTags } from "@/lib/db/schema";

interface GoalListPageProps {
  initialGoals?: GoalWithTags[];
}

export default function GoalListPage({ initialGoals = [] }: GoalListPageProps) {
  const [goals, setGoals] = useState<GoalWithTags[]>(initialGoals);
  const [error, setError] = useState<string>("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);

  // Handle successful form submission
  const handleDialogSuccess = useCallback(async () => {
    setOpenAddDialog(false);
    // Reload goals
    try {
      const result = await getGoalsServerAction();
      if (result.success && result.goals) {
        setGoals(result.goals);
      }
    } catch {
      setError("Failed to reload goals");
    }
  }, []);

  const handleAddGoal = () => {
    setOpenAddDialog(true);
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoalServerAction(goalId);
        const result = await getGoalsServerAction();
        if (result.success && result.goals) {
          setGoals(result.goals);
        }
      } catch {
        setError("Failed to delete goal");
      }
    }
  };

  const getCategoryChips = (goal: GoalWithTags) => {
    const categories = [];
    if (goal.clinical) categories.push("Clinical");
    if (goal.nonClinical) categories.push("Non-Clinical");
    if (goal.interactive) categories.push("Interactive");
    if (goal.therapeutic) categories.push("Therapeutic");
    return categories;
  };

  const getComplianceStatus = () => {
    const totalGoals = goals.length;
    const clinicalGoals = goals.filter((g) => g.clinical).length;

    return {
      hasGoals: totalGoals > 0,
      hasClinicalGoal: clinicalGoals > 0,
      totalGoals,
      clinicalGoals,
    };
  };

  const compliance = getComplianceStatus();

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #0d3b66, #124a78)",
          color: "white",
          p: 4,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Learning Goals
          </Typography>
          <Typography variant="body1" color="white">
            Set and track your CPD learning objectives for your registration
            cycle
          </Typography>
        </Box>

        <Button
          onClick={handleAddGoal}
          variant="outlined"
          color="inherit"
          startIcon={<Add />}
          sx={{ minWidth: 150 }}
        >
          Add Goal
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Guidance Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Goal Setting Guidance</Typography>
            <IconButton onClick={() => setShowGuidance(!showGuidance)}>
              {showGuidance ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={showGuidance}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Learning goals help structure your CPD activities and ensure you
                meet requirements. Set specific, measurable objectives for each
                registration year.
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Category Guidelines:
              </Typography>
              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Clinical:</strong> Direct patient care, diagnosis,
                  treatment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Non-Clinical:</strong> Practice management, business
                  skills, research
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Interactive:</strong> Peer learning, discussions,
                  case studies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Therapeutic:</strong> Prescribing, therapeutics
                  knowledge
                </Typography>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Example Goals:
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  • &ldquo;Improve myopia management techniques through latest
                  research&rdquo;
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • &ldquo;Enhance practice efficiency with new technology
                  implementation&rdquo;
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • &ldquo;Develop expertise in pediatric optometry&rdquo;
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: 1,
          borderColor:
            compliance.hasGoals && compliance.hasClinicalGoal
              ? "success.main"
              : "warning.main",
          backgroundColor:
            compliance.hasGoals && compliance.hasClinicalGoal
              ? "success.50"
              : "warning.50",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {compliance.hasGoals && compliance.hasClinicalGoal ? (
            <CheckCircle sx={{ color: "success.main", mr: 1 }} />
          ) : (
            <Warning sx={{ color: "warning.main", mr: 1 }} />
          )}
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            Compliance Status
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          Goals: {compliance.totalGoals} total, {compliance.clinicalGoals}{" "}
          clinical
        </Typography>

        {!compliance.hasGoals && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You need at least one learning goal for your registration cycle.
          </Alert>
        )}

        {compliance.hasGoals && !compliance.hasClinicalGoal && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You need at least one clinical learning goal.
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Info sx={{ color: "info.main", mr: 1, fontSize: "small" }} />
          <Typography variant="caption" color="text.secondary">
            Goals are retained for 5 years after your registration period ends
          </Typography>
        </Box>
      </Paper>

      {/* Goals List */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Your Learning Goals ({goals.length})
        </Typography>
      </Box>

      {goals.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No learning goals set yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by setting your first learning goal for this registration
              cycle
            </Typography>
            <Button
              onClick={handleAddGoal}
              variant="contained"
              startIcon={<Add />}
            >
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {goals.map((goal) => (
            <Card key={goal.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {goal.title}
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      {getCategoryChips(goal).map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          color={
                            category === "Clinical" ? "primary" : "default"
                          }
                        />
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Year: {goal.year}
                      </Typography>
                      {goal.targetHours && (
                        <Typography variant="body2" color="text.secondary">
                          Target: {goal.targetHours} hours
                        </Typography>
                      )}
                    </Box>

                    {goal.goalsToTags && goal.goalsToTags.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {goal.goalsToTags.map((goalsToTag, index) => (
                          <Chip
                            key={index}
                            label={goalsToTag.tag.tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      component={Link}
                      href={`/goal/${goal.id}/edit`}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteGoal(goal.id)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add Goal Stepped Dialog */}
      <AddGoalSteppedDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
}
