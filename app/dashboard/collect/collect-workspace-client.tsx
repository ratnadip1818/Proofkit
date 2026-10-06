"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  CheckCircle,
  Lock,
  ExternalLink,
  Smartphone,
  Monitor,
  Camera,
  Copy,
  Share2,
  SlidersHorizontal,
  Star,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { updateForm } from "../actions";

interface FormRow {
  id: string;
  slug: string;
  headline: string;
  prompt: string;
  thank_you_message: string;
  theme_color: string;
  collect_photo: boolean;
  collect_rating: boolean;
  require_consent: boolean;
  custom_domain: string | null;
  custom_font?: string | null;
  custom_css?: string | null;
}

interface CollectWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: FormRow;
  appUrl: string;
}

const ACCENT_COLORS = [
  "#2563EB",
  "#10B981",
  "#6366F1",
  "#EC4899",
  "#EF4444",
  "#1F2937",
];

const FONTS = [
  { id: "Inter", label: "Inter (Clean Sans)", family: "var(--font-sans), sans-serif" },
  { id: "Space Grotesk", label: "Space Grotesk (Tech)", family: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" },
  { id: "Instrument Serif", label: "Instrument Serif (Editorial)", family: "var(--font-serif-accent), 'Instrument Serif', Georgia, serif" },
  { id: "JetBrains Mono", label: "JetBrains Mono (Developer)", family: "var(--font-mono), 'JetBrains Mono', monospace" },
  { id: "Jakarta", label: "Plus Jakarta (Modern Display)", family: "var(--font-display), 'Plus Jakarta Sans', sans-serif" },
];

/**
 * Normalizes user-input hex colors into strict 7-character #RRGGBB strings
 * with fallback to Blovi brand blue (#2563EB).
 */
function normalizeHexColor(input: string): string {
  if (!input) return "#2563EB";
  let val = input.trim();
  if (!val.startsWith("#")) {
    val = `#${val}`;
  }
  // Expand 3-digit hex #RGB -> #RRGGBB
  if (/^#[0-9A-Fa-f]{3}$/.test(val)) {
    val = `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
  }
  // Valid 6-digit hex
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    return val.toUpperCase();
  }
  // 8-digit hex with alpha
  if (/^#[0-9A-Fa-f]{8}$/.test(val)) {
    return val.slice(0, 7).toUpperCase();
  }
  return "#2563EB";
}

/**
 * Determines whether a given input string matches a valid 6-hex or 3-hex color code.
 */
function isValidHexColor(input: string): boolean {
  if (!input) return false;
  const val = input.trim().startsWith("#") ? input.trim() : `#${input.trim()}`;
  return /^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val);
}

/**
 * Calculates high-contrast text color (dark navy or white) for dynamic button backgrounds.
 */
function getContrastTextColor(hexColor: string): string {
  const normalized = normalizeHexColor(hexColor);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 155 ? "#0f172a" : "#ffffff";
}

/**
 * Ensures text or icon elements rendered directly on light/white backgrounds
 * maintain adequate contrast (WCAG AA). Falls back to accessible deep blue if too light.
 */
function getAccessibleTextColor(hexColor: string): string {
  const normalized = normalizeHexColor(hexColor);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  if (yiq >= 155) {
    return "#1D4ED8";
  }
  return normalized;
}

/**
 * Robust clipboard copy helper with legacy execCommand fallback.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to document.execCommand
  }
  try {
    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  } catch {
    // Ignore fallback errors
  }
  return false;
}

function Switch({
  checked,
  onChange,
  size = "default",
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "default";
  "aria-label"?: string;
}) {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
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

export default function CollectWorkspaceClient({
  form,
  appUrl,
}: CollectWorkspaceClientProps) {
  // Configuration States
  const [headline, setHeadline] = useState(
    form.headline || "Share your experience with us"
  );
  const [prompt, setPrompt] = useState(
    form.prompt || "Would you recommend our product? What's your honest feedback?"
  );
  const [thankYouMessage, setThankYouMessage] = useState(
    form.thank_you_message || "Thank you for your feedback! It means the world to our team."
  );
  const [themeColor, setThemeColor] = useState(form.theme_color || "#2563EB");
  const [lastValidColor, setLastValidColor] = useState(
    normalizeHexColor(form.theme_color || "#2563EB")
  );
  const [collectPhoto, setCollectPhoto] = useState(form.collect_photo ?? true);
  const [collectRating, setCollectRating] = useState(form.collect_rating ?? true);
  const [requireConsent, setRequireConsent] = useState(form.require_consent ?? true);

  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [tab, setTab] = useState<"design" | "share">("design");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");

  // Local interactive preview states
  const [testRating, setTestRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [testContent, setTestContent] = useState("");
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testConsent, setTestConsent] = useState(true);
  const [testPhotoUrl, setTestPhotoUrl] = useState<string | null>(null);
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Share states
  const [copiedLink, setCopiedLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyLinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const testPhotoUrlRef = useRef<string | null>(null);
  testPhotoUrlRef.current = testPhotoUrl;

  const isMountedRef = useRef(true);
  const syncSeqRef = useRef(0);
  const lastSavedPayloadRef = useRef({
    headline: form.headline || "Share your experience with us",
    prompt: form.prompt || "Would you recommend our product? What's your honest feedback?",
    thank_you_message: form.thank_you_message || "Thank you for your feedback! It means the world to our team.",
    theme_color: normalizeHexColor(form.theme_color || "#2563EB"),
    collect_photo: form.collect_photo ?? true,
    collect_rating: form.collect_rating ?? true,
    require_consent: form.require_consent ?? true,
  });

  // Cleanup object URL and pending timers on unmount to prevent memory leaks
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (testPhotoUrlRef.current) {
        URL.revokeObjectURL(testPhotoUrlRef.current);
      }
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
      if (copyLinkTimerRef.current) {
        clearTimeout(copyLinkTimerRef.current);
      }
    };
  }, []);

  // Normalized safe theme color for 0ms reliable CSS styling without mid-typing flickering
  const safeThemeColor = isValidHexColor(themeColor)
    ? normalizeHexColor(themeColor)
    : lastValidColor;
  const contrastTextColor = getContrastTextColor(safeThemeColor);
  const accessibleAccentColor = getAccessibleTextColor(safeThemeColor);

  // Sanitize share URL against trailing slashes or domain prefixes
  const cleanAppUrl = (appUrl || "https://www.blovi.space").replace(/\/+$/, "");
  const cleanCustomDomain = form.custom_domain
    ? form.custom_domain.replace(/^(https?:\/\/)?/, "").replace(/\/+$/, "").trim()
    : null;
  const safeSlug = (form?.slug || "form").trim();
  const shareUrl = cleanCustomDomain
    ? `https://${cleanCustomDomain}`
    : `${cleanAppUrl}/c/${encodeURIComponent(safeSlug)}`;

  // Background Auto-Sync effect (skips initial mount and avoids redundant mutations)
  useEffect(() => {
    const currentPayload = {
      headline,
      prompt,
      thank_you_message: thankYouMessage,
      theme_color: normalizeHexColor(themeColor),
      collect_photo: collectPhoto,
      collect_rating: collectRating,
      require_consent: requireConsent,
    };

    const hasChanged =
      currentPayload.headline !== lastSavedPayloadRef.current.headline ||
      currentPayload.prompt !== lastSavedPayloadRef.current.prompt ||
      currentPayload.thank_you_message !== lastSavedPayloadRef.current.thank_you_message ||
      currentPayload.theme_color !== lastSavedPayloadRef.current.theme_color ||
      currentPayload.collect_photo !== lastSavedPayloadRef.current.collect_photo ||
      currentPayload.collect_rating !== lastSavedPayloadRef.current.collect_rating ||
      currentPayload.require_consent !== lastSavedPayloadRef.current.require_consent;

    if (!hasChanged) {
      return;
    }

    setSavingStatus("saving");
    const currentSeq = ++syncSeqRef.current;

    const timer = setTimeout(async () => {
      try {
        const res = await updateForm(form.id, {
          headline,
          prompt,
          thank_you_message: thankYouMessage,
          theme_color: normalizeHexColor(themeColor),
          collect_photo: collectPhoto,
          collect_rating: collectRating,
          require_consent: requireConsent,
          // Preserve custom_font / custom_css if provided in props without hardcoding "canvas"
          ...(form.custom_font !== undefined ? { custom_font: form.custom_font } : {}),
          ...(form.custom_css !== undefined ? { custom_css: form.custom_css } : {}),
        });

        if (currentSeq !== syncSeqRef.current || !isMountedRef.current) {
          return;
        }

        if (res?.error) {
          console.error("Failed auto-syncing form:", res.error);
          setSavingStatus("error");
          if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
          savedTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) setSavingStatus("idle");
          }, 3500);
        } else {
          lastSavedPayloadRef.current = currentPayload;
          setSavingStatus("saved");
          if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
          savedTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) setSavingStatus("idle");
          }, 2500);
        }
      } catch (err) {
        console.error("Failed auto-syncing form:", err);
        if (currentSeq === syncSeqRef.current && isMountedRef.current) {
          setSavingStatus("error");
          if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
          savedTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) setSavingStatus("idle");
          }, 3500);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    headline,
    prompt,
    thankYouMessage,
    themeColor,
    collectPhoto,
    collectRating,
    requireConsent,
    form.id,
    form.custom_font,
    form.custom_css,
  ]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success && isMountedRef.current) {
      setCopiedLink(true);
      if (copyLinkTimerRef.current) clearTimeout(copyLinkTimerRef.current);
      copyLinkTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) setCopiedLink(false);
      }, 2000);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (testPhotoUrl) {
        URL.revokeObjectURL(testPhotoUrl);
      }
      const url = URL.createObjectURL(file);
      setTestPhotoUrl(url);
    }
  };

  const handleRemovePhoto = () => {
    if (testPhotoUrl) {
      URL.revokeObjectURL(testPhotoUrl);
    }
    setTestPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetTest = () => {
    if (testPhotoUrl) {
      URL.revokeObjectURL(testPhotoUrl);
    }
    setTestSubmitted(false);
    setTestRating(5);
    setHoveredRating(0);
    setTestContent("");
    setTestName("");
    setTestRole("");
    setTestConsent(true);
    setTestPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const matchedFont = FONTS.find(
    (f) => f.id.toLowerCase() === (form.custom_font || "").toLowerCase()
  );
  const activeFontFamily = matchedFont
    ? matchedFont.family
    : form.custom_font
    ? `'${form.custom_font}', sans-serif`
    : "var(--font-sans), sans-serif";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-[#F5F4F1] font-sans text-gray-900 overflow-x-hidden relative">
      {/* LEFT PANEL: CONFIGURATION */}
      <div className="w-full lg:w-[360px] bg-white border-b lg:border-b-0 lg:border-r border-zinc-200/70 flex flex-col h-auto lg:h-full shrink-0 z-10">
        {/* Navigation Header */}
        <div className="p-3.5 border-b border-zinc-200/60 bg-white shrink-0">
          <div className="flex items-center justify-between pb-2.5">
            <div className="text-xs font-semibold text-zinc-900 tracking-tight">
              Collect Form
            </div>
            <div className="text-[10px] font-medium min-h-[16px]">
              {savingStatus === "saving" && (
                <span className="text-blue-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Saving...
                </span>
              )}
              {savingStatus === "saved" && (
                <span className="text-emerald-600 flex items-center gap-1 transition-opacity duration-200">
                  <Check size={11} className="stroke-[3]" />
                  Saved
                </span>
              )}
              {savingStatus === "error" && (
                <span className="text-red-600 flex items-center gap-1 transition-opacity duration-200">
                  <AlertCircle size={11} className="stroke-[2.5]" />
                  Failed to save
                </span>
              )}
            </div>
          </div>

          {/* Segmented Pill Navigation */}
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
              <SlidersHorizontal
                size={13}
                className={tab === "design" ? "text-blue-600" : "text-zinc-400"}
              />
              <span>Form Design</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("share")}
              className={`flex items-center justify-center gap-2 py-1.5 px-3 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                tab === "share"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Share2
                size={13}
                className={tab === "share" ? "text-blue-600" : "text-zinc-400"}
              />
              <span>Share &amp; Invites</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
          {tab === "design" ? (
            <>
              {/* 1. Form Copy Inputs */}
              <section className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Form Copy
                </label>
                <div className="bg-white border border-zinc-200/80 rounded-xl p-3.5 space-y-3.5 shadow-2xs">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 block">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 bg-zinc-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-2xs font-normal"
                      placeholder="e.g. Share your experience with us"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 block">
                      Prompt Description
                    </label>
                    <textarea
                      rows={2}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 bg-zinc-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none leading-relaxed shadow-2xs font-normal"
                      placeholder="e.g. Would you recommend our product? What's your honest feedback?"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 block">
                      Thank You Message
                    </label>
                    <textarea
                      rows={2}
                      value={thankYouMessage}
                      onChange={(e) => setThankYouMessage(e.target.value)}
                      className="w-full text-xs border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 bg-zinc-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none leading-relaxed shadow-2xs font-normal"
                      placeholder="e.g. Thank you for your feedback! It means the world to our team."
                    />
                  </div>
                </div>
              </section>

              {/* 2. Unified Brand Accent Palette */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Brand Accent Palette
                  </label>
                  <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase">
                    {safeThemeColor}
                  </span>
                </div>
                <div className="bg-white border border-zinc-200/80 rounded-xl p-3.5 space-y-3.5 shadow-2xs">
                  {/* Preset Swatches */}
                  <div className="flex items-center justify-between gap-1.5">
                    {ACCENT_COLORS.map((color) => {
                      const isSelected =
                        safeThemeColor.toLowerCase() === color.toLowerCase();
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setThemeColor(color);
                            setLastValidColor(color);
                          }}
                          aria-label={`Select accent color ${color}`}
                          aria-pressed={isSelected}
                          className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                            isSelected
                              ? "ring-2 ring-blue-600 ring-offset-2 scale-105 shadow-xs"
                              : "hover:scale-105 border border-zinc-200/80"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white drop-shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Code Input */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100">
                    <span className="text-xs font-medium text-zinc-600">
                      Custom hex color
                    </span>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 hover:bg-zinc-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 border border-zinc-200/70 rounded-lg transition-all shadow-2xs">
                      <label className="relative w-4 h-4 rounded-full ring-1 ring-black/10 shrink-0 cursor-pointer overflow-hidden block">
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: safeThemeColor,
                          }}
                        />
                        <input
                          type="color"
                          value={safeThemeColor.toLowerCase()}
                          onChange={(e) => {
                            const upper = e.target.value.toUpperCase();
                            setThemeColor(upper);
                            setLastValidColor(upper);
                          }}
                          aria-label="Color picker"
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </label>
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => {
                          let val = e.target.value.trim();
                          if (val && !val.startsWith("#")) {
                            val = `#${val}`;
                          }
                          val = val.replace(/[^#0-9A-Fa-f]/g, "");
                          if (val.length > 7) val = val.slice(0, 7);
                          setThemeColor(val);
                          if (isValidHexColor(val)) {
                            setLastValidColor(normalizeHexColor(val));
                          }
                        }}
                        onBlur={() => {
                          const normalized = normalizeHexColor(themeColor);
                          setThemeColor(normalized);
                          setLastValidColor(normalized);
                        }}
                        maxLength={7}
                        placeholder="#2563EB"
                        className="w-20 text-[11px] font-mono text-zinc-800 font-semibold bg-transparent focus:outline-none uppercase"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Field Controls */}
              <section className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Field Controls
                </label>
                <div className="bg-white border border-zinc-200/80 rounded-xl divide-y divide-zinc-100 shadow-2xs overflow-hidden">
                  <div
                    onClick={() => setCollectRating(!collectRating)}
                    className="p-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-zinc-900">
                        Star Rating
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Collect 1 to 5 star rating score
                      </div>
                    </div>
                    <Switch
                      checked={collectRating}
                      onChange={setCollectRating}
                      aria-label="Toggle Star Rating collection"
                    />
                  </div>

                  <div
                    onClick={() => setCollectPhoto(!collectPhoto)}
                    className="p-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-zinc-900">
                        Customer Photo
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Allow customer avatar upload
                      </div>
                    </div>
                    <Switch
                      checked={collectPhoto}
                      onChange={setCollectPhoto}
                      aria-label="Toggle Customer Photo upload"
                    />
                  </div>

                  <div
                    onClick={() => setRequireConsent(!requireConsent)}
                    className="p-3.5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-zinc-900">
                        Consent Checkbox
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Require marketing permission consent
                      </div>
                    </div>
                    <Switch
                      checked={requireConsent}
                      onChange={setRequireConsent}
                      aria-label="Toggle Consent Checkbox requirement"
                    />
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* TAB 2: SHARE & INVITES */
            <div className="space-y-5">
              {/* 1. Direct Share Link */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Direct Share Link
                  </label>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Open live form</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="bg-white border border-zinc-200/80 rounded-xl p-3.5 space-y-3 shadow-2xs">
                  <div className="bg-zinc-50 border border-zinc-200/70 rounded-lg px-3 py-2 text-xs font-mono text-zinc-700 break-all select-all">
                    {shareUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                      copiedLink
                        ? "bg-emerald-600 text-white shadow-emerald-900/10"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/10"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check size={14} className="stroke-[2.5]" />
                        <span>Copied link to clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy link</span>
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: LIVE INTERACTIVE PREVIEW */}
      <div className="flex-1 flex flex-col min-h-[640px] lg:min-h-0 lg:h-full overflow-hidden bg-[#FAF9F6]">
        <div className="flex-1 w-full h-full p-4 md:p-6 overflow-hidden flex flex-col">
          {/* macOS Window Chrome Container */}
          <div className="w-full flex-1 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col relative">
            {/* Top macOS Browser Chrome Bar */}
            <div className="h-10 bg-[#FAF9F6] border-b border-gray-200/80 px-4 flex items-center justify-between shrink-0 relative">
              {/* macOS Window Control Dots */}
              <div className="flex items-center space-x-1.5 z-10 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>

              {/* Centered URL Pill */}
              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200/80 rounded-md px-3 py-0.5 text-[11px] text-gray-500 font-mono items-center gap-1.5 shadow-2xs max-w-[200px] xl:max-w-xs min-w-0 pointer-events-none">
                <Lock size={10} className="text-gray-400 shrink-0" />
                <span className="text-gray-400 shrink-0">https://</span>
                <span className="truncate min-w-0">your-website.com/c/{safeSlug}</span>
              </div>

              {/* Viewport Mode Segmented Switcher on Right of Browser Header */}
              <div className="flex items-center gap-1 z-10 ml-auto md:ml-0 shrink-0">
                <div className="p-0.5 bg-zinc-100/90 rounded-lg flex items-center border border-zinc-200/60 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDeviceMode("desktop")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      deviceMode === "desktop"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    <Monitor
                      size={12}
                      className={
                        deviceMode === "desktop"
                          ? "text-blue-600"
                          : "text-zinc-400"
                      }
                    />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceMode("mobile")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      deviceMode === "mobile"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    <Smartphone
                      size={12}
                      className={
                        deviceMode === "mobile"
                          ? "text-blue-600"
                          : "text-zinc-400"
                      }
                    />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* In-Canvas Live Interactive Preview */}
            <div className="flex-1 w-full min-h-0 p-4 md:p-8 overflow-y-auto flex justify-center bg-[#FAF9F6]">
              <div
                className={`my-auto shrink-0 transition-all duration-300 bg-white rounded-2xl shadow-sm border border-zinc-200/80 ${
                  deviceMode === "mobile"
                    ? "w-full max-w-[360px] p-5 md:p-6"
                    : "w-full max-w-[520px] p-6 md:p-8"
                }`}
                style={{ fontFamily: activeFontFamily }}
              >
                {testSubmitted ? (
                  <div className="py-8 text-center space-y-4 animate-modal-in transition-all duration-300">
                    <div
                      className="mx-auto w-14 h-14 rounded-full flex items-center justify-center shadow-2xs transition-colors"
                      style={{
                        backgroundColor: `${safeThemeColor}18`,
                        color: accessibleAccentColor,
                      }}
                    >
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                        Thank you!
                      </h3>
                      <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                        {thankYouMessage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetTest}
                      className="mt-3 text-xs font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1"
                      style={{ color: accessibleAccentColor }}
                    >
                      <RefreshCw size={12} />
                      <span>Test Form Again</span>
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setTestSubmitted(true);
                    }}
                    className="space-y-5"
                  >
                    <div className="text-center space-y-1.5">
                      <h2
                        className={`font-semibold text-zinc-900 tracking-tight leading-snug ${
                          deviceMode === "mobile"
                            ? "text-base md:text-lg"
                            : "text-lg md:text-xl"
                        }`}
                      >
                        {headline}
                      </h2>
                      {prompt && (
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                          {prompt}
                        </p>
                      )}
                    </div>

                    {collectRating && (
                      <div className="flex justify-center pt-1">
                        <div
                          className="flex gap-1.5"
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTestRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onFocus={() => setHoveredRating(star)}
                              onBlur={() => setHoveredRating(0)}
                              className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full transition-transform hover:scale-110 cursor-pointer"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  star <= (hoveredRating || testRating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-200"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <textarea
                        required
                        rows={3}
                        value={testContent}
                        onChange={(e) => setTestContent(e.target.value)}
                        placeholder="What did you love? How has it helped you?"
                        className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed shadow-2xs font-normal"
                      />

                      <div
                        className={`grid gap-2.5 ${
                          deviceMode === "mobile"
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        }`}
                      >
                        <input
                          required
                          value={testName}
                          onChange={(e) => setTestName(e.target.value)}
                          placeholder="Full name"
                          className="h-9 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs font-normal"
                        />
                        <input
                          value={testRole}
                          onChange={(e) => setTestRole(e.target.value)}
                          placeholder="Role / Company (optional)"
                          className="h-9 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs font-normal"
                        />
                      </div>
                    </div>

                    {collectPhoto && (
                      <div className="flex items-center gap-3 pt-0.5">
                        <label className="relative w-11 h-11 shrink-0 rounded-full border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center cursor-pointer overflow-hidden transition-colors group">
                          {testPhotoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={testPhotoUrl}
                              alt="Preview avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            aria-label="Upload customer photo"
                            className="opacity-0 absolute inset-0 cursor-pointer"
                          />
                        </label>
                        <div className="space-y-0.5">
                          <span className="text-xs text-zinc-700 font-medium block">
                            {testPhotoUrl ? "Photo attached" : "Add a photo"}{" "}
                            <span className="text-zinc-400 font-normal">
                              (optional)
                            </span>
                          </span>
                          {testPhotoUrl ? (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="text-[11px] text-red-500 hover:underline cursor-pointer"
                            >
                              Remove photo
                            </button>
                          ) : (
                            <span className="text-[11px] text-zinc-400">
                              Click circle to choose image
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {requireConsent && (
                      <label className="flex items-start gap-2.5 text-[11px] text-zinc-600 cursor-pointer pt-0.5">
                        <input
                          type="checkbox"
                          required
                          checked={testConsent}
                          onChange={(e) => setTestConsent(e.target.checked)}
                          className="mt-0.5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                        />
                        <span className="leading-tight select-none">
                          I give permission to use this testimonial on your website and marketing materials.
                        </span>
                      </label>
                    )}

                    <div className="pt-1 space-y-2.5 text-center">
                      <button
                        type="submit"
                        style={{
                          backgroundColor: safeThemeColor,
                          color: contrastTextColor,
                        }}
                        className="w-full h-10 rounded-xl text-xs font-semibold shadow-xs hover:brightness-95 active:scale-[0.99] transition-all cursor-pointer border border-black/5"
                      >
                        Submit testimonial
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                        <Lock className="w-3 h-3 text-zinc-400" />
                        <span>Encrypted · GDPR ready · Never shared</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
