import { FeedbackQueries } from "@/lib/db/queries/feedback";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Feedback as FeedbackIcon,
  Person,
  CalendarToday,
  Web,
} from "@mui/icons-material";

export async function listAllFeedback() {
  try {
    const feedbackList = await FeedbackQueries.getAllFeedback();
    return feedbackList;
  } catch (error) {
    console.error("Error listing all feedback:", error);
    throw new Error("Failed to list feedback");
  }
}

export default async function Page() {
  const feedbackList = await listAllFeedback();

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "80vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <FeedbackIcon sx={{ mr: 2, verticalAlign: "middle" }} />
          User Feedback
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage user feedback from across the platform
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="primary">
            {feedbackList.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Feedback
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="success.main">
            {feedbackList.filter((f) => f.isPositive).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Positive
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", flex: 1 }}>
          <Typography variant="h3" color="error.main">
            {feedbackList.filter((f) => !f.isPositive).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Negative
          </Typography>
        </Paper>
      </Stack>

      {/* Feedback List */}
      {feedbackList.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <FeedbackIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No feedback yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User feedback will appear here once submitted
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {feedbackList.map((feedbackItem) => (
            <Card key={feedbackItem.id} elevation={2}>
              <CardContent>
                {/* Header with sentiment and page */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={
                        feedbackItem.isPositive ? <ThumbUp /> : <ThumbDown />
                      }
                      label={feedbackItem.isPositive ? "Positive" : "Negative"}
                      color={feedbackItem.isPositive ? "success" : "error"}
                      variant="outlined"
                      size="medium"
                    />
                    <Chip
                      icon={<Web />}
                      label={feedbackItem.page}
                      variant="outlined"
                      size="medium"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarToday
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(feedbackItem.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>

                {/* User info */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <Person sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    Name: {feedbackItem.profile.firstName}{" "}
                    {feedbackItem.profile.lastName} (ID:{" "}
                    {feedbackItem.profile.id})
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Feedback content */}
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {feedbackItem.details}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
