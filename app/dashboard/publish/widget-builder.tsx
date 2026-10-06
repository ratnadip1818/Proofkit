"use client";

import React, { useState, useEffect } from "react";
import { Code, Check, Copy, SlidersHorizontal } from "lucide-react";
import { saveWidgetConfig } from "../actions";
import type { WidgetType } from "@/app/embed/types/widget";

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
      className={`relative inline-flex items-center shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 ${
        checked ? "bg-blue-600" : "bg-zinc-200"
      } ${isSm ? "h-4 w-7" : "h-5 w-9"}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
          isSm ? "h-3 w-3" : "h-4 w-4"
        }`}
        style={{
          transform: checked
            ? `translateX(${isSm ? "12px" : "16px"})`
            : "translateX(0px)",
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
  const [layout, setLayout] = useState<WidgetType>("wall");
  // Fixed standard defaults for simplified design panel
  const preset = "base";
  const theme = "light";
  const showPhotos = true;
  const useGravatar = true;
  const fallbackAvatar = "Initials";

  const [showBranding, setShowBranding] = useState(true);
  const [textColor, setTextColor] = useState("#374151");
  const [primaryColor, setPrimaryColor] = useState("#2564EB");
  const [ratingColor, setRatingColor] = useState("#FBBF24");
  const [ratingBorderColor, setRatingBorderColor] = useState("#4E46E5");
  const [highlightColor, setHighlightColor] = useState("#FFCD3640");
  const [chatCustomerPrompt, setChatCustomerPrompt] = useState("");
  const [chatFounderReply, setChatFounderReply] = useState("");

  // UI Drawer & Tab States
  const [tab, setTab] = useState<"design" | "embed">("design");
  const [copiedCode, setCopiedCode] = useState(false);
  const [stackEmbedMode, setStackEmbedMode] = useState<"floating" | "inline">("floating");

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
    primaryColor,
    textColor,
    ratingColor,
    ratingBorderColor,
    highlightColor,
    showBranding,
  ]);

  const colorFields = [
    { label: "Primary Accent", value: primaryColor, onChange: setPrimaryColor },
    { label: "Body Text", value: textColor, onChange: setTextColor },
    { label: "Star Rating", value: ratingColor, onChange: setRatingColor },
    { label: "Rating Border", value: ratingBorderColor, onChange: setRatingBorderColor },
    { label: "Highlight Color", value: highlightColor, onChange: setHighlightColor },
  ];

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";
  
  const testimonialsKey = testimonials.map((t) => t.id).join("-") || "none";
  // Live preview URL pointing to uncached dynamic preview endpoint
  const rawPreviewUrl = `/embed/preview?user=${userId || "demo-widget"}&type=${layout}&preset=${preset}&theme=${theme}&accent=${encodeURIComponent(primaryColor)}&textColor=${encodeURIComponent(textColor)}&ratingColor=${encodeURIComponent(ratingColor)}&ratingBorderColor=${encodeURIComponent(ratingBorderColor)}&highlightColor=${encodeURIComponent(highlightColor)}&showPhotos=${showPhotos}&useGravatar=${useGravatar}&fallbackAvatar=${encodeURIComponent(fallbackAvatar)}&chatCustomerPrompt=${encodeURIComponent(chatCustomerPrompt)}&chatFounderReply=${encodeURIComponent(chatFounderReply)}&showBranding=${showBranding}&max=9&desktop=1&v=${testimonialsKey}`;

  const getEstimatedHeight = (layoutType: string, count: number): number => {
    switch (layoutType) {
      case "single":
        return 200;
      case "carousel":
        return 320;
      case "stack":
        return 190;
      case "conversation":
        return 420;
      case "spotlight":
        return 460;
      case "orbit":
        return 540;
      case "bento":
        return count > 4 ? 640 : 480;
      case "marquee":
        return 160;
      case "wall":
      default:
        if (count <= 3) return 360;
        return 580;
    }
  };

  const getEmbedCode = () => {
    const widgetId = userId || "demo-widget";
    const estimatedHeight = getEstimatedHeight(layout, testimonials.length);

    if (layout === "stack") {
      if (stackEmbedMode === "inline") {
        return `<!-- Blovi Spotlight: Inline Card -->
<div id="blovi-widget" data-widget-id="${widgetId}" style="width: 100%; max-width: 460px; min-height: 190px;"></div>
<script 
  src="${appUrl}/widget.js" 
  data-user="${widgetId}"
  data-type="stack"
  data-preset="${preset}"
  data-theme="${theme}"
  data-accent="${primaryColor}"
  data-text-color="${textColor}"
  data-rating-color="${ratingColor}"
  data-rating-border-color="${ratingBorderColor}"
  data-highlight-color="${highlightColor}"
  data-show-photos="${showPhotos}"
  data-use-gravatar="${useGravatar}"
  data-fallback-avatar="${fallbackAvatar}"
  data-show-branding="${showBranding}"
  async
></script>`;
      }

      return `<!-- Blovi Spotlight: Floating Corner Widget (Pinned to bottom-left) -->
<div style="position: fixed; bottom: 24px; left: 24px; z-index: 9999; max-width: 400px; width: 100%;">
  <div id="blovi-widget" data-widget-id="${widgetId}" style="width: 100%; min-height: 190px;"></div>
  <script 
    src="${appUrl}/widget.js" 
    data-user="${widgetId}"
    data-type="stack"
    data-preset="${preset}"
    data-theme="${theme}"
    data-accent="${primaryColor}"
    data-text-color="${textColor}"
    data-rating-color="${ratingColor}"
    data-rating-border-color="${ratingBorderColor}"
    data-highlight-color="${highlightColor}"
    data-show-photos="${showPhotos}"
    data-use-gravatar="${useGravatar}"
    data-fallback-avatar="${fallbackAvatar}"
    data-show-branding="${showBranding}"
    async
  ></script>
</div>`;
    }

    return `<!-- Blovi Widget: ${layout.toUpperCase()} (${preset.toUpperCase()} PRESET) -->
<div id="blovi-widget" data-widget-id="${widgetId}" style="width: 100%; min-height: ${estimatedHeight}px; contain: layout style paint; position: relative;"></div>
<script 
  src="${appUrl}/widget.js" 
  data-user="${widgetId}"
  data-type="${layout}"
  data-preset="${preset}"
  data-theme="${theme}"
  data-accent="${primaryColor}"
  data-text-color="${textColor}"
  data-rating-color="${ratingColor}"
  data-rating-border-color="${ratingBorderColor}"
  data-highlight-color="${highlightColor}"
  data-show-photos="${showPhotos}"
  data-use-gravatar="${useGravatar}"
  data-fallback-avatar="${fallbackAvatar}"
  data-chat-customer-prompt="${chatCustomerPrompt}"
  data-chat-founder-reply="${chatFounderReply}"
  data-show-branding="${showBranding}"
  async
></script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const layoutOptions: { id: WidgetType; label: string }[] = [
    { id: "wall", label: "Wall of Love" },
    { id: "stack", label: "Spotlight" },
    { id: "orbit", label: "Orbit" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F4F1] font-sans text-gray-900 overflow-hidden relative">
      {/* LEFT PANEL */}
      <div className="w-[360px] bg-white border-r border-zinc-200/70 flex flex-col h-screen shrink-0 z-10">
        <div className="p-3.5 border-b border-zinc-200/60 bg-white shrink-0">
          <div className="p-1 bg-zinc-100/80 rounded-xl grid grid-cols-2 gap-1 border border-zinc-200/60">
            <button
              type="button"
              onClick={() => setTab("design")}
              className={`flex items-center justify-center gap-2 py-1.5 px-3 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                tab === "design"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <SlidersHorizontal size={13} className={tab === "design" ? "text-blue-600" : "text-zinc-400"} />
              <span>Customize</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("embed")}
              className={`flex items-center justify-center gap-2 py-1.5 px-3 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                tab === "embed"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Code size={13} className={tab === "embed" ? "text-blue-600" : "text-zinc-400"} />
              <span>Embed Code</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {tab === "design" ? (
            <>
              {/* 1. Widget Layout - Minimalist Segmented Pill */}
              <section className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Layout style
                </label>
                <div className="p-1 bg-zinc-100/80 rounded-xl grid grid-cols-3 gap-1 border border-zinc-200/60">
                  {layoutOptions.map((opt) => {
                    const isSelected = layout === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLayout(opt.id)}
                        className={`py-1.5 px-2 text-xs rounded-lg transition-all text-center cursor-pointer font-medium truncate ${
                          isSelected
                            ? "bg-white text-zinc-900 shadow-xs"
                            : "text-zinc-500 hover:text-zinc-900"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. Colors */}
              <section className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Palette &amp; accents
                </label>
                <div className="bg-white border border-zinc-200/80 rounded-xl divide-y divide-zinc-100 shadow-2xs overflow-hidden">
                  {colorFields.map(({ label, value, onChange }) => {
                    const swatchColor =
                      /^#[0-9A-Fa-f]{6}$/.test(value)
                        ? value
                        : /^#[0-9A-Fa-f]{8}$/.test(value)
                        ? value.slice(0, 7)
                        : "#000000";

                    return (
                      <div
                        key={label}
                        className="flex items-center justify-between py-2.5 px-3.5 hover:bg-zinc-50/60 transition-colors"
                      >
                        <span className="text-xs font-medium text-zinc-700">{label}</span>
                        <div className="flex items-center gap-2 px-2 py-1 bg-zinc-50 hover:bg-zinc-100/80 focus-within:bg-white focus-within:ring-1 focus-within:ring-zinc-400 border border-zinc-200/70 rounded-lg transition-all shadow-2xs">
                          <label className="relative w-4 h-4 rounded-full ring-1 ring-black/10 shrink-0 cursor-pointer overflow-hidden block">
                            <span
                              className="absolute inset-0 rounded-full"
                              style={{ backgroundColor: swatchColor }}
                            />
                            <input
                              type="color"
                              value={swatchColor}
                              onChange={(e) => {
                                const newColor =
                                  value.length === 9 && value.startsWith("#")
                                    ? e.target.value + value.slice(7)
                                    : e.target.value;
                                onChange(newColor);
                              }}
                              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-18 text-[11px] font-mono text-zinc-800 font-medium bg-transparent focus:outline-none uppercase"
                            spellCheck={false}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. Branding */}
              <section className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Branding
                </label>
                <div className="bg-white border border-zinc-200/80 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium text-zinc-900">Blovi badge</div>
                    <div className="text-[11px] text-zinc-500">Show &ldquo;Powered by Blovi&rdquo; badge</div>
                  </div>
                  <Switch checked={showBranding} onChange={setShowBranding} />
                </div>
              </section>
            </>
          ) : (
            /* GET CODE SNIPPET TAB */
            <div className="space-y-5">
              {/* If Spotlight: show placement toggle */}
              {layout === "stack" && (
                <section className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Spotlight placement
                  </label>
                  <div className="p-1 bg-zinc-100/80 rounded-xl grid grid-cols-2 gap-1 border border-zinc-200/60">
                    <button
                      type="button"
                      onClick={() => setStackEmbedMode("floating")}
                      className={`py-1.5 px-3 text-xs rounded-lg transition-all text-center cursor-pointer font-medium ${
                        stackEmbedMode === "floating"
                          ? "bg-white text-zinc-900 shadow-xs"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      Floating corner
                    </button>
                    <button
                      type="button"
                      onClick={() => setStackEmbedMode("inline")}
                      className={`py-1.5 px-3 text-xs rounded-lg transition-all text-center cursor-pointer font-medium ${
                        stackEmbedMode === "inline"
                          ? "bg-white text-zinc-900 shadow-xs"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      Inline card
                    </button>
                  </div>
                </section>
              )}

              {/* Primary 1-Click Copy Action */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-xs active:scale-[0.99] ${
                    copiedCode
                      ? "bg-emerald-600 text-white shadow-emerald-900/10"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/15"
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <Check size={14} className="stroke-[2.5]" />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy embed code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Minimal Clear Instructions */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-100/70 rounded-xl">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Paste before the closing{" "}
                  <code className="text-[11px] font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200/80 text-blue-600 font-semibold shadow-2xs">
                    &lt;/body&gt;
                  </code>{" "}
                  tag on HTML, Framer, Webflow, or WordPress.
                </p>
              </div>

              {/* Code Card */}
              <section className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Code snippet
                </label>
                <div className="relative rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-xs">
                  <div className="flex items-center justify-between px-3.5 py-2 border-b border-zinc-800/60 bg-zinc-900/50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-zinc-700/60" />
                      <div className="w-2 h-2 rounded-full bg-zinc-700/60" />
                      <div className="w-2 h-2 rounded-full bg-zinc-700/60" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      script
                    </span>
                  </div>
                  <pre className="p-3.5 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-56 scrollbar-thin select-all">
                    {getEmbedCode()}
                  </pre>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAF9F6]">

        {/* Right Panel Main View: Live Iframe Preview */}
        <div className="flex-1 w-full h-full p-4 md:p-6 overflow-hidden flex flex-col">
          <div className="w-full flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col relative">
            {/* Top Browser Chrome Bar */}
            <div className="h-10 bg-[#FAF9F6] border-b border-gray-200/80 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="bg-white border border-gray-200/80 rounded-md px-3 py-0.5 text-[11px] text-gray-500 font-mono flex items-center gap-1.5 shadow-2xs">
                <span className="text-gray-400">https://</span>your-website.com
              </div>
              <div className="w-12" />
            </div>

            {/* Preview Stage Area */}
            {layout === "stack" ? (
              <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col justify-between p-6 md:p-8 bg-[#FBFBFA]">
                {/* Simulated Website Content in Background */}
                <div className="max-w-md space-y-4 pt-4 select-none pointer-events-none opacity-40">
                  <div className="h-2.5 w-24 bg-blue-600/30 rounded-full" />
                  <div className="h-7 w-72 bg-gray-900/20 rounded-lg" />
                  <div className="h-3.5 w-80 bg-gray-400/25 rounded-md" />
                  <div className="flex gap-2.5 pt-2">
                    <div className="h-8 w-24 bg-blue-600/30 rounded-lg" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>

                {/* The Floating Card Spotlight Pinned to Bottom-Left (Just like on the live site) */}
                <div className="w-[400px] max-w-full">
                  <iframe
                    key={`preview-stack-${rawPreviewUrl}`}
                    src={rawPreviewUrl}
                    className="w-full border-none block bg-transparent"
                    style={{ height: "170px" }}
                    title="Live Render Output"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 w-full h-full overflow-hidden bg-white">
                <iframe
                  key={`preview-full-${rawPreviewUrl}`}
                  src={rawPreviewUrl}
                  className="w-full h-full border-none"
                  title="Live Render Output"
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
