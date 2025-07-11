import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/payments/stripe";
import { SubscriptionQueries } from "@/lib/queries/subscription";

export async function GET() {
  try {
    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user's subscription to find Stripe customer ID
    const subscription = await SubscriptionQueries.getSubscriptionByUserId(
      user.id
    );

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({
        invoices: [],
      });
    }

    // Get billing history from Stripe
    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 20,
      status: "paid",
    });

    const billingHistory = invoices.data.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      created: invoice.created,
      hosted_invoice_url: invoice.hosted_invoice_url,
      invoice_pdf: invoice.invoice_pdf,
      period_start: invoice.period_start,
      period_end: invoice.period_end,
      description: invoice.description,
      number: invoice.number,
    }));

    return NextResponse.json({
      invoices: billingHistory,
    });
  } catch (error) {
    console.error("Error fetching billing history:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing history" },
      { status: 500 }
    );
  }
}
