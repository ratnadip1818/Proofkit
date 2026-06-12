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

  if (event?.eventType === EventName.TransactionCompleted) {
    const customerId = event.data.customerId;

    if (customerId) {
      const customer = await paddle.customers.get(customerId);
      const user = await findUserByEmail(customer.email);
      const supabase = createAdminClient();

      if (user) {
        await supabase
          .from("profiles")
          .upsert({ id: user.id, is_lifetime: true });
      } else {
        // Buyer paid from the landing page without an account — create one,
        // unlock it, and email an invite so they can set a password.
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

        await supabase
          .from("profiles")
          .upsert({ id: invited.user.id, is_lifetime: true });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
