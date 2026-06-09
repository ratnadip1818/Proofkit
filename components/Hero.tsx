"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

// TODO: Replace with real avatar images of customers
const AVATARS = [
  { initials: "JM", bg: "#E8743B" },
  { initials: "SR", bg: "#2E9E6B" },
  { initials: "AL", bg: "#6B6B6B" },
  { initials: "TK", bg: "#16161D" },
  { initials: "RP", bg: "#CF5F2C" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FAF8F5] px-6 pt-24 pb-20">
      {/* Subtle radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,116,59,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8743B]/30 bg-[#E8743B]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E8743B]" />
            Lifetime deal · Limited
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-6 text-[clamp(2.75rem,7vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Collect testimonials.
          <br />
          Pay once.{" "}
          <span className="text-[#E8743B]">Keep them forever.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          {...fadeUp(0.18)}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6B6B6B]"
        >
          ProofKit helps indie founders, agencies, and freelancers collect text
          &amp; video testimonials and embed a beautiful Wall of Love — for a{" "}
          <strong className="font-semibold text-[#1A1A1A]">
            single $49 payment
          </strong>
          , not another monthly subscription.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.26)}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-full bg-[#E8743B] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Get ProofKit — $49 once
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 rounded-full border border-[#ECE7E0] bg-white px-8 py-4 text-base font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A]/20 hover:bg-[#FAF8F5] hover:scale-105"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          {...fadeUp(0.32)}
          className="mt-5 text-sm text-[#6B6B6B]"
        >
          No subscription · No per-seat fees · 30-day money-back guarantee
        </motion.p>

        {/* Avatar row + count */}
        <motion.div
          {...fadeUp(0.38)}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {AVATARS.map((a) => (
              <div
                key={a.initials}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#FAF8F5] text-[10px] font-bold text-white"
                style={{ backgroundColor: a.bg }}
                aria-hidden="true"
              >
                {a.initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-[#6B6B6B]">
            {/* TODO: Replace with real customer count */}
            Join <strong className="text-[#1A1A1A]">1,200+ founders</strong> already using ProofKit
          </p>
        </motion.div>

        {/* Product mockup placeholder */}
        <motion.div
          {...fadeUp(0.44)}
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="ml-3 h-5 w-48 rounded-full bg-[#FAF8F5]" />
            </div>
            {/* TODO: Replace with real product screenshot */}
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] p-4"
                >
                  <div className="mb-2 flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-[10px] text-[#E8743B]">
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${75 + (i * 7) % 25}%` }} />
                    <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${55 + (i * 11) % 35}%` }} />
                    <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${65 + (i * 5) % 20}%` }} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#ECE7E0]" />
                    <div className="h-2 w-16 rounded bg-[#ECE7E0]" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs font-medium text-[#6B6B6B]">
              Wall of Love preview
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
