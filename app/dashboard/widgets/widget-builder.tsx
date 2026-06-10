"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type Layout = "masonry" | "grid";
type Theme = "light" | "dark";
type MaxOption = "3" | "6" | "9" | "all";

function Toggle({
  checked,
  onChange,
  disabled,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
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
}: {
  userId: string;
  isLifetime: boolean;
}) {
  const [layout, setLayout] = useState<Layout>("masonry");
  const [theme, setTheme] = useState<Theme>("light");
  const [max, setMax] = useState<MaxOption>("all");
  const [showRatings, setShowRatings] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams();
  params.set("layout", layout);
  params.set("theme", theme);
  params.set("max", max);
  params.set("ratings", showRatings ? "on" : "off");
  if (isLifetime) params.set("badge", showBadge ? "on" : "off");
  const query = params.toString();

  const previewUrl = `/embed/${userId}?${query}`;
  const liveUrl = `${APP_URL}/embed/${userId}?${query}`;

  const dataAttrs = [
    `data-user="${userId}"`,
    `data-layout="${layout}"`,
    `data-theme="${theme}"`,
    `data-max="${max}"`,
    `data-ratings="${showRatings ? "on" : "off"}"`,
  ];
  if (isLifetime) dataAttrs.push(`data-badge="${showBadge ? "on" : "off"}"`);

  const snippet = `<script src="${APP_URL}/widget.js" ${dataAttrs.join(" ")}></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Settings + embed code */}
      <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
          Widget settings
        </h2>

        <div className="mt-4">
          <p className="text-sm font-medium text-[#1A1A1A]">Layout</p>
          <div className="mt-2 flex gap-5">
            {(
              [
                { value: "masonry", label: "Masonry" },
                { value: "grid", label: "Grid" },
              ] as { value: Layout; label: string }[]
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

        <div className="mt-4">
          <p className="text-sm font-medium text-[#1A1A1A]">Theme</p>
          <div className="mt-2 flex gap-5">
            {(
              [
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ] as { value: Theme; label: string }[]
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

        <div className="mt-5 flex flex-col gap-4 border-t border-[#ECE7E0] pt-4">
          <Toggle
            checked={showRatings}
            onChange={setShowRatings}
            label="Show ratings"
            description="Display star ratings on each testimonial"
          />
          <Toggle
            checked={isLifetime ? showBadge : true}
            onChange={setShowBadge}
            disabled={!isLifetime}
            label='Show "Powered by Blovi" badge'
            description={
              isLifetime
                ? "Display attribution at the bottom of your wall"
                : "Available on the lifetime plan"
            }
          />
        </div>

        <div className="mt-5 border-t border-[#ECE7E0] pt-4">
          <p className="text-sm font-medium text-[#1A1A1A]">Embed code</p>
          <div className="mt-2 flex items-start gap-2">
            <code className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs text-[#1A1A1A]">
              {snippet}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy embed snippet"
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-3 py-2.5 text-xs font-medium text-[#6B6B6B] transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-[#2E9E6B]" strokeWidth={2.5} />
                  <span className="text-[#2E9E6B]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
        >
          <ExternalLink size={15} />
          View live wall
        </a>
      </div>

      {/* Live preview */}
      <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
          Live preview
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          This is how your Wall of Love looks with these settings.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-[#ECE7E0]">
          <iframe
            key={query}
            src={previewUrl}
            className="h-[420px] w-full"
            title="Widget preview"
          />
        </div>
      </div>
    </div>
  );
}
