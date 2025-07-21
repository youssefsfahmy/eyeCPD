"use client";

import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  Button,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSubscription } from "@/lib/hooks/use-subscription";
import Link from "next/link";
import { LoadingAnimatedLogo } from "@/components/ui/loading";

// Subscriptions Tab Component
export default function SubscriptionsTab() {
  const {
    subscription,
    billingHistory,
    isLoading,
    error,
    fetchSubscription,
    fetchBillingHistory,
    cancelSubscription,
    createPortalSession,
  } = useSubscription();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchBillingHistory();
  }, [fetchSubscription, fetchBillingHistory]);

  const handleUpgrade = async () => {
    setActionLoading("upgrade");
    try {
      // Redirect to portal for plan changes
      const portalUrl = await createPortalSession();
      window.open(portalUrl, "_blank");
    } catch (err) {
      console.error("Error handling upgrade:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    setActionLoading("cancel");
    try {
      await cancelSubscription();
    } catch (err) {
      console.error("Error cancelling subscription:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading("portal");
    try {
      const portalUrl = await createPortalSession();
      window.open(portalUrl, "_blank");
    } catch (err) {
      console.error("Error opening billing portal:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (isLoading && !subscription) {
    return <LoadingAnimatedLogo />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Subscription Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Current Plan" />
        <CardContent>
          {subscription ? (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="h6">
                  {subscription.planName || "Professional Plan"}
                </Typography>
                <Chip
                  label={
                    subscription.status === "active"
                      ? "Active"
                      : subscription.status
                  }
                  color={
                    subscription.status === "active" ? "success" : "default"
                  }
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Full access to all CPD features and resources
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current period: {formatDate(subscription.currentPeriodStart)} -{" "}
                {formatDate(subscription.currentPeriodEnd)}
              </Typography>
              {subscription.cancelAtPeriodEnd && (
                <Typography variant="body2" color="error" gutterBottom>
                  {new Date(subscription.cancelAtPeriodEnd) > new Date()
                    ? `Subscription will be cancelled on: ${formatDate(
                        subscription.cancelAtPeriodEnd
                      )}`
                    : `Subscription was cancelled on: ${formatDate(
                        subscription.cancelAtPeriodEnd
                      )}`}
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpgrade}
                  disabled={actionLoading === "upgrade"}
                >
                  {actionLoading === "upgrade" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Manage Plan"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleManageBilling}
                  disabled={actionLoading === "portal"}
                >
                  {actionLoading === "portal" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Billing Portal"
                  )}
                </Button>
                {subscription.status === "active" &&
                  !subscription.cancelAtPeriodEnd && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleCancel}
                      disabled={actionLoading === "cancel"}
                    >
                      {actionLoading === "cancel" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Cancel Subscription"
                      )}
                    </Button>
                  )}
              </Box>
            </>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No active subscription found.
              </Typography>
              <Link href="/pricing" passHref>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Subscribe Now
                </Button>
              </Link>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Billing History" />
        <CardContent>
          {billingHistory.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {formatAmount(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status}
                          color={
                            invoice.status === "paid" ? "success" : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {invoice.hosted_invoice_url ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              window.open(invoice.hosted_invoice_url!, "_blank")
                            }
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No billing history available yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
