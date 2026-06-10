"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import {
  WallContent,
  CarouselContent,
  MarqueeContent,
  SingleQuoteContent,
  type Testimonial,
  type WallLayout,
  type WallTheme,
  type WidgetType,
} from "../../embed/wall-renderer";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type MaxOption = "3" | "6" | "9" | "all";

const WIDGET_TYPES: { value: WidgetType; label: string }[] = [
  { value: "wall", label: "Wall of Love" },
  { value: "carousel", label: "Carousel" },
  { value: "marquee", label: "Marquee" },
  { value: "single", label: "Single Quote" },
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
  testimonials,
}: {
  userId: string;
  isLifetime: boolean;
  testimonials: Testimonial[];
}) {
  const [widgetType, setWidgetType] = useState<WidgetType>("wall");
  const [layout, setLayout] = useState<WallLayout>("masonry");
  const [theme, setTheme] = useState<WallTheme>("light");
  const [max, setMax] = useState<MaxOption>("all");
  const [showRatings, setShowRatings] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const maxCount = max === "all" ? null : Number(max);
  const badgeOn = isLifetime ? showBadge : true;
  const featured = testimonials[featuredIndex] ?? testimonials[0] ?? null;

  const params = new URLSearchParams();
  params.set("type", widgetType);
  if (widgetType === "wall") {
    params.set("layout", layout);
    params.set("max", max);
  }
  params.set("theme", theme);
  params.set("ratings", showRatings ? "true" : "false");
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
      <div className="mb-5 flex flex-wrap gap-2">
        {WIDGET_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setWidgetType(t.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              widgetType === t.value
                ? "bg-[#E8743B] text-white"
                : "border border-[#ECE7E0] bg-white text-[#6B6B6B] hover:text-[#1A1A1A]"
            }`}
          >
            {t.label}
          </button>
        ))}
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
                disabled={testimonials.length === 0}
                className="w-full rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm text-[#1A1A1A] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20 disabled:opacity-50"
              >
                {testimonials.length === 0 ? (
                  <option>No testimonials yet</option>
                ) : (
                  testimonials.map((t, i) => (
                    <option key={t.id} value={i}>
                      {t.author_name} — &ldquo;
                      {(t.display_body ?? t.body_original).slice(0, 40)}
                      {(t.display_body ?? t.body_original).length > 40 ? "…" : ""}
                      &rdquo;
                    </option>
                  ))
                )}
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
            <p className="text-sm font-medium text-[#1A1A1A]">Embed code</p>
            <code className="mt-2 block w-full overflow-x-auto whitespace-nowrap rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs text-[#1A1A1A]">
              {snippet}
            </code>
            <button
              onClick={handleCopy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8743B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C]"
            >
              {copied ? (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy embed code
                </>
              )}
            </button>
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
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Live preview
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            This is how your widget looks with these settings.
          </p>
          <div className="mt-4 max-h-[480px] overflow-y-auto rounded-lg border border-[#ECE7E0]">
            {widgetType === "wall" && (
              <WallContent
                testimonials={testimonials}
                layout={layout}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
                maxCount={maxCount}
              />
            )}
            {widgetType === "carousel" && (
              <CarouselContent
                testimonials={testimonials}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
              />
            )}
            {widgetType === "marquee" && (
              <MarqueeContent
                testimonials={testimonials}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
              />
            )}
            {widgetType === "single" && (
              <SingleQuoteContent
                testimonial={featured}
                theme={theme}
                showRatings={showRatings}
                showBadge={badgeOn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
