import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";
const HOUR = 60 * 60 * 1000;

/**
 * Daily cron (vercel.json): free-plan lifecycle emails.
 *
 * Runs once a day, so 24h-wide windows mean each account receives each
 * email exactly once — no sent-flag bookkeeping needed:
 *   - created 48–72h ago  -> day-2 nudge (get set up, what Pro unlocks)
 *   - created 72–96h ago  -> day-3 upsell (unlimited testimonials pitch)
 */

function emailShell(heading: string, body: string, cta: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A;">
      <p style="font-size:20px;font-weight:800;color:#2563EB;margin-bottom:4px;">Blovi</p>
      <h2 style="margin:16px 0 8px;">${heading}</h2>
      <p style="color:#6B6B6B;line-height:1.6;">${body}</p>
      <a href="${SITE_URL}/dashboard/billing" style="display:inline-block;margin-top:20px;background:#2563EB;color:white;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;">
        ${cta}
      </a>
      <p style="margin-top:24px;font-size:12px;color:#9CA3AF;">
        Pro plan billed annually. Cancel anytime. 30-day money-back guarantee.
      </p>
    </div>
  `;
}

const TEMPLATES = {
  endsToday: {
    subject: "Getting the most out of Blovi",
    html: emailShell(
      "How's your Wall of Love coming along?",
      "You're on the free plan with up to 3 testimonials. When you're ready, upgrading to Pro for $49/year unlocks unlimited testimonials, every widget layout, custom branding, and badge removal.",
      "Unlock everything — $49/year"
    ),
  },
  expired: {
    subject: "Show every testimonial you've earned",
    html: emailShell(
      "Your free plan holds up to 3 testimonials",
      "Social proof works best in volume. Upgrade to Pro for $49/year to collect unlimited testimonials, show them all, and unlock Carousel, Marquee, and Single Quote widgets with custom accent colors.",
      "Upgrade to Pro — $49/year"
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
  let profiles: { id: string; is_lifetime?: boolean; plan_tier?: string }[] | null = null;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, is_lifetime, plan_tier")
    .in("id", buckets.map((b) => b.user.id));

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("id, is_lifetime")
      .in("id", buckets.map((b) => b.user.id));
    if (fallbackData) {
      profiles = fallbackData.map((p) => ({
        id: p.id,
        is_lifetime: p.is_lifetime,
        plan_tier: p.is_lifetime ? "pro" : "free",
      }));
    }
  } else if (profileData) {
    profiles = profileData;
  }

  const paidUsers = new Set((profiles ?? []).filter((p) => p.is_lifetime === true || p.plan_tier === "pro" || p.plan_tier === "business").map((p) => p.id));

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const { user, template } of buckets) {
    if (paidUsers.has(user.id)) {
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
