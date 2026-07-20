"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Code,
  Sliders,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  Maximize2,
  ExternalLink,
  X
} from "lucide-react";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "../../embed/wall-renderer";
import { styleRegistry, type WidgetPresetId } from "../../embed/styles";

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type WidgetLayout = "wall" | "carousel" | "grid" | "badge" | "toast" | "marquee";
type WidgetTheme = "light" | "dark" | "transparent";
type FrameworkType = "html" | "react" | "next" | "framer" | "webflow";

export default function WidgetBuilder({
  userId,
  isLifetime,
  email,
  testimonials = [],
}: {
  userId: string;
  isLifetime: boolean;
  email?: string;
  testimonials: Testimonial[];
}) {
  // Widget Customization States
  const [layout, setLayout] = useState<WidgetLayout>("wall");
  const [preset, setPreset] = useState<WidgetPresetId>("base");
  const [theme, setTheme] = useState<WidgetTheme>("light");
  const [accentColor, setAccentColor] = useState("#2563EB");
  const [borderRadius, setBorderRadius] = useState<"sharp" | "rounded" | "pill">("rounded");
  const [cardShadow, setCardShadow] = useState<"none" | "subtle" | "soft" | "bold">("soft");
  const [ratingFilter, setRatingFilter] = useState<number>(4);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tabs & Controls
  const [wizardTab, setWizardTab] = useState<"design" | "embed">("design");
  const [activeFramework, setActiveFramework] = useState<FrameworkType>("html");
  const [copiedCode, setCopiedCode] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const displayTestimonials = testimonials.length > 0 ? testimonials : SAMPLE_TESTIMONIALS;
  const filteredTestimonials = displayTestimonials.filter((t) => (t.rating || 5) >= ratingFilter);

  const getEmbedCode = () => {
    const widgetId = userId || "demo-widget";

    if (activeFramework === "html") {
      return `<!-- Blovi Widget: ${layout.toUpperCase()} (${preset.toUpperCase()} PRESET) -->
<div id="proofkit-widget" data-widget-id="${widgetId}"></div>
<script 
  src="${APP_URL}/widget.js" 
  data-user="${widgetId}"
  data-type="${layout}"
  data-preset="${preset}"
  data-theme="${theme}"
  data-radius="${borderRadius}"
  data-shadow="${cardShadow}"
  data-accent="${accentColor}"
  data-max="9"
  defer>
</script>`;
    }
    if (activeFramework === "react") {
      return `import { ProofKitWidget } from '@proofkit/react';

export default function SocialProofSection() {
  return (
    <ProofKitWidget 
      widgetId="${widgetId}" 
      layout="${layout}"
      preset="${preset}"
      theme="${theme}"
      accentColor="${accentColor}"
      max={9}
    />
  );
}`;
    }
    if (activeFramework === "next") {
      return `// components/SocialProof.tsx
'use client';
import { ProofKitWidget } from '@proofkit/react';

export default function SocialProof() {
  return (
    <section className="py-12">
      <ProofKitWidget widgetId="${widgetId}" layout="${layout}" preset="${preset}" theme="${theme}" max={9} />
    </section>
  );
}`;
    }
    if (activeFramework === "framer") {
      return `1. Copy your direct embed URL:
   ${APP_URL}/embed/${widgetId}?type=${layout}&preset=${preset}&theme=${theme}&max=9

2. In Framer, add an "Embed / IFrame" component.
3. Paste the URL into the Framer property panel.`;
    }
    return `1. Drag an "Embed" element into your Webflow page canvas.
2. Paste the HTML snippet below:
<div id="proofkit-widget" data-widget-id="${widgetId}"></div>
<script src="${APP_URL}/widget.js" data-user="${widgetId}" data-type="${layout}" data-preset="${preset}" data-max="9" defer></script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Keep the dashboard preview separate from the cached customer embed route.
  // This makes every preview reflect the currently deployed widget renderer.
  const previewIframeUrl = `/embed/preview?demo=1&type=${layout}&preset=${preset}&theme=${theme}&radius=${borderRadius}&accent=${encodeURIComponent(accentColor)}&preview=gallery-v2`;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-6 animate-fade-in font-sans select-none">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 tracking-tight">
          Publish & Embed Widgets
        </h1>
        <p className="text-gray-500 text-xs mt-1 leading-relaxed">
          Customize high-converting testimonial widgets and generate script tags for your live site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. LEFT PANEL: Controls & Embed Exporter (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-[#ecebe6] rounded-2xl shadow-2xs overflow-hidden flex flex-col">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 border-b border-[#ecebe6] bg-gray-50/60">
            <button
              onClick={() => setWizardTab("design")}
              className={`py-3 px-4 text-xs font-bold transition-all flex items-center justify-center space-x-2 border-b-2 cursor-pointer ${
                wizardTab === "design"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Widget Design</span>
            </button>
            <button
              onClick={() => setWizardTab("embed")}
              className={`py-3 px-4 text-xs font-bold transition-all flex items-center justify-center space-x-2 border-b-2 cursor-pointer ${
                wizardTab === "embed"
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>2. Get Code Snippet</span>
            </button>
          </div>

          <div className="p-5 space-y-5">
            {wizardTab === "design" ? (
              <div className="space-y-4">
                {/* 1. Widget Layout Style (Wall of Love for MVP) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 block">Widget Layout Style</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "wall", label: "Wall of Love" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLayout(item.id as WidgetLayout)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-left cursor-pointer flex items-center justify-between ${
                          layout === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-700 shadow-2xs"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Dynamic Preset Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    <span>Widget Design Preset</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(styleRegistry).map((def) => {
                      const isSelected = preset === def.id;
                      return (
                        <button
                          key={def.id}
                          onClick={() => setPreset(def.id)}
                          title={def.description}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 border-blue-600 text-blue-700 shadow-2xs"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {def.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 block">Color Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["light", "dark", "transparent"] as WidgetTheme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize transition-all border text-center cursor-pointer ${
                          theme === t
                            ? "bg-blue-50 border-blue-600 text-blue-700 shadow-2xs"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Swatch */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-gray-800 block">Brand Accent Color</label>
                  <div className="flex items-center space-x-2">
                    {["#2563EB", "#10B981", "#6366F1", "#EC4899", "#EF4444", "#1F2937"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className={`w-6 h-6 rounded-full border border-gray-200 cursor-pointer ${
                          accentColor === c ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Rating Filter Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                    <span>Minimum Rating Filter</span>
                    <span className="text-amber-500 font-mono">{ratingFilter}★ and above</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              /* EMBED SNIPPET WIZARD */
              <div className="space-y-4">
                {/* Platform tabs */}
                <div className="flex items-center space-x-1 border-b border-[#ecebe6] pb-2">
                  {(["html", "react", "next", "framer", "webflow"] as FrameworkType[]).map((fw) => (
                    <button
                      key={fw}
                      onClick={() => setActiveFramework(fw)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        activeFramework === fw
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {fw}
                    </button>
                  ))}
                </div>

                {/* Code display block */}
                <div className="relative">
                  <pre className="bg-[#1E293B] text-gray-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-gray-800">
                    {getEmbedCode()}
                  </pre>
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs transition-all cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. RIGHT PANEL: Live Widget Preview Canvas (Span 7) */}
        <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#ecebe6] rounded-2xl p-5 min-h-[560px] flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#ecebe6] mb-3">
            <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Render Output ({layout} - {preset.toUpperCase()})</span>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={previewIframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
                title="Open raw preview in new tab"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Raw</span>
              </a>
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
                title="View Fullscreen Preview"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Full Screen</span>
              </button>
            </div>
          </div>

          <div className="w-full flex-1 min-h-[480px] bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <iframe
              src={previewIframeUrl}
              className="w-full h-full min-h-[480px] border-none"
              title="Widget Preview"
            />
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL OVERLAY */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex flex-col animate-fade-in">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">Full Screen Widget Preview</h3>
                <p className="text-xs text-gray-500">Live render output — {layout.toUpperCase()} ({preset.toUpperCase()} PRESET)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={previewIframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center space-x-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Tab</span>
              </a>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                title="Close Fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-[#FAF9F6] p-6 overflow-hidden">
            <iframe
              src={previewIframeUrl}
              className="w-full h-full border-none rounded-2xl shadow-xl bg-white"
              title="Fullscreen Widget Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
