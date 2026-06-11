import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import PricingFAQ from "@/components/PricingFAQ";

export const metadata = {
  title: "Pricing — Blovi",
};

const FEATURES = [
  "Unlimited text testimonials",
  "AI-powered improvement button",
  "Wall of Love embed widget",
  "Carousel, Marquee & Single Quote widgets",
  "Shareable collection form",
  "Form customization (colors, headline, prompt)",
  "CSV import",
  "Email notifications on new submissions",
  "Multiple forms",
  "Lifetime access — pay once",
  "All future updates included",
];

type CellValue = boolean | string;

const COMPARISON_ROWS: { feature: string; blovi: CellValue; senja: CellValue }[] = [
  { feature: "Price", blovi: "$49 once", senja: "$29/month" },
  { feature: "Text testimonials", blovi: true, senja: true },
  { feature: "AI improvement", blovi: true, senja: false },
  { feature: "Wall of Love widget", blovi: true, senja: true },
  { feature: "Multiple widget styles", blovi: true, senja: true },
  { feature: "Collection form", blovi: true, senja: true },
  { feature: "Email notifications", blovi: true, senja: true },
  { feature: "CSV import", blovi: true, senja: true },
  { feature: "Lifetime deal", blovi: true, senja: false },
  { feature: "Monthly fee", blovi: "None", senja: "$29/month forever" },
];

const FAQS = [
  {
    q: "Is this really a one-time payment?",
    a: "Yes. Pay $49 once, use Blovi forever. No renewal, no hidden fees.",
  },
  {
    q: "What does lifetime mean?",
    a: "You get access for the lifetime of Blovi. If we ever shut down, we'll give 6 months notice.",
  },
  {
    q: "Is there a free trial?",
    a: "No free trial, but we offer a 30-day money-back guarantee. Not happy? Full refund.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major credit and debit cards via Paddle. Secure checkout.",
  },
  {
    q: "Can I use this on multiple websites?",
    a: "Yes. One account, unlimited websites.",
  },
  {
    q: "Do you have video testimonials?",
    a: "Not yet. Text testimonials with photos supported now. Video is on the roadmap.",
  },
  {
    q: "What makes Blovi different from Senja?",
    a: "AI improvement button Senja doesn't have. And $49 once vs $29/month forever.",
  },
  {
    q: "How do I get support?",
    a: "Email hello@blovi.space — we reply within 24 hours.",
  },
];

function ComparisonCell({ value, accent }: { value: CellValue; accent?: boolean }) {
  if (typeof value === "string") {
    return (
      <span className={`font-semibold ${accent ? "text-[#E8743B]" : "text-[#6B6B6B]"}`}>
        {value}
      </span>
    );
  }
  return value ? (
    <Check size={18} className="mx-auto text-[#2E9E6B]" strokeWidth={2.5} aria-label="Yes" />
  ) : (
    <X size={18} className="mx-auto text-[#9CA3AF]" strokeWidth={2.5} aria-label="No" />
  );
}

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="w-full overflow-x-hidden flex flex-col flex-1 bg-[#FAF8F5]">
        {/* HERO */}
        <section className="w-full pt-20 pb-12 px-5 md:px-10 text-center">
          <div className="mx-auto w-full max-w-[1200px]">
            <FadeIn>
              <h1
                className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Simple, honest pricing
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg text-[#6B6B6B]">
                One plan. Everything included. No surprises.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* PRICING CARD */}
        <section className="w-full pb-24 px-5 md:px-10">
          <div className="mx-auto w-full max-w-lg">
            <FadeIn delay={0.08}>
              <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm sm:p-10">
                <div className="text-center">
                  <span className="inline-block rounded-full bg-[#E8743B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
                    Lifetime deal
                  </span>
                  <div className="mt-4 flex items-start justify-center gap-1">
                    <span
                      className="mt-3 text-2xl font-bold text-[#6B6B6B]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      $
                    </span>
                    <span
                      className="text-[5rem] font-extrabold leading-none text-[#1A1A1A]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      49
                    </span>
                  </div>
                  <p className="mt-2 text-base text-[#6B6B6B]">
                    one-time payment — yours forever
                  </p>
                </div>

                <div className="my-8 border-t border-[#ECE7E0]" />

                <ul className="space-y-3">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                      <Check size={16} className="shrink-0 text-[#2E9E6B]" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* TODO: replace with Paddle checkout URL */}
                <Link
                  href="/signup"
                  className="mt-8 flex w-full items-center justify-center rounded-full bg-[#E8743B] py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Get Blovi — $49
                </Link>

                <p className="mt-4 text-center text-sm text-[#6B6B6B]">
                  30-day money-back guarantee · No questions asked
                </p>
                <p className="mt-2 text-center text-xs text-[#9CA3AF]">
                  Secure payment via Paddle
                </p>
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
                        Blovi ($49 once)
                      </th>
                      <th scope="col" className="p-4 text-center font-semibold text-[#6B6B6B]">
                        Senja ($29/mo)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row) => (
                      <tr key={row.feature} className="border-b border-[#ECE7E0] last:border-0">
                        <th scope="row" className="p-4 text-left font-medium text-[#1A1A1A]">
                          {row.feature}
                        </th>
                        <td className="border-x-2 border-[#E8743B] bg-[#E8743B]/5 p-4 text-center">
                          <ComparisonCell value={row.blovi} accent />
                        </td>
                        <td className="p-4 text-center">
                          <ComparisonCell value={row.senja} />
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
        <section className="w-full py-24 px-5 md:px-10">
          <div className="mx-auto w-full max-w-[800px]">
            <FadeIn>
              <h2
                className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A] mb-12"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Common questions
              </h2>
            </FadeIn>
            <FadeIn delay={0.08}>
              <PricingFAQ items={FAQS} />
            </FadeIn>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <FadeIn>
              <h2
                className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to stop paying monthly?
              </h2>
              <div className="mt-8">
                {/* TODO: replace with Paddle checkout URL */}
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#E8743B] px-10 py-5 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Get Blovi for $49
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
