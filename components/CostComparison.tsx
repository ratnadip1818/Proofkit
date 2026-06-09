"use client";

import FadeIn from "./FadeIn";

interface BarData {
  label: string;
  years: number[];
  color: string;
  isProofKit?: boolean;
}

const BARS: BarData[] = [
  {
    label: "Cheapest rival (WiserReview $9/mo)",
    years: [108, 216, 324],
    color: "#ECE7E0",
  },
  {
    label: "Average rival (Senja $29/mo)",
    years: [348, 696, 1044],
    color: "#D4CEC7",
  },
  {
    label: "Premium rival (Testimonial.to $60/mo)",
    years: [720, 1440, 2160],
    color: "#BFBAB2",
  },
  {
    label: "ProofKit — pay once",
    years: [49, 49, 49],
    color: "#E8743B",
    isProofKit: true,
  },
];

const MAX = 2160;

export default function CostComparison() {
  return (
    <section className="bg-[#FAF8F5] py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-[#E8743B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
              The real cost
            </span>
          </div>
          <h2
            className="text-center text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stop renting your testimonials.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-[#6B6B6B]">
            Most testimonial tools cost{" "}
            <strong className="text-[#1A1A1A]">$108–$960 per year</strong>.
            ProofKit is $49 — total. For life.
          </p>
        </FadeIn>

        {/* Card comparison */}
        <FadeIn delay={0.12}>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Other tools
              </p>
              <p
                className="mt-3 text-[2.5rem] font-extrabold text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $9–$80
              </p>
              <p className="mt-1 text-base text-[#6B6B6B]">per month, forever</p>
              <p className="mt-3 text-sm text-[#6B6B6B]">
                = $108–$960 per year, every year
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#E8743B] bg-white p-8 text-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#E8743B] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                Best value
              </div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#E8743B]">
                ProofKit
              </p>
              <p
                className="mt-3 text-[2.5rem] font-extrabold text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $49
              </p>
              <p className="mt-1 text-base text-[#6B6B6B]">one time, forever</p>
              <p className="mt-3 text-sm font-semibold text-[#2E9E6B]">
                Breaks even vs cheapest rival in 6 months
              </p>
            </div>
          </div>
        </FadeIn>

        {/* 3-year bar chart */}
        <FadeIn delay={0.2}>
          <div className="mt-16 rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm max-w-4xl mx-auto">
            <h3
              className="mb-8 text-center text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cumulative cost over 3 years
            </h3>

            <div className="space-y-6">
              {BARS.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <span
                      className={`text-sm font-medium ${
                        bar.isProofKit ? "text-[#E8743B] font-semibold" : "text-[#6B6B6B]"
                      }`}
                    >
                      {bar.label}
                    </span>
                    <span
                      className={`text-sm font-bold shrink-0 ${
                        bar.isProofKit ? "text-[#E8743B]" : "text-[#6B6B6B]"
                      }`}
                    >
                      ${bar.years[2].toLocaleString()} after 3 yrs
                    </span>
                  </div>
                  <div className="flex gap-1.5 h-8 items-end">
                    {bar.years.map((val, i) => (
                      <div
                        key={i}
                        className="relative flex-1 rounded-t-md transition-all duration-700"
                        style={{
                          height: `${Math.max((val / MAX) * 100, 3)}%`,
                          backgroundColor: bar.color,
                          minHeight: "6px",
                        }}
                        title={`Year ${i + 1}: $${val}`}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-[#6B6B6B] whitespace-nowrap">
                          Yr {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-[#6B6B6B]">
              Based on publicly listed pricing as of June 2026. Verify on each
              competitor&apos;s pricing page before publishing comparison claims.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
