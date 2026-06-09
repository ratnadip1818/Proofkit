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

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] py-24 px-5 md:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,116,59,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] text-center">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8743B]/30 bg-[#E8743B]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E8743B]" />
            Early access · Lifetime deal
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-[#1A1A1A] md:text-7xl"
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
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6B6B6B] md:text-xl"
        >
          ProofKit helps indie founders, agencies, and freelancers collect text
          testimonials and embed a beautiful Wall of Love — for a{" "}
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
          {/* TODO: wire up payment — currently links to free signup */}
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-full bg-[#E8743B] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Get ProofKit — $49
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
          No subscription · No per-seat fees · Pay once, yours forever
        </motion.p>

        {/* Early access note */}
        <motion.p
          {...fadeUp(0.38)}
          className="mt-4 text-sm font-medium text-[#E8743B]"
        >
          Early access — be one of our first customers
        </motion.p>

        {/* Product mockup placeholder */}
        <motion.div
          {...fadeUp(0.44)}
          className="w-full max-w-[900px] mx-auto mt-16"
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
