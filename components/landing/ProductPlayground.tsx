"use client";

import React, { useState } from "react";
import {
  WallContent,
  type WallTheme
} from "@/app/embed/wall-renderer";
import { SAMPLE_TESTIMONIALS } from "@/app/embed/constants";
import Reveal from "./Reveal";
import {
  Layout,
  Sun,
  Moon,
  Copy,
  Check,
  Code,
  Palette,
  Sparkles,
  ChevronRight,
  Sliders,
  Layers,
  Quote
} from "lucide-react";

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center shrink-0 h-6 w-11 rounded-full transition-colors cursor-pointer focus:outline-none ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className="inline-block h-5 w-5 bg-white rounded-full transition-transform shadow-sm"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

export default function ProductPlayground() {
  const [tab, setTab] = useState<"design" | "embed">("design");
  const [theme, setTheme] = useState<WallTheme>("light");
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [textColor, setTextColor] = useState("#374151");
  const [ratingColor, setRatingColor] = useState("#FBBF24");
  const [ratingBorderColor, setRatingBorderColor] = useState("#4E46E5");
  const [highlightColor, setHighlightColor] = useState("#FFCD3640");
  const [showPhotos, setShowPhotos] = useState(true);
  const [useGravatar, setUseGravatar] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const getEmbedCode = () => {
    return `<!-- Blovi Widget: WALL OF LOVE (BASE PRESET) -->
<div id="proofkit-widget" data-widget-id="demo-widget"></div>
<script 
  src="https://www.blovi.space/widget.js" 
  data-user="demo-widget"
  data-type="wall"
  data-preset="base"
  data-theme="${theme}"
  data-accent="${primaryColor}"
  data-text-color="${textColor}"
  data-rating-color="${ratingColor}"
  data-rating-border-color="${ratingBorderColor}"
  data-highlight-color="${highlightColor}"
  data-show-photos="${showPhotos}"
  data-use-gravatar="${useGravatar}"
  data-max="9"
  defer>
</script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const colorFields = [
    { label: "TEXT COLOR", value: textColor, onChange: setTextColor },
    { label: "PRIMARY COLOR", value: primaryColor, onChange: setPrimaryColor },
    { label: "RATING COLOR", value: ratingColor, onChange: setRatingColor },
    { label: "RATING BORDER COLOR", value: ratingBorderColor, onChange: setRatingBorderColor },
    { label: "HIGHLIGHT COLOR", value: highlightColor, onChange: setHighlightColor },
  ];

  return (
    <section id="playground" className="relative w-full overflow-hidden bg-[#f7f4eb] px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute right-[-16rem] top-8 h-[38rem] w-[38rem] rounded-full bg-[#d9f6cd] opacity-60 blur-3xl" />
      <div className="mx-auto w-full max-w-[1150px] relative z-10">
        
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
                className="font-serif-accent ml-2 font-normal italic text-[#2563EB]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                like it was always yours.
              </span>
            </h2>
            <p className="mt-6 max-w-[530px] text-[15px] leading-relaxed text-[#587091] md:text-[17px]">
              Shape the widget, color, and tone. Blovi makes customer proof feel built into your site—not bolted onto it.
            </p>
          </Reveal>
        </div>

        {/* 2-Column Playground Layout */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT COLUMN: Actual Widget Design System Panel (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col rounded-[24px] border border-gray-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* Header Tabs (1. Widget Design | 2. Get Code Snippet) */}
            <div className="px-6 pt-5 shrink-0 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTab("design")}
                    className={`text-xs font-semibold cursor-pointer pb-3 -mb-[13px] transition-all border-b-2 ${
                      tab === "design"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-800"
                    }`}
                  >
                    1. Widget Design
                  </button>
                  <Code size={14} className="text-gray-300" />
                  <button
                    type="button"
                    onClick={() => setTab("embed")}
                    className={`text-xs font-medium cursor-pointer pb-3 -mb-[13px] transition-all border-b-2 ${
                      tab === "embed"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-800"
                    }`}
                  >
                    2. Get Code Snippet
                  </button>
                </div>
              </div>
            </div>

            {/* Design Controls Body */}
            <div className="p-6 space-y-5 max-h-[520px] overflow-y-auto">
              {tab === "design" ? (
                <>
                  {/* 1. Widget Layout Style */}
                  <section>
                    <div className="font-semibold text-xs text-gray-900 mb-2.5">
                      Widget Layout Style
                    </div>
                    <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <Layout size={16} className="text-blue-600" />
                        <span className="font-semibold text-gray-900">Wall of Love</span>
                        <span className="bg-blue-50 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-blue-100">
                          ACTIVE
                        </span>
                      </div>
                      <ChevronRight size={15} className="text-gray-400" />
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* 2. Variations */}
                  <section>
                    <div className="flex items-center justify-between font-semibold text-xs text-gray-900 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Palette size={15} className="text-gray-400" />
                        <span>Variations</span>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-600 cursor-pointer">
                        View All
                      </span>
                    </div>

                    <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={15} className="text-amber-500" />
                        <span className="font-semibold text-gray-900">Base</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-400">Change</span>
                        <ChevronRight size={15} className="text-gray-400" />
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 text-xs rounded-lg border border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-2xs">
                        Base
                      </span>
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* 3. Theme (Light / Dark) */}
                  <section>
                    <div className="font-semibold text-xs text-gray-900 mb-2.5">Theme</div>
                    <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          theme === "light"
                            ? "bg-white shadow-2xs text-gray-900 border border-gray-200/60 font-semibold"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Sun size={14} className={theme === "light" ? "text-amber-500" : "text-gray-400"} />
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          theme === "dark"
                            ? "bg-white shadow-2xs text-gray-900 border border-gray-200/60 font-semibold"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Moon size={14} className={theme === "dark" ? "text-indigo-600" : "text-gray-400"} />
                        Dark
                      </button>
                    </div>
                  </section>

                  {/* 4. Colors */}
                  <section>
                    <div className="font-semibold text-xs text-gray-900 mb-2.5">Colors</div>
                    <div className="space-y-2">
                      {colorFields.map(({ label, value, onChange }) => {
                        const swatchColor = value.length === 9 ? value.slice(0, 7) : value;
                        return (
                          <div key={label}>
                            <div className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              {label}
                            </div>
                            <label className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 py-2 bg-white hover:border-gray-300 transition-colors cursor-pointer">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-200 shrink-0 shadow-2xs"
                                style={{ backgroundColor: swatchColor }}
                              />
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                className="flex-1 text-xs font-mono text-gray-700 bg-transparent focus:outline-none"
                              />
                              <input
                                type="color"
                                value={swatchColor}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-0 h-0 opacity-0 overflow-hidden cursor-pointer"
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  {/* 5. Photos & Gravatar Toggles */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">Show Customer Photos</span>
                      <Switch checked={showPhotos} onChange={setShowPhotos} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">Use Gravatar if available</span>
                      <Switch checked={useGravatar} onChange={setUseGravatar} />
                    </div>
                  </section>
                </>
              ) : (
                /* Code Snippet Embed Tab */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900">HTML Embed Code</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-gray-900 text-gray-100 text-[10.5px] font-mono rounded-xl overflow-x-auto leading-relaxed border border-gray-800">
                    {getEmbedCode()}
                  </pre>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Paste this snippet anywhere in your site&apos;s HTML before the closing <code className="text-blue-600 bg-blue-50 px-1 rounded">&lt;/body&gt;</code> tag.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Live Render Canvas (col-span-7) */}
          <div className="lg:col-span-7 w-full min-w-0">
            <div className="flex flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_20px_45px_rgba(0,0,0,0.1)]">
              
              {/* Browser Header Bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/90 px-4 py-2.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#27C93F]" />
                </div>
                
                <div className="w-48 truncate rounded-md border border-gray-200/60 bg-white px-4 py-1 text-center font-sans text-[10px] font-medium text-gray-400 tracking-tight select-all shadow-2xs">
                  https://mybrand.com/reviews
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[9.5px] font-bold text-[#2563EB]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  Live Render Output
                </div>
              </div>

              {/* Live Preview Canvas */}
              <div
                className={`w-full p-6 md:p-8 transition-colors duration-300 min-h-[440px] flex items-center justify-center overflow-x-hidden ${
                  theme === "dark" ? "bg-[#111111]" : "bg-[#fffdf8]"
                }`}
              >
                <div
                  key={`${theme}-${primaryColor}-${textColor}-${ratingColor}-${ratingBorderColor}-${highlightColor}-${showPhotos}-${useGravatar}`}
                  className="playground-preview w-full max-w-full overflow-hidden"
                >
                  <WallContent
                    testimonials={SAMPLE_TESTIMONIALS.slice(0, 6)}
                    layout="grid"
                    theme={theme}
                    showRatings={true}
                    showBadge={false}
                    maxCount={6}
                    accent={primaryColor}
                    radius="pill"
                    preset="base"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
      <style jsx global>{`
        #playground .playground-preview .blovi-flex-grid {
          gap: 12px !important;
          max-width: 100% !important;
        }

        #playground .playground-preview .blovi-flex-card-wrapper {
          flex: 0 1 calc((100% - 12px) / 2) !important;
          max-width: calc((100% - 12px) / 2) !important;
        }
      `}</style>
    </section>
  );
}
