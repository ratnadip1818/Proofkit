"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  LayoutGrid,
  GalleryHorizontal,
  Rows3,
  Quote,
  Lock,
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

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type MaxOption = "3" | "6" | "9" | "all";

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
        <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
        <p className="text-xs text-[#6B6B6B]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        title={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-[#E8743B]" : "bg-[#ECE7E0]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
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
  const [layout, setLayout] = useState<WallLayout>("masonry");
  const [theme, setTheme] = useState<WallTheme>("light");
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [radius, setRadius] = useState<WidgetRadius>("rounded");
  const [max, setMax] = useState<MaxOption>("all");
  const [showRatings, setShowRatings] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const maxCount = max === "all" ? null : Number(max);
  const badgeOn = isLifetime ? showBadge : true;
  // No approved testimonials yet — preview with samples so every
  // style/theme choice is actually visible.
  const usingSamples = testimonials.length === 0;
  const previewList = usingSamples ? SAMPLE_TESTIMONIALS : testimonials;
  const featured = previewList[featuredIndex] ?? previewList[0] ?? null;

  const params = new URLSearchParams();
  params.set("type", widgetType);
  if (widgetType === "wall") {
    params.set("layout", layout);
    params.set("max", max);
  }
  params.set("theme", theme);
  params.set("ratings", showRatings ? "true" : "false");
  if (accent !== DEFAULT_ACCENT) params.set("accent", accent.replace("#", ""));
  if (radius !== "rounded") params.set("radius", radius);
  if (widgetType === "single") params.set("featured", String(featuredIndex));
  if (isLifetime) params.set("badge", showBadge ? "true" : "false");
  const query = params.toString();

  const liveUrl = `${APP_URL}/embed/${userId}?${query}`;

  const dataAttrs = [`data-user="${userId}"`, `data-type="${widgetType}"`];
  if (widgetType === "wall") {
    dataAttrs.push(`data-layout="${layout}"`, `data-max="${max}"`);
  }
  dataAttrs.push(
    `data-theme="${theme}"`,
    `data-ratings="${showRatings ? "true" : "false"}"`
  );
  if (accent !== DEFAULT_ACCENT) dataAttrs.push(`data-accent="${accent.replace("#", "")}"`);
  if (radius !== "rounded") dataAttrs.push(`data-radius="${radius}"`);
  if (widgetType === "single") dataAttrs.push(`data-featured="${featuredIndex}"`);
  if (isLifetime) dataAttrs.push(`data-badge="${showBadge ? "true" : "false"}"`);

  const snippet = `<script src="${APP_URL}/widget.js" ${dataAttrs.join(" ")}></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="mb-5 inline-flex flex-wrap gap-1 rounded-xl border border-[#ECE7E0] bg-white p-1 shadow-sm">
        {WIDGET_TYPES.map((t) => {
          // Free tier: only Wall of Love — other types open checkout
          const typeLocked = !isLifetime && t.value !== "wall";
          if (typeLocked) {
            return (
              <PaddleCheckout
                key={t.value}
                email={email}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#9CA3AF] transition-all duration-200 hover:bg-[#FFF4EE] hover:text-[#E8743B]"
              >
                <t.icon size={15} />
                {t.label}
                <span className="flex items-center gap-1 rounded-full bg-[#E8743B]/10 px-2 py-0.5 text-[10px] font-bold text-[#E8743B]">
                  <Lock size={9} />
                  Upgrade to unlock
                </span>
              </PaddleCheckout>
            );
          }
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setWidgetType(t.value)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                widgetType === t.value
                  ? "bg-[#E8743B] text-white shadow-sm"
                  : "text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#1A1A1A]"
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Settings + embed code */}
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Widget settings
          </h2>

          {widgetType === "wall" && (
            <div className="mt-4">
              <p className="text-sm font-medium text-[#1A1A1A]">Layout</p>
              <div className="mt-2 flex gap-5">
                {(
                  [
                    { value: "masonry", label: "Masonry" },
                    { value: "grid", label: "Grid" },
                  ] as { value: WallLayout; label: string }[]
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-sm text-[#1A1A1A]"
                  >
                    <input
                      type="radio"
                      name="layout"
                      checked={layout === opt.value}
                      onChange={() => setLayout(opt.value)}
                      className="accent-[#E8743B]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm font-medium text-[#1A1A1A]">Theme</p>
            <div className="mt-2 flex gap-5">
              {(
                [
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ] as { value: WallTheme; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm text-[#1A1A1A]"
                >
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === opt.value}
                    onChange={() => setTheme(opt.value)}
                    className="accent-[#E8743B]"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#6B6B6B]">
              Tip: use{" "}
              <code className="rounded bg-[#FAF8F5] px-1 py-0.5 font-mono text-[11px]">
                data-theme=&quot;auto&quot;
              </code>{" "}
              in the snippet to match your site automatically.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">Brand color</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  aria-label="Accent color"
                  className="h-9 w-12 cursor-pointer rounded-lg border border-[#ECE7E0] bg-white p-1"
                />
                <span className="font-mono text-xs text-[#6B6B6B]">{accent}</span>
                {accent !== DEFAULT_ACCENT && (
                  <button
                    type="button"
                    onClick={() => setAccent(DEFAULT_ACCENT)}
                    className="text-xs font-medium text-[#6B6B6B] underline underline-offset-2 hover:text-[#1A1A1A]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">Corners</p>
              <div className="mt-2 flex gap-4">
                {(
                  [
                    { value: "sharp", label: "Sharp" },
                    { value: "rounded", label: "Rounded" },
                    { value: "pill", label: "Soft" },
                  ] as { value: WidgetRadius; label: string }[]
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-sm text-[#1A1A1A]"
                  >
                    <input
                      type="radio"
                      name="radius"
                      checked={radius === opt.value}
                      onChange={() => setRadius(opt.value)}
                      className="accent-[#E8743B]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {widgetType === "wall" && (
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">
                Max testimonials to show
              </label>
              <select
                value={max}
                onChange={(e) => setMax(e.target.value as MaxOption)}
                className="w-full rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm text-[#1A1A1A] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="all">All</option>
              </select>
            </div>
          )}

          {widgetType === "single" && (
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A1A]">
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
          )}

          <div className="mt-5 flex flex-col gap-4 border-t border-[#ECE7E0] pt-4">
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

          <div className="mt-5 border-t border-[#ECE7E0] pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#1A1A1A]">Embed code</p>
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
            <div className="mt-2 overflow-hidden rounded-lg bg-[#16161D]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              </div>
              <code className="block w-full overflow-x-auto whitespace-pre-wrap break-all px-3 py-3 font-mono text-xs leading-relaxed text-[#ECE7E0]">
                {snippet}
              </code>
            </div>
            {!isLifetime && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Free plan — your widget shows your 3 most recent approved
                testimonials. Upgrade for unlimited.
              </p>
            )}
          </div>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
          >
            <ExternalLink size={15} />
            View live widget
          </a>
        </div>

        {/* Live preview */}
        <BlurFade delay={0.1}>
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Live preview
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-[#2E9E6B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E6B]" />
              Live
            </span>
          </div>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            {usingSamples
              ? "Previewing with sample testimonials — your real ones will appear here once collected."
              : "This is how your widget looks with these settings."}
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-[#ECE7E0] shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div
              className={`max-h-[480px] overflow-y-auto ${
                theme === "dark" ? "bg-[#16161D]" : "bg-white"
              }`}
            >
            {widgetType === "wall" && (
              <WallContent
                testimonials={previewList}
                layout={layout}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
                maxCount={maxCount}
                accent={accent}
                radius={radius}
              />
            )}
            {widgetType === "carousel" && (
              <CarouselContent
                testimonials={previewList}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
                accent={accent}
                radius={radius}
              />
            )}
            {widgetType === "marquee" && (
              <MarqueeContent
                testimonials={previewList}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
                accent={accent}
                radius={radius}
              />
            )}
            {widgetType === "single" && (
              <SingleQuoteContent
                testimonial={featured}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
                accent={accent}
                radius={radius}
              />
            )}
            </div>
          </div>
        </div>
        </BlurFade>
      </div>
    </div>
  );
}
