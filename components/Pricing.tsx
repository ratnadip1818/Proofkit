import { Check } from "lucide-react";
import FadeIn from "./FadeIn";
import PaddleCheckout from "./PaddleCheckout";

const FEATURES = [
  "Unlimited text testimonials",
  "AI-powered improvement button",
  "Wall of Love embed widget",
  "Carousel, Marquee & Single Quote widgets",
  "Shareable collection form",
  "Form customization (colors, headline, prompt)",
  "CSV import",
  "Email notifications",
  "Lifetime access — pay once",
  "All future updates included",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full py-24 px-5 md:px-10"
      style={{ backgroundColor: "#16161D" }}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#E8743B] mb-4">
            Pricing
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One price. Everything included.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#9CA3AF]">
            No tiers, no asterisks, no usage caps. Pay once — own it forever.
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mx-auto mt-12 max-w-lg rounded-2xl bg-white p-10 shadow-2xl">
            {/* Price */}
            <div className="text-center">
              <div className="mb-3 inline-block rounded-full bg-[#E8743B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
                Lifetime deal
              </div>
              <div className="flex items-start justify-center gap-1">
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
              <p className="mt-1 text-lg font-semibold text-[#6B6B6B]">
                one-time payment
              </p>
              <p className="mt-1 text-sm text-[#2E9E6B] font-medium">
                vs $300–$350/year with competitors
              </p>
            </div>

            {/* What's included */}
            <ul className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                  <Check size={16} className="shrink-0 text-[#2E9E6B]" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <PaddleCheckout className="mt-7 flex w-full items-center justify-center rounded-full bg-[#E8743B] py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95">
              Get Blovi — $49
            </PaddleCheckout>

            <p className="mt-3 text-center text-xs text-[#6B6B6B]">
              30-day money-back guarantee
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
