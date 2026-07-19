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
  ExternalLink,
  Sparkles,
  Smartphone,
  Monitor
} from "lucide-react";
import { SAMPLE_TESTIMONIALS, type Testimonial } from "../../embed/wall-renderer";

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
  const [theme, setTheme] = useState<WidgetTheme>("light");
  const [accentColor, setAccentColor] = useState("#2563EB");
  const [borderRadius, setBorderRadius] = useState<"sharp" | "rounded" | "pill">("rounded");
  const [cardShadow, setCardShadow] = useState<"none" | "subtle" | "soft" | "bold">("soft");
  const [ratingFilter, setRatingFilter] = useState<number>(4);

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
      return `<!-- ProofKit Widget: ${layout.toUpperCase()} -->
<div id="proofkit-widget" data-widget-id="${widgetId}"></div>
<script 
  src="${APP_URL}/widget.js" 
  data-layout="${layout}"
  data-theme="${theme}"
  data-radius="${borderRadius}"
  data-shadow="${cardShadow}"
  data-accent="${accentColor}"
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
      theme="${theme}"
      accentColor="${accentColor}"
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
      <ProofKitWidget widgetId="${widgetId}" layout="${layout}" theme="${theme}" />
    </section>
  );
}`;
    }
    if (activeFramework === "framer") {
      return `1. Copy your direct embed URL:
   ${APP_URL}/embed/${widgetId}?layout=${layout}&theme=${theme}

2. In Framer, add an "Embed / IFrame" component.
3. Paste the URL into the Framer property panel.`;
    }
    return `1. Drag an "Embed" element into your Webflow page canvas.
2. Paste the HTML snippet below:
<div id="proofkit-widget" data-widget-id="${widgetId}"></div>
<script src="${APP_URL}/widget.js" data-layout="${layout}" defer></script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
                {/* Layout Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 block">Widget Layout Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "wall", label: "Wall of Love" },
                      { id: "carousel", label: "Carousel" },
                      { id: "grid", label: "Grid" },
                      { id: "badge", label: "Badge" },
                      { id: "toast", label: "Toast Popup" },
                      { id: "marquee", label: "Marquee" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLayout(item.id as WidgetLayout)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                          layout === item.id
                            ? "bg-blue-50 border-blue-600 text-blue-700 shadow-2xs"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
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
        <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#ecebe6] rounded-2xl p-6 min-h-[460px] flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center space-x-2 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Live Render Output ({layout})</span>
          </div>

          {/* RENDER LAYOUT PREVIEWS */}
          {layout === "wall" && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {filteredTestimonials.slice(0, 4).map((t, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl transition-all shadow-2xs ${
                    theme === "dark" ? "bg-gray-900 text-white border border-gray-800" : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-0.5 text-amber-400 mb-2">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed italic">"{t.display_body || t.body_original || "Amazing product!"}"</p>
                  <div className="mt-3 text-[11px] font-bold opacity-80">— {t.author_name || "Verified Client"}</div>
                </div>
              ))}
            </div>
          )}

          {layout === "carousel" && (
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-md relative">
              <div className="flex items-center space-x-0.5 text-amber-400 mb-3">
                {Array.from({ length: filteredTestimonials[carouselIndex]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-800 leading-relaxed italic">
                "{filteredTestimonials[carouselIndex]?.display_body || filteredTestimonials[carouselIndex]?.body_original || "Exceptional service and quick delivery."}"
              </p>
              <div className="mt-4 font-bold text-xs text-gray-900">
                {filteredTestimonials[carouselIndex]?.author_name || "Sarah Jenkins"}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-mono">
                  {carouselIndex + 1} of {filteredTestimonials.length}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)}
                    className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % filteredTestimonials.length)}
                    className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {layout === "badge" && (
            <div className="bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-md flex items-center space-x-3">
              <div className="flex items-center space-x-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-xs text-gray-900">4.9/5 Rating from 120+ happy clients</span>
            </div>
          )}

          {layout === "toast" && (
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xl flex items-center space-x-3 max-w-xs animate-bounce">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                A
              </div>
              <div>
                <span className="font-bold text-xs text-gray-900 block leading-tight">Alex R. submitted 5★ review</span>
                <span className="text-[10px] text-gray-500 block">Just now via ProofKit</span>
              </div>
            </div>
          )}

          {(layout === "grid" || layout === "marquee") && (
            <div className="w-full grid grid-cols-3 gap-3 max-w-lg">
              {filteredTestimonials.slice(0, 3).map((t, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                  <div className="flex justify-center space-x-0.5 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-700 truncate">"{t.author_name}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
