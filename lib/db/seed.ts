// import { stripe } from '@/lib/payments/stripe';
// import { db } from './drizzle';
// import { profiles, subscriptions } from './schema';
// import { createClient } from '@/lib/supabase/server';rt { stripe } from "@/lib/payments/stripe";
// import { db } from "./drizzle";
// import { users, profiles, subscriptions } from "./schema";
// // import { hashPassword } from '@/lib/auth/session'; // TODO: Implement session module

// async function createStripeProducts() {
//   console.log("Creating Stripe products and prices...");

//   const baseProduct = await stripe.products.create({
//     name: "Base",
//     description: "Base subscription plan",
//   });

//   await stripe.prices.create({
//     product: baseProduct.id,
//     unit_amount: 800, // $8 in cents
//     currency: "usd",
//     recurring: {
//       interval: "month",
//       trial_period_days: 7,
//     },
//   });

//   const plusProduct = await stripe.products.create({
//     name: "Plus",
//     description: "Plus subscription plan",
//   });

//   await stripe.prices.create({
//     product: plusProduct.id,
//     unit_amount: 1200, // $12 in cents
//     currency: "usd",
//     recurring: {
//       interval: "month",
//       trial_period_days: 7,
//     },
//   });

//   console.log("Stripe products and prices created successfully.");
// }

// async function seed() {
//   const email = "test@test.com";
//   const password = "admin123";
//   // TODO: Implement proper password hashing
//   const passwordHash = "temp_hash_" + password; // Temporary until auth is implemented

//   const [user] = await db
//     .insert(users)
//     .values([
//       {
//         email: email,
//         passwordHash: passwordHash,
//         role: "optometrist",
//       },
//     ])
//     .returning();

//   console.log("Initial user created.");

//   // Create a profile for the user
//   await db
//     .insert(profiles)
//     .values({
//       userId: user.id,
//       first_name: "Test",
//       last_name: "User",
//       phone: "+1234567890",
//       registration_number: "OPT123456",
//     })
//     .returning();

//   console.log("User profile created.");

//   // Create a subscription for the user (initially without Stripe data)
//   await db
//     .insert(subscriptions)
//     .values({
//       userId: user.id,
//       stripeCustomerId: "temp_customer_id", // Will be updated when Stripe customer is created
//       status: "active",
//       planName: "Base",
//     })
//     .returning();

//   console.log("User subscription created.");

//   await createStripeProducts();
// }

// seed()
//   .catch((error) => {
//     console.error("Seed process failed:", error);
//     process.exit(1);
//   })
//   .finally(() => {
//     console.log("Seed process finished. Exiting...");
//     process.exit(0);
//   });
