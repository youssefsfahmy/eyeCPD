import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { JSX, useState } from "react";
import {
  AutoAwesome,
  Schedule,
  Assessment,
  TrendingUp,
} from "@mui/icons-material";
import { GoalFormData } from "@/app/goal/types/goal";

interface LightPlanStepProps {
  formData: GoalFormData;
  updateFormData: (updates: Partial<GoalFormData>) => void;
  categories: {
    clinical: boolean;
    nonClinical: boolean;
    interactive: boolean;
    therapeutic: boolean;
  };
}

const planningPrompts: {
  fieldKey: "keyActions" | "resources" | "timeline" | "successMeasure";
  icon: JSX.Element;
  title: string;
  placeholder: string;
  examples: string[];
}[] = [
  {
    fieldKey: "keyActions",
    icon: <AutoAwesome />,
    title: "Key Actions",
    placeholder: "What specific activities will you do?",
    examples: [
      "Complete online course",
      "Attend workshop",
      "Read 3 research papers",
    ],
  },
  {
    fieldKey: "resources",
    icon: <Assessment />,
    title: "Resources",
    placeholder: "What resources do you need?",
    examples: [
      "Professional journals",
      "Online platform access",
      "Equipment for practice",
    ],
  },
  {
    fieldKey: "timeline",
    icon: <Schedule />,
    title: "Timeline",
    placeholder: "When will you work on this?",
    examples: ["2 hours weekly", "Monthly workshops", "Complete by June"],
  },
  {
    fieldKey: "successMeasure",
    icon: <TrendingUp />,
    title: "Success Measure",
    placeholder: "How will you know you've succeeded?",
    examples: [
      "Implement 5 new techniques",
      "Pass certification exam",
      "Improve patient satisfaction",
    ],
  },
];

const categoryBasedSuggestions = {
  clinical: {
    keyActions: [
      "shadow expert clinician",
      "review case studies",
      "practice new techniques",
    ],
    resources: [
      "clinical guidelines",
      "peer-reviewed papers",
      "equipment training",
    ],
    timeline: [
      "weekly practice sessions",
      "monthly assessments",
      "quarterly reviews",
    ],
    successMeasure: [
      "patient outcomes",
      "technique proficiency",
      "diagnostic accuracy",
    ],
  },
  nonClinical: {
    keyAction: [
      "attend business workshop",
      "implement new system",
      "develop processes",
    ],
    resources: [
      "management courses",
      "software training",
      "consultant guidance",
    ],
    timeline: ["monthly training", "quarterly implementation", "annual review"],
    successMeasure: [
      "efficiency metrics",
      "cost savings",
      "staff satisfaction",
    ],
  },
  interactive: {
    keyAction: [
      "join discussion groups",
      "participate in case reviews",
      "mentor colleagues",
    ],
    resources: ["professional networks", "online forums", "conference access"],
    timeline: ["weekly discussions", "monthly meetings", "ongoing mentoring"],
    successMeasure: [
      "peer feedback",
      "knowledge sharing",
      "collaboration quality",
    ],
  },
  therapeutic: {
    keyAction: [
      "study treatment protocols",
      "review medication updates",
      "practice prescribing",
    ],
    resources: [
      "pharmaceutical guidelines",
      "therapy manuals",
      "expert consultations",
    ],
    timeline: ["monthly updates", "quarterly reviews", "continuous monitoring"],
    successMeasure: [
      "treatment success",
      "patient compliance",
      "adverse event reduction",
    ],
  },
};

export default function LightPlanStep({
  updateFormData,
  categories,
}: LightPlanStepProps) {
  const [planningResponses, setPlanningResponses] = useState({
    keyActions: "",
    resources: "",
    timeline: "",
    successMeasure: "",
  });

  const getSuggestionsForCategory = (
    promptType: keyof typeof planningResponses
  ) => {
    if (Object.values(categories).every((isSelected) => !isSelected)) return []; // No categories selected

    const suggestions: string[] = [];
    Object.entries(categories).forEach(([category, isSelected]) => {
      if (isSelected) {
        const categoryKey = category as keyof typeof categoryBasedSuggestions;
        const categoryData = categoryBasedSuggestions[categoryKey];
        if (
          categoryData &&
          categoryData[promptType as keyof typeof categoryData]
        ) {
          suggestions.push(
            ...categoryData[promptType as keyof typeof categoryData]
          );
        }
      }
    });

    return [...new Set(suggestions)]; // Remove duplicates
  };

  const createDescriptionFromPlanning = () => {
    console.log(planningResponses);
    const parts = [];

    if (planningResponses.keyActions.trim()) {
      parts.push(`Key Actions: ${planningResponses.keyActions.trim()}`);
    }

    if (planningResponses.resources.trim()) {
      parts.push(`Resources: ${planningResponses.resources.trim()}`);
    }

    if (planningResponses.timeline.trim()) {
      parts.push(`Timeline: ${planningResponses.timeline.trim()}`);
    }

    if (planningResponses.successMeasure.trim()) {
      parts.push(`Success Measure: ${planningResponses.successMeasure.trim()}`);
    }

    return parts.join("\n");
  };

  // Update description when planning responses change
  const handleResponseChange = (field: string, value: string) => {
    const newResponses = { ...planningResponses, [field]: value };
    setPlanningResponses(newResponses);

    // Create description from all responses
    const description = createDescriptionFromPlanning();
    updateFormData({ description });
  };

  const addSuggestionToResponse = (field: string, suggestion: string) => {
    const currentValue =
      planningResponses[field as keyof typeof planningResponses];
    const newValue = currentValue
      ? `${currentValue}, ${suggestion}`
      : suggestion;
    handleResponseChange(field, newValue);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Let&apos;s create a light plan
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        These prompts are optional but will help clarify a description for your
        goal and may enhance your title with more specific, outcome-oriented
        language.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {planningPrompts.map((prompt, index) => {
          const suggestions = getSuggestionsForCategory(prompt.fieldKey);

          return (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {prompt.icon}
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    {prompt.title}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder={prompt.placeholder}
                  value={planningResponses[prompt.fieldKey]}
                  onChange={(e) =>
                    handleResponseChange(prompt.fieldKey, e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                {suggestions.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      gutterBottom
                    >
                      Suggestions for your categories:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      {suggestions.slice(0, 4).map((suggestion, idx) => (
                        <Chip
                          key={idx}
                          label={suggestion}
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            addSuggestionToResponse(prompt.fieldKey, suggestion)
                          }
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.contrastText",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Examples: {prompt.examples.join(" • ")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
