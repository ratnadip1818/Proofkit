"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

export default function TrustManifestoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] px-4 py-24 md:px-8 md:py-36 border-y border-gray-200/60 select-none">
      {/* Subtle Background Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.03)_0%,transparent_70%)]" />

      <div className="mx-auto w-full max-w-[1150px] relative z-10 space-y-24 md:space-y-32">
        
        {/* ========================================================================= */}
        {/* PART 1: ELEGANT EDITORIAL HEADLINE */}
        {/* ========================================================================= */}
        <div className="max-w-[820px] mx-auto text-center space-y-6">
          <Reveal>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2563EB]">
              The Trust Shift
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="text-[clamp(2.4rem,4.8vw,4.25rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[#173b71]"
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
            <p className="max-w-[580px] mx-auto text-base md:text-lg leading-relaxed text-[#587091]">
              When prospective buyers see real, verified voices on your site, hesitation disappears and certainty takes over in seconds.
            </p>
          </Reveal>
        </div>


        {/* ========================================================================= */}
        {/* PART 2: 3 HIGH-IMPACT TYPOGRAPHIC CARDS (Senja-Style High Contrast) */}
        {/* ========================================================================= */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1 */}
          <Reveal delay={0.15}>
            <div className="flex flex-col justify-between h-full rounded-[28px] border border-gray-200/90 bg-white p-7 md:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:border-blue-300 transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="font-serif-accent text-[15px] italic text-[#2563EB]"
                    style={{ fontFamily: "var(--font-serif-accent)" }}
                  >
                    Buyer Behavior
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <div
                  className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.05em] text-[#173b71]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  92%
                </div>

                <p className="text-sm md:text-[15px] leading-relaxed text-slate-600 font-medium">
                  <strong className="text-slate-900 font-bold">of buyers check authentic customer reviews &amp; ratings</strong> before making any online purchase decision.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Card 2 - Featured Gradient Card */}
          <Reveal delay={0.2}>
            <div className="relative flex flex-col justify-between h-full rounded-[28px] border border-blue-600 bg-gradient-to-b from-[#2563EB] to-[#1d4ed8] p-7 md:p-8 text-white shadow-[0_20px_50px_rgba(37,99,235,0.22)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.3)] transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="font-serif-accent text-[15px] italic text-blue-100"
                    style={{ fontFamily: "var(--font-serif-accent)" }}
                  >
                    Conversion Impact
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
                    <TrendingUp size={18} />
                  </div>
                </div>

                <div
                  className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.05em] text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  +34%
                </div>

                <p className="text-sm md:text-[15px] leading-relaxed text-blue-100 font-medium">
                  <strong className="text-white font-bold">average sales conversion lift</strong> when verified customer proof is displayed directly near buy buttons.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Card 3 */}
          <Reveal delay={0.25}>
            <div className="flex flex-col justify-between h-full rounded-[28px] border border-gray-200/90 bg-white p-7 md:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:border-blue-300 transition duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="font-serif-accent text-[15px] italic text-[#2563EB]"
                    style={{ fontFamily: "var(--font-serif-accent)" }}
                  >
                    Instant Setup
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                    <Zap size={18} />
                  </div>
                </div>

                <div
                  className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.05em] text-[#173b71]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  &lt;2 min
                </div>

                <p className="text-sm md:text-[15px] leading-relaxed text-slate-600 font-medium">
                  <strong className="text-slate-900 font-bold">to collect, manage, and showcase</strong> customer proof on your site.
                </p>
              </div>
            </div>
          </Reveal>

        </div>


        {/* ========================================================================= */}
        {/* PART 3: THE FOUNDER'S MANIFESTO (With Ratnadip's Portrait) */}
        {/* ========================================================================= */}
        <Reveal delay={0.28}>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            
            {/* Background Decorative Accent */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-50/80 blur-2xl" />

            <div className="relative z-10 grid gap-8 md:grid-cols-[auto_1fr] items-center">
              
              {/* Founder Headshot Image */}
              <div className="flex flex-col items-center text-center shrink-0">
                <div className="relative h-28 w-28 md:h-36 md:w-36 overflow-hidden rounded-full border-4 border-white shadow-xl ring-2 ring-blue-500/20">
                  <Image
                    src="/images/founder-ratnadip.png"
                    alt="Ratnadip Ubale - Founder of Blovi"
                    width={180}
                    height={180}
                    quality={100}
                    unoptimized
                    priority
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                
                <div className="mt-3.5 space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">Ratnadip Ubale</h4>
                  <p className="text-[11px] font-semibold text-[#2563EB]">Founder &amp; Creator of Blovi</p>
                </div>
              </div>

              {/* Founder Manifesto Quote */}
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <span>FOUNDER&apos;S NOTE</span>
                </div>

                <blockquote className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-slate-800 italic">
                  &ldquo;Your best customers already love your product. They say it in DMs, in emails, and on social media. But none of that praise is on the one page that matters most: your website. I built Blovi so every founder can turn authentic feedback into their highest-converting asset in under 2 minutes.&rdquo;
                </blockquote>

                <div className="pt-2 flex justify-end border-t border-slate-100">
                  <a
                    href="https://www.linkedin.com/in/ratnadip-ubale-27273b417/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <span>Connect with me on LinkedIn</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
}
