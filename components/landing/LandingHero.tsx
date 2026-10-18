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
          <p className="mt-6 max-w-[620px] text-pretty text-[17px] leading-relaxed text-gray-600 md:text-[20px]">
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
              className="group inline-flex items-center gap-2.5 rounded-full border border-gray-200/90 bg-white px-5 py-3.5 text-[14px] font-semibold text-gray-700 shadow-sm transition hover:border-gray-900 hover:text-gray-900"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition group-hover:bg-gray-900 group-hover:text-white">
                <Play size={10} fill="currentColor" />
              </span>
              See how it works
            </a>
          </div>

        </div>

        {/* CENTERED SHOWCASE CANVAS CONTAINER (Inspired by reference site) */}
        <div className="mt-14 md:mt-20 mx-auto w-full max-w-[1240px]">
          <div className="relative w-full rounded-[32px] md:rounded-[44px] bg-gradient-to-b from-[#FAF8F5] via-[#F4F6FB] to-[#EDF2FC] p-4 sm:p-8 md:p-12 lg:p-14 border border-gray-200/80 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.08)] overflow-hidden">
            
            {/* Background Glow Accents */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-3/4 rounded-full bg-blue-400/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" />

            {/* FLOATING CARD 1 (Top-Left): Collection Form (Desktop) */}
            <div className="hidden lg:block absolute left-6 xl:left-10 top-14 xl:top-18 w-[260px] xl:w-[285px] rounded-2xl bg-white p-2.5 shadow-[0_20px_45px_rgba(0,0,0,0.16)] border border-gray-200/80 z-20 transition-all duration-300 hover:scale-105 hover:-rotate-1 -rotate-2 cursor-pointer">
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-gray-100">
                <span className="text-[11px] font-semibold text-gray-700">01. Collection Form</span>
                <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Branded link</span>
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
            <div className="relative mx-auto max-w-[880px] rounded-2xl md:rounded-3xl bg-white border border-gray-200/90 shadow-[0_24px_55px_rgba(15,23,42,0.14)] overflow-hidden z-10 transition-transform duration-500 hover:scale-[1.01]">
              
              {/* Top Browser Bar */}
              <div className="bg-[#FAF8F5] px-4 py-2.5 border-b border-gray-200/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                  <span className="text-[11px] font-medium text-gray-500 font-sans tracking-tight ml-2">
                    blovi.space/dashboard/manage
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Dashboard
                  </span>
                </div>
              </div>

              {/* Main Screenshot: Manage Dashboard */}
              <div className="p-0.5 bg-white">
                <Image
                  src="/images/hero-manage-dashboard.png"
                  alt="Blovi Manage Dashboard"
                  width={1400}
                  height={900}
                  quality={100}
                  unoptimized
                  priority
                  className="w-full h-auto object-cover max-h-[460px] md:max-h-[520px]"
                />
              </div>
            </div>

            {/* FLOATING CARD 2 (Bottom-Right): Wall of Love Review Widget (Desktop) */}
            <div className="hidden lg:block absolute right-6 xl:right-10 bottom-8 xl:bottom-12 w-[330px] xl:w-[360px] rounded-2xl bg-white p-2.5 shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-gray-200/80 z-20 transition-all duration-300 hover:scale-105 hover:rotate-1 rotate-2 cursor-pointer">
              <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-gray-100">
                <span className="text-[11px] font-semibold text-gray-700">03. Wall of Love Widget</span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Embed ready</span>
              </div>
              <div className="rounded-xl overflow-hidden bg-white">
                <Image
                  src="/images/hero-wall-widget.png"
                  alt="Wall of Love Review Widget"
                  width={800}
                  height={600}
                  quality={100}
                  unoptimized
                  priority
                  className="w-full h-auto object-cover max-h-[220px]"
                />
              </div>
            </div>

            {/* MOBILE & TABLET COMPLEMENTARY CARDS (< 1024px) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 lg:hidden relative z-10">
              {/* Mobile Card 1: Collection Form */}
              <div className="rounded-xl bg-white p-2.5 shadow-md border border-gray-200/80 overflow-hidden">
                <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-700">01. Collection Form</span>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Collect</span>
                </div>
                <Image
                  src="/images/hero-collect-form.png"
                  alt="Collection Form"
                  width={500}
                  height={600}
                  unoptimized
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              {/* Mobile Card 2: Wall of Love */}
              <div className="rounded-xl bg-white p-2.5 shadow-md border border-gray-200/80 overflow-hidden">
                <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-700">03. Wall of Love Widget</span>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Showcase</span>
                </div>
                <Image
                  src="/images/hero-wall-widget.png"
                  alt="Wall of Love Widget"
                  width={800}
                  height={600}
                  unoptimized
                  className="w-full h-auto object-cover rounded-lg max-h-[220px]"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
