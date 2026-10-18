"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 md:pt-36 lg:pt-40 pb-20 md:pb-28">
      {/* Subtle Ambient Background Mesh */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-full max-w-[1400px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_70%)] blur-2xl" />

      <div className="mx-auto max-w-[1360px] px-4 md:px-8 relative z-10">
        
        {/* CENTERED HERO HEADER */}
        <div className="mx-auto flex max-w-[940px] flex-col items-center text-center">
          
          {/* Main Headline */}
          <h1
            className="text-balance text-[clamp(2.75rem,5.8vw,5.25rem)] font-medium leading-[1.03] tracking-[-0.055em] text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Make every good word{" "}
            <span className="font-serif-accent font-normal italic tracking-[-0.03em] text-[#2563EB]">
              do more.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-[620px] text-pretty text-[17px] leading-relaxed text-[#787774] md:text-[20px]">
            Collect the moments customers already share. Curate them into proof that makes your next customer feel certain.
          </p>

          {/* Centered CTA Buttons */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#2563EB] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-[0_12px_28px_rgba(37,99,235,0.4)]"
            >
              Start collecting proof
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </span>
            </Link>

            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#E3E0DB] bg-white px-5 py-3.5 text-[14px] font-semibold text-[#1A1A1A] shadow-xs transition hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF8F5] text-[#1A1A1A] transition group-hover:bg-[#1A1A1A] group-hover:text-white">
                <Play size={10} fill="currentColor" />
              </span>
              See how it works
            </a>
          </div>

        </div>

        {/* CENTERED SHOWCASE CANVAS CONTAINER */}
        <div className="mt-14 md:mt-20 mx-auto w-full max-w-[1240px]">
          <div className="relative w-full rounded-[32px] md:rounded-[44px] bg-[#FAF8F5] p-4 sm:p-8 md:p-12 lg:p-14 border border-[#E3E0DB] shadow-[0_25px_60px_-15px_rgba(37,99,235,0.08)] overflow-hidden">
            
            {/* Background Glow Accents */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-3/4 rounded-full bg-blue-400/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" />

            {/* FLOATING CARD 1 (Top-Left): Collection Form (Desktop) */}
            <div className="hidden lg:block absolute left-6 xl:left-10 top-14 xl:top-18 w-[260px] xl:w-[285px] rounded-2xl bg-white p-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.16)] border border-[#E3E0DB] z-20 transition-all duration-300 hover:scale-105 hover:-rotate-1 -rotate-2 cursor-pointer">
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-gray-100">
                <span className="text-[11px] font-semibold text-[#1A1A1A]">01. Collection Form</span>
                <span className="text-[10px] font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Branded link</span>
              </div>
              <div className="rounded-xl overflow-hidden bg-white">
                <Image
                  src="/images/hero-collect-form.png"
                  alt="Collection Form Preview"
                  width={500}
                  height={600}
                  quality={100}
                  unoptimized
                  priority
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>

            {/* CENTERPIECE: Main Tablet / App Browser Showcase Frame */}
            <div className="relative mx-auto max-w-[880px] rounded-2xl md:rounded-3xl bg-white border border-[#E3E0DB] shadow-[0_24px_55px_rgba(15,23,42,0.14)] overflow-hidden z-10 transition-transform duration-500 hover:scale-[1.01]">
              
              {/* Top Browser Bar */}
              <div className="bg-[#FAF8F5] px-4 py-2.5 border-b border-[#E3E0DB]/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                  <span className="text-[11px] font-medium text-[#787774] font-sans tracking-tight ml-2">
                    blovi.space/dashboard/manage
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Dashboard
                  </span>
                </div>
              </div>

              {/* Main Manage Table Screenshot */}
              <div className="relative w-full bg-white">
                <Image
                  src="/images/hero-manage-dashboard.png"
                  alt="Blovi Manage Dashboard"
                  width={1400}
                  height={900}
                  quality={100}
                  unoptimized
                  priority
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>

            {/* FLOATING CARD 2 (Bottom-Right): Wall of Love Widget (Desktop) */}
            <div className="hidden lg:block absolute right-6 xl:right-10 bottom-10 xl:bottom-12 w-[270px] xl:w-[295px] rounded-2xl bg-white p-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.16)] border border-[#E3E0DB] z-20 transition-all duration-300 hover:scale-105 hover:rotate-1 rotate-2 cursor-pointer">
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-gray-100">
                <span className="text-[11px] font-semibold text-[#1A1A1A]">03. Wall of Love Widget</span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Embed ready</span>
              </div>
              <div className="rounded-xl overflow-hidden bg-white">
                <Image
                  src="/images/hero-wall-widget.png"
                  alt="Wall of Love Preview"
                  width={500}
                  height={600}
                  quality={100}
                  unoptimized
                  priority
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>

            {/* MOBILE ONLY / TABLET ONLY: Display the two cards in clean responsive grid beneath browser frame */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 lg:hidden relative z-20">
              <div className="rounded-2xl bg-white p-3 shadow-md border border-[#E3E0DB]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-[#1A1A1A]">01. Collection Form</span>
                  <span className="text-[10px] font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">Branded link</span>
                </div>
                <Image
                  src="/images/hero-collect-form.png"
                  alt="Collection Form Preview"
                  width={500}
                  height={600}
                  quality={100}
                  unoptimized
                  className="w-full h-auto object-contain block rounded-lg"
                />
              </div>

              <div className="rounded-2xl bg-white p-3 shadow-md border border-[#E3E0DB]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-[#1A1A1A]">03. Wall of Love Widget</span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Embed ready</span>
                </div>
                <Image
                  src="/images/hero-wall-widget.png"
                  alt="Wall of Love Preview"
                  width={500}
                  height={600}
                  quality={100}
                  unoptimized
                  className="w-full h-auto object-contain block rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
