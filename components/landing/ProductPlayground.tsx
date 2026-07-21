"use client";

import React, { useState } from "react";
import {
  WallContent,
  type WidgetRadius,
  type WallTheme
} from "@/app/embed/wall-renderer";
import type { WidgetPresetId } from "@/app/embed/styles/types";
import { SAMPLE_TESTIMONIALS } from "@/app/embed/constants";
import Reveal from "./Reveal";
import { Layout, Sparkles, Sun, Moon } from "lucide-react";

const PRESET_VARIATIONS: { id: WidgetPresetId; label: string }[] = [
  { id: "base", label: "Base" },
  { id: "editorial", label: "Editorial" },
  { id: "modern", label: "Modern" },
  { id: "luxury", label: "Luxury" },
  { id: "minimal", label: "Minimal" }
];

const THEMES: { id: WallTheme; label: string }[] = [
  { id: "light", label: "Light Theme" },
  { id: "dark", label: "Dark Theme" }
];

const RADIUSES: { id: WidgetRadius; label: string }[] = [
  { id: "sharp", label: "Sharp" },
  { id: "rounded", label: "Rounded" },
  { id: "pill", label: "Pill" }
];

const COLOR_PRESETS = [
  { name: "Brand Blue", hex: "#2563EB" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Red", hex: "#EF4444" },
  { name: "Dark", hex: "#1F2937" },
];

export default function ProductPlayground() {
  const [preset, setPreset] = useState<WidgetPresetId>("base");
  const [theme, setTheme] = useState<WallTheme>("light");
  const [radius, setRadius] = useState<WidgetRadius>("pill");
  const [accent, setAccent] = useState("#2563EB");

  return (
    <section id="playground" className="relative w-full overflow-hidden bg-[#f7f4eb] px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute right-[-16rem] top-8 h-[38rem] w-[38rem] rounded-full bg-[#d9f6cd] opacity-60 blur-3xl" />
      <div className="mx-auto w-full max-w-[1100px] relative z-10">
        
        {/* Section Header */}
        <div className="max-w-[680px] mb-14 md:mb-16">
          <Reveal>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              Make it yours
            </p>
            <h2
              className="text-balance text-[clamp(2.65rem,5.1vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-[#173b71]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Proof that looks
              <span
                className="font-serif-accent ml-2 font-normal italic text-[#0b61d9]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                like it was always yours.
              </span>
            </h2>
            <p className="mt-6 max-w-[530px] text-[15px] leading-relaxed text-[#587091] md:text-[17px]">
              Shape the widget, colour, and tone. Blovi makes customer proof feel built into your site—not bolted onto it.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Playground Layout */}
        <div className="grid gap-5 lg:grid-cols-12 items-start">
          
          {/* Left Column: Configuration Controls (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 rounded-[28px] border border-[#d8d3c5] bg-[#fffdf8] p-6 shadow-[0_12px_30px_rgba(74,64,42,0.06)]">
            
            {/* Widget Layout Style */}
            <div>
              <label className="block text-[10px] font-bold text-[#7a8091] uppercase tracking-wider mb-2.5">
                Widget Layout Style
              </label>
              <div className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#0b61d9] rounded-xl text-xs font-bold text-[#0b61d9] bg-[#e9f1ff]/50 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Layout size={16} className="text-[#0b61d9]" />
                  <span>Wall of Love</span>
                </div>
                <span className="bg-[#0b61d9] text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
            </div>

            {/* Variations Preset Selection */}
            <div>
              <label className="block text-[10px] font-bold text-[#7a8091] uppercase tracking-wider mb-2.5">
                Preset Variations
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_VARIATIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    className={`text-center px-3 py-2.5 rounded-xl border text-xs font-bold transition-product duration-hover ease-product cursor-pointer capitalize ${
                      preset === p.id
                        ? "border-[#0b61d9] bg-[#e9f1ff] text-[#0b61d9] translate-y-[-1px] shadow-sm"
                        : "border-[#e3ded1] bg-white text-[#6c7280] hover:border-[#0b61d9]/25 hover:text-[#173b71]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color presets */}
            <div>
              <label className="block text-[10px] font-bold text-[#7a8091] uppercase tracking-wider mb-2.5">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    onClick={() => setAccent(p.hex)}
                    className={`h-7 w-7 rounded-full border border-black/10 transition-transform active:scale-95 flex items-center justify-center cursor-pointer ${
                      accent === p.hex ? "ring-2 ring-[#0b61d9] ring-offset-1 scale-105" : ""
                    }`}
                    style={{ backgroundColor: p.hex }}
                    title={p.name}
                  >
                    {accent === p.hex && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                ))}
                
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                />
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-[10px] font-bold text-[#7a8091] uppercase tracking-wider mb-2.5">
                Pick a theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold text-center transition-product duration-hover ease-product cursor-pointer flex items-center justify-center gap-1.5 ${
                      theme === t.id
                        ? "border-[#0b61d9] bg-[#e9f1ff] text-[#0b61d9] translate-y-[-1px] shadow-sm"
                        : "border-[#e3ded1] bg-white text-[#6c7280] hover:border-[#0b61d9]/25 hover:text-[#173b71]"
                    }`}
                  >
                    {t.id === "light" ? <Sun size={14} /> : <Moon size={14} />}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius Selector */}
            <div>
              <label className="block text-[10px] font-bold text-[#7a8091] uppercase tracking-wider mb-2.5">
                Corner style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RADIUSES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRadius(r.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-center transition-product duration-hover ease-product cursor-pointer ${
                      radius === r.id
                        ? "border-[#0b61d9] bg-[#e9f1ff] text-[#0b61d9] translate-y-[-1px] shadow-sm"
                        : "border-[#e3ded1] bg-white text-[#6c7280] hover:border-[#0b61d9]/25 hover:text-[#173b71]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Preview (col-span-8) */}
          <div className="lg:col-span-8 w-full min-w-0">
            <div className="flex flex-col overflow-hidden rounded-[30px] border border-[#cad7ee] bg-white shadow-[0_22px_55px_rgba(24,61,122,0.15)] transition-product duration-card ease-product">
              
              {/* Browser Header Bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#173b71] px-5 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#f9a289]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#f3d47a]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#c6ffb1]"></div>
                </div>
                
                <div className="w-48 truncate rounded-lg border border-white/10 bg-white/10 px-6 py-0.5 text-center font-mono text-[9px] tracking-wide text-white/65 select-all">
                  https://mybrand.com/reviews
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-[#c6ffb1]/30 bg-[#c6ffb1]/10 px-2 py-0.5 text-[9px] font-bold text-[#c6ffb1]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c6ffb1] animate-pulse"></span>
                  Wall of Love ({preset.toUpperCase()})
                </div>
              </div>

              {/* Live Preview Canvas container */}
              <div
                className={`w-full p-6 md:p-8 transition-colors duration-card ease-product min-h-[420px] flex items-center justify-center overflow-x-hidden ${
                  theme === "dark" ? "bg-[#111111]" : "bg-[#fffdf8]"
                }`}
              >
                <div
                  key={`${preset}-${theme}-${radius}-${accent}`}
                  className="playground-preview w-full max-w-full overflow-hidden animate-modal-in"
                >
                  <WallContent
                    testimonials={SAMPLE_TESTIMONIALS.slice(0, 6)}
                    layout="grid"
                    theme={theme}
                    showRatings={true}
                    showBadge={false}
                    maxCount={6}
                    accent={accent}
                    radius={radius}
                    preset={preset}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
      <style jsx global>{`
        #playground .playground-preview .blovi-flex-grid {
          gap: 10px !important;
          max-width: 100% !important;
        }

        #playground .playground-preview .blovi-flex-card-wrapper {
          flex: 0 1 calc((100% - 10px) / 2) !important;
          max-width: calc((100% - 10px) / 2) !important;
        }
      `}</style>
    </section>
  );
}
