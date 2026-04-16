"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { Construction, ArrowBack } from "@mui/icons-material";

export default function ComingSoon() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          py: 8,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Construction
            sx={{
              fontSize: 120,
              color: "primary.main",
              opacity: 0.7,
            }}
          />
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: 2,
          }}
        >
          Coming Soon
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: "500px",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          This feature is currently under development. We&apos;re working hard
          to bring it to you. Stay tuned!
        </Typography>

        <Button
          onClick={() => window.history.back()}
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
          sx={{ minWidth: 140 }}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}
