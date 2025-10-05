import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material";
import { ExpandMore, ExpandLess, Lightbulb } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import ActivityCategories from "@/components/categories/activity-categories";

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
        sx={{ p: 2, backgroundColor: "info.light", color: "info.contrastText" }}
      >
        <Button
          onClick={() => setShowInspiration(!showInspiration)}
          startIcon={<Lightbulb />}
          endIcon={showInspiration ? <ExpandLess /> : <ExpandMore />}
          sx={{ mb: showInspiration ? 2 : 0, color: "info.contrastText" }}
        >
          Need inspiration?
        </Button>

        <Collapse in={showInspiration}>
          <Typography variant="subtitle2" gutterBottom>
            {getSelectedCategories().length > 0
              ? `Ideas for ${getSelectedCategories().join(", ")} goals:`
              : "Goal ideas across all categories:"}
          </Typography>

          <List dense>
            {getFilteredInspiration()
              .slice(0, 8)
              .map((idea, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={idea}
                    primaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
          </List>
        </Collapse>
      </Paper>
    </Box>
  );
}
