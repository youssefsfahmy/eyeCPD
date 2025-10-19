import { GoalFormData } from "@/app/goal/types/goal";
import { Tag } from "@/lib/db/schema";
import { Box, Typography, TextField, Chip, Paper } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import TagComboBox from "../../../common/tag-combo-box";

interface GoalTitleStepProps {
  formData: GoalFormData;
  updateFormData: (updates: Partial<GoalFormData>) => void;
  categories: {
    clinical: boolean;
    nonClinical: boolean;
    interactive: boolean;
    therapeutic: boolean;
  };
  goalTags: Tag[];
  setGoalTags: (tags: Tag[]) => void;
}

const placeholderSuggestions = {
  clinical: [
    "Improve myopia management skills through latest research and training",
    "Enhance contact lens fitting expertise for complex cases",
    "Develop pediatric optometry examination techniques",
    "Master advanced OCT interpretation for early disease detection",
  ],
  nonClinical: [
    "Implement digital practice management system to improve efficiency",
    "Develop leadership skills through management training program",
    "Create patient education materials for better health outcomes",
    "Build referral network with local healthcare providers",
  ],
  interactive: [
    "Participate in monthly peer review sessions with colleagues",
    "Join professional discussion group for case study analysis",
    "Mentor new graduates entering the profession",
    "Lead team meetings on latest clinical protocols",
  ],
  therapeutic: [
    "Update dry eye treatment protocols with latest therapies",
    "Learn new glaucoma management approaches and medications",
    "Enhance prescribing confidence through therapeutic updates",
    "Master combination therapy approaches for complex conditions",
  ],
};

const quickChips = {
  clinical: [
    "patient care",
    "diagnosis",
    "treatment",
    "clinical skills",
    "examination",
  ],
  nonClinical: [
    "practice management",
    "business skills",
    "efficiency",
    "technology",
    "leadership",
  ],
  interactive: [
    "peer learning",
    "collaboration",
    "mentoring",
    "team work",
    "discussion",
  ],
  therapeutic: [
    "prescribing",
    "medications",
    "treatment protocols",
    "therapeutics",
    "therapy",
  ],
};

export default function GoalTitleStep({
  formData,
  updateFormData,
  categories,
  goalTags,
  setGoalTags,
}: GoalTitleStepProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Get relevant placeholders based on selected categories
  const getRelevantPlaceholders = useCallback(() => {
    if (Object.values(categories).every((isSelected) => !isSelected)) {
      return Object.values(placeholderSuggestions).flat();
    }

    return Object.entries(categories).reduce(
      (acc: string[], [category, isSelected]) => {
        if (isSelected) {
          const categoryKey = category as keyof typeof placeholderSuggestions;
          return [...acc, ...placeholderSuggestions[categoryKey]];
        }
        return acc;
      },
      []
    );
  }, [categories]);

  // Get relevant quick chips based on selected categories
  const getRelevantChips = () => {
    if (Object.values(categories).every((isSelected) => !isSelected)) {
      return Object.values(quickChips).flat();
    }

    return Object.entries(categories).reduce(
      (acc: string[], [category, isSelected]) => {
        if (isSelected) {
          const categoryKey = category as keyof typeof quickChips;
          return [...acc, ...quickChips[categoryKey]];
        }
        return acc;
      },
      []
    );
  };

  // Rotate placeholder suggestions
  useEffect(() => {
    const placeholders = getRelevantPlaceholders();
    if (placeholders.length === 0) return;

    setCurrentPlaceholder(placeholders[placeholderIndex]);

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [categories, placeholderIndex, getRelevantPlaceholders]);

  const handleChipClick = (chipText: string) => {
    const currentTitle = formData.title;
    const newTitle = currentTitle ? `${currentTitle} ${chipText}` : chipText;
    updateFormData({ title: newTitle });
  };

  const handleTitleChange = (value: string) => {
    updateFormData({ title: value });
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        What&apos;s your learning goal?
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Write a clear, specific goal that describes what you want to achieve. Be
        as specific as possible about the outcome you&apos;re aiming for.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Goal Title"
        value={formData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder={currentPlaceholder}
        required
        helperText={
          'Min 3 characters. E.g. "Improve my contact lens fitting skills"'
        }
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 3 }}>
        <TagComboBox value={goalTags} handleChange={setGoalTags} />
      </Box>

      {Object.values(categories).some((isSelected) => isSelected) && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: "background.default" }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick phrases to help build your goal:
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 2 }}
          >
            Click to add to your goal title
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {getRelevantChips()
              .slice(0, 12)
              .map((chip, index) => (
                <Chip
                  key={index}
                  label={chip}
                  onClick={() => handleChipClick(chip)}
                  variant="outlined"
                  size="small"
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
        </Paper>
      )}
    </Box>
  );
}
