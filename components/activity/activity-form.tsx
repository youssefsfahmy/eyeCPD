"use client";

import {
  TextField,
  Divider,
  Button,
  Box,
  Alert,
  Typography,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Save,
  Cancel,
  Add,
  TipsAndUpdatesOutlined,
  LightbulbCircleOutlined,
  UploadFileOutlined,
  DeleteOutlined,
  AttachFileOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActivityRecord } from "@/lib/db/schema";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ActivityCategories from "./activity-categories";
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

  const [isDraft, setIsDraft] = useState(activity?.isDraft ?? true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError("");

    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setFileError(
          "Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed."
        );
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size must be less than 10MB.");
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError("");
  };

  // Custom form submission handler for the new API route
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setUploadProgress("Processing...");
    setFormError("");
    setFormSuccess(false);

    const formData = new FormData(event.currentTarget);

    // Add the selected file to form data if one exists
    if (selectedFile) {
      formData.set("evidenceFile", selectedFile);
    }

    try {
      const endpoint = isEditing
        ? `/api/activity/${activity.id}/update`
        : "/api/activity/create";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormSuccess(true);
        setSelectedFile(null);
        setFileError("");

        if (onSuccess) {
          onSuccess();
        } else if (isEditing) {
          router.push(`/activity/${activity.id}`);
          router.refresh(); // Use the refresh method separately
        } else {
          router.push("/activity/list");
        }
      } else {
        setFormError(result.error || "Failed to save activity");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/activity/list");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Hidden field for edit mode */}
      {isEditing && <input type="hidden" name="id" value={activity.id} />}

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {`Activity ${isEditing ? "updated" : "created"} successfully`}
        </Alert>
      )}

      {/* Upload progress indicator */}
      {isUploading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {uploadProgress}
        </Alert>
      )}

      {fileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fileError}
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
            name="activityProvider"
            variant="outlined"
            sx={{ flex: 2, minWidth: 300 }}
            defaultValue={activity?.activityProvider || ""}
            helperText="e.g., CPD Academy, Optometry Australia"
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
          {/* Topics/Tags */}
          <TextField
            id="tags"
            label="Topics/Tags"
            name="tags"
            variant="outlined"
            multiline
            rows={2}
            defaultValue={activity?.tags?.join(", ") || ""}
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

          {/* File Upload Area */}
          <Box>
            <input
              type="file"
              id="evidenceFile"
              name="evidenceFile"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {!selectedFile && !activity?.evidenceFileUrl ? (
              <Box
                sx={{
                  p: 3,
                  border: 2,
                  borderColor: "grey.300",
                  borderStyle: "dashed",
                  borderRadius: 2,
                  textAlign: "center",
                  backgroundColor: "grey.50",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                  },
                }}
                onClick={() => document.getElementById("evidenceFile")?.click()}
              >
                <UploadFileOutlined
                  sx={{ fontSize: 48, mb: 1, color: "grey.600" }}
                />
                <Typography variant="body1" gutterBottom>
                  Upload Evidence File
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to browse or drag and drop
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                </Typography>
              </Box>
            ) : (
              <Card sx={{ p: 2, backgroundColor: "success.light" }}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AttachFileOutlined sx={{ color: "success.dark" }} />
                    <Box sx={{ flex: 1 }}>
                      {selectedFile ? (
                        <>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedFile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" fontWeight="medium">
                            Current evidence file
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Previously uploaded
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {activity?.evidenceFileUrl && (
                        <Button
                          size="small"
                          variant="outlined"
                          href={activity.evidenceFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          document.getElementById("evidenceFile")?.click()
                        }
                      >
                        {selectedFile ? "Change" : "Replace"}
                      </Button>
                      {selectedFile && (
                        <IconButton
                          size="small"
                          onClick={removeFile}
                          color="error"
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {fileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fileError}
              </Alert>
            )}
          </Box>
        </Box>

        <ActivityCategories
          categories={categories}
          setCategories={setCategories}
          hours={activity?.hours || 0}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={!isDraft}
              onChange={(e) => setIsDraft(!e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {isDraft ? "Save as Draft" : "Publish Activity"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isDraft
                  ? "Save your progress without making it visible in reports"
                  : "Make this activity count towards your CPD requirements"}
              </Typography>
            </Box>
          }
        />

        <input type="hidden" name="isDraft" value={isDraft.toString()} />

        <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isUploading}
            startIcon={isEditing ? <Save /> : <Add />}
          >
            {isUploading
              ? uploadProgress || "Processing..."
              : isEditing
              ? "Save Changes"
              : isDraft
              ? "Save Draft"
              : "Create Activity"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isUploading}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
}
