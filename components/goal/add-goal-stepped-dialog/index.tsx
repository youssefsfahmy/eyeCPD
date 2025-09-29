"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  LinearProgress,
  Alert,
} from "@mui/material";

import {
  CategoryStep,
  GoalTitleStep,
  LightPlanStep,
  ReviewStep,
} from "./steps";
import { Close } from "@mui/icons-material";
import { GoalFormData } from "@/app/goal/types/goal";

interface AddGoalSteppedDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const steps = ["Category", "Goal Title", "Light Plan", "Target Hours & Review"];

export default function AddGoalSteppedDialog({
  open,
  onClose,
  onSuccess,
}: AddGoalSteppedDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const selectedYear = new Date().getFullYear().toString();
  const [categories, setCategories] = useState<{
    clinical: boolean;
    nonClinical: boolean;
    interactive: boolean;
    therapeutic: boolean;
  }>({
    clinical: false,
    nonClinical: false,
    interactive: false,
    therapeutic: false,
  });

  const [formData, setFormData] = useState<GoalFormData>({
    year: selectedYear,
    title: "",
    tags: [],
    clinical: false,
    nonClinical: false,
    interactive: false,
    therapeutic: false,
    targetHours: "",
  });

  const [createState, setCreateState] = useState<{
    isPending: boolean;
    success: boolean;
    message: string;
    error: string;
  }>({
    isPending: false,
    success: false,
    message: "",
    error: "",
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setFormData({
        year: selectedYear,
        title: "",
        tags: [],
        clinical: false,
        nonClinical: false,
        interactive: false,
        therapeutic: false,
        targetHours: "",
      });
      setCreateState({
        isPending: false,
        success: false,
        message: "",
        error: "",
      });
    }
  }, [open, selectedYear]);

  // Handle form submission success
  useEffect(() => {
    if (createState.success) {
      onSuccess();
    }
  }, [createState.success, onSuccess]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    setActiveStep(0);
    onClose();
  };

  const updateFormData = (updates: Partial<GoalFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0: // Category
        return (
          categories.clinical ||
          categories.nonClinical ||
          categories.interactive ||
          categories.therapeutic
        );
      case 1: // Goal Title
        return formData.title.trim().length >= 3;
      case 2: // Light Plan (always valid)
        return true;
      case 3: // Review
        return formData.year.length === 4 && !isNaN(Number(formData.year));
      default:
        return false;
    }
  };

  const canProceed = isStepValid(activeStep);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreateState({ isPending: true, success: false, message: "", error: "" });

    try {
      const submitFormData = new FormData();
      submitFormData.append("year", formData.year);
      submitFormData.append("title", formData.title);
      submitFormData.append("tags", (formData.tags || []).join(", "));
      submitFormData.append("description", formData.description || "");
      submitFormData.append("clinical", categories.clinical.toString());
      submitFormData.append("nonClinical", categories.nonClinical.toString());
      submitFormData.append("interactive", categories.interactive.toString());
      submitFormData.append("therapeutic", categories.therapeutic.toString());
      submitFormData.append("targetHours", formData.targetHours);

      const response = await fetch("/api/goal", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create goal");
      }

      setCreateState({
        isPending: false,
        success: true,
        message: result.message || "Goal created successfully",
        error: "",
      });
    } catch (error) {
      setCreateState({
        isPending: false,
        success: false,
        message: "",
        error: error instanceof Error ? error.message : "Failed to create goal",
      });
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CategoryStep categories={categories} setCategories={setCategories} />
        );
      case 1:
        return (
          <GoalTitleStep
            formData={formData}
            updateFormData={updateFormData}
            categories={categories}
          />
        );
      case 2:
        return (
          <LightPlanStep
            formData={formData}
            updateFormData={updateFormData}
            categories={categories}
          />
        );
      case 3:
        return (
          <ReviewStep
            formData={formData}
            updateFormData={updateFormData}
            categories={categories}
            createState={createState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 3,
        }}
      >
        <LinearProgress
          variant="determinate"
          value={(activeStep / (steps.length - 1)) * 100}
          sx={{ height: 8, borderRadius: 3, width: "100%", mr: 3 }}
        />
        <Close
          onClick={handleClose}
          width={18}
          height={18}
          sx={{
            position: "absolute",
            right: 20,
            top: "50%",
            cursor: "pointer",
            transform: "translateY(-50%)",
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        {renderStepContent(activeStep)}
        {createState.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {createState.error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Box sx={{ flex: 1 }} />

        {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canProceed}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canProceed || createState.isPending}
          >
            {createState.isPending ? "Creating..." : "Create Goal"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
