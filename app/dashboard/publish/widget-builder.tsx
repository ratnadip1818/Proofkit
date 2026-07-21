"use client";

import React, { useState } from "react";
import {
  Settings,
  Code,
  Zap,
  ExternalLink,
  Maximize2,
  User,
  ChevronLeft,
  ChevronRight,
  Star,
  Layout,
  Check,
  Copy,
  X,
  Sparkles,
  Save
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
  // Widget Customization States mapped to persisable config
  const [preset, setPreset] = useState("base");
  const [theme, setTheme] = useState("light");
  const [showPhotos, setShowPhotos] = useState(true);
  const [useGravatar, setUseGravatar] = useState(true);
  const [fallbackAvatar, setFallbackAvatar] = useState("Placeholder");
  const [fontFamily, setFontFamily] = useState("Inter (Default)");
  const [showBranding, setShowBranding] = useState(true);
  const [textColor, setTextColor] = useState("#374151");
  const [primaryColor, setPrimaryColor] = useState("#2564EB");
  const [ratingColor, setRatingColor] = useState("#FBBF24");
  const [ratingBorderColor, setRatingBorderColor] = useState("#4E46E5");
  const [highlightColor, setHighlightColor] = useState("#FFCD3640");

  // UI state
  const [tab, setTab] = useState<"design" | "embed">("design");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Active testimonial data from DB or fallback
  const activeTestimonial = testimonials.length > 0
    ? testimonials[testimonialIndex % testimonials.length]
    : {
        author_name: "Ratnadip Ubale",
        author_role: "Founder at Blovi",
        display_body: "Blovi transformed how we collect social proof. Our conversion rate jumped 34% in the first month.",
        body_original: "Blovi transformed how we collect social proof. Our conversion rate jumped 34% in the first month.",
        rating: 5,
        avatar_url: null,
      };

  const reviewText = activeTestimonial.display_body || activeTestimonial.body_original || "Blovi is great, cheap and good.";
  const authorName = activeTestimonial.author_name || "Ratnadip Ubale";
  const authorRole = activeTestimonial.author_role || "Customer";
  const starRating = activeTestimonial.rating ?? 5;

  const colorFields = [
    { label: "Text Color", value: textColor, onChange: setTextColor },
    { label: "Primary Color", value: primaryColor, onChange: setPrimaryColor },
    { label: "Rating Color", value: ratingColor, onChange: setRatingColor },
    { label: "Rating Border Color", value: ratingBorderColor, onChange: setRatingBorderColor },
    { label: "Highlight Color", value: highlightColor, onChange: setHighlightColor },
  ];

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";
  const rawPreviewUrl = `/embed/${userId || "demo-widget"}?preset=${preset}&theme=${theme}&accent=${encodeURIComponent(primaryColor)}`;

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
  data-max="9"
  defer>
</script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    const { error } = await saveWidgetConfig({
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
      font_family: fontFamily.split(" ")[0],
      show_branding: showBranding,
    });
    setSaving(false);
    if (error) {
      setSaveStatus("Failed to save settings");
    } else {
      setSaveStatus("Saved successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F4F1] font-sans text-gray-900 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[440px] bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 shadow-sm z-10">
        <div className="px-8 pt-8 shrink-0">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-1">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTab("design")}
                className={`text-sm font-semibold cursor-pointer pb-4 -mb-[17px] transition-all border-b-2 ${
                  tab === "design"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                1. Widget Design
              </button>
              <Code size={16} className="text-gray-300" />
              <button
                type="button"
                onClick={() => setTab("embed")}
                className={`text-sm font-medium cursor-pointer pb-4 -mb-[17px] transition-all border-b-2 ${
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

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {tab === "design" ? (
            <>
              {/* Widget Layout Style */}
              <section>
                <div className="font-medium text-sm text-gray-900 mb-3">Widget Layout Style</div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-800 hover:bg-gray-50 shadow-xs cursor-pointer"
                >
                  <Layout size={16} className="text-gray-500" />
                  Wall of Love
                  <span className="bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-blue-100 ml-1">
                    Active
                  </span>
                </button>
              </section>

              <hr className="border-gray-100" />

              {/* Widget Design Preset */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Settings size={16} className="text-gray-400" />
                  <span className="font-medium text-sm text-gray-900">Widget Design Preset</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Base", "Editorial", "Modern", "Luxury", "Minimal"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPreset(p.toLowerCase())}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all cursor-pointer ${
                        preset === p.toLowerCase()
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 font-semibold shadow-xs"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Theme */}
              <section>
                <div className="font-medium text-sm text-gray-900 mb-3">Color Theme</div>
                <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                  {["Light", "Dark", "Transparent"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t.toLowerCase())}
                      className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                        theme === t.toLowerCase()
                          ? "bg-white shadow-xs text-gray-900 border border-gray-200/50 font-semibold"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>

              {/* Colors */}
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

              {/* Show Customer Photos */}
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

              {/* Typography */}
              <section>
                <div className="font-medium text-sm text-gray-900 mb-3">Typography</div>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option>Inter (Default)</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Outfit</option>
                </select>
              </section>

              <hr className="border-gray-100" />

              {/* Branding */}
              <section>
                <div className="flex items-center justify-between">
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

        {/* SAVE BUTTON AT BOTTOM OF LEFT PANEL */}
        <div className="p-6 border-t border-gray-200 bg-white shrink-0 flex items-center justify-between">
          {saveStatus && (
            <span className={`text-xs font-semibold ${saveStatus.includes("Failed") ? "text-red-600" : "text-emerald-600"}`}>
              {saveStatus}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="px-10 py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50 shadow-xs">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            Live Render Output (Wall · {preset})
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
