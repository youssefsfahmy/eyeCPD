"use client";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { useState, useEffect } from "react";
import { LoadingPulse } from "@/components/ui/loading";

export default function PricingPage() {
  const { plans, fetchPlans, createCheckoutSession } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(null);
    }
  };

  const features = [
    "Access to all CPD courses",
    "Certificate generation",
    "Progress tracking",
    "24/7 support",
    "Mobile app access",
    "Continuing education credits",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Get access to premium CPD content and advance your optometry career
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.length > 0 ? (
          plans.map((plan) =>
            plan.prices.map((price) => (
              <Grid key={price.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {price.nickname === "popular" && (
                    <Chip
                      label="Most Popular"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {plan.name}
                    </Typography>

                    <Box mb={2}>
                      <Typography variant="h3" component="span" color="primary">
                        {price.unit_amount
                          ? `$${(price.unit_amount / 100).toFixed(0)}`
                          : "Free"}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        color="text.secondary"
                      >
                        /{price.recurring?.interval || "month"}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {plan.description}
                    </Typography>

                    <List dense>
                      {features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => handleSubscribe(price.id)}
                      disabled={loading === price.id}
                      sx={{
                        bgcolor:
                          price.nickname === "popular"
                            ? "primary.main"
                            : "grey.800",
                        "&:hover": {
                          bgcolor:
                            price.nickname === "popular"
                              ? "primary.dark"
                              : "grey.900",
                        },
                      }}
                    >
                      {loading === price.id ? "Processing..." : "Get Started"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )
        ) : (
          <LoadingPulse />
        )}
      </Grid>

      <Box textAlign="center" mt={8}>
        <Typography variant="body2" color="text.secondary">
          All plans include a 7-day free trial. Cancel anytime.
        </Typography>
      </Box>
    </Container>
  );
}
