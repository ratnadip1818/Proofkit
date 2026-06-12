import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";
const HOUR = 60 * 60 * 1000;

/**
 * Daily cron (vercel.json): trial lifecycle emails.
 *
 * Runs once a day, so 24h-wide windows mean each account receives each
 * email exactly once — no sent-flag bookkeeping needed:
 *   - created 48–72h ago  -> "your preview ends today" reminder
 *   - created 72–96h ago  -> "your preview has ended" notice
 */

function emailShell(heading: string, body: string, cta: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <p style="font-size:20px;font-weight:800;color:#E8743B;margin-bottom:4px;">Blovi</p>
      <h2 style="margin:16px 0 8px;">${heading}</h2>
      <p style="color:#6B6B6B;line-height:1.6;">${body}</p>
      <a href="${SITE_URL}/dashboard/billing" style="display:inline-block;margin-top:20px;background:#E8743B;color:white;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;">
        ${cta}
      </a>
      <p style="margin-top:24px;font-size:12px;color:#9CA3AF;">
        One payment, lifetime access — no subscription. 30-day money-back guarantee.
      </p>
    </div>
  `;
}

const TEMPLATES = {
  endsToday: {
    subject: "Your Blovi preview ends today",
    html: emailShell(
      "Your free preview ends today",
      "You've had a chance to see how your Wall of Love looks. Unlock testimonial collection and your live embed before your preview ends — it's a single $49 payment, yours forever.",
      "Unlock Blovi — $49 once"
    ),
  },
  expired: {
    subject: "Your Blovi preview has ended — here's what you're missing",
    html: emailShell(
      "Your free preview has ended",
      "Your widget link is paused and testimonial collection is locked. One $49 payment turns everything back on for life — no monthly fees, all future updates included.",
      "Reactivate for $49 — once"
    ),
  },
};

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = Date.now();

  // collect all users (paginated), bucket by account age
  const buckets: { user: { id: string; email?: string }; template: keyof typeof TEMPLATES }[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    for (const user of data.users) {
      if (!user.email) continue;
      const age = now - new Date(user.created_at).getTime();
      if (age >= 48 * HOUR && age < 72 * HOUR) {
        buckets.push({ user, template: "endsToday" });
      } else if (age >= 72 * HOUR && age < 96 * HOUR) {
        buckets.push({ user, template: "expired" });
      }
    }
    if (!data.nextPage) break;
    page = data.nextPage;
  }

  if (buckets.length === 0) {
    return NextResponse.json({ scanned: true, sent: 0, skipped: 0, failed: 0 });
  }

  // skip anyone who already paid
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, is_lifetime")
    .in("id", buckets.map((b) => b.user.id));
  const lifetime = new Set((profiles ?? []).filter((p) => p.is_lifetime).map((p) => p.id));

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const { user, template } of buckets) {
    if (lifetime.has(user.id)) {
      skipped++;
      continue;
    }
    try {
      const { error } = await resend.emails.send({
        from: "Blovi <hello@blovi.space>",
        to: user.email!,
        subject: TEMPLATES[template].subject,
        html: TEMPLATES[template].html,
      });
      if (error) throw new Error(error.message);
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ scanned: true, candidates: buckets.length, sent, skipped, failed });
}
