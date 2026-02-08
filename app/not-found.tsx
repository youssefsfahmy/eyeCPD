"use client";

import Link from "next/link";
import { Button, Typography, Box, Container } from "@mui/material";
import { Home, ArrowBack, Visibility } from "@mui/icons-material";

export default function NotFoundPage() {
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
        {/* 404 Icon */}
        <Box sx={{ mb: 4 }}>
          <Visibility
            sx={{
              fontSize: 120,
              color: "primary.main",
              opacity: 0.7,
            }}
          />
        </Box>

        {/* Error Code */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "4rem", md: "6rem" },
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 2,
            color: "text.primary",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Page Not Found
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
          Sorry, we couldnt find the page you`&apos;`re looking for. The page
          might have been moved, deleted, or you may have entered the wrong URL.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
            sx={{ minWidth: 140 }}
          >
            Go Home
          </Button>

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

        {/* Helpful Links */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: 1,
            borderColor: "divider",
            width: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom color="text.primary">
            Popular Pages
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="/opt"
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Dashboard
            </Link>
            <Link
              href="/education"
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Education
            </Link>
            <Link
              href="/about"
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
