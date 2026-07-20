import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Pricing — Blovi",
  description:
    "Pay once. Own your social proof forever. No subscriptions, no monthly rent. Just one $49 lifetime payment after Blovi proves its value.",
};

const PHILOSOPHY_ROWS = [
  { feature: "Pricing Model", blovi: "One-time ($49)", saas: "Monthly subscription" },
  { feature: "Own your testimonials", blovi: "Yes, forever", saas: "Yes, while paying" },
  { feature: "Monthly payments", blovi: "Never", saas: "Required ($29+/mo)" },
  { feature: "Future updates", blovi: "Included", saas: "Depends on tier" },
  { feature: "Support", blovi: "Direct founder support", saas: "Support ticket queue" },
];

const REVIEWS = [
  {
    quote: "The setup took less than 5 minutes. Paying once instead of adding another $29/mo subscription was an easy decision.",
    author: "Marc K.",
    role: "Founder, ShipFast",
  },
  {
    quote: "Blovi makes our Wall of Love look like it was custom-coded into our landing page. The $49 lifetime deal paid for itself immediately.",
    author: "Elena R.",
    role: "Indie Creator",
  },
];

const FAQ_OBJECTIONS = [
  {
    q: "Why lifetime?",
    a: "I don't believe your customer testimonials should become another monthly bill. You earned every review—you should own them forever.",
  },
  {
    q: "Can I start free?",
    a: "Yes. You can collect your first customer stories and publish your first Wall of Love completely free, with no credit card required.",
  },
  {
    q: "Can I upgrade later?",
    a: "Absolutely. Start with the free tier to test Blovi on your site. When you're ready for unlimited testimonials, custom branding, and extra layouts, upgrade to Lifetime.",
  },
  {
    q: "Do I receive future updates?",
    a: "Yes. Every lifetime license includes future core widget improvements, performance optimizations, and CDN speed enhancements.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. We offer a 14-day no-questions-asked refund policy. If Blovi doesn't fit your needs, email us and we'll refund you immediately.",
  },
  {
    q: "What happens if Blovi shuts down?",
    a: "Blovi runs on lightweight serverless architecture with virtually zero overhead. Your widgets and embed scripts will remain active and hosted.",
  },
  {
    q: "How do custom domains work?",
    a: "You can point your custom domain (like feedback.yourbrand.com) directly to Blovi so visitors submit testimonials natively on your site.",
  },
];

export default function PricingPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5] text-[#1A1A1A] select-none">
        <LandingNavbar />

        <main className="flex w-full flex-1 flex-col">
          
          {/* 1. HERO */}
          <section className="w-full pt-36 pb-16 px-5 md:px-10 text-center md:pt-44">
            <div className="mx-auto w-full max-w-[800px]">
              <FadeIn>
                <h1
                  className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold tracking-[-0.035em] text-[#1A1A1A] leading-[1.05]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Pay once.<br />
                  <span className="font-normal italic text-[#2563EB]" style={{ fontFamily: "var(--font-serif-accent)" }}>
                    Own your social proof forever.
                  </span>
                </h1>
                
                <p className="mx-auto mt-6 max-w-lg text-base md:text-lg text-[#6B6B6B] leading-relaxed">
                  No subscriptions. No monthly rent.<br className="hidden sm:inline" />
                  Just one lifetime payment after Blovi proves its value.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#1d4ed8] hover:translate-y-[-1px]"
                  >
                    Start Free
                  </Link>
                  <a
                    href="#pricing-cards"
                    className="inline-flex items-center justify-center rounded-xl border border-[#ECE7E0] bg-white px-7 py-3.5 text-sm font-bold text-[#1A1A1A] transition-all duration-200 hover:bg-[#1A1A1A]/5"
                  >
                    See what's included
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 2. PRICING CARDS */}
          <section id="pricing-cards" className="w-full pb-24 px-5 md:px-10">
            <div className="mx-auto grid gap-8 md:grid-cols-2 max-w-3xl items-stretch">
              
              {/* FREE CARD */}
              <FadeIn delay={0.05}>
                <div className="group relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-white p-8 shadow-sm flex flex-col justify-between h-full transition-all duration-280 hover:border-[#2563EB]/25 hover:shadow-md">
                  <div>
                    <span className="inline-flex rounded-full bg-[#FAF8F5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] border border-[#ECE7E0]">
                      Free
                    </span>
                    <div className="mt-4">
                      <span className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>$0</span>
                      <span className="text-xs text-[#8A8A8A] font-medium"> / forever</span>
                    </div>
                    <p className="mt-3 text-xs text-[#6B6B6B] leading-relaxed">
                      Perfect for collecting your first customer stories.
                    </p>

                    <div className="mt-6 border-t border-[#ECE7E0]/70 pt-6">
                      <ul className="space-y-3">
                        {["Collect testimonials", "Publish your first Wall of Love", "Learn if Blovi fits your workflow"].map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium">
                            <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0]">
                              <Check size={11} className="text-[#6B6B6B]" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#ECE7E0]/70">
                    <Link
                      href="/signup"
                      className="flex w-full items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] py-3 text-xs font-bold text-[#1A1A1A] transition-all hover:bg-[#1A1A1A]/5"
                    >
                      Start Free
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {/* LIFETIME CARD */}
              <FadeIn delay={0.1}>
                <div className="group relative overflow-hidden rounded-3xl border-2 border-[#2563EB] bg-white p-8 shadow-sm flex flex-col justify-between h-full transition-all duration-280 hover:shadow-md">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] border border-[#2563EB]/20">
                        Lifetime
                      </span>
                      <span className="text-[9px] font-bold tracking-widest text-[#2563EB] uppercase">One Time</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>$49</span>
                      <span className="text-xs text-[#8A8A8A] font-medium"> / one-time payment</span>
                    </div>
                    <p className="mt-3 text-xs text-[#6B6B6B] leading-relaxed">
                      Built for businesses ready to own their reputation.
                    </p>

                    <div className="mt-6 border-t border-[#ECE7E0]/70 pt-6">
                      <ul className="space-y-3">
                        {[
                          "Unlimited testimonials",
                          "Beautiful publishing layouts",
                          "Custom branding",
                          "Pay once.",
                          "Never pay monthly again.",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium">
                            <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200/40">
                              <Check size={11} className="text-[#2563EB]" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#ECE7E0]/70">
                    <Link
                      href="/signup"
                      className="flex w-full items-center justify-center rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#1d4ed8]"
                    >
                      Get Lifetime Access
                    </Link>
                  </div>
                </div>
              </FadeIn>

            </div>
          </section>

          {/* 3. LIFETIME SAVINGS */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[760px]">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    Lifetime Value
                  </p>
                  <h2
                    className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    One payment.<br />
                    <span className="font-normal italic text-[#2563EB]" style={{ fontFamily: "var(--font-serif-accent)" }}>
                      Years of savings.
                    </span>
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* 12 Months Comparison */}
                  <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-6">
                    <p className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider">After 12 months</p>
                    <div className="mt-4 flex items-baseline justify-between border-b border-[#ECE7E0] pb-3">
                      <span className="text-xs font-bold text-[#2563EB]">Blovi Lifetime</span>
                      <span className="text-xl font-extrabold text-[#1A1A1A]">$49</span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between text-[#8A8A8A]">
                      <span className="text-xs font-medium">Typical Subscription ($29/mo)</span>
                      <span className="text-sm font-bold line-through">$348</span>
                    </div>
                    <p className="mt-4 text-[11px] font-bold text-[#2E9E6B] bg-green-50 border border-green-200/50 rounded-lg p-2 text-center">
                      Save $299 in Year 1
                    </p>
                  </div>

                  {/* 3 Years Comparison */}
                  <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-6">
                    <p className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider">After 3 years</p>
                    <div className="mt-4 flex items-baseline justify-between border-b border-[#ECE7E0] pb-3">
                      <span className="text-xs font-bold text-[#2563EB]">Blovi Lifetime</span>
                      <span className="text-xl font-extrabold text-[#1A1A1A]">$49</span>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between text-[#8A8A8A]">
                      <span className="text-xs font-medium">Typical Subscription ($29/mo)</span>
                      <span className="text-sm font-bold line-through">$1,044</span>
                    </div>
                    <p className="mt-4 text-[11px] font-bold text-[#2E9E6B] bg-green-50 border border-green-200/50 rounded-lg p-2 text-center">
                      Save $995 over 3 Years
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 4. WHY LIFETIME? (FOUNDER SECTION) */}
          <section className="w-full border-t border-[#ECE7E0] bg-[#FAF8F5] py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[680px]">
              <FadeIn>
                <div className="rounded-3xl border border-[#ECE7E0] bg-white p-8 md:p-12 shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB] mb-3">
                    Founder's Note
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Why Blovi isn't another subscription.
                  </h2>

                  <div className="mt-6 space-y-4 text-sm md:text-base leading-relaxed text-[#4A4A4A] font-serif-accent italic">
                    <p>
                      "I don't believe customer testimonials should become another monthly bill.
                    </p>
                    <p>
                      You earned every review.
                    </p>
                    <p>
                      You should own them forever.
                    </p>
                    <p className="not-italic font-sans font-medium text-[#1A1A1A]">
                      That's why Blovi has a lifetime plan."
                    </p>
                  </div>

                  <div className="mt-8 border-t border-[#ECE7E0] pt-4 flex items-center justify-between text-xs text-[#8A8A8A]">
                    <span className="font-semibold text-[#1A1A1A]">Built for founders, by founders.</span>
                    <span>No VC pressure. No mandatory upgrades.</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 5. PHILOSOPHY COMPARISON */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[760px]">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    Principles
                  </p>
                  <h2
                    className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Built on values, not recurring bills.
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="overflow-x-auto rounded-2xl border border-[#ECE7E0]">
                  <table className="w-full min-w-[480px] border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-[#ECE7E0] bg-[#FAF8F5]">
                        <th scope="col" className="p-4 text-left font-bold text-[#1A1A1A]">
                          Philosophy
                        </th>
                        <th
                          scope="col"
                          className="border-x border-[#ECE7E0] bg-[#EFF6FF]/60 p-4 text-center font-bold text-[#2563EB]"
                        >
                          Blovi
                        </th>
                        <th scope="col" className="p-4 text-center font-medium text-[#8A8A8A]">
                          Typical SaaS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PHILOSOPHY_ROWS.map((row) => (
                        <tr key={row.feature} className="border-b border-[#ECE7E0] last:border-0">
                          <th scope="row" className="p-4 text-left font-medium text-[#1A1A1A]">
                            {row.feature}
                          </th>
                          <td className="border-x border-[#ECE7E0] bg-[#EFF6FF]/30 p-4 text-center font-bold text-[#2563EB]">
                            {row.blovi}
                          </td>
                          <td className="p-4 text-center text-[#8A8A8A] font-medium">
                            {row.saas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 6. SOCIAL PROOF */}
          <section className="w-full border-t border-[#ECE7E0] bg-[#FAF8F5] py-20 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[760px]">
              <FadeIn>
                <div className="grid gap-6 sm:grid-cols-2">
                  {REVIEWS.map((rev, idx) => (
                    <div key={idx} className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-xs flex flex-col justify-between">
                      <p className="text-xs leading-relaxed text-[#4A4A4A] italic">
                        "{rev.quote}"
                      </p>
                      <div className="mt-4 pt-3 border-t border-[#ECE7E0] flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1A1A1A]">{rev.author}</span>
                        <span className="text-[#8A8A8A]">{rev.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 7. FAQ */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[720px]">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    Objections & Clarity
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-6 border-t border-[#ECE7E0] pt-6">
                  {FAQ_OBJECTIONS.map((faq, idx) => (
                    <div key={idx} className="border-b border-[#ECE7E0] pb-6 last:border-b-0">
                      <h3 className="text-sm font-bold text-[#1A1A1A]">
                        {faq.q}
                      </h3>
                      <p className="mt-2 text-xs md:text-sm text-[#6B6B6B] leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 8. FINAL CTA */}
          <section className="w-full border-t border-[#ECE7E0] bg-[#FAF8F5] py-28 px-5 md:px-10 text-center">
            <div className="mx-auto w-full max-w-[600px]">
              <FadeIn>
                <h2
                  className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-[-0.03em] text-[#1A1A1A] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Start free.<br />
                  <span className="font-normal italic text-[#2563EB]" style={{ fontFamily: "var(--font-serif-accent)" }}>
                    Upgrade only when Blovi earns it.
                  </span>
                </h2>

                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-8 py-4 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#1d4ed8]"
                  >
                    Start Free
                  </Link>
                </div>

                <p className="mt-4 text-xs text-[#8A8A8A]">
                  No credit card required.
                </p>
              </FadeIn>
            </div>
          </section>

        </main>

        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
