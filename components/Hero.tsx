"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

const SIDEBAR_LINKS = [
  "Dashboard",
  "Testimonials",
  "Forms",
  "Widgets",
  "Import",
  "Settings",
];

const STATS = [
  { label: "Total", value: "12" },
  { label: "Pending", value: "1" },
  { label: "Approved", value: "10" },
  { label: "Hidden", value: "1" },
];

const ROWS = [
  {
    name: "Maria K.",
    role: "Founder, Lume",
    body: "I love this app — it saved me so much time. Highly recommend!",
    improved: true,
  },
  {
    name: "Devon R.",
    role: "Freelance designer",
    body: "Set up the wall on my site in five minutes. Looks great.",
    improved: false,
  },
  {
    name: "Priya S.",
    role: "Agency owner",
    body: "Finally a testimonial tool I don't have to pay for every month.",
    improved: false,
  },
];

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
            <span aria-hidden="true">✦</span>
            Lifetime deal — pay once, own it forever
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-[#1A1A1A] md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The testimonial tool that{" "}
          <span className="text-[#E8743B]">polishes itself</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          {...fadeUp(0.18)}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#6B6B6B] md:text-xl"
        >
          Collect text testimonials, improve them with AI in one click, and
          embed a beautiful Wall of Love on your site — for a{" "}
          <strong className="font-semibold text-[#1A1A1A]">
            single $49 payment
          </strong>
          . Not $29 every month, forever.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.26)}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {/* TODO: replace with Paddle checkout URL */}
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-full bg-[#E8743B] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Get Blovi for $49
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
        <motion.p {...fadeUp(0.32)} className="mt-5 text-sm text-[#6B6B6B]">
          No subscription · No per-seat fees · Pay once, yours forever
        </motion.p>

        {/* Product mockup — dashboard UI (HTML/CSS only) */}
        <motion.div
          {...fadeUp(0.4)}
          className="w-full max-w-[920px] mx-auto mt-16"
        >
          <div className="overflow-hidden rounded-2xl border border-[#ECE7E0] bg-white shadow-xl text-left">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[#ECE7E0] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="ml-2 truncate rounded-full bg-[#FAF8F5] px-3 py-1 text-[11px] text-[#6B6B6B]">
                blovi.space/dashboard
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="hidden w-40 shrink-0 flex-col gap-1 border-r border-[#ECE7E0] p-4 sm:flex">
                {SIDEBAR_LINKS.map((link, i) => (
                  <div
                    key={link}
                    className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      i === 0
                        ? "bg-[#E8743B]/10 text-[#E8743B]"
                        : "text-[#6B6B6B]"
                    }`}
                  >
                    {link}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-4 sm:p-5">
                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-2">
                  {STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] px-2 py-2.5 text-center sm:px-3"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#6B6B6B] sm:text-xs">
                        {s.label}
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[#E8743B] sm:text-xl">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Testimonial rows */}
                <div className="mt-3 space-y-2">
                  {ROWS.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-start gap-3 rounded-xl border border-[#ECE7E0] p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4EE] text-xs font-bold text-[#E8743B]">
                        {row.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[#1A1A1A]">
                            {row.name}
                          </span>
                          <span className="text-[11px] text-[#6B6B6B]">
                            {row.role}
                          </span>
                          <span className="flex gap-0.5">
                            {[...Array(5)].map((_, s) => (
                              <span
                                key={s}
                                className="text-[10px] text-[#E8743B]"
                              >
                                ★
                              </span>
                            ))}
                          </span>
                          {row.improved && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8743B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#E8743B]">
                              <Sparkles size={10} />
                              AI improved
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-[#6B6B6B]">
                          {row.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs font-medium text-[#6B6B6B]">
            Your Blovi dashboard
          </p>
        </motion.div>
      </div>
    </section>
  );
}
