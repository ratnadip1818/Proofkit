"use client";

import React from "react";
import Reveal from "./Reveal";
import { Star, ShieldCheck, Mail, ArrowUpRight, Zap, Eye, Globe } from "lucide-react";

export default function FeaturesBento() {
  return (
    <section id="features" className="w-full bg-white px-5 py-28 md:px-10 md:py-36 border-t border-[#1A1A1A]/5 relative overflow-hidden select-none">
      <div className="mx-auto w-full max-w-[1100px] relative z-10">
        
        {/* Section Header */}
        <div className="mx-auto max-w-[720px] text-center mb-20 md:mb-24">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A8A8A] md:text-[10.5px]">
              Engineered for Growth
            </p>
            <h2
              className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every feature, built to{" "}
              <span
                className="font-normal italic text-[#2563EB]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                earn trust
              </span>
            </h2>
            <p className="mt-5 text-[14px] leading-relaxed text-[#6B6B6B] max-w-md mx-auto">
              From instant collection to white-label hosting, Blovi gives founders complete authority over their reputation.
            </p>
          </Reveal>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Wall of Love Layouts (col-span-2) */}
          <div className="md:col-span-2 rounded-3xl border border-[#ECE7E0] bg-[#FAF8F5]/30 p-8 flex flex-col justify-between hover:border-[#2563EB]/20 transition-product duration-card ease-product">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/5 px-2 py-0.5 rounded">
                Layouts
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A] mt-3">
                Beautiful Walls of Love
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-2 max-w-md leading-relaxed">
                Display your best feedback in a modern masonry grid. Fully responsive, automatically adjusts spacing, and inherits your site's native container boundaries.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="mt-8 grid grid-cols-2 gap-3 bg-white border border-[#ECE7E0] rounded-2xl p-4 shadow-xs">
              <div className="border border-[#ECE7E0] rounded-xl p-3 bg-[#FAF8F5]/30 space-y-2">
                <div className="flex gap-0.5 text-[#2563EB]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={6} fill="currentColor" />)}
                </div>
                <div className="h-1.5 w-full bg-[#1A1A1A]/10 rounded"></div>
                <div className="h-1.5 w-2/3 bg-[#1A1A1A]/5 rounded"></div>
              </div>
              <div className="border border-[#ECE7E0] rounded-xl p-3 bg-[#FAF8F5]/30 space-y-2">
                <div className="flex gap-0.5 text-[#2563EB]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={6} fill="currentColor" />)}
                </div>
                <div className="h-1.5 w-full bg-[#1A1A1A]/10 rounded"></div>
                <div className="h-1.5 w-1/2 bg-[#1A1A1A]/5 rounded"></div>
              </div>
            </div>
          </div>

          {/* Card 2: Smart Moderation (col-span-1) */}
          <div className="rounded-3xl border border-[#ECE7E0] bg-white p-8 flex flex-col justify-between hover:border-[#2563EB]/20 transition-product duration-card ease-product">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Moderation
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A] mt-3">
                Smart Curating
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                Filter out spam automatically. Refine visitor reviews, verify their identities, and publish updates in a single click.
              </p>
            </div>

            {/* Visual Action Button */}
            <div className="mt-8 flex items-center justify-between border border-[#ECE7E0] rounded-xl p-3 bg-[#FAF8F5]/50">
              <span className="text-[10px] font-bold text-[#1A1A1A]">Review Pending</span>
              <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-bold uppercase text-[#2E9E6B] border border-green-200/30">
                <ShieldCheck size={9} />
                Approve
              </span>
            </div>
          </div>

          {/* Card 3: Dynamic Loop Marquees (col-span-1) */}
          <div className="rounded-3xl border border-[#ECE7E0] bg-white p-8 flex flex-col justify-between hover:border-[#2563EB]/20 transition-product duration-card ease-product">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Marquees
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A] mt-3">
                Dynamic Loops
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                Add movement to your hero headers. Create cinematic infinite-looping horizontal testimonial banners that draw direct eyes.
              </p>
            </div>

            {/* Visual Loop */}
            <div className="mt-8 overflow-hidden border border-[#ECE7E0] rounded-xl py-2 bg-[#FAF8F5]/50 relative">
              <div className="flex gap-2 animate-marquee-x whitespace-nowrap">
                <span className="inline-block border border-[#ECE7E0] bg-white rounded px-2.5 py-1 text-[8px] font-bold text-[#1A1A1A]">"Highly recommended!"</span>
                <span className="inline-block border border-[#ECE7E0] bg-white rounded px-2.5 py-1 text-[8px] font-bold text-[#1A1A1A]">"Incredible speed"</span>
              </div>
            </div>
          </div>

          {/* Card 4: White-Label Domains (col-span-2) */}
          <div className="md:col-span-2 rounded-3xl border border-[#ECE7E0] bg-[#FAF8F5]/30 p-8 flex flex-col justify-between hover:border-[#2563EB]/20 transition-product duration-card ease-product">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#2E9E6B] bg-green-50/50 border border-green-200/30 px-2 py-0.5 rounded">
                Custom Domains
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A] mt-3">
                Custom White-Label Collection
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-2 max-w-md leading-relaxed">
                Connect your Vercel DNS and host collection forms directly under your custom domain (e.g., `feedback.yourbrand.com`). Complete authority and brand alignment.
              </p>
            </div>

            {/* Domain Mock Bezel */}
            <div className="mt-8 border border-[#ECE7E0] rounded-2xl p-3 bg-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#2563EB] text-[9px] font-bold text-white">b</span>
                <span className="text-[10px] font-mono text-[#6B6B6B]">reviews.mybrand.com</span>
              </div>
              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-[#2E9E6B] bg-green-50 px-2 py-0.5 rounded border border-green-200/30">
                <Globe size={9} /> Verified DNS
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
