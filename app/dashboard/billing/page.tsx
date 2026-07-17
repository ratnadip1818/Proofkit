import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Check, Lock, ShieldCheck, Heart, Sparkles, HelpCircle } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Confetti } from "@/components/magicui/confetti";
import { FREE_WIDGET_TESTIMONIAL_LIMIT } from "@/lib/limits";

const FREE_LIMITS = [
  `Up to ${FREE_WIDGET_TESTIMONIAL_LIMIT} testimonials total`,
  "Wall of Love widget only",
  "Standard styles only",
  '"Powered by Blovi" badge active',
  "1 website limit",
];

const PRO_FEATURES = [
  "Unlimited testimonials",
  "All widget layouts (Wall, Carousel, Marquee, Single Quote)",
  "Custom accent colors & corner radiuses",
  "Remove the 'Powered by Blovi' attribution",
  "CSV bulk import",
  "Email notifications on new submissions",
  "Unlimited websites",
];

const BUSINESS_FEATURES = [
  "Everything in Pro",
  "Up to 5 team members",
  "Up to 10 workspaces",
  "White-label collection forms",
  "Custom domain integration",
  "Developer API access",
  "Priority support (12h response)",
];

const FAQS = [
  {
    q: "How does billing work?",
    a: "Blovi Pro is available as a one-time purchase for lifetime access. We also support AppSumo license key redemptions, allowing you to own it forever with no recurring subscription bills.",
  },
  {
    q: "Can I use the widget on multiple websites?",
    a: "Yes. With both Pro and Business tiers, once you generate your widget embed code, you can insert it into as many different pages or websites as you like.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes. If you aren't completely satisfied within 30 days of upgrading, just email us at hello@blovi.space and we'll issue a full refund.",
  },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let profile: { is_lifetime?: boolean; plan_tier?: string } | null = null;
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("is_lifetime, plan_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && (profileError.message.includes("plan_tier") || profileError.code === "42703")) {
    const { data: fallbackData } = await supabase
      .from("profiles")
      .select("is_lifetime")
      .eq("id", user.id)
      .maybeSingle();
    if (fallbackData) {
      profile = {
        is_lifetime: fallbackData.is_lifetime,
        plan_tier: fallbackData.is_lifetime ? "pro" : "free",
      };
    }
  } else if (profileData) {
    profile = profileData;
  }

  const planTier = profile?.is_lifetime === true ? "pro" : (profile?.plan_tier ?? "free");
  const isPaid = planTier === "pro" || planTier === "business";

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-16">
      <div className="mx-auto max-w-[1000px] px-5 md:px-10 py-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1
            className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] flex items-center justify-center md:justify-start gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Billing &amp; License
          </h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Premium features and billing status for your account.
          </p>
        </div>

        {/* AppSumo Promo Banner */}
        {planTier === "free" && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Have an AppSumo code?</p>
                <p className="text-xs text-zinc-500 mt-0.5">Redeem your AppSumo license key to unlock your lifetime Pro account features instantly.</p>
              </div>
            </div>
            <a
              href="/redeem"
              className="rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#E8743B] active:scale-95"
            >
              Redeem Code
            </a>
          </div>
        )}

        {profile?.is_lifetime && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50/50 p-6 flex items-center gap-3 shadow-sm">
            <div className="rounded-xl bg-green-500/10 p-2.5 text-green-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900">Active Lifetime License</p>
              <p className="text-xs text-zinc-500 mt-0.5">Your account has been upgraded via AppSumo. You have lifetime access to all Pro features.</p>
            </div>
          </div>
        )}

        {isPaid ? (
          /* Celebratory Paid Active State */
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border-2 border-green-200 bg-white p-8 shadow-md">
              <Confetti />
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="text-center md:text-left space-y-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-[#2E9E6B] border border-green-200 uppercase">
                    <Sparkles size={11} className="animate-pulse" />
                    {planTier} plan active
                  </span>
                  <h2
                    className="text-2xl font-extrabold text-[#1A1A1A] capitalize"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    You are on the {planTier} plan!
                  </h2>
                  <p className="text-sm text-[#6B6B6B] max-w-xl">
                    Thank you for your support. You have full access to all premium widgets, themes, and layouts included in your tier.
                  </p>
                </div>
                <div className="h-16 w-16 bg-[#FFF4EE] text-[#E8743B] rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#E8743B]/20">
                  <Heart size={28} className="fill-[#E8743B]" />
                </div>
              </div>

              {/* Receipt Details */}
              <div className="mt-8 border-t border-[#ECE7E0] pt-6 grid gap-4 sm:grid-cols-2 text-sm">
                <div className="rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] p-4">
                  <p className="text-xs text-[#6B6B6B] uppercase font-bold tracking-wider">License Owner</p>
                  <p className="mt-1 font-semibold text-[#1A1A1A] truncate">{user.email}</p>
                </div>
                <div className="rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] p-4">
                  <p className="text-xs text-[#6B6B6B] uppercase font-bold tracking-wider">Plan Type</p>
                  <p className="mt-1 font-semibold text-[#1A1A1A] capitalize">
                    {profile?.is_lifetime ? "Pro Lifetime Plan (One-Time)" : `${planTier} Subscription (Billed Annually)`}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Included List */}
            <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#6B6B6B] mb-5">
                Features Unlocked
              </h3>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {PRO_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm text-[#1A1A1A]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 border border-green-200">
                      <Check size={12} className="text-[#2E9E6B]" />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Modern 2-Column Plan Comparison Layout */
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-flex rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-xs font-semibold text-[#6B6B6B] border border-[#ECE7E0]">
                  Free Tier
                </span>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-[#1A1A1A] font-display">$0</span>
                  <span className="text-sm text-[#6B6B6B]"> / forever</span>
                </div>
                <p className="mt-3 text-xs text-[#6B6B6B] min-h-[32px]">
                  Perfect for trial pages and small personal portfolio sites.
                </p>

                <div className="mt-6 border-t border-[#ECE7E0] pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-4">Included Limits</p>
                  <ul className="space-y-3">
                    {FREE_LIMITS.map((limit) => (
                      <li key={limit} className="flex items-start gap-2.5 text-xs text-[#6B6B6B]">
                        <Lock size={12} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                        {limit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-[#ECE7E0]/60">
                <span className="text-xs font-semibold text-[#6B6B6B] block text-center">Active Plan</span>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#E8743B] bg-white p-6 shadow-md flex flex-col justify-between">
              <BorderBeam duration={8} />
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="inline-flex rounded-full bg-[#FFF4EE] px-2.5 py-0.5 text-xs font-semibold text-[#E8743B] border border-[#E8743B]/20">
                    Pro Plan
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-[#E8743B] uppercase animate-pulse">Popular</span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-[#1A1A1A] font-display">$49</span>
                  <span className="text-sm text-[#6B6B6B]"> / lifetime</span>
                </div>
                <p className="mt-3 text-xs text-[#6B6B6B] min-h-[32px]">
                  Unlock unlimited testimonials and all layouts on your site forever.
                </p>

                <div className="mt-6 border-t border-[#ECE7E0] pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#E8743B] mb-4">Pro Features</p>
                  <ul className="space-y-3">
                    {PRO_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-[#1A1A1A]">
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-green-50 border border-green-200">
                          <Check size={11} className="text-[#2E9E6B]" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#ECE7E0]/60">
                <Link
                  href="/redeem"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-[#E8743B] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer text-center"
                >
                  Redeem AppSumo Code
                </Link>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#6B6B6B]">
                  <Sparkles size={12} className="text-amber-500" />
                  Redeem your AppSumo license key here
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
          <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            <HelpCircle className="text-[#E8743B]" size={18} />
            Frequently Asked Questions
          </h3>
          <div className="divide-y divide-[#ECE7E0]">
            {FAQS.map((faq, i) => (
              <div key={i} className={`py-4 ${i === 0 ? "pt-0" : ""} ${i === FAQS.length - 1 ? "pb-0" : ""}`}>
                <p className="text-sm font-bold text-[#1A1A1A]">{faq.q}</p>
                <p className="mt-1.5 text-xs text-[#6B6B6B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-[#6B6B6B]">
          Have custom requirements or need billing help? Contact us at{" "}
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
