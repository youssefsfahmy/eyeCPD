"use client";

import {
  TextField,
  Divider,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
} from "@mui/material";
import {
  Save,
  Cancel,
  Add,
  MedicalInformation,
  MedicationLiquid,
  PeopleAltOutlined,
  WorkOffOutlined,
  TipsAndUpdatesOutlined,
  LightbulbCircleOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import { useActionState, useEffect, useState } from "react";
import { ActivityActionState } from "@/app/activity/types/activity";
import {
  createActivityServerAction,
  updateActivityServerAction,
} from "@/app/activity/actions";
import { useRouter } from "next/navigation";
import { ActivityRecord } from "@/lib/db/schema";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
interface ActivityFormProps {
  activity?: ActivityRecord;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ActivityForm({
  activity,
  onSuccess,
  onCancel,
}: ActivityFormProps) {
  const router = useRouter();
  const isEditing = !!activity;
  const [categories, setCategories] = useState({
    clinical: activity?.clinical || false,
    nonClinical: activity?.nonClinical || false,
    interactive: activity?.interactive || false,
    therapeutic: activity?.therapeutic || false,
  });

  const init: ActivityActionState = {
    isPending: false,
    success: false,
    message: "",
    error: "",
  };

  const [state, action, isPending] = useActionState(
    isEditing ? updateActivityServerAction : createActivityServerAction,
    init
  );

  useEffect(() => {
    if (state.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to activity list after successful creation/update
        setTimeout(() => {
          router.push("/activity/list");
        }, 1000);
      }
    }
  }, [state.success, onSuccess, router]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/activity/list");
    }
  };

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
        transition: "background-color 0.3s, border-color 0.3s, outline 0.3s",
        cursor: "pointer",
        width: "100%",
        borderRadius: 1,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: state ? "primary.main" : "grey.300",
        outline: state ? "2px solid primary.main" : "none",
        outlineOffset: state ? "2px" : "0",
        outlineStyle: "solid",
        outlineColor: "primary.main",
        outlineWidth: state ? 1 : 0,
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
        name="clinical"
        defaultChecked={state || false}
        checked={categories[name]}
      />
    </Box>
  );

  return (
    <form action={action}>
      {/* Hidden field for edit mode */}
      {isEditing && <input type="hidden" name="id" value={activity.id} />}

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}
      {state.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.message ||
            `Activity ${isEditing ? "updated" : "created"} successfully`}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            sm: "column",
            md: "row",
            lg: "row",
          },
          gap: 8,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <DescriptionOutlinedIcon sx={{ color: "primary.main" }} /> Activity
            Details
          </Box>
          <Divider sx={{ mt: -1 }} />
          {/* Activity Name and Date */}
          <TextField
            id="name"
            label="Activity Name"
            name="name"
            variant="outlined"
            sx={{ flex: 2, minWidth: 300 }}
            required
            defaultValue={activity?.name || ""}
            helperText="e.g., Clinical Workshop on Dry Eye Management"
          />
          <TextField
            id="provider"
            label="Activity Provider"
            name="provider"
            variant="outlined"
            sx={{ flex: 2, minWidth: 300 }}
            required
            defaultValue={activity?.name || ""}
            helperText="e.g., CPD Academy"
          />
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              id="date"
              label="Date"
              name="date"
              type="date"
              variant="outlined"
              sx={{ flex: 1 }}
              required
              defaultValue={activity?.date || ""}
            />
            <TextField
              id="hours"
              label="Hours"
              name="hours"
              type="number"
              variant="outlined"
              sx={{ flex: 1 }}
              inputProps={{
                min: 0.25,
                step: 0.25,
              }}
              required
              defaultValue={activity?.hours || ""}
              helperText="Enter hours in 0.25 increments"
            />
          </Box>

          {/* Activity Types */}
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Activity Types (select all that apply)
              </Typography>
            </FormLabel>
            <FormGroup>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="clinical"
                      defaultChecked={activity?.clinical || false}
                    />
                  }
                  label="Clinical"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="nonClinical"
                      defaultChecked={activity?.nonClinical || false}
                    />
                  }
                  label="Non-Clinical"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="interactive"
                      defaultChecked={activity?.interactive || false}
                    />
                  }
                  label="Interactive"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="therapeutic"
                      defaultChecked={activity?.therapeutic || false}
                    />
                  }
                  label="Therapeutic"
                />
              </Box>
            </FormGroup>
          </FormControl>
          {/* Description */}
          <TextField
            id="description"
            label="Description"
            name="description"
            variant="outlined"
            multiline
            rows={4}
            required
            defaultValue={activity?.description || ""}
            helperText="Provide a detailed description of the activity, including what was covered and key learning outcomes"
          />
          {/* Description */}
          <TextField
            id="topics"
            label="Topics/Tags"
            name="topics"
            variant="outlined"
            multiline
            rows={2}
            required
            defaultValue={""}
            helperText="Provide a comma-separated list of topics or tags related to this activity, e.g., 'Dry Eye, Patient Care, Clinical Skills'"
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <LightbulbCircleOutlined sx={{ color: "#8730d1" }} /> Activity
            Reflection
          </Box>
          <Divider sx={{ mt: -1 }} />
          {/* Reflection */}
          <TextField
            id="reflection"
            label="Reflection"
            name="reflection"
            variant="outlined"
            multiline
            rows={4}
            required
            defaultValue={activity?.reflection || ""}
            helperText="Reflect on how this activity will impact your practice and what you learned"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 2,
              border: 1,
              borderColor: "#f3e8ff",
              borderRadius: 1,
              color: "#8730d1",
              backgroundColor: "#f3e8ff80",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{
                color: "#8730d1",
              }}
            >
              <TipsAndUpdatesOutlined /> Reflection guidelines
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              ml={3}
              sx={{
                color: "#8730d1",
              }}
            >
              - Briefly summarize your key takeaways from this activity.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              ml={3}
              sx={{
                color: "#8730d1",
              }}
            >
              - Assess your progress against your learning goals.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              ml={3}
              sx={{
                color: "#8730d1",
              }}
            >
              - Describe how you will apply what you&apos;ve learned in your
              practice.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              ml={3}
              sx={{
                color: "#8730d1",
              }}
            >
              - Describe how this activity will improve your patient care or
              professional skills.
            </Typography>
          </Box>
          {/* Evidence File - TODO: Implement file upload */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
            }}
          >
            <UploadFileOutlined sx={{ color: "#4da16d" }} /> Evidence
          </Box>
          <Divider sx={{ mt: -1 }} />
          <Box
            sx={{
              p: 2,
              border: 1,
              borderColor: "grey.300",
              borderRadius: 1,
              backgroundColor: "grey.50",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              📎 Evidence File Upload (Coming Soon)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Upload certificates, screenshots, or other evidence to support
              this activity.
            </Typography>
            {activity?.evidenceFileUrl && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Current file:{" "}
                <a
                  href={activity.evidenceFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
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
            Select the categories that best describe this activity. Each
            activity will recieve full hours.
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
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isPending}
          startIcon={isEditing ? <Save /> : <Add />}
        >
          {isPending
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
            ? "Save Changes"
            : "Create Activity"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isPending}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
}
