"use client";

import { Divider, Box, Checkbox, Typography, FormControl } from "@mui/material";
import {
  MedicalInformation,
  MedicationLiquid,
  PeopleAltOutlined,
  WorkOffOutlined,
} from "@mui/icons-material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Dispatch, SetStateAction } from "react";

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
}

function ActivityCategories(props: Props) {
  const { categories, setCategories } = props;

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
  }) => (
    <Box
      sx={{
        transition: "all 0.3s",
        cursor: "pointer",
        width: "100%",
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
      onClick={() => {
        setCategories((prev) => ({
          ...prev,
          [name]: !prev[name],
        }));
      }}
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
      <Checkbox
        name={name}
        defaultChecked={state || false}
        checked={categories[name]}
      />
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontWeight: "bold",
        }}
      >
        <DescriptionOutlinedIcon sx={{ color: "primary.main" }} /> Categories
      </Box>
      <Divider />
      <Typography variant="h5" color="text.secondary">
        CPD Categories
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Select the categories that best describe this activity. Each activity
        will recieve full hours.
      </Typography>
      {/* Activity Types */}
      <FormControl component="fieldset" sx={{ display: "flex", gap: 2 }}>
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
          state={categories?.interactive}
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
        />{" "}
        <ActivityCategory
          state={categories?.therapeutic}
          heading="Therapeutic"
          name="therapeutic"
          label="Therapeutic activities related to patient care, such as counseling or therapy."
          icon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#dcfce5",
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
          state={categories?.nonClinical}
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
    </Box>
  );
}

export default ActivityCategories;
