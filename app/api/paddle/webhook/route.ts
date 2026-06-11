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

      if (user) {
        const supabase = createAdminClient();
        await supabase
          .from("profiles")
          .update({ is_lifetime: true })
          .eq("id", user.id);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
