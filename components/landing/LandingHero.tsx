"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Play, Check, Star } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 md:pt-36 lg:pt-40 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center justify-center gap-8 lg:gap-12 min-h-[620px]">
          
          {/* LEFT SIDE — White Background */}
          <div className="lg:col-span-6 bg-white px-4 py-8 md:px-8 lg:px-12 flex flex-col justify-center z-10">
            
            {/* Headline */}
            <h1
              className="text-balance text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.05em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Make every good word
              <span className="block font-serif-accent font-normal italic tracking-[-0.03em] text-[#2563EB]">
                do more.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-[500px] text-pretty text-[16px] leading-relaxed text-gray-600 md:text-[18px]">
              Collect the moments customers already share. Curate them into proof that makes your next customer feel certain.
            </p>

            {/* 3 Creative Bullets */}
            <div className="mt-8 flex flex-col gap-3.5">
              {[
                "Collect testimonials",
                "Manage them",
                "Showcase on your website",
              ].map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 rounded-full bg-[#2563EB] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
              >
                Start collecting proof
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-200 group-hover:rotate-45">
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 text-[14px] font-semibold text-gray-600 transition hover:text-gray-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition group-hover:border-gray-900 group-hover:bg-gray-50">
                  <Play size={11} fill="currentColor" />
                </span>
                See how it works
              </a>
            </div>

            {/* AppSumo Featured Partner Trust Bar */}
            <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-gray-100">
              <a
                href="https://appsumo.com/products/blovi?utm_source=partner-badge&utm_medium=referral&utm_campaign=partner-255021"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform duration-200 hover:scale-[1.02] shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://appsumo2ppnuxt.b-cdn.net/img/as-badge-featured.2433f63.png"
                  alt="AppSumo badge"
                  className="h-10 w-auto object-contain"
                />
              </a>

              <div className="hidden sm:block h-7 w-px bg-gray-200" />

              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-xs font-semibold text-gray-700">
                  <span className="font-bold text-gray-900">Official AppSumo Select Partner</span> &mdash; Lifetime Deal Available
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE — Vibrant Blue Rectangle with 3D Stacked High-Res Screenshots */}
          <div className="lg:col-span-6 bg-[#2563EB] rounded-3xl p-6 md:p-8 lg:p-10 relative flex items-center justify-center min-h-[540px] md:min-h-[580px] overflow-hidden shadow-2xl">
            
            {/* Background Glows */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] opacity-95" />
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />

            {/* 3D Stack Container matching 4th reference image */}
            <div className="relative w-full max-w-[580px] h-[480px] md:h-[500px]">

              {/* LAYER 1 (Top-Right): Collection Form Card (Clean Borderless Card) */}
              <div className="absolute -top-2 right-1 w-[36%] bg-white rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.22)] overflow-hidden border border-gray-200/50 z-40 transition-transform duration-300 hover:scale-[1.03]">
                <Image
                  src="/images/hero-collect-form.png"
                  alt="Collection Form"
                  width={500}
                  height={600}
                  quality={100}
                  unoptimized
                  priority
                  className="w-full h-auto object-contain block"
                />
              </div>

              {/* LAYER 2 (Left-Middle): Manage Dashboard Window */}
              <div className="absolute top-16 left-0 w-[64%] bg-white rounded-xl shadow-[0_22px_45px_rgba(0,0,0,0.22)] border border-gray-200/50 overflow-hidden z-20 transition-transform duration-300 hover:scale-[1.02]">
                <div className="bg-[#FAF8F5] px-3 py-1.5 border-b border-gray-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-medium text-gray-400 font-sans tracking-tight ml-1.5">Manage Dashboard</span>
                  </div>
                </div>
                <div className="p-0.5 bg-white">
                  <Image
                    src="/images/hero-manage-dashboard.png"
                    alt="Manage Dashboard"
                    width={700}
                    height={500}
                    quality={100}
                    unoptimized
                    priority
                    className="w-full h-auto object-cover max-h-[220px]"
                  />
                </div>
              </div>

              {/* LAYER 3 (Bottom-Front): Main Wall of Love Review Widget */}
              <div className="absolute bottom-0 right-0 w-[78%] bg-white rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.32)] border border-gray-200/60 overflow-hidden z-30 transition-transform duration-300 hover:scale-[1.02]">
                <div className="bg-[#FAF8F5] px-3 py-1.5 border-b border-gray-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-medium text-gray-400 font-sans tracking-tight ml-1.5">Wall of Love Widget</span>
                  </div>
                </div>
                <div className="p-0.5 bg-white">
                  <Image
                    src="/images/hero-wall-widget.png"
                    alt="Main Wall of Love Review Widget"
                    width={800}
                    height={600}
                    quality={100}
                    unoptimized
                    priority
                    className="w-full h-auto object-cover max-h-[290px]"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
