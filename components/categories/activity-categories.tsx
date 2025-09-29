"use client";

import {
  Divider,
  Box,
  Checkbox,
  Typography,
  FormControl,
  Alert,
} from "@mui/material";
import {
  MedicalInformation,
  MedicationLiquid,
  PeopleAltOutlined,
  WorkOffOutlined,
} from "@mui/icons-material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Dispatch, SetStateAction, useState } from "react";
import { useProfile } from "@/lib/context/profile-context";

interface Props {
  categories: {
    clinical?: boolean;
    nonClinical?: boolean;
    interactive?: boolean;
    therapeutic?: boolean;
  };
  setCategories: Dispatch<
    SetStateAction<{
      clinical: boolean;
      nonClinical: boolean;
      interactive: boolean;
      therapeutic: boolean;
    }>
  >;
  hours?: string | number; // pass in hours for this activity
  type?: "goal" | "activity";
  numberOfColumns?: 1 | 2;
  disableTitles?: boolean;
}

function ActivityCategories(props: Props) {
  const {
    categories,
    setCategories,
    hours = 1,
    type = "activity",
    numberOfColumns = 1,
    disableTitles = false,
  } = props; // default 1h per activity
  const { isTherapeuticallyEndorsed } = useProfile();

  const [warning, setWarning] = useState<string | null>(null);

  const ActivityCategory = ({
    icon,
    label,
    heading,
    state,
    name,
  }: {
    icon: React.ReactElement;
    label: string;
    heading: string;
    state?: boolean;
    name: "clinical" | "nonClinical" | "interactive" | "therapeutic";
  }) => {
    const handleClick = () => {
      // Unendorsed optometrists → ❌ No Therapeutic possible.
      if (!isTherapeuticallyEndorsed && name === "therapeutic") {
        setWarning(
          `Therapeutic ${
            type === "activity" ? "activities" : "goals"
          } are not allowed for unendorsed optometrists.`
        );
        return;
      }
      // Rule: Clinical and Non-Clinical are mutually exclusive
      if (name === "clinical" && categories.nonClinical) {
        setWarning(
          `${
            type === "activity" ? "Activities" : "Goals"
          } cannot be both Clinical and Non-Clinical.`
        );
        return;
      }
      if (name === "nonClinical" && categories.clinical) {
        setWarning(
          `${
            type === "activity" ? "Activities" : "Goals"
          } cannot be both Non-Clinical and Clinical.`
        );
        return;
      }

      // Rule: Therapeutic must be Clinical
      if (
        (name === "therapeutic" && !categories.clinical) ||
        (categories.therapeutic && categories.clinical && name === "clinical")
      ) {
        setWarning(
          `Therapeutic ${
            type === "activity" ? "activities" : "goals"
          } must also be Clinical.`
        );
        return;
      }

      // Clear warning and toggle state
      setWarning(null);
      setCategories((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    };

    return (
      <Box
        sx={{
          transition: "all 0.3s",
          cursor: "pointer",
          width: numberOfColumns === 2 ? "48%" : "100%",
          borderRadius: 1,
          border: 1,
          borderColor: state ? "primary.main" : "grey.300",
          outline: state ? "2px solid" : "none",
          outlineColor: "primary.main",
          outlineOffset: 2,
          p: 2,
          display: "flex",
          alignItems: "center",
          backgroundColor: state ? "#dbe9fe" : "background.paper",
        }}
        onClick={handleClick}
        role="button"
      >
        {icon}
        <Box sx={{ flexGrow: 1, px: 2 }}>
          <Typography variant="h6" color="text.secondary">
            {heading}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Checkbox name={name} checked={!!categories[name]} readOnly />
      </Box>
    );
  };

  // --- Hours Summary Logic ---
  const totalHours = hours; // each activity = hours
  const clinicalHours = categories.clinical ? hours : 0;
  const nonClinicalHours = categories.nonClinical ? hours : 0;
  const interactiveHours = categories.interactive ? hours : 0;
  const therapeuticHours = categories.therapeutic ? hours : 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
      {!disableTitles && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <DescriptionOutlinedIcon sx={{ color: "primary.main" }} />{" "}
            Categories
          </Box>
          <Divider />
          <Typography variant="h5" color="text.secondary">
            CPD Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select the categories that best describe this {type}.{" "}
            {type === "activity" && "Each activity will receive full hours."}
          </Typography>
        </>
      )}

      {/* Warning Message */}
      {warning && <Alert severity="warning">{warning}</Alert>}

      {/* Activity Types */}
      <FormControl
        component="fieldset"
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, flexDirection: "row" }}
      >
        <ActivityCategory
          state={categories.clinical}
          heading="Clinical"
          label="Clinical activities related to patient care, diagnosis, and treatment."
          name="clinical"
          icon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#dbe9fe",
                borderRadius: 100,
                p: 1.5,
                color: "primary.main",
              }}
            >
              <MedicalInformation />
            </Box>
          }
        />
        <ActivityCategory
          state={categories.interactive}
          heading="Interactive"
          label="Interactive activities such as workshops, webinars, or group discussions."
          name="interactive"
          icon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f3e8ff",
                borderRadius: 100,
                p: 1.5,
                color: "#8730d1",
              }}
            >
              <PeopleAltOutlined />
            </Box>
          }
        />
        <ActivityCategory
          state={categories.therapeutic}
          heading="Therapeutic"
          name="therapeutic"
          label="Therapeutic activities related to patient care, such as counseling or therapy."
          icon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: isTherapeuticallyEndorsed
                  ? "#dcfce5"
                  : "#f0f0f0",
                borderRadius: 100,
                p: 1.5,
                color: "#4da16d",
              }}
            >
              <MedicationLiquid />
            </Box>
          }
        />
        <ActivityCategory
          state={categories.nonClinical}
          heading="Non-Clinical"
          name="nonClinical"
          label="Non-clinical activities such as administration, management, or research."
          icon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fef3c6",
                borderRadius: 100,
                p: 1.5,
                color: "#c5773a",
              }}
            >
              <WorkOffOutlined />
            </Box>
          }
        />
      </FormControl>

      {/* Summary Box */}
      {type === "activity" && <Divider />}
      {type === "activity" && (
        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            border: "1px solid",
            borderColor: "grey.300",
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6" color="text.primary">
            Summary
          </Typography>
          <Typography variant="body2">Total Hours: {totalHours}</Typography>
          <Typography variant="body2">
            Clinical Hours: {clinicalHours}
          </Typography>
          <Typography variant="body2">
            Non-Clinical Hours: {nonClinicalHours}
          </Typography>
          <Typography variant="body2">
            Interactive Hours: {interactiveHours}
          </Typography>
          {isTherapeuticallyEndorsed && (
            <Typography variant="body2">
              Therapeutic Hours: {therapeuticHours}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default ActivityCategories;
