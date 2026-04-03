import { Box, Typography, Paper, Collapse, Button } from "@mui/material";
import { ExpandMore, ExpandLess, Lightbulb } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import ActivityCategories from "@/components/categories/activity-categories";
import InspirationCarousel from "./InspirationCarousel";

interface CategoryStepProps {
  categories: {
    clinical: boolean;
    nonClinical: boolean;
    interactive: boolean;
    therapeutic: boolean;
  };
  setCategories: Dispatch<
    SetStateAction<{
      clinical: boolean;
      nonClinical: boolean;
      interactive: boolean;
      therapeutic: boolean;
    }>
  >;
}

const categoryInspiration = {
  clinical: [
    "Improve myopia management techniques",
    "Enhance contact lens fitting skills",
    "Develop expertise in pediatric optometry",
    "Master advanced OCT interpretation",
    "Update knowledge on retinal diseases",
  ],
  nonClinical: [
    "Implement new practice management software",
    "Develop leadership and team management skills",
    "Learn business development strategies",
    "Improve patient communication techniques",
    "Enhance digital marketing knowledge",
  ],
  interactive: [
    "Participate in peer review sessions",
    "Join professional discussion groups",
    "Attend collaborative case studies",
    "Engage in mentoring relationships",
    "Lead team learning sessions",
  ],
  therapeutic: [
    "Update dry eye treatment protocols",
    "Learn latest glaucoma therapies",
    "Master new pharmaceutical options",
    "Enhance prescribing confidence",
    "Stay current with treatment guidelines",
  ],
};

export default function CategoryStep({
  categories,
  setCategories,
}: CategoryStepProps) {
  const [showInspiration, setShowInspiration] = useState(false);

  const getSelectedCategories = () => {
    const selected = [];
    if (categories.clinical) selected.push("clinical");
    if (categories.nonClinical) selected.push("nonClinical");
    if (categories.interactive) selected.push("interactive");
    if (categories.therapeutic) selected.push("therapeutic");
    return selected;
  };

  const getFilteredInspiration = () => {
    if (
      !categories.clinical &&
      !categories.nonClinical &&
      !categories.interactive &&
      !categories.therapeutic
    ) {
      return Object.values(categoryInspiration).flat();
    }

    const selectedCategories = getSelectedCategories();
    return selectedCategories.reduce((acc: string[], category) => {
      const categoryKey = category as keyof typeof categoryInspiration;
      return [...acc, ...categoryInspiration[categoryKey]];
    }, []);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        What categories does your goal fall under?
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select all that apply.
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <ActivityCategories
          categories={categories}
          setCategories={setCategories}
          type="goal"
          numberOfColumns={2}
          disableTitles={true}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          backgroundColor: "info.main",
          borderRadius: 2,
        }}
      >
        <Button
          onClick={() => setShowInspiration(!showInspiration)}
          startIcon={<Lightbulb />}
          endIcon={showInspiration ? <ExpandLess /> : <ExpandMore />}
          sx={{
            mb: showInspiration ? 1.5 : 0,
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
            px: 0,
            "&:hover": { backgroundColor: "transparent", opacity: 0.85 },
          }}
        >
          Need inspiration?
        </Button>

        <Collapse in={showInspiration}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.75)",
                display: "block",
                mb: 1,
                width: "30%",
              }}
            >
              {getSelectedCategories().length > 0
                ? `Ideas for ${getSelectedCategories().join(", ")} goals:`
                : "Goal ideas across all categories:"}
            </Typography>
            <InspirationCarousel ideas={getFilteredInspiration()} />
          </div>
        </Collapse>
      </Paper>
    </Box>
  );
}
