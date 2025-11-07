"use client";
import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  RocketLaunch as RocketLaunchIcon,
  FileDownload as FileDownloadIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

const helpSections = [
  {
    title: "Getting Started",
    icon: RocketLaunchIcon,
    color: "#2562ea", // primary.500
    faqs: [
      {
        question: "How do I create my first CPD activity?",
        answer:
          "Navigate to the Activities section and click 'Create New Activity'. Fill in the required details including activity name, provider, date, hours, description, and reflection. You can save as draft or publish immediately.",
      },
      {
        question: "What information do I need to complete my profile?",
        answer:
          "Complete your profile with your registration details, practice information, and CPD goals. This helps us track your progress and ensure compliance with registration standards.",
      },
      {
        question: "How do I set up my CPD goals?",
        answer:
          "Go to the Goals section to create learning objectives for the year. Set specific, measurable goals that align with your practice needs and the Optometry Board requirements.",
      },
      {
        question:
          "What's the difference between draft and published activities?",
        answer:
          "Draft activities are saved for later completion and don't count towards your CPD hours. Published activities are finalized and contribute to your annual CPD requirement.",
      },
    ],
  },
  {
    title: "Exporting Reports",
    icon: FileDownloadIcon,
    color: "#079669", // secondary.500
    faqs: [
      {
        question: "How do I generate my CPD report?",
        answer:
          "Go to the Reports section and select your desired date range. You can generate reports for specific periods or the full registration year. The report will include all published activities with reflections.",
      },
      {
        question: "What formats are available for export?",
        answer:
          "Reports can be exported as PDF documents that are suitable for audits and submissions to the Optometry Board. The PDF includes all activity details, evidence files, and reflections.",
      },
      {
        question:
          "Can I choose which year to export or export a previous year's report?",
        answer:
          "Yes, you can export reports for any year or specific date range. Use the date range selector in the Reports section to choose the period you want to export, including previous registration years.",
      },
      {
        question: "How often should I export my CPD report?",
        answer:
          "We recommend exporting quarterly reports to track your progress and ensure you're on target to meet your annual requirements. Always export a final report at the end of your registration period.",
      },
    ],
  },
  {
    title: "General CPD Questions",
    icon: HelpIcon,
    color: "#f59e0b", // warning.500
    faqs: [
      {
        question:
          "What is the minimum number of CPD hours required for optometrists?",
        answer:
          "Optometrists must complete a minimum of 20 hours of CPD every year to meet the Optometry Board of Australia's registration standard.",
      },
      {
        question: "Does the CPD requirement apply to all optometrists?",
        answer:
          "The CPD requirement applies to all registered optometrists, except those with student or non-practising registration.",
      },
      {
        question: "What types of CPD activities are acceptable?",
        answer:
          "Acceptable CPD activities include: Higher education/accredited courses, conferences, seminars, and online learning, research and presenting work, written reflections on clinical practice, quality assurance activities like clinical audits, and participation in committees and professional interactions.",
      },
      {
        question:
          "Are there any specific CPD requirements for optometrists who hold an endorsement for scheduled medicines?",
        answer:
          "Optometrists with an endorsement for scheduled medicines must complete an additional 10 hours of CPD over the registration period, including at least two hours of interactive CPD.",
      },
      {
        question: "What is interactive CPD?",
        answer:
          "Interactive CPD involves learning activities that involve two-way communication and engagement with other practitioners. This includes face-to-face education or web-conferencing.",
      },
      {
        question: "Do I need to reflect on my CPD activities?",
        answer:
          "Yes, the CPD standard requires you to reflect on how your completed CPD activities have impacted your practice. This helps in setting future learning goals.",
      },
      {
        question: "How long should I keep my CPD records?",
        answer:
          "You must keep your CPD portfolio and evidence of completed activities for at least five years from the date you complete your CPD cycle.",
      },
    ],
  },
];

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: string | false;
  }>({});

  const handleSectionChange =
    (section: string, panel: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: isExpanded ? panel : false,
      }));
    };

  // Create search results for dropdown
  const searchResults =
    searchQuery.length > 0
      ? helpSections.flatMap((section, sectionIndex) =>
          section.faqs
            .map((faq, faqIndex) => ({
              ...faq,
              sectionTitle: section.title,
              sectionColor: section.color,
              sectionIndex,
              faqIndex,
            }))
            .filter(
              (faq) =>
                faq.question
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
      : [];

  const handleSearchResultClick = (result: (typeof searchResults)[number]) => {
    // Close dropdown
    setShowDropdown(false);
    setSearchQuery("");

    // Expand the accordion
    setExpandedSections((prev) => ({
      ...prev,
      [result.sectionTitle]: `panel-${result.sectionIndex}-${result.faqIndex}`,
    }));

    // Scroll to the accordion item
    setTimeout(() => {
      const element = document.getElementById(
        `faq-${result.sectionIndex}-${result.faqIndex}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "grey.50" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to right, #2562ea, #1d4ed8)",
          color: "white",
          p: 4,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
      >
        <Container sx={{ mb: 3 }}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              fontSize: { xs: "2.5rem", md: "2.5rem" },
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Help Center
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Everything you need to know about managing your CPD requirements
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: "500px", mx: "auto", position: "relative" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowDropdown(searchQuery.length > 0)}
              onBlur={() => {
                // Delay hiding dropdown to allow clicks on results
                setTimeout(() => setShowDropdown(false), 200);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "grey.400" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <Paper
                elevation={8}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: 300,
                  overflow: "auto",
                  mt: 1,
                  borderRadius: 2,
                }}
              >
                {searchResults.slice(0, 8).map((result, index) => (
                  <Box
                    key={index}
                    onClick={() => handleSearchResultClick(result)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      borderBottom:
                        index !== Math.min(searchResults.length, 8) - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      "&:hover": {
                        backgroundColor: "grey.50",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: result.sectionColor,
                          mr: 1.5,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: result.sectionColor,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      >
                        {result.sectionTitle}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {result.question}
                    </Typography>
                  </Box>
                ))}
                {searchResults.length > 8 && (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      backgroundColor: "grey.50",
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      +{searchResults.length - 8} more results
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}

            {showDropdown &&
              searchQuery.length > 0 &&
              searchResults.length === 0 && (
                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    mt: 1,
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </Typography>
                </Paper>
              )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Card sx={{ mb: 3, p: 4 }}>
        {/* Category Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mb: 6,
          }}
        >
          {helpSections.map((section, sectionIndex) => (
            <Card
              key={sectionIndex}
              sx={{
                flex: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => {
                const element = document.getElementById(
                  `section-${sectionIndex}`
                );
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: section.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <section.icon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {section.faqs.length} articles
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* FAQ Sections */}
        {helpSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} id={`section-${sectionIndex}`} sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: section.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <section.icon sx={{ fontSize: 24, color: "white" }} />
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: section.color }}
              >
                {section.title}
              </Typography>
            </Box>

            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `2px solid ${section.color}20`,
              }}
            >
              {section.faqs.map((faq, faqIndex) => (
                <Accordion
                  key={faqIndex}
                  id={`faq-${sectionIndex}-${faqIndex}`}
                  expanded={
                    expandedSections[section.title] ===
                    `panel-${sectionIndex}-${faqIndex}`
                  }
                  onChange={handleSectionChange(
                    section.title,
                    `panel-${sectionIndex}-${faqIndex}`
                  )}
                  sx={{
                    margin: "0 !important",
                    boxShadow: "none",
                    borderBottom:
                      faqIndex !== section.faqs.length - 1
                        ? "1px solid"
                        : "none",
                    borderColor: "divider",
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      px: 4,
                      py: 2,
                      "& .MuiAccordionSummary-content": {
                        my: 1,
                      },
                      "& .MuiAccordionSummary-expandIconWrapper": {
                        color: section.color,
                      },
                      "&:hover": {
                        backgroundColor: `${section.color}08`,
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 4,
                      pb: 4,
                      pt: 0,
                      backgroundColor: `${section.color}04`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Box>
        ))}
      </Card>
    </Box>
  );
}

export default Page;
