import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Check, Lock } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Confetti } from "@/components/magicui/confetti";
import { FREE_WIDGET_TESTIMONIAL_LIMIT } from "@/lib/limits";

const FREE_LIMITS = [
  `Up to ${FREE_WIDGET_TESTIMONIAL_LIMIT} testimonials total`,
  "Wall of Love widget only (Carousel, Marquee & Single Quote locked)",
  "AI improvement locked",
  '"Powered by Blovi" badge on your widget',
];

const LIFETIME_FEATURES = [
  "Unlimited testimonials",
  "All widget types — Wall of Love, Carousel, Marquee, Single Quote",
  'Removable "Powered by Blovi" badge',
  "Unlimited testimonial collection forms",
  "AI-powered improvement button",
  "CSV import",
  "Email notifications on new submissions",
  "All future updates included",
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_lifetime")
    .eq("id", user.id)
    .maybeSingle();

  const isLifetime = profile?.is_lifetime ?? false;

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-10">
        <div className="mb-8">
          <h1
            className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Billing &amp; License
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            One payment, lifetime access — no subscriptions.
          </p>
        </div>

        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Current plan
          </h2>
          <p
            className="mt-2 text-lg font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isLifetime ? "Lifetime License" : "Free"}
          </p>

          {isLifetime ? (
            <div className="relative mt-5 overflow-hidden rounded-xl border border-green-200 bg-green-50 p-5">
              <Confetti />
              <p className="relative flex items-center gap-2 text-sm font-semibold text-[#2E9E6B]">
                <span aria-hidden="true">✅</span> Lifetime License Active
              </p>
              <p className="relative mt-1.5 text-xs text-[#2E9E6B]/80">
                Thanks for being an early supporter — enjoy every feature,
                forever.
              </p>
            </div>
          ) : (
            <>
              <ul className="mt-4 space-y-2.5">
                {FREE_LIMITS.map((limit) => (
                  <li
                    key={limit}
                    className="flex items-start gap-2 text-sm text-[#6B6B6B]"
                  >
                    <Lock size={14} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                    {limit}
                  </li>
                ))}
              </ul>

              <div className="relative mt-5 overflow-hidden rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] p-5">
                <BorderBeam duration={8} />
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  Upgrade now — unlock everything, forever
                </p>
                <ul className="mt-3 space-y-2">
                  {LIFETIME_FEATURES.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-[#1A1A1A]"
                    >
                      <Check size={15} className="mt-0.5 shrink-0 text-[#2E9E6B]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <PaddleCheckout
                  email={user.email}
                  className="mt-4 inline-flex items-center rounded-lg bg-[#E8743B] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-105"
                >
                  Upgrade now — $49 once
                </PaddleCheckout>
                <p className="mt-2 text-xs text-[#6B6B6B]">
                  Secure checkout via Paddle · 30-day money-back guarantee
                </p>
              </div>
            </>
          )}
        </div>

        {isLifetime && (
          <div className="mt-5 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Features included
            </h2>
            <ul className="mt-4 space-y-2.5">
              {LIFETIME_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-[#1A1A1A]"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-[#2E9E6B]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-sm text-[#6B6B6B]">
          Need help? Contact{" "}
          <a
            href="mailto:hello@blovi.space"
            className="font-medium text-[#E8743B] hover:underline"
          >
            hello@blovi.space
          </a>
        </p>
      </div>
    </div>
  );
}
