import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Stack,
} from "@mui/material";
import {
  People,
  Feedback as FeedbackIcon,
  AdminPanelSettings,
  Business,
  Label,
} from "@mui/icons-material";
import Link from "next/link";

export default async function Page() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AdminPanelSettings sx={{ mr: 1, verticalAlign: "middle" }} />
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, providers, tags, and review feedback.
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Link href="/admin/users/list" style={{ textDecoration: "none" }}>
          <Card>
            <CardActionArea>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 3, p: 3 }}
              >
                <People sx={{ fontSize: 48, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6">User Management</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View all users, manage accounts, monitor subscription
                    status, and review user activities and learning plans.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

        <Link href="/admin/feedback" style={{ textDecoration: "none" }}>
          <Card>
            <CardActionArea>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 3, p: 3 }}
              >
                <FeedbackIcon sx={{ fontSize: 48, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6">User Feedback</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review and manage user feedback submitted from across the
                    platform.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

        <Link href="/admin/providers" style={{ textDecoration: "none" }}>
          <Card>
            <CardActionArea>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 3, p: 3 }}
              >
                <Business sx={{ fontSize: 48, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6">Providers</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and manage global CPD providers available to all
                    users.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

        <Link href="/admin/tags" style={{ textDecoration: "none" }}>
          <Card>
            <CardActionArea>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 3, p: 3 }}
              >
                <Label sx={{ fontSize: 48, color: "primary.main" }} />
                <Box>
                  <Typography variant="h6">Tags</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and manage global tags for categorising activities
                    and learning goals.
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Stack>
    </Box>
  );
}
