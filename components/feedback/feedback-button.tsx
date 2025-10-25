"use client";

import React, { useState } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Feedback as FeedbackIcon } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { submitFeedback } from "@/app/feedback/actions";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [isPositive, setIsPositive] = useState<string>("true");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("page", pathname);
      formData.append("isPositive", isPositive);
      formData.append("details", details);

      await submitFeedback(formData);

      setOpen(false);
      setDetails("");
      setIsPositive("true");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDetails("");
    setIsPositive("true");
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="feedback"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <FeedbackIcon />
      </Fab>

      {/* Feedback Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            We Appreciate Your Feedback! 💭
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Help us improve your experience. Your feedback is valuable to us.
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Page: {pathname}
              </Typography>
            </Box>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">How was your experience?</FormLabel>
              <RadioGroup
                value={isPositive}
                onChange={(e) => setIsPositive(e.target.value)}
                row
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="👍 Positive"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="👎 Negative"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tell us more about your experience"
              placeholder="What went well? What could be improved? Any suggestions?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              variant="outlined"
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !details.trim()}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Thank you for your feedback! We truly appreciate it. 🙏
        </Alert>
      </Snackbar>
    </>
  );
}
