"use client";

import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  LayoutGrid,
  GalleryHorizontal,
  Rows3,
  Quote,
  Lock,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import {
  WallContent,
  CarouselContent,
  MarqueeContent,
  SingleQuoteContent,
  SAMPLE_TESTIMONIALS,
  type Testimonial,
  type WallLayout,
  type WallTheme,
  type WidgetType,
  type WidgetRadius,
} from "../../embed/wall-renderer";
import { BlurFade } from "@/components/magicui/blur-fade";
import { motion } from "framer-motion";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type MaxOption = "3" | "6" | "all";

const WIDGET_TYPES: { value: WidgetType; label: string; icon: typeof LayoutGrid }[] = [
  { value: "wall", label: "Wall of Love", icon: LayoutGrid },
  { value: "carousel", label: "Carousel", icon: GalleryHorizontal },
  { value: "marquee", label: "Marquee", icon: Rows3 },
  { value: "single", label: "Single Quote", icon: Quote },
];

function Toggle({
  checked,
  onChange,
  disabled,
  title,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  title?: string;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-[#1A1A1A]">{label}</p>
        <p className="text-xs text-[#6B6B6B]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        title={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
          checked ? "bg-[#E8743B]" : "bg-[#ECE7E0]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function WidgetBuilder({
  userId,
  isLifetime,
  email,
  testimonials,
}: {
  userId: string;
  isLifetime: boolean;
  email?: string;
  testimonials: Testimonial[];
}) {
  const DEFAULT_ACCENT = "#E8743B";
  const [widgetType, setWidgetType] = useState<WidgetType>("wall");
  const [layout, setLayout] = useState<string>("grid");
  const [theme, setTheme] = useState<WallTheme>("light");
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [radius, setRadius] = useState<WidgetRadius>("rounded");
  const [max, setMax] = useState<MaxOption>("all");
  const [showRatings, setShowRatings] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [containerWidth, setContainerWidth] = useState(600);
  const [containerHeight, setContainerHeight] = useState(500);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.max(300, entry.contentRect.width - 48)); // subtract p-6 padding
        setContainerHeight(Math.max(200, entry.contentRect.height - 48)); // subtract p-6 padding
      }
    });
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (widgetType === "single") {
      setLayout("card");
    } else if (widgetType === "wall") {
      setLayout("grid");
    }
  }, [widgetType]);

  const maxCount = max === "all" ? null : Number(max);
  const badgeOn = isLifetime ? showBadge : true;
  const usingSamples = testimonials.length === 0;
  const previewList = usingSamples ? SAMPLE_TESTIMONIALS : testimonials;
  const featured = previewList[featuredIndex] ?? previewList[0] ?? null;

  const params = new URLSearchParams();
  params.set("type", widgetType);
  if (widgetType === "wall") {
    params.set("layout", "grid");
    params.set("max", max);
  } else if (widgetType === "single") {
    params.set("layout", layout);
    params.set("featured", String(featuredIndex));
  }
  params.set("theme", theme);
  params.set("ratings", showRatings ? "true" : "false");
  if (accent !== DEFAULT_ACCENT) params.set("accent", accent.replace("#", ""));
  if (radius !== "rounded") params.set("radius", radius);
  if (isLifetime) params.set("badge", showBadge ? "true" : "false");
  const query = params.toString();

  const liveUrl = `${APP_URL}/embed/${userId}?${query}`;
  const relativeEmbedUrl = `/embed/${userId}?${query}${usingSamples ? "&demo=1" : ""}`;

  let targetWidth = 1200;
  let targetHeight = 500;

  if (previewMode === "tablet") {
    targetWidth = 768;
    targetHeight = 550;
  } else if (previewMode === "mobile") {
    targetWidth = 380;
    targetHeight = 600;
  }

  const scaleX = containerWidth / targetWidth;
  const scaleY = containerHeight / targetHeight;
  const scale = Math.min(scaleX, scaleY, 1);
  const parentHeight = Math.min(targetHeight, containerHeight);
  const scaledHeight = parentHeight / scale;

  const dataAttrs = [`data-user="${userId}"`, `data-type="${widgetType}"`];
  if (widgetType === "wall") {
    dataAttrs.push('data-layout="grid"', `data-max="${max}"`);
  } else if (widgetType === "single") {
    dataAttrs.push(`data-layout="${layout}"`, `data-featured="${featuredIndex}"`);
  }
  dataAttrs.push(
    `data-theme="${theme}"`,
    `data-ratings="${showRatings ? "true" : "false"}"`
  );
  if (accent !== DEFAULT_ACCENT) dataAttrs.push(`data-accent="${accent.replace("#", "")}"`);
  if (radius !== "rounded") dataAttrs.push(`data-radius="${radius}"`);
  if (isLifetime) dataAttrs.push(`data-badge="${showBadge ? "true" : "false"}"`);

  const snippet = `<script src="${APP_URL}/widget.js" ${dataAttrs.join(" ")}></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
      {/* Sliding Segmented Widget Switcher */}
      <div className="mb-6 shrink-0 inline-flex flex-wrap gap-1 rounded-xl border border-[#ECE7E0] bg-white p-1 shadow-sm relative z-0">
        {WIDGET_TYPES.map((t) => {
          const typeLocked = !isLifetime && t.value !== "wall";
          if (typeLocked) {
            return (
              <PaddleCheckout
                key={t.value}
                email={email}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#9CA3AF] transition-all duration-200 hover:bg-[#FFF4EE] hover:text-[#E8743B] cursor-pointer"
              >
                <t.icon size={15} />
                {t.label}
                <span className="flex items-center gap-1 rounded-full bg-[#E8743B]/10 px-2 py-0.5 text-[10px] font-bold text-[#E8743B]">
                  <Lock size={9} />
                  Unlock
                </span>
              </PaddleCheckout>
            );
          }
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setWidgetType(t.value)}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 z-10 ${
                widgetType === t.value
                  ? "text-white"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              {widgetType === t.value && (
                <motion.div
                  layoutId="active-widget-type"
                  className="absolute inset-0 bg-[#E8743B] rounded-lg -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <t.icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-stretch lg:flex-1 lg:min-h-0 lg:max-h-full">
        {/* Settings Sidebar */}
        <div className="lg:col-span-5 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col gap-6 lg:h-full lg:overflow-y-auto pr-2">
          {/* Section 1: Theme & Shape */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] border-b border-[#ECE7E0] pb-2">
              1. Theme & Shape
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {/* Visual Theme Card Selectors */}
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Theme</p>
                <div className="mt-2 flex gap-4">
                  {(
                    [
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                    ] as { value: WallTheme; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTheme(opt.value)}
                      className={`flex-1 flex flex-col items-center gap-2.5 rounded-xl border p-3 text-center transition-all duration-200 ${
                        theme === opt.value
                          ? "border-[#E8743B] bg-[#FFF4EE]/30 ring-1 ring-[#E8743B]"
                          : "border-[#ECE7E0] bg-white hover:border-[#1A1A1A]/20"
                      }`}
                    >
                      {/* Miniature card mockup */}
                      <div className={`w-full h-12 rounded-lg border p-2 flex flex-col gap-1 transition-all ${
                        opt.value === "dark" 
                          ? "bg-[#16161D] border-white/5" 
                          : "bg-white border-[#ECE7E0]"
                      }`}>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-[#E8743B]/20" />
                          <div className={`h-1 w-6 rounded ${opt.value === "dark" ? "bg-white/20" : "bg-zinc-800"}`} />
                        </div>
                        <div className={`h-0.5 w-full rounded ${opt.value === "dark" ? "bg-white/10" : "bg-zinc-100"}`} />
                        <div className={`h-0.5 w-4/5 rounded ${opt.value === "dark" ? "bg-white/10" : "bg-zinc-100"}`} />
                      </div>
                      <span className="text-xs font-semibold text-[#1A1A1A]">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[#6B6B6B]">
                  Tip: use{" "}
                  <code className="rounded bg-[#FAF8F5] px-1 py-0.5 font-mono text-[10px] text-zinc-600">
                    data-theme=&quot;auto&quot;
                  </code>{" "}
                  in the snippet to automatically match user preferences.
                </p>
              </div>

              {/* Visual Corner Radius Option Cards */}
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Corners</p>
                <div className="mt-2 flex gap-3">
                  {(
                    [
                      { value: "sharp", label: "Sharp", borderRadius: "rounded-none" },
                      { value: "rounded", label: "Rounded", borderRadius: "rounded-md" },
                      { value: "pill", label: "Soft", borderRadius: "rounded-xl" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRadius(opt.value)}
                      className={`flex-1 flex flex-col items-center gap-2 rounded-xl border p-2.5 text-center transition-all duration-200 ${
                        radius === opt.value
                          ? "border-[#E8743B] bg-[#FFF4EE]/30 ring-1 ring-[#E8743B]"
                          : "border-[#ECE7E0] bg-white hover:border-[#1A1A1A]/20"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        <div className={`w-5 h-5 border-2 border-dashed transition-all ${
                          radius === opt.value ? "border-[#E8743B]" : "border-zinc-300"
                        } ${opt.borderRadius}`} />
                      </div>
                      <span className="text-xs font-semibold text-[#1A1A1A]">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Colors & Style */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] border-b border-[#ECE7E0] pb-2">
              2. Branding & Appearance
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {/* Preset Palette + Picker */}
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Brand Color</p>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  {[
                    { value: "#E8743B", label: "Blovi Orange" },
                    { value: "#6366F1", label: "Indigo Ink" },
                    { value: "#10B981", label: "Emerald Mint" },
                    { value: "#EC4899", label: "Crimson Rose" },
                    { value: "#18181B", label: "Obsidian Slate" },
                  ].map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setAccent(color.value)}
                      title={color.label}
                      className={`h-6 w-6 rounded-full border border-white shadow-sm ring-1 transition-all duration-250 hover:scale-110 ${
                        accent === color.value
                          ? "ring-[#1A1A1A] scale-105"
                          : "ring-[#ECE7E0]"
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}

                  {/* Custom color selector */}
                  <div className="relative flex items-center gap-1.5 pl-2 border-l border-zinc-200">
                    <input
                      type="color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      aria-label="Custom brand accent color"
                      className="h-7 w-9 cursor-pointer rounded border border-[#ECE7E0] bg-white p-0.5"
                    />
                    <span className="font-mono text-xs text-[#6B6B6B] lowercase select-all">{accent}</span>
                    {accent !== DEFAULT_ACCENT && (
                      <button
                        type="button"
                        onClick={() => setAccent(DEFAULT_ACCENT)}
                        className="text-xs font-semibold text-zinc-500 underline underline-offset-2 hover:text-[#1A1A1A]"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Options & Limits */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] border-b border-[#ECE7E0] pb-2">
              3. Options & Limits
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {widgetType === "wall" && (
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Max testimonials to show</p>
                  <div className="mt-2 flex gap-3">
                    {(
                      [
                        { value: "3", label: "3 Reviews", desc: "Compact grid" },
                        { value: "6", label: "6 Reviews", desc: "Standard page" },
                        { value: "all", label: "Unlimited", desc: "Show all reviews" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMax(opt.value)}
                        className={`flex-1 flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-200 ${
                          max === opt.value
                            ? "border-[#E8743B] bg-[#FFF4EE]/30 ring-1 ring-[#E8743B]"
                            : "border-[#ECE7E0] bg-white hover:border-[#1A1A1A]/20"
                        }`}
                      >
                        <span className="text-xs font-bold text-[#1A1A1A]">{opt.label}</span>
                        <span className="text-[10px] text-[#6B6B6B]">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {widgetType === "single" && (
                <div className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#1A1A1A]">
                      Featured testimonial
                    </label>
                    <select
                      value={featuredIndex}
                      onChange={(e) => setFeaturedIndex(Number(e.target.value))}
                      className="w-full rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm text-[#1A1A1A] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20 disabled:opacity-50"
                    >
                      {previewList.map((t, i) => (
                        <option key={t.id} value={i}>
                          {t.author_name} — &ldquo;
                          {(t.display_body ?? t.body_original).slice(0, 40)}
                          {(t.display_body ?? t.body_original).length > 40 ? "…" : ""}
                          &rdquo;
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Layout Variant</p>
                    <div className="mt-2 flex gap-4">
                      {[
                        { value: "card", label: "Featured Card" },
                        { value: "minimal", label: "Minimalist Editorial" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#ECE7E0] bg-white p-2.5 text-center text-xs font-semibold cursor-pointer select-none transition-all hover:border-[#1A1A1A]/20"
                        >
                          <input
                            type="radio"
                            name="single-layout"
                            checked={(layout === "minimal" ? "minimal" : "card") === opt.value}
                            onChange={() => setLayout(opt.value)}
                            className="accent-[#E8743B]"
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle controls */}
              <div className="flex flex-col gap-4 pt-2">
                <Toggle
                  checked={showRatings}
                  onChange={setShowRatings}
                  label="Show ratings"
                  description="Display star ratings on each testimonial"
                />
                <Toggle
                  checked={badgeOn}
                  onChange={setShowBadge}
                  disabled={!isLifetime}
                  title={!isLifetime ? "Upgrade to lifetime to remove" : undefined}
                  label='Show "Powered by Blovi" badge'
                  description={
                    isLifetime
                      ? "Display attribution at the bottom of your widget"
                      : "Upgrade to lifetime to remove"
                  }
                />
              </div>
            </div>
          </div>

          {/* Embed Code IDE Terminal Snippet */}
          <div className="mt-2 border-t border-[#ECE7E0] pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#1A1A1A]">Embed code</p>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#E8743B] transition-all duration-200 hover:bg-[#FFF4EE] active:scale-95"
              >
                {copied ? (
                  <>
                    <Check size={13} strokeWidth={2.5} className="text-[#2E9E6B]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            {/* macOS IDE editor container */}
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A0B] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  integration snippet
                </span>
                <div className="w-10" />
              </div>
              
              <div className="flex font-mono text-[11px] leading-relaxed text-[#ECE7E0] p-4 overflow-x-auto whitespace-pre">
                {/* Mock line numbers */}
                <div className="flex flex-col text-zinc-600 select-none text-right pr-4 border-r border-white/5 mr-4 font-semibold">
                  <span>1</span>
                  <span>2</span>
                </div>
                {/* Highlighted code snippet */}
                <div className="flex-1 select-all break-all whitespace-pre-wrap">
                  <span className="text-[#E8743B]">&lt;script</span>{" "}
                  <span className="text-[#FEBC2E]">src</span>=<span className="text-[#27C93F]">&quot;{APP_URL}/widget.js&quot;</span>
                  {dataAttrs.map((attr, idx) => {
                    const [key, val] = attr.split("=");
                    return (
                      <span key={idx}>
                        <br />
                        {"  "}
                        <span className="text-[#FEBC2E]">{key}</span>=<span className="text-[#27C93F]">{val}</span>
                      </span>
                    );
                  })}
                  <span className="text-[#E8743B]">&gt;&lt;/script&gt;</span>
                </div>
              </div>
            </div>
            {!isLifetime && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Free plan — up to 3 testimonials. Upgrade for unlimited.
              </p>
            )}
          </div>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-semibold text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
          >
            <ExternalLink size={15} />
            View live widget
          </a>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7 flex flex-col gap-4 lg:h-full lg:max-h-full lg:overflow-hidden">
          <div className="flex items-center justify-between">
            {/* Device Sizing Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-[#ECE7E0] bg-white p-0.5 shadow-sm">
              {(
                [
                  { value: "desktop", label: "Desktop", icon: Monitor },
                  { value: "tablet", label: "Tablet", icon: Tablet },
                  { value: "mobile", label: "Mobile", icon: Smartphone },
                ] as const
              ).map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setPreviewMode(size.value)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    previewMode === size.value
                      ? "bg-[#E8743B] text-white shadow-sm"
                      : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                  }`}
                >
                  <size.icon size={13} />
                  {size.label}
                </button>
              ))}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-[#2E9E6B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E6B]" />
              Live Preview
            </span>
          </div>

          {/* Designer Dotted Grid Canvas */}
          <BlurFade delay={0.1} className="lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
            <div ref={canvasRef} className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-6 shadow-sm relative overflow-hidden lg:flex-1 lg:flex lg:flex-col lg:min-h-0">
              <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none opacity-80 z-0" />
              
              {/* Parent Scaled Wrapper to maintain correct layout space */}
              <div 
                className="mx-auto my-auto transition-all duration-300 ease-out lg:min-h-0 shrink-0"
                style={{
                  width: `${targetWidth * scale}px`,
                  height: `${parentHeight}px`,
                  overflow: "hidden",
                }}
              >
                {/* Mock Browser Frame */}
                <div
                  className="overflow-hidden rounded-xl border border-[#ECE7E0] bg-white shadow-lg relative z-10 shrink-0"
                  style={{
                    width: `${targetWidth}px`,
                    height: `${targetHeight}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {/* macOS Browser Header bar */}
                  <div className="flex items-center justify-between border-b border-[#ECE7E0] bg-[#FAF8F5] px-4 py-2 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="mx-4 flex-1 max-w-[280px] rounded bg-white border border-[#ECE7E0] py-0.5 px-3 text-[10px] text-center text-zinc-400 select-all font-mono truncate">
                      blovi.space/embed/{userId.slice(0, 8)}...
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Inner Preview Content - Rendered in iframe to isolate context and support real responsive viewport media queries */}
                  <div
                    className="w-full h-full overflow-hidden"
                    style={{
                      backgroundColor: theme === "dark" ? "#16161D" : "#ffffff",
                    }}
                  >
                    <iframe
                      key={relativeEmbedUrl}
                      src={relativeEmbedUrl}
                      className="w-full h-full border-none block"
                      title="Widget Live Preview"
                    />
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
