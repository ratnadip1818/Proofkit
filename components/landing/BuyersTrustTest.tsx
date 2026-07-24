"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  MousePointerClick,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
  TrendingUp,
  Award
} from "lucide-react";
import Reveal from "./Reveal";

export default function BuyersTrustTest() {
  const [selectedCard, setSelectedCard] = useState<"A" | "B" | null>(null);
  const [activeStep, setActiveStep] = useState<"test" | "insights" | "transform">("test");
  const [bloviActive, setBloviActive] = useState(false);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);

  const handleSelectCard = (choice: "A" | "B") => {
    setSelectedCard(choice);
    if (activeStep === "test") {
      setTimeout(() => {
        setActiveStep("insights");
      }, 600);
    }
  };

  const handleReset = () => {
    setSelectedCard(null);
    setActiveStep("test");
    setBloviActive(false);
  };

  return (
    <section id="trust-test" className="relative w-full overflow-hidden bg-[#faf8f5] px-4 py-20 md:px-8 md:py-32 border-y border-gray-200/60 select-none">
      {/* Decorative Subtle Ambient Glow */}
      <div className="pointer-events-none absolute right-[-10rem] top-12 h-[32rem] w-[32rem] rounded-full bg-blue-100/60 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute left-[-10rem] bottom-12 h-[32rem] w-[32rem] rounded-full bg-amber-100/50 opacity-40 blur-3xl" />

      <div className="mx-auto w-full max-w-[1180px] relative z-10">
        
        {/* Section Header */}
        <div className="max-w-[720px] mb-12 md:mb-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-[11px] font-bold text-[#2563EB] mb-4">
              <Sparkles size={13} className="text-[#2563EB]" />
              <span>THE BUYER&apos;S PSYCHOLOGY EXPERIMENT</span>
            </div>
            <h2
              className="text-balance text-[clamp(2.4rem,4.8vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-[#173b71]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Don&apos;t take our word for it.
              <span
                className="font-serif-accent block font-normal italic text-[#2563EB]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                Experience how trust works yourself.
              </span>
            </h2>
            <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-[#587091] md:text-[17px]">
              We won&apos;t pitch you feature lists. Put yourself in a real buyer&apos;s shoes for 10 seconds and test your own buying instinct.
            </p>
          </Reveal>
        </div>

        {/* STEP 1: Side-by-Side Product Choice */}
        <div className="space-y-12">
          
          {/* Phase 1 Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-2xs">
                1
              </span>
              <h3 className="text-lg font-bold text-[#173b71]">
                Which product page would you buy from?
              </h3>
            </div>
            {selectedCard && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-blue-800 transition cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw size={13} />
                <span>Reset Experiment</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* CARD A: Zero Social Proof */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => handleSelectCard("A")}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 md:p-8 transition-all cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.04)] ${
                selectedCard === "A"
                  ? "border-amber-400 ring-2 ring-amber-400/30"
                  : "border-gray-200/90 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                  Option A — Standard Product Card
                </span>
                {selectedCard === "A" && (
                  <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-bold text-amber-800">
                    Your Choice
                  </span>
                )}
              </div>

              {/* Card Main Body */}
              <div className="space-y-4 py-2">
                <div className="h-44 w-full rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent" />
                  <span className="text-xs font-bold text-slate-500 tracking-tight">SaaS Productivity Suite</span>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900">TaskFlow Pro</h4>
                  <p className="text-xs text-slate-500 mt-1">Organize your workspace and boost team velocity effortlessly.</p>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-slate-900">$49</span>
                  <span className="text-xs text-slate-400 font-medium">/ lifetime access</span>
                </div>

                {/* Plain Button */}
                <div className="pt-2">
                  <button className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs">
                    Get TaskFlow Pro
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-[11px] text-gray-400 italic">
                Clean design, clear copy — but zero verified buyer proof.
              </div>
            </motion.div>

            {/* CARD B: With Blovi Social Proof */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => handleSelectCard("B")}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 md:p-8 transition-all cursor-pointer shadow-[0_16px_40px_rgba(37,99,235,0.08)] ${
                selectedCard === "B"
                  ? "border-[#2563EB] ring-4 ring-blue-500/20 bg-gradient-to-b from-blue-50/20 to-white"
                  : "border-blue-200/80 hover:border-blue-400"
              }`}
            >
              {/* Badge Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                  <Sparkles size={12} /> Option B — With Blovi Social Proof
                </span>
                {selectedCard === "B" ? (
                  <span className="rounded-full bg-[#2563EB] px-3 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                    Chosen by 87% of Buyers
                  </span>
                ) : (
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                    Click to Test
                  </span>
                )}
              </div>

              {/* Card Main Body */}
              <div className="space-y-4 py-2">
                <div className="h-44 w-full rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 to-transparent" />
                  <span className="text-xs font-bold text-slate-500 tracking-tight">SaaS Productivity Suite</span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">TaskFlow Pro</h4>
                    <p className="text-xs text-slate-500 mt-1">Organize your workspace and boost team velocity effortlessly.</p>
                  </div>
                </div>

                {/* ⭐ Micro Social Proof Bar */}
                <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-100/80 px-3 py-2 rounded-xl">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">5.0 / 5.0</span>
                  <span className="text-[11px] text-slate-500">• 140+ Verified Buyers</span>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-bold text-slate-900">$49</span>
                  <span className="text-xs text-slate-400 font-medium">/ lifetime access</span>
                </div>

                {/* High Trust Button with Verified Badge */}
                <div className="pt-2">
                  <button className="w-full rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <span>Get TaskFlow Pro</span>
                    <ShieldCheck size={15} />
                  </button>
                </div>
              </div>

              {/* Verified Buyer Testimonial Micro Card */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  AK
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-800 leading-snug">
                    &ldquo;Saved our team 10+ hours a week. Best purchase this year!&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Alex K. — Verified Founder</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* REVEAL BOX (Triggers when user selects B or A) */}
          <AnimatePresence>
            {selectedCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-[640px]">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={16} />
                      <span>Psychological Insight Unlocked</span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold tracking-tight">
                      You chose Option B — and so does 87% of online shoppers.
                    </h4>
                    <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed">
                      The product price didn&apos;t change. The features didn&apos;t change. <span className="font-semibold text-white">The proof changed.</span> When buyers see real, verified voices, certainty replaces doubt in seconds.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveStep("transform")}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-xs font-bold text-[#2563EB] shadow-md hover:bg-blue-50 transition cursor-pointer shrink-0"
                  >
                    <span>See Blovi In Action On Your Site</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 2: Interactive Mock Website & Live Blovi Toggle */}
          <div className="pt-8 space-y-6">
            
            {/* Step 2 Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-2xs">
                  2
                </span>
                <h3 className="text-lg font-bold text-[#173b71]">
                  Now watch Blovi eliminate trust gaps on your website in 1 click
                </h3>
              </div>

              {/* Master Blovi Toggle Switch */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-2xs self-start sm:self-auto">
                <span className="text-xs font-bold text-slate-800">Show Website with Blovi:</span>
                <button
                  type="button"
                  onClick={() => setBloviActive(!bloviActive)}
                  className={`relative inline-flex h-6 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    bloviActive ? "bg-[#2563EB]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                      bloviActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-[10px] font-extrabold uppercase tracking-wide ${bloviActive ? "text-[#2563EB]" : "text-slate-400"}`}>
                  {bloviActive ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Interactive Browser Canvas Mockup */}
            <div className="overflow-hidden rounded-3xl border border-slate-300/80 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
              
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="w-56 truncate rounded-lg border border-slate-200 bg-white px-4 py-1 text-center font-sans text-[11px] font-medium text-slate-400 select-all">
                  https://yourbrand.com
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Mockup Preview
                </div>
              </div>

              {/* Mock Page Content Canvas */}
              <div className="p-6 md:p-10 space-y-12 bg-[#faf9f6]">
                
                {/* HERO AREA MOCK */}
                <div className="space-y-6 max-w-2xl mx-auto text-center relative py-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100/80 text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">
                    Your Product Headline
                  </span>

                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Turn your visitors into loyal, paying customers.
                  </h3>

                  <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
                    The simplest way to showcase verified customer proof and convert traffic into sales automatically.
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button className="rounded-xl bg-[#2563EB] px-6 py-3 text-xs font-bold text-white shadow-md">
                      Start Your Free Trial
                    </button>
                  </div>

                  {/* TRUST GAP 1 / BLOVI WIDGET 1 (Near CTA) */}
                  <div className="pt-2">
                    {bloviActive ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 rounded-2xl border border-blue-200/90 bg-white px-4 py-2.5 shadow-sm"
                      >
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          &ldquo;Best decision for our growth!&rdquo;
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">— Sarah M.</span>
                      </motion.div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-red-300 bg-red-50/60 px-4 py-2 text-[11px] font-semibold text-red-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span>Trust Gap #1: No verified customer quote near primary CTA button</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* WALL OF LOVE MOCK / BLOVI WIDGET 2 */}
                <div className="border-t border-slate-200/70 pt-8">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-slate-900">What Our Users Say</h4>
                    <p className="text-xs text-slate-500 mt-1">Real feedback from real teams.</p>
                  </div>

                  {bloviActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="grid gap-4 md:grid-cols-3"
                    >
                      {[
                        {
                          quote: "Set up in 2 minutes. Our conversion rate increased by 22% in the first week!",
                          author: "David R.",
                          role: "SaaS Founder"
                        },
                        {
                          quote: "The clean Wall of Love looks like it was built by our own design team.",
                          author: "Priya S.",
                          role: "Agency Owner"
                        },
                        {
                          quote: "Finally a social proof tool that doesn't charge ridiculous monthly limits.",
                          author: "Marcus T.",
                          role: "Indie Creator"
                        }
                      ].map((card, idx) => (
                        <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            &ldquo;{card.quote}&rdquo;
                          </p>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="font-bold text-slate-900">{card.author}</span>
                            <span className="text-slate-400">{card.role}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-red-300 bg-red-50/60 p-6 text-center space-y-2">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span>Trust Gap #2 &amp; #3: No Wall of Love &amp; No Verified Buyer Badges</span>
                      </div>
                      <p className="text-xs text-red-500/90 max-w-md mx-auto">
                        Toggle <span className="font-bold text-red-700">&ldquo;Show Website with Blovi: ON&rdquo;</span> above to see Blovi automatically fill your site with verified proof.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Bottom Summary CTA */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-white border border-gray-200 p-6 md:p-8 shadow-xs">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-slate-900">
                  Ready to eliminate trust gaps on your website?
                </h4>
                <p className="text-xs text-slate-500">
                  1-minute setup • 1 code snippet • Zero website speed impact.
                </p>
              </div>

              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 rounded-full bg-[#2563EB] px-7 py-3.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer shrink-0"
              >
                <span>Start Building Trust Free</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
