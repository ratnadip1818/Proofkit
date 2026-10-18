"use client";

import React from "react";
import Reveal from "./Reveal";

const metrics = [
  {
    kicker: "Buyer Habits",
    stat: "92%",
    title: "Look for real reviews",
    description:
      "Almost every buyer seeks out genuine customer feedback before committing to a purchase.",
  },
  {
    kicker: "Conversion Lift",
    stat: "+34%",
    title: "More completed checkouts",
    description:
      "Placing honest proof next to buy buttons removes the friction of last-minute hesitation.",
  },
  {
    kicker: "Quick Setup",
    stat: "<2 min",
    title: "Effortless to install",
    description:
      "Paste a single snippet to display an always-updated wall of love that matches your brand.",
  },
];

export default function TrustManifestoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] px-6 py-24 md:px-12 md:py-32 border-t border-[#EAE6DF] select-none">
      <div className="mx-auto w-full max-w-[1240px] relative z-10 space-y-14 md:space-y-18">
        
        {/* Editorial Headline */}
        <div className="max-w-[780px] space-y-4">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#63724E]">
              The Trust Shift
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="text-balance text-[clamp(2.4rem,4.8vw,4.25rem)] font-normal tracking-[-0.04em] leading-[1.04] text-[#141413]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Great products don&apos;t fail from bad features.
              <span
                className="font-serif-accent block font-normal italic text-[#2563EB] mt-1"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                They fail from a lack of proof.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="max-w-[560px] text-[16px] md:text-[17px] leading-relaxed text-[#6E6C68]">
              When prospective buyers see real, verified voices on your site, hesitation disappears and certainty takes over.
            </p>
          </Reveal>
        </div>

        {/* 3 Clean Minimal Metric Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric, index) => (
            <Reveal key={metric.kicker} delay={0.15 + index * 0.08}>
              <div className="flex flex-col justify-between h-full rounded-2xl border border-[#EAE6DF] bg-white p-7 md:p-9 transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#63724E]">
                    {metric.kicker}
                  </p>
                  <div
                    className="mt-6 text-5xl sm:text-6xl font-light tracking-[-0.04em] text-[#141413]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {metric.stat}
                  </div>
                </div>

                <div className="mt-8 border-t border-[#F0ECE1] pt-5">
                  <h3 className="text-[16px] md:text-[17px] font-semibold tracking-tight text-[#141413]">
                    {metric.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6E6C68]">
                    {metric.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
