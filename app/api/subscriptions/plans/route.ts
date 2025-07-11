import { NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Get current user (optional - can be public endpoint)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get all active products with their prices from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Get all prices for subscription products
    const prices = await stripe.prices.list({
      active: true,
      type: "recurring",
      expand: ["data.product"],
    });

    // Combine products with their associated prices
    const subscriptionPlans = products.data
      .map((product) => {
        const productPrices = prices.data.filter(
          (price) =>
            typeof price.product === "object" && price.product.id === product.id
        );

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          metadata: product.metadata,
          prices: productPrices.map((price) => ({
            id: price.id,
            currency: price.currency,
            unit_amount: price.unit_amount,
            recurring: price.recurring,
            nickname: price.nickname,
            metadata: price.metadata,
          })),
        };
      })
      .filter((plan) => plan.prices.length > 0); // Only include products that have prices

    return NextResponse.json({
      subscriptionPlans,
      userAuthenticated: !!user,
    });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}
