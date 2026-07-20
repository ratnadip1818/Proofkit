"use client";

import { useRef } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";
import Reveal from "./Reveal";

const BARS = [
  { label: "WiserReview", price: "$9/mo", total: 324, color: "#D4CEC7" },
  { label: "Testimonial.to", price: "$25/mo", total: 900, color: "#BFBAB2" },
  { label: "Senja", price: "$29/mo", total: 1044, color: "#9C968D" },
  { label: "Blovi", price: "$49/yr", total: 147, color: "#2563EB", hero: true },
];

const MAX = 1044;

export default function CostCompare() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cost-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.12,
          transformOrigin: "left center",
          scrollTrigger: { trigger: ".cost-chart", start: "top 80%", once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAF8F5] px-5 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <Reveal>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB] md:text-xs">
            The real cost
          </p>
          <h2
            className="text-center text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stop{" "}
            <span
              className="font-normal italic text-[#2563EB]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              renting
            </span>{" "}
            your testimonials.
          </h2>
        </Reveal>

        {/* Headline numbers */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#ECE7E0] bg-white p-8 text-center md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B]">
                Senja over 3 years
              </p>
              <p
                className="mt-3 text-5xl font-extrabold tracking-tight text-[#1A1A1A] md:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $<NumberTicker value={1044} />
              </p>
              <p className="mt-2 text-sm text-[#6B6B6B]">…and still counting, every month</p>
            </div>
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#2563EB] bg-white p-8 text-center shadow-[0_24px_56px_rgba(232,116,59,0.18)] md:p-10">
              <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#2563EB] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                Best value
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
                Blovi Pro
              </p>
              <p
                className="mt-3 text-5xl font-extrabold tracking-tight text-[#1A1A1A] md:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $<NumberTicker value={147} />
              </p>
              <p className="mt-2 text-sm font-semibold text-[#2E9E6B]">
                Saves you over $890 over 3 years vs Senja
              </p>
            </div>
          </div>
        </Reveal>

        {/* 3-year bar chart */}
        <Reveal delay={0.15}>
          <div className="cost-chart mx-auto mt-12 max-w-3xl rounded-3xl border border-[#ECE7E0] bg-white p-7 md:p-10">
            <h3
              className="mb-8 text-lg font-bold text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cumulative cost over 3 years
            </h3>
            <div className="space-y-6">
              {BARS.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span
                      className={`text-sm ${
                        bar.hero ? "font-bold text-[#2563EB]" : "font-medium text-[#6B6B6B]"
                      }`}
                    >
                      {bar.label}{" "}
                      <span className="text-xs font-normal text-[#6B6B6B]">· {bar.price}</span>
                    </span>
                    <span
                      className={`shrink-0 text-sm font-bold tabular-nums ${
                        bar.hero ? "text-[#2563EB]" : "text-[#1A1A1A]"
                      }`}
                    >
                      ${bar.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-[#FAF8F5]">
                    <div
                      className="cost-bar h-full rounded-full"
                      style={{
                        width: `${Math.max((bar.total / MAX) * 100, 4.5)}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-[#6B6B6B]">
              Based on publicly listed pricing as of June 2026.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
