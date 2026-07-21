"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  Zap,
  ExternalLink,
  Maximize2,
  ChevronRight,
  Layout,
  Check,
  Copy,
  X,
  Sparkles,
  Sliders,
  Layers,
  Quote,
  Sun,
  Moon,
  Palette
} from "lucide-react";
import { saveWidgetConfig } from "../actions";

export interface TestimonialItem {
  id?: string;
  author_name: string;
  author_role?: string | null;
  body_original?: string;
  display_body?: string;
  rating?: number | null;
  avatar_url?: string | null;
}

function Switch({
  checked,
  onChange,
  size = "default",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "default";
}) {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center shrink-0 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      } ${isSm ? "h-4 w-8" : "h-6 w-11"}`}
    >
      <span
        className={`inline-block bg-white rounded-full transition-transform shadow-sm ${
          isSm ? "h-3 w-3" : "h-5 w-5"
        }`}
        style={{
          transform: checked
            ? `translateX(${isSm ? "14px" : "22px"})`
            : "translateX(2px)",
        }}
      />
    </button>
  );
}

export default function WidgetBuilder({
  userId,
  isLifetime,
  email,
  testimonials = [],
}: {
  userId: string;
  isLifetime: boolean;
  email?: string;
  testimonials: TestimonialItem[];
}) {
  // Widget Customization States mapped to persistable config
  const [preset, setPreset] = useState("base");
  const [theme, setTheme] = useState("light");
  const [showPhotos, setShowPhotos] = useState(true);
  const [useGravatar, setUseGravatar] = useState(true);
  const [fallbackAvatar, setFallbackAvatar] = useState("Placeholder");
  const [showBranding, setShowBranding] = useState(true);
  const [textColor, setTextColor] = useState("#374151");
  const [primaryColor, setPrimaryColor] = useState("#2564EB");
  const [ratingColor, setRatingColor] = useState("#FBBF24");
  const [ratingBorderColor, setRatingBorderColor] = useState("#4E46E5");
  const [highlightColor, setHighlightColor] = useState("#FFCD3640");

  // UI Drawer & Tab States
  const [tab, setTab] = useState<"design" | "embed">("design");
  const [layoutDrawerOpen, setLayoutDrawerOpen] = useState(false);
  const [variationDrawerOpen, setVariationDrawerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-sync configuration changes to database in the background
  useEffect(() => {
    const timer = setTimeout(() => {
      saveWidgetConfig({
        preset,
        theme,
        primary_color: primaryColor,
        text_color: textColor,
        rating_color: ratingColor,
        rating_border_color: ratingBorderColor,
        highlight_color: highlightColor,
        show_photos: showPhotos,
        use_gravatar: useGravatar,
        fallback_avatar: fallbackAvatar,
        show_branding: showBranding,
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [
    preset,
    theme,
    primaryColor,
    textColor,
    ratingColor,
    ratingBorderColor,
    highlightColor,
    showPhotos,
    useGravatar,
    fallbackAvatar,
    showBranding,
  ]);

  const colorFields = [
    { label: "Text Color", value: textColor, onChange: setTextColor },
    { label: "Primary Color", value: primaryColor, onChange: setPrimaryColor },
    { label: "Rating Color", value: ratingColor, onChange: setRatingColor },
    { label: "Rating Border Color", value: ratingBorderColor, onChange: setRatingBorderColor },
    { label: "Highlight Color", value: highlightColor, onChange: setHighlightColor },
  ];

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";
  
  // Live preview URL including all live color, photo, and avatar fallback parameters
  const rawPreviewUrl = `/embed/${userId || "demo-widget"}?type=wall&preset=${preset}&theme=${theme}&accent=${encodeURIComponent(primaryColor)}&textColor=${encodeURIComponent(textColor)}&ratingColor=${encodeURIComponent(ratingColor)}&ratingBorderColor=${encodeURIComponent(ratingBorderColor)}&highlightColor=${encodeURIComponent(highlightColor)}&showPhotos=${showPhotos}&useGravatar=${useGravatar}&fallbackAvatar=${encodeURIComponent(fallbackAvatar)}&showBranding=${showBranding}&max=9&desktop=1`;

  const getEmbedCode = () => {
    const widgetId = userId || "demo-widget";
    return `<!-- Blovi Widget: WALL OF LOVE (${preset.toUpperCase()} PRESET) -->
<div id="proofkit-widget" data-widget-id="${widgetId}"></div>
<script 
  src="${appUrl}/widget.js" 
  data-user="${widgetId}"
  data-type="wall"
  data-preset="${preset}"
  data-theme="${theme}"
  data-accent="${primaryColor}"
  data-rating-color="${ratingColor}"
  data-text-color="${textColor}"
  data-max="9"
  defer>
</script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const variationsList = [
    { id: "base", name: "Base", desc: "Clean modern card with soft borders and balanced spacing." },
    { id: "editorial", name: "Editorial", desc: "Classic typography with magazine-style metadata and refined rules." },
    { id: "modern", name: "Modern", desc: "High-contrast dynamic layout with vibrant primary accents and rounded pills." },
    { id: "luxury", name: "Luxury", desc: "Sleek dark gold-trimmed borders and elegant high-end styling." },
    { id: "minimal", name: "Minimal", desc: "Ultra-clean borderless presentation focusing purely on review text." },
  ];

  const layoutStylesList = [
    { id: "wall", name: "Wall of Love", desc: "Multi-column masonry grid showcasing all your top customer reviews.", icon: Layout, active: true },
    { id: "marquee", name: "Marquee Stream", desc: "Continuous auto-scrolling ticker bar ideal for headers & footers.", icon: Layers, active: false },
    { id: "carousel", name: "Card Carousel", desc: "Interactive swipeable carousel slider for landing page sections.", icon: Sliders, active: false },
    { id: "single", name: "Single Quote Badge", desc: "Minimalist high-converting quote card for checkout & CTA buttons.", icon: Quote, active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F4F1] font-sans text-gray-900 overflow-hidden relative">
      {/* LEFT PANEL */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 shadow-sm z-10">
        <div className="px-6 pt-6 shrink-0">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-1">
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === "design" ? (
            <>
              {/* 1. Widget Layout Style with Drawer Trigger */}
              <section>
                <div className="font-medium text-sm text-gray-900 mb-3 flex items-center justify-between">
                  <span>Widget Layout Style</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLayoutDrawerOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-50 shadow-xs cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Layout size={16} className="text-blue-600" />
                    <span className="font-semibold text-gray-900">Wall of Love</span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-blue-100">
                      Active
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </section>

              <hr className="border-gray-100" />

              {/* 2. Variations with Drawer Trigger */}
              <section>
                <div className="font-medium text-sm text-gray-900 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette size={16} className="text-gray-400" />
                    <span>Variations</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVariationDrawerOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setVariationDrawerOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-50 shadow-xs cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="font-semibold text-gray-900 capitalize">{preset}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-normal">Change</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </button>

                {/* Quick Selection Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {variationsList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                        preset === p.id
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* 3. Theme (Light & Dark) */}
              <section>
                <div className="font-medium text-sm text-gray-900 mb-3">Theme</div>
                <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      theme === "light"
                        ? "bg-white shadow-xs text-gray-900 border border-gray-200/50 font-semibold"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Sun size={14} className={theme === "light" ? "text-amber-500" : "text-gray-400"} />
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      theme === "dark"
                        ? "bg-white shadow-xs text-gray-900 border border-gray-200/50 font-semibold"
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
                <div className="font-medium text-sm text-gray-900 mb-3">Colors</div>
                <div className="space-y-2.5">
                  {colorFields.map(({ label, value, onChange }) => {
                    const swatchColor = value.length === 9 ? value.slice(0, 7) : value;
                    return (
                      <div key={label}>
                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
                          {label}
                        </div>
                        <label className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 py-2.5 bg-white hover:border-gray-300 transition-colors cursor-pointer">
                          <div
                            className="w-5 h-5 rounded-full border border-gray-200 shrink-0 shadow-inner"
                            style={{ backgroundColor: swatchColor }}
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="flex-1 text-sm font-mono text-gray-700 bg-transparent focus:outline-none"
                          />
                          <input
                            type="color"
                            value={swatchColor}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-0 h-0 opacity-0 absolute"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* 5. Show Customer Photos & Fallback Avatar */}
              <section>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-medium text-sm text-gray-900">Show Customer Photos</span>
                  <Switch checked={showPhotos} onChange={setShowPhotos} />
                </div>
                {showPhotos && (
                  <div className="ml-2 pl-5 border-l-2 border-gray-100 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Use Gravatar if available</span>
                      <Switch size="sm" checked={useGravatar} onChange={setUseGravatar} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Fallback Avatar</div>
                      <select
                        value={fallbackAvatar}
                        onChange={(e) => setFallbackAvatar(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        <option>Placeholder</option>
                        <option>Initials</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                )}
              </section>

              <hr className="border-gray-100" />

              {/* 6. Branding */}
              <section>
                <div className="flex items-center justify-between pb-6">
                  <span className="font-medium text-sm text-gray-900">Show Blovi Powered By</span>
                  <Switch checked={showBranding} onChange={setShowBranding} />
                </div>
              </section>
            </>
          ) : (
            /* GET CODE SNIPPET TAB */
            <div className="space-y-4">
              <div className="font-medium text-sm text-gray-900 mb-2">Embed Code Snippet</div>
              <div className="relative">
                <pre className="bg-[#1E293B] text-gray-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-gray-800">
                  {getEmbedCode()}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer transition-all"
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="px-10 py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-xs">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            Live Render Output (Wall · {preset.toUpperCase()})
          </div>
          <div className="flex gap-3">
            <a
              href={rawPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-all"
            >
              <ExternalLink size={16} className="text-gray-400" /> Open Raw
            </a>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white shadow-xs transition-all cursor-pointer"
            >
              <Maximize2 size={16} /> Full Screen
            </button>
          </div>
        </div>

        {/* Right Panel Main View: Live Iframe Preview */}
        <div className="flex-1 w-full h-full p-4 md:p-6 overflow-hidden flex flex-col">
          <div className="w-full flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <iframe
              src={rawPreviewUrl}
              className="w-full h-full border-none"
              title="Live Render Output"
            />
          </div>
        </div>
      </div>

      {/* 1. LAYOUT STYLE DRAWER MODAL */}
      {layoutDrawerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 flex flex-col space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Layout size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Widget Layout Style</h3>
                  <p className="text-xs text-gray-500">Select how customer reviews are rendered on your site</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLayoutDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {layoutStylesList.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.active) {
                        setLayoutDrawerOpen(false);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      item.active
                        ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80 opacity-75"
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${item.active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900">{item.name}</span>
                        {item.active ? (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLayoutDrawerOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VARIATIONS DRAWER MODAL */}
      {variationDrawerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 flex flex-col space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Preset Variations</h3>
                  <p className="text-xs text-gray-500">Choose a curated visual style theme for your widget cards</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVariationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {variationsList.map((item) => {
                const isSelected = preset === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setPreset(item.id);
                      setVariationDrawerOpen(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-sm text-gray-900 capitalize">{item.name}</span>
                        {isSelected && (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-blue-600 text-white shrink-0 mt-0.5">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setVariationDrawerOpen(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex flex-col animate-fade-in">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">Full Screen Widget Preview</h3>
                <p className="text-xs text-gray-500">Live render output — WALL ({preset.toUpperCase()} PRESET)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={rawPreviewUrl}
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
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-[#FAF9F6] p-6 overflow-hidden">
            <iframe
              src={rawPreviewUrl}
              className="w-full h-full border-none rounded-2xl shadow-xl bg-white"
              title="Fullscreen Widget Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
