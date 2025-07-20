import { useState, useCallback } from "react";
import { Subscription } from "@/lib/db/schema";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  metadata: Record<string, string>;
  prices: {
    id: string;
    currency: string;
    unit_amount: number | null;
    recurring: {
      interval: string;
      interval_count: number;
    } | null;
    nickname: string | null;
    metadata: Record<string, string>;
  }[];
}

interface BillingHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  billingHistory: BillingHistory[];
  isLoading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchBillingHistory: () => Promise<void>;
  createCheckoutSession: (priceId: string) => Promise<string>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (priceId: string) => Promise<void>;
  createPortalSession: () => Promise<string>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to fetch subscription");
      }

      const result = await response.json();
      setSubscription(result.subscription);
      setPlans(result.availablePlans || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch subscription";
      setError(errorMessage);
      console.error("Error fetching subscription:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/plans");

      if (!response.ok) {
        throw new Error("Failed to fetch subscription plans");
      }

      const result = await response.json();
      setPlans(result.subscriptionPlans || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch plans";
      setError(errorMessage);
      console.error("Error fetching plans:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBillingHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/billing-history");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to fetch billing history");
      }

      const result = await response.json();
      setBillingHistory(result.invoices || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch billing history";
      setError(errorMessage);
      console.error("Error fetching billing history:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCheckoutSession = useCallback(
    async (priceId: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/subscriptions/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            // If the user is not authenticated, redirect to login
            const data = await response.json();
            window.location.href =
              data.redirectTo || "/auth/login?next=/pricing";
            throw new Error("User not authenticated");
          }
          throw new Error("Failed to create checkout session");
        }

        const result = await response.json();
        return result.url;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create checkout session";
        setError(errorMessage);
        console.error("Error creating checkout session:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const cancelSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscription", {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to cancel subscription");
      }

      // Refresh subscription data after cancellation
      await fetchSubscription();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel subscription";
      setError(errorMessage);
      console.error("Error cancelling subscription:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubscription]);

  const updateSubscription = useCallback(
    async (priceId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/subscription", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priceId }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("User not authenticated");
          }
          throw new Error("Failed to update subscription");
        }

        // Refresh subscription data after update
        await fetchSubscription();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update subscription";
        setError(errorMessage);
        console.error("Error updating subscription:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSubscription]
  );

  const createPortalSession = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions/portal", {
        method: "POST",
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/account/subscriptions`,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to create portal session");
      }

      const result = await response.json();
      return result.url;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create portal session";
      setError(errorMessage);
      console.error("Error creating portal session:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    subscription,
    plans,
    billingHistory,
    isLoading,
    error,
    fetchSubscription,
    fetchPlans,
    fetchBillingHistory,
    createCheckoutSession,
    cancelSubscription,
    updateSubscription,
    createPortalSession,
  };
}
