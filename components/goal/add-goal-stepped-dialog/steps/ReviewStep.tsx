import {
  Box,
  Typography,
  TextField,
  Paper,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Edit,
  Category,
  Schedule,
  Description,
} from "@mui/icons-material";
import { GoalFormData } from "@/app/goal/types/goal";

interface ReviewStepProps {
  formData: GoalFormData;
  updateFormData: (updates: Partial<GoalFormData>) => void;
  categories: {
    clinical: boolean;
    nonClinical: boolean;
    interactive: boolean;
    therapeutic: boolean;
  };
  createState: {
    isPending: boolean;
    success: boolean;
    message: string;
    error: string;
  };
}

export default function ReviewStep({
  formData,
  updateFormData,
  categories,
  createState,
}: ReviewStepProps) {
  const isYearValid =
    formData.year.length === 4 && !isNaN(Number(formData.year));
  const currentYear = new Date().getFullYear();

  const getCategoryDisplayNames = () => {
    return (
      Object.entries(categories)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => {
          switch (key) {
            case "clinical":
              return "Clinical";
            case "nonClinical":
              return "Non-Clinical";
            case "interactive":
              return "Interactive";
            case "therapeutic":
              return "Therapeutic";
            default:
              return key;
          }
        })
    );
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        Review & Finalize Your Goal
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your learning goal details below and set your target hours and
        registration year.
      </Typography>

      {/* Goal Summary Card */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "background.default" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CheckCircle sx={{ color: "success.main", mr: 1 }} />
          <Typography variant="h6">Goal Summary</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Edit sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="subtitle2">Goal Title:</Typography>
          </Box>
          <Typography variant="body1" sx={{ pl: 3, fontStyle: "italic" }}>
            &ldquo;{formData.title}&rdquo;
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Category sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="subtitle2">Categories:</Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pl: 3 }}>
            {getCategoryDisplayNames().map((category) => (
              <Chip
                key={category}
                label={category}
                color="primary"
                size="small"
              />
            ))}
          </Box>
        </Box>

        {formData.tags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Generated Tags:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pl: 3 }}>
                {formData.tags.slice(0, 10).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Paper>

      {/* Generated Description */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Description sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6">Generated Description</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* Description editable text box */}
          <TextField
            fullWidth
            multiline
            rows={7}
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Add a description..."
          />
        </Box>
      </Paper>

      {/* Target Hours & Year */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Schedule sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6">Target & Timeline</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="Registration Year"
            value={formData.year}
            onChange={(e) => updateFormData({ year: e.target.value })}
            required
            error={!isYearValid}
            helperText={
              !isYearValid
                ? "Year must be 4 digits"
                : `Current year: ${currentYear}`
            }
            inputProps={{ maxLength: 4 }}
            sx={{ flex: 1 }}
          />

          <TextField
            label="Target Hours (Optional)"
            type="number"
            required
            value={formData.targetHours}
            onChange={(e) => updateFormData({ targetHours: e.target.value })}
            placeholder="e.g., 20"
            helperText="How many CPD hours do you plan to allocate?"
            inputProps={{ min: 0, step: 0.5 }}
            sx={{ flex: 1 }}
          />
        </Box>
      </Paper>

      {/* Validation Messages */}
      {!isYearValid && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please enter a valid 4-digit year to continue.
        </Alert>
      )}

      {isYearValid &&
        Object.values(categories).some((isSelected) => isSelected) &&
        formData.title.trim().length >= 3 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Great! Your goal is ready to be created. Click &ldquo;Create
              Goal&rdquo; to save it.
            </Typography>
          </Alert>
        )}

      {/* Submission Error */}
      {createState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createState.error}
        </Alert>
      )}
    </Box>
  );
}
