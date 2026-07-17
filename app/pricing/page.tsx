import Link from "next/link";
import { Check, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";
import FAQSection from "@/components/landing/FAQSection";

export const metadata = {
  title: "Pricing — Blovi",
  description:
    "Simple, transparent pricing. Get Blovi Pro lifetime access for a single one-time payment of $49.",
};

const FREE_LIMITS = [
  "Up to 3 testimonials total",
  "Wall of Love embed widget only",
  "Standard widget styles",
  '"Powered by Blovi" badge active',
  "1 website limit",
];

const PRO_FEATURES = [
  "Unlimited testimonials",
  "All 4 widget layouts (Wall, Carousel, Marquee, Single Quote)",
  "Custom accent colors & corner radiuses",
  "Remove the 'Powered by Blovi' attribution",
  "CSV bulk import",
  "Email notifications",
  "Up to 3 websites limit",
];

const COMPARISON_ROWS = [
  { feature: "Pricing Model", blovi: "$49 one-time (Lifetime)", senja: "$348 / year" },
  { feature: "Text testimonials", blovi: "Unlimited", senja: "Unlimited" },
  { feature: "Wall of Love widget", blovi: "Yes", senja: "Yes" },
  { feature: "Multiple widget layouts", blovi: "4 styles", senja: "5 styles" },
  { feature: "Collection form", blovi: "Yes", senja: "Yes" },
  { feature: "Email notifications", blovi: "Yes", senja: "Yes" },
  { feature: "CSV import", blovi: "Yes", senja: "Yes" },
  { feature: "Branding removal", blovi: "Yes", senja: "Yes" },
];

export default function PricingPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          {/* HERO */}
          <section className="w-full pt-36 pb-12 px-5 md:px-10 text-center md:pt-44">
            <div className="mx-auto w-full max-w-[1200px]">
              <FadeIn>
                <h1
                  className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Simple, transparent pricing
                </h1>
                <p className="mx-auto mt-4 max-w-lg text-lg text-[#6B6B6B]">
                  Choose the plan that fits your growth. Try Blovi for free today.
                </p>
              </FadeIn>
            </div>
          </section>

          {/* PRICING CARDS */}
          <section className="w-full pb-24 px-5 md:px-10">
            <div className="mx-auto grid gap-6 md:grid-cols-2 max-w-3xl items-stretch">
              {/* Free Tier */}
              <FadeIn delay={0.05}>
                <div className="group relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:border-[#E8743B]/20 hover:shadow-[0_24px_56px_rgba(232,116,59,0.04)]">
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
                    <Link
                      href="/signup"
                      className="flex w-full items-center justify-center rounded-full bg-[#1A1A1A]/5 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:bg-[#1A1A1A]/10 active:scale-95"
                    >
                      Start Free
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {/* Pro Tier */}
              <FadeIn delay={0.1}>
                <div className="group relative overflow-hidden rounded-3xl border-2 border-[#E8743B] bg-white p-6 shadow-md flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(232,116,59,0.08)]">
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
                      Unlock unlimited testimonials and all layouts on 3 websites forever.
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
                      href="/signup"
                      className="flex w-full items-center justify-center rounded-full bg-[#E8743B] py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(232,116,59,0.15)] transition-all hover:scale-[1.02] hover:bg-[#CF5F2C] active:scale-95"
                    >
                      Upgrade to Pro
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* COMPARISON TABLE */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[800px]">
              <FadeIn>
                <h2
                  className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  How Blovi compares
                </h2>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="mt-10 overflow-x-auto rounded-2xl border border-[#ECE7E0]">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#ECE7E0]">
                        <th scope="col" className="p-4 text-left font-semibold text-[#1A1A1A]">
                          Feature
                        </th>
                        <th
                          scope="col"
                          className="border-x-2 border-[#E8743B] bg-[#E8743B]/5 p-4 text-center font-semibold text-[#E8743B]"
                        >
                          Blovi Pro
                        </th>
                        <th scope="col" className="p-4 text-center font-semibold text-[#6B6B6B]">
                          Senja Pro
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map((row) => (
                        <tr key={row.feature} className="border-b border-[#ECE7E0] last:border-0">
                          <th scope="row" className="p-4 text-left font-medium text-[#1A1A1A]">
                            {row.feature}
                          </th>
                          <td className="border-x-2 border-[#E8743B] bg-[#E8743B]/5 p-4 text-center font-semibold text-[#E8743B]">
                            {row.blovi}
                          </td>
                          <td className="p-4 text-center text-[#6B6B6B] font-semibold">
                            {row.senja}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* FAQ */}
          <FAQSection />

          {/* FINAL CTA */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[1200px] text-center">
              <FadeIn>
                <h2
                  className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Ready to display your social proof?
                </h2>
                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#E8743B] px-10 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
                  >
                    Start collecting for free
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
