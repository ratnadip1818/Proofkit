import { NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { paddle } from "@/lib/paddle";
import { createAdminClient } from "@/lib/supabase/admin";

async function findUserByEmail(email: string) {
  const supabase = createAdminClient();
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );
    if (match) return match;

    if (!data.nextPage) return null;
    page = data.nextPage;
  }
}

/**
 * Resolve the plan tier from a Paddle price ID.
 * Falls back to "pro" if the env var is missing or unrecognized.
 */
function resolvePlanTier(priceId: string): "pro" {
  return "pro";
}

export async function POST(request: Request) {
  const signature = request.headers.get("paddle-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Subscription Created or Updated (activated, renewed, plan changed) ──
  if (
    event?.eventType === EventName.SubscriptionCreated ||
    event?.eventType === EventName.SubscriptionUpdated
  ) {
    const customerId = event.data.customerId;
    const subscriptionId = event.data.id;
    const status = event.data.status; // "active" | "past_due" | "paused" | "canceled"

    // Determine plan tier from the first line item's price ID
    const priceId = event.data.items?.[0]?.price?.id;
    const planTier = priceId ? resolvePlanTier(priceId) : "pro";

    if (customerId) {
      const customer = await paddle.customers.get(customerId);
      const user = await findUserByEmail(customer.email);
      const supabase = createAdminClient();

      // Only grant access when the subscription is active
      const effectiveTier = status === "active" ? planTier : "free";

      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          plan_tier: effectiveTier,
          paddle_subscription_id: subscriptionId,
          subscription_status: status,
        });
      } else {
        // Buyer subscribed from the landing page without an account —
        // create one and email an invite so they can set a password.
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";
        const { data: invited, error: inviteError } =
          await supabase.auth.admin.inviteUserByEmail(customer.email, {
            redirectTo: `${siteUrl}/auth/callback`,
          });

        if (inviteError || !invited?.user) {
          // Non-200 makes Paddle retry instead of dropping the payment
          return NextResponse.json(
            { error: "Failed to provision account for buyer" },
            { status: 500 }
          );
        }

        await supabase.from("profiles").upsert({
          id: invited.user.id,
          plan_tier: effectiveTier,
          paddle_subscription_id: subscriptionId,
          subscription_status: status,
        });
      }
    }
  }

  // ── Subscription Canceled ─────────────────────────────────────────────
  if (event?.eventType === EventName.SubscriptionCanceled) {
    const customerId = event.data.customerId;

    if (customerId) {
      try {
        const customer = await paddle.customers.get(customerId);
        console.log(
          `Processing subscription cancellation for: ${customer.email} (${customerId})`
        );

        const user = await findUserByEmail(customer.email);
        if (user) {
          const supabase = createAdminClient();
          await supabase.from("profiles").upsert({
            id: user.id,
            plan_tier: "free",
            subscription_status: "canceled",
          });
          console.log(
            `Downgraded to free for user: ${user.id} (${customer.email})`
          );
        }
      } catch (err: any) {
        console.error(`Error processing cancellation: ${err.message || err}`);
        return NextResponse.json(
          { error: "Failed to process cancellation" },
          { status: 500 }
        );
      }
    }
  }

  // ── Refund / Adjustment ───────────────────────────────────────────────
  if (event?.eventType === EventName.AdjustmentCreated) {
    const customerId = event.data.customerId;

    if (customerId) {
      try {
        const customer = await paddle.customers.get(customerId);
        console.log(
          `Processing refund webhook for customer: ${customer.email} (${customerId})`
        );

        const user = await findUserByEmail(customer.email);
        if (user) {
          const supabase = createAdminClient();
          await supabase.from("profiles").upsert({
            id: user.id,
            plan_tier: "free",
            subscription_status: "canceled",
          });
          console.log(
            `Successfully revoked access for user: ${user.id} (${customer.email})`
          );
        } else {
          console.log(
            `No registered user found for refunded email: ${customer.email}`
          );
        }
      } catch (err: any) {
        console.error(`Error processing refund: ${err.message || err}`);
        return NextResponse.json(
          { error: "Failed to process refund webhook" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
