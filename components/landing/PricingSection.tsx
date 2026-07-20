"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

const FREE_OUTCOMES = [
  "Collect testimonials",
  "Publish your first Wall of Love",
  "Learn if Blovi fits your workflow",
];

const LIFETIME_OUTCOMES = [
  "Unlimited testimonials",
  "Beautiful publishing layouts",
  "Custom branding",
  "Pay once.",
  "Never pay monthly again.",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative w-full overflow-hidden bg-[#FAF8F5] border-t border-[#1A1A1A]/5 px-5 py-28 md:px-10 md:py-36 select-none">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(37,99,235,0.02) 0%, transparent 70%)"
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1100px] z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-[720px] text-center mb-20 md:mb-24">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A8A8A] md:text-[10.5px]">
              Simple Pricing
            </p>
            <h2
              className="text-center text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pay once.<br />
              <span
                className="font-normal italic text-[#2563EB]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                Own your social proof forever.
              </span>
            </h2>
            <p className="mx-auto mt-5 text-[15px] leading-relaxed text-[#6B6B6B] max-w-md">
              No subscriptions. No monthly rent.<br />
              Just one lifetime payment after Blovi proves its value.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto items-stretch">
          
          {/* Card 1: Free */}
          <Reveal delay={0.05} y={32}>
            <div className="group relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-white p-8 shadow-sm flex flex-col justify-between h-full min-h-[480px] transition-product duration-card ease-product hover:border-[#2563EB]/30 hover:shadow-md">
              <div>
                <span className="inline-flex rounded-full bg-[#FAF8F5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] border border-[#ECE7E0]">
                  Free
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>$0</span>
                  <span className="text-xs text-[#8A8A8A] font-medium">/ forever</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#6B6B6B]">
                  Perfect for collecting your first customer stories.
                </p>

                <div className="mt-6 border-t border-[#ECE7E0]/60 pt-6">
                  <ul className="space-y-3">
                    {FREE_OUTCOMES.map((item) => (
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

              <div className="mt-8 pt-6 border-t border-[#ECE7E0]/60">
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] py-3 text-xs font-bold text-[#1A1A1A] transition-product duration-button ease-product hover:bg-[#1A1A1A]/5"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Lifetime */}
          <Reveal delay={0.1} y={32}>
            <div className="group relative overflow-hidden rounded-3xl border-2 border-[#2563EB] bg-white p-8 shadow-sm flex flex-col justify-between h-full min-h-[480px] transition-product duration-card ease-product hover:shadow-md">
              <div>
                <div className="flex justify-between items-center">
                  <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] border border-[#2563EB]/20">
                    Lifetime
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-[#2563EB] uppercase">One Time</span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>$49</span>
                  <span className="text-xs text-[#8A8A8A] font-medium">/ one-time payment</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#6B6B6B]">
                  Built for businesses ready to own their reputation.
                </p>

                <div className="mt-6 border-t border-[#ECE7E0]/60 pt-6">
                  <ul className="space-y-3">
                    {LIFETIME_OUTCOMES.map((item) => (
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

              <div className="mt-8 pt-6 border-t border-[#ECE7E0]/60">
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-xs transition-product duration-button ease-product hover:bg-[#1d4ed8]"
                >
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
