"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  Zap,
  ChevronRight,
  Layout,
  Check,
  Copy,
  X,
  Sliders,
  Layers,
  Quote,
  Globe,
} from "lucide-react";
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
  const [layoutDrawerOpen, setLayoutDrawerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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
    { label: "Text Color", value: textColor, onChange: setTextColor },
    { label: "Primary Color", value: primaryColor, onChange: setPrimaryColor },
    { label: "Rating Color", value: ratingColor, onChange: setRatingColor },
    { label: "Rating Border Color", value: ratingBorderColor, onChange: setRatingBorderColor },
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
      return `<!-- Option 1: Floating Corner Spotlight (Pinned to bottom-left like uicolors.app) -->
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
</div>

<!-- Option 2: Inline Card (inside any section on your page) -->
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

  const layoutStylesList = [
    { id: "wall", name: "Wall of Love Grid", desc: "Multi-column masonry grid showcasing all your top customer reviews.", icon: Layout },
    { id: "orbit", name: "Orbit Social Cosmos", desc: "Perpetual dual-ring counter-rotating community orbit around your gravitational brand logo.", icon: Globe },
    { id: "stack", name: "Card Spotlight", desc: "Sleek floating testimonial spotlight modeled after modern SaaS cards. Calm 10s auto-cycle with gentle float transitions.", icon: Layers },
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
                    <span className="font-semibold text-gray-900">
                      {layoutStylesList.find((l) => l.id === layout)?.name || "Wall of Love Grid"}
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-blue-100">
                      Active
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </section>

              <hr className="border-gray-100" />

              {/* 2. Colors */}
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

              {/* 3. Branding */}
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
                const isSelected = layout === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setLayout(item.id as WidgetType);
                      setLayoutDrawerOpen(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80"
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900">{item.name}</span>
                        {isSelected ? (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Active
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-semibold hover:bg-blue-100 transition-colors">
                            Select Layout
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

      {/* LAYOUT DRAWER MODAL END */}
    </div>
  );
}
