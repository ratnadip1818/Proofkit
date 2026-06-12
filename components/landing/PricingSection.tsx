import Link from "next/link";
import { Check } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import Reveal from "./Reveal";

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

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="grain relative w-full overflow-hidden bg-[#16161D] px-5 py-28 md:px-10 md:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 75% 50%, rgba(232,116,59,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-[1100px] items-start gap-12 lg:grid-cols-[1fr_460px] lg:gap-20">
        {/* Sticky intro (desktop) */}
        <div className="lg:sticky lg:top-32">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8743B] md:text-xs">
              Pricing
            </p>
            <h2
              className="text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              One price.{" "}
              <span
                className="font-normal italic text-[#E8743B]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                Everything included.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#9CA3AF] md:text-lg">
              Start free with up to 3 testimonials. When you&apos;re ready, pay
              $49 exactly once and own everything forever — while competitors
              charge $29 every month.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm text-[#9CA3AF]">
              <span>✓ 30-day money-back guarantee</span>
              <span>✓ Works on unlimited websites</span>
              <span>✓ Secure checkout via Paddle</span>
            </div>
          </Reveal>
        </div>

        {/* Price card */}
        <Reveal delay={0.1} y={56}>
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_48px_120px_-24px_rgba(232,116,59,0.4)] md:p-10">
            <BorderBeam duration={7} />

            <div className="text-center">
              <div className="mb-4 inline-block rounded-full bg-[#E8743B]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8743B]">
                ✦ Lifetime deal
              </div>
              <div className="flex items-start justify-center gap-1">
                <span
                  className="mt-3 text-2xl font-bold text-[#6B6B6B]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  $
                </span>
                <span
                  className="text-[5.5rem] font-extrabold leading-none tracking-tight text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  49
                </span>
              </div>
              <p className="mt-2 text-base font-semibold text-[#6B6B6B]">one-time payment</p>
              <p className="mt-1 text-sm font-medium text-[#2E9E6B]">
                vs $300–$350/year with competitors
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                  <Check size={16} className="shrink-0 text-[#2E9E6B]" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="mt-8 flex w-full items-center justify-center rounded-full bg-[#E8743B] py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(232,116,59,0.4)] transition-all hover:scale-[1.02] hover:bg-[#CF5F2C] active:scale-95"
            >
              Get Blovi — $49
            </Link>

            <p className="mt-4 text-center text-xs text-[#6B6B6B]">
              30-day money-back guarantee · Secure checkout via Paddle
            </p>

            <p className="mt-5 border-t border-[#ECE7E0] pt-4 text-center text-sm text-[#6B6B6B]">
              Just exploring?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#E8743B] hover:underline"
              >
                Start free
              </Link>{" "}
              — up to 3 testimonials, Wall of Love widget, Blovi branding.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
