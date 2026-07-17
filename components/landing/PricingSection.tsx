"use client";

import React from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import Reveal from "./Reveal";

const FREE_LIMITS = [
  "Collect reviews from your custom page",
  "Publish trust on one landing page",
  "Explore widgets without commitment",
  "Beautiful Wall of Love layouts",
  "Upgrade whenever you're ready"
];

const LIFETIME_FEATURES = [
  "Never worry about monthly sub limits",
  "Fully white-labeled: zero brand ads",
  "Publish customer proof anywhere",
  "Match widgets to your exact brand styles",
  "Import existing testimonials instantly",
  "Connect your own custom Vercel DNS"
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative w-full overflow-hidden bg-[#FAF8F5] border-t border-[#1A1A1A]/5 px-5 py-28 md:px-10 md:py-36 select-none">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(11,84,216,0.015) 0%, transparent 70%)"
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
              className="text-center text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start building trust{" "}
              <span
                className="font-normal italic text-[#0b54d8]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                today
              </span>
            </h2>
            <p className="mx-auto mt-5 text-[14px] leading-relaxed text-[#6B6B6B] max-w-sm">
              From your first review to your next hundred, Blovi helps you grow.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto items-stretch">
          
          {/* Card 1: Free */}
          <Reveal delay={0.05} y={32}>
            <div className="group relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-white p-8 shadow-sm flex flex-col justify-between min-h-[520px] transition-product duration-card ease-product hover:border-[#0b54d8]/20 hover:translate-y-[-2px] hover:shadow-md">
              <div>
                <span className="inline-flex rounded-full bg-[#FAF8F5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] border border-[#ECE7E0]">
                  Free
                </span>
                <h3 className="mt-4 text-base font-bold text-[#1A1A1A] leading-tight">
                  Collect your first reviews.
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>$0</span>
                  <span className="text-xs text-[#8A8A8A] font-medium">/ forever</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#6B6B6B]">
                  Perfect for testing Blovi on a single landing page and collecting initial praise.
                </p>

                <div className="mt-6 border-t border-[#ECE7E0]/60 pt-6">
                  <ul className="space-y-3">
                    {FREE_LIMITS.map((limit) => (
                      <li key={limit} className="flex items-center gap-2.5 text-xs text-[#6B6B6B]">
                        <Lock size={12} className="shrink-0 text-[#8A8A8A]/40" />
                        <span>{limit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#ECE7E0]/60">
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] py-3 text-xs font-bold text-[#1A1A1A] transition-product duration-button ease-product hover:bg-[#1A1A1A]/5 active:scale-95"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Lifetime Starter */}
          <Reveal delay={0.1} y={32}>
            <div className="group relative overflow-hidden rounded-3xl border-2 border-[#0b54d8] bg-white p-8 shadow-sm flex flex-col justify-between min-h-[520px] transition-product duration-card ease-product hover:translate-y-[-2px] hover:shadow-md">
              <div>
                <div className="flex justify-between items-center">
                  <span className="inline-flex rounded-full bg-[#EBF3FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0b54d8] border border-[#0b54d8]/20">
                    Lifetime Starter
                  </span>
                  <span className="text-[9px] font-bold tracking-widest text-[#0b54d8] uppercase">One Time</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-[#1A1A1A] leading-tight">
                  Complete trust authority.
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>$49</span>
                  <span className="text-xs text-[#8A8A8A] font-medium">/ one-time payment</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#6B6B6B]">
                  Unlimited reviews, dynamic widgets, white-labeled domain collection page forever.
                </p>

                <div className="mt-6 border-t border-[#ECE7E0]/60 pt-6">
                  <ul className="space-y-3">
                    {LIFETIME_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-xs text-[#1A1A1A] font-medium">
                        <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-green-50 border border-green-200/30">
                          <Check size={11} className="text-[#2E9E6B]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#ECE7E0]/60 flex flex-col items-center gap-2">
                <Link
                  href="/signup"
                  className="flex w-full items-center justify-center rounded-xl bg-[#0b54d8] py-3 text-xs font-bold text-white shadow-xs transition-product duration-button ease-product hover:bg-[#0945b3] text-center"
                >
                  Get Lifetime Access
                </Link>
                <span className="text-[10px] text-[#8A8A8A] font-medium italic mt-1.5">
                  One-time purchase. No subscription fatigue.
                </span>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
