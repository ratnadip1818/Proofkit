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
  Layers,
  Paintbrush,
  Star,
  AlertCircle,
  Upload,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  User,
  Briefcase,
  Loader2,
} from "lucide-react";
import { updateForm, uploadFormLogo } from "../actions";

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

interface FormMetadata {
  logo_url?: string | null;
  rating_title?: string;
  rating_subtitle?: string;
  rating_cta?: string;
  review_placeholder?: string;
  review_cta?: string;
  thank_you_title?: string;
}

interface CollectWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: FormRow;
  appUrl: string;
}

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const ACCENT_PRESETS = [
  { name: "Brand Blue", hex: "#2563EB" },
  { name: "Verified Indigo", hex: "#4F46E5" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Star Amber", hex: "#F59E0B" },
  { name: "Rose Red", hex: "#EF4444" },
  { name: "Dark Neutral", hex: "#111827" },
];

function parseFormMetadata(customCss?: string | null): FormMetadata {
  if (!customCss) return {};
  try {
    const match = customCss.match(/\/\* __BLOVI_CONFIG__=([\s\S]*?) \*\//);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch {
    // Ignore malformed JSON
  }
  return {};
}

function serializeFormMetadata(meta: FormMetadata, rawCss?: string | null): string {
  const cleanCss = (rawCss || "").replace(/\/\* __BLOVI_CONFIG__=[\s\S]*? \*\//g, "").trim();
  const json = JSON.stringify(meta);
  return `/* __BLOVI_CONFIG__=${json} */\n${cleanCss}`.trim();
}

function normalizeHexColor(input: string): string {
  if (!input) return "#2563EB";
  let val = input.trim();
  if (!val.startsWith("#")) {
    val = `#${val}`;
  }
  if (/^#[0-9A-Fa-f]{3}$/.test(val)) {
    val = `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    return val.toUpperCase();
  }
  if (/^#[0-9A-Fa-f]{8}$/.test(val)) {
    return val.slice(0, 7).toUpperCase();
  }
  return "#2563EB";
}

function isValidHexColor(input: string): boolean {
  if (!input) return false;
  const val = input.trim().startsWith("#") ? input.trim() : `#${input.trim()}`;
  return /^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val);
}

function getContrastTextColor(hexColor: string): string {
  const normalized = normalizeHexColor(hexColor);
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 155 ? "#111827" : "#FFFFFF";
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back
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
      className={`relative inline-flex items-center shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
        checked ? "bg-brand-600" : "bg-gray-200"
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

{/* Blovi Compact Manual Save Button */}
function BookmarkSaveButton({
  onSave,
  savingStatus,
}: {
  onSave: () => void;
  savingStatus: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="flex justify-end pt-3">
      <button
        type="button"
        onClick={onSave}
        disabled={savingStatus === "saving"}
        data-status={savingStatus}
        className="bookmarkBtn shrink-0 cursor-pointer"
        title="Save changes (Ctrl+S / Cmd+S)"
      >
        <span className="IconContainer">
          {savingStatus === "saving" ? (
            <Loader2 size={12} className="text-white animate-spin" />
          ) : savingStatus === "saved" ? (
            <Check size={12} className="text-white stroke-[3]" />
          ) : (
            <svg viewBox="0 0 384 512" height="0.8em" className="icon fill-white">
              <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
            </svg>
          )}
        </span>
        <p className="text">
          {savingStatus === "saving"
            ? "Saving"
            : savingStatus === "saved"
            ? "Saved"
            : "Save"}
        </p>
      </button>
    </div>
  );
}

{/* From Uiverse.io by kheshore - Next Step Preview Button */}
function NextStepButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="btn-conteiner">
      <button
        type="button"
        onClick={onClick}
        className="btn-content select-none"
        title={label}
      >
        <span>{label}</span>
        <div className="icon-arrow">
          <svg width="16" height="10" viewBox="0 0 28 14" fill="none">
            <path
              id="arrow-icon-one"
              d="M2 1.5l5.5 5.5-5.5 5.5h2.5l5.5-5.5-5.5-5.5H2z"
            />
            <path
              id="arrow-icon-two"
              d="M10 1.5l5.5 5.5-5.5 5.5h2.5l5.5-5.5-5.5-5.5H10z"
            />
            <path
              id="arrow-icon-three"
              d="M18 1.5l5.5 5.5-5.5 5.5h2.5l5.5-5.5-5.5-5.5H18z"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}

export default function CollectWorkspaceClient({
  form,
  appUrl,
}: CollectWorkspaceClientProps) {
  // Parse initial metadata safely stored in custom_css
  const initialMeta = useRef(parseFormMetadata(form.custom_css));

  // Tab State: "pages" | "design" | "share"
  const [tab, setTab] = useState<"pages" | "design" | "share">("pages");

  // Sub-page switcher in Pages tab: "rating" | "review" | "thankyou"
  const [activePage, setActivePage] = useState<"rating" | "review" | "thankyou">("rating");

  // Page 1: Rating Page Copy
  const [ratingTitle, setRatingTitle] = useState(
    initialMeta.current.rating_title || "Do you enjoy using Blovi?"
  );
  const [ratingSubtitle, setRatingSubtitle] = useState(
    initialMeta.current.rating_subtitle || "On a scale of 1 to 5, how would you rate us?"
  );
  const [ratingCta, setRatingCta] = useState(
    initialMeta.current.rating_cta || "Continue"
  );

  // Page 2: Review Page Copy (Introduce yourself + review body)
  const [headline, setHeadline] = useState(
    form.headline || "Introduce yourself and share why you love our product 💜"
  );
  const [prompt, setPrompt] = useState(
    form.prompt || "In a few sentences, share what you love about using our product."
  );
  const [reviewPlaceholder, setReviewPlaceholder] = useState(
    initialMeta.current.review_placeholder || "Write your testimonial..."
  );
  const [reviewCta, setReviewCta] = useState(
    initialMeta.current.review_cta || "Continue"
  );

  // Page 3: Thank You Page Copy
  const [thankYouTitle, setThankYouTitle] = useState(
    initialMeta.current.thank_you_title || "Thank you!"
  );
  const [thankYouMessage, setThankYouMessage] = useState(
    form.thank_you_message ||
      "Thank you so much for leaving a testimonial! Testimonials help me grow my business. They're the best way of helping me out if you read and enjoy my work."
  );

  // Design States
  const [logoUrl, setLogoUrl] = useState<string | null>(initialMeta.current.logo_url || null);
  const [themeColor, setThemeColor] = useState(form.theme_color || "#2563EB");
  const [lastValidColor, setLastValidColor] = useState(
    normalizeHexColor(form.theme_color || "#2563EB")
  );
  const [collectPhoto, setCollectPhoto] = useState(form.collect_photo ?? true);
  const [collectRating, setCollectRating] = useState(form.collect_rating ?? true);
  const [requireConsent, setRequireConsent] = useState(form.require_consent ?? true);

  // UI Status
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Live interactive preview test states
  const [testRating, setTestRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [testContent, setTestContent] = useState("");
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testConsent, setTestConsent] = useState(true);
  const [testPhotoUrl, setTestPhotoUrl] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyLinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Auto-sync debouncing refs
  const lastSavedPayloadRef = useRef({
    headline,
    prompt,
    thankYouMessage,
    themeColor: normalizeHexColor(themeColor),
    collectPhoto,
    collectRating,
    requireConsent,
    logoUrl,
    ratingTitle,
    ratingSubtitle,
    ratingCta,
    reviewPlaceholder,
    reviewCta,
    thankYouTitle,
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (copyLinkTimerRef.current) clearTimeout(copyLinkTimerRef.current);
    };
  }, []);

  // Compute live share link
  const safeSlug = form.slug || "reviews";
  const shareUrl = form.custom_domain
    ? `https://${form.custom_domain}`
    : `${appUrl.replace(/\/$/, "")}/c/${safeSlug}`;

  const safeThemeColor = isValidHexColor(themeColor)
    ? normalizeHexColor(themeColor)
    : lastValidColor;
  const contrastBtnText = getContrastTextColor(safeThemeColor);

  // Compute current form payload & check for unsaved edits
  const currentPayload = {
    headline,
    prompt,
    thankYouMessage,
    themeColor: safeThemeColor,
    collectPhoto,
    collectRating,
    requireConsent,
    logoUrl,
    ratingTitle,
    ratingSubtitle,
    ratingCta,
    reviewPlaceholder,
    reviewCta,
    thankYouTitle,
  };

  const hasUnsavedChanges =
    JSON.stringify(currentPayload) !==
    JSON.stringify(lastSavedPayloadRef.current);

  // Manual save handler triggered by BookmarkSaveButton or Ctrl+S
  const handleSave = async () => {
    if (savingStatus === "saving") return;
    setSavingStatus("saving");

    try {
      const serializedCss = serializeFormMetadata(
        {
          logo_url: logoUrl,
          rating_title: ratingTitle,
          rating_subtitle: ratingSubtitle,
          rating_cta: ratingCta,
          review_placeholder: reviewPlaceholder,
          review_cta: reviewCta,
          thank_you_title: thankYouTitle,
        },
        form.custom_css
      );

      const res = await updateForm(form.id, {
        headline,
        prompt,
        thank_you_message: thankYouMessage,
        theme_color: safeThemeColor,
        collect_photo: collectPhoto,
        collect_rating: collectRating,
        require_consent: requireConsent,
        custom_css: serializedCss,
      });

      if (!isMountedRef.current) return;

      if (res?.error) {
        setSavingStatus("error");
      } else {
        lastSavedPayloadRef.current = currentPayload;
        setSavingStatus("saved");
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) setSavingStatus("idle");
        }, 3000);
      }
    } catch {
      if (isMountedRef.current) setSavingStatus("error");
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S to save manually
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError(null);
    setUploadingLogo(true);

    try {
      const data = new FormData();
      data.append("file", file);
      const res = await uploadFormLogo(data);

      if (res.error) {
        setLogoError(res.error);
      } else if (res.url) {
        setLogoUrl(res.url);
      }
    } catch {
      setLogoError("Failed to upload logo. Please try again.");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setLogoError(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Glider calculation: 0 = Pages, 1 = Design, 2 = Share
  const activeTabIndex = tab === "pages" ? 0 : tab === "design" ? 1 : 2;

  // Sub-page switcher index: 0 = rating, 1 = review, 2 = thankyou
  const activePageIndex = activePage === "rating" ? 0 : activePage === "review" ? 1 : 2;

  // Tactile Soft Input classes (inspired by Uiverse ercnersoy)
  const inputClass =
    "w-full text-xs rounded-xl px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 bg-gray-50/80 border border-gray-200/90 shadow-2xs transition-all duration-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/40 focus:outline-none focus:shadow-inner font-normal";
  const textareaClass =
    "w-full text-xs rounded-xl px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 bg-gray-50/80 border border-gray-200/90 shadow-2xs transition-all duration-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/40 focus:outline-none focus:shadow-inner font-normal resize-none leading-relaxed";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-gray-50 font-sans text-gray-900 overflow-x-hidden relative">
      {/* ============================================================ */}
      {/* LEFT PANEL: BUILDER SIDEBAR (360px)                          */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[360px] bg-white border-b lg:border-b-0 lg:border-r border-gray-200/80 flex flex-col h-auto lg:h-full shrink-0 z-10 shadow-xs">
        {/* Sidebar Header & Glider Pill Navigation */}
        <div className="p-4 border-b border-gray-200/70 bg-white shrink-0">
          {/* Glider Segmented Pill (Pages | Design | Share) */}
          <div className="relative p-1 bg-gray-100/90 rounded-full border border-gray-200/80 shadow-2xs grid grid-cols-3">
            {/* Sliding Glider indicator */}
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-white shadow-xs border border-gray-200/60 transition-transform duration-250 ease-out z-0 pointer-events-none"
              style={{
                transform: `translateX(${activeTabIndex * 100}%)`,
              }}
            />

            <button
              type="button"
              onClick={() => setTab("pages")}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-full transition-colors cursor-pointer select-none ${
                tab === "pages"
                  ? "text-brand-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Layers
                size={16}
                className={tab === "pages" ? "text-brand-600" : "text-gray-400"}
              />
              <span>Pages</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("design")}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-full transition-colors cursor-pointer select-none ${
                tab === "design"
                  ? "text-brand-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Paintbrush
                size={16}
                className={tab === "design" ? "text-brand-600" : "text-gray-400"}
              />
              <span>Design</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("share")}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-full transition-colors cursor-pointer select-none ${
                tab === "share"
                  ? "text-brand-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Share2
                size={16}
                className={tab === "share" ? "text-brand-600" : "text-gray-400"}
              />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
          {/* ======================================================== */}
          {/* TAB 1: PAGES (TEXT EDITING ONLY)                          */}
          {/* ======================================================== */}
          {tab === "pages" && (
            <div className="space-y-4">
              {/* Active Editing Page Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                  <span className="text-xs font-bold text-gray-900 tracking-tight">
                    {activePage === "rating" && "Rating"}
                    {activePage === "review" && "Review"}
                    {activePage === "thankyou" && "Thank You"}
                  </span>
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {activePage === "rating" && "Step 1 of 3"}
                  {activePage === "review" && "Step 2 of 3"}
                  {activePage === "thankyou" && "Step 3 of 3"}
                </span>
              </div>

              {/* Sub-page 1: Rating Page Copy */}
              {activePage === "rating" && (
                <div className="space-y-4">
                  <div className="space-y-3.5 bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Page title
                      </label>
                      <input
                        type="text"
                        value={ratingTitle}
                        onChange={(e) => setRatingTitle(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Do you enjoy using Blovi?"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={ratingSubtitle}
                        onChange={(e) => setRatingSubtitle(e.target.value)}
                        className={textareaClass}
                        placeholder="e.g. On a scale of 1 to 5, how would you rate us?"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Call to action
                      </label>
                      <input
                        type="text"
                        value={ratingCta}
                        onChange={(e) => setRatingCta(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Continue"
                      />
                    </div>
                  </div>

                  {/* Manual Save Button */}
                  <BookmarkSaveButton
                    onSave={handleSave}
                    savingStatus={savingStatus}
                  />
                </div>
              )}

              {/* Sub-page 2: Review Page Copy (Introduce yourself + Testimonial) */}
              {activePage === "review" && (
                <div className="space-y-4">
                  <div className="space-y-3.5 bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Page title
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Introduce yourself and share why you love our product 💜"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className={textareaClass}
                        placeholder="e.g. In a few sentences, share what you love about using our product."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Testimonial placeholder
                      </label>
                      <input
                        type="text"
                        value={reviewPlaceholder}
                        onChange={(e) => setReviewPlaceholder(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Write your testimonial..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Call to action
                      </label>
                      <input
                        type="text"
                        value={reviewCta}
                        onChange={(e) => setReviewCta(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Continue"
                      />
                    </div>
                  </div>

                  {/* Manual Save Button */}
                  <BookmarkSaveButton
                    onSave={handleSave}
                    savingStatus={savingStatus}
                  />
                </div>
              )}

              {/* Sub-page 3: Thank You Page Copy */}
              {activePage === "thankyou" && (
                <div className="space-y-4">
                  <div className="space-y-3.5 bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={thankYouTitle}
                        onChange={(e) => setThankYouTitle(e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Thank you!"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 block">
                        Thank you message
                      </label>
                      <textarea
                        rows={3}
                        value={thankYouMessage}
                        onChange={(e) => setThankYouMessage(e.target.value)}
                        className={textareaClass}
                        placeholder="e.g. Thank you so much for leaving a testimonial! Testimonials help me grow my business..."
                      />
                    </div>
                  </div>

                  {/* Manual Save Button */}
                  <BookmarkSaveButton
                    onSave={handleSave}
                    savingStatus={savingStatus}
                  />
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DESIGN (BRANDING, COLOR, AND FIELD CONTROLS)      */}
          {/* ======================================================== */}
          {tab === "design" && (
            <div className="space-y-5">
              {/* 1. Brand Logo */}
              <section className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-900 block">
                    Brand Logo
                  </label>
                  <span className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">
                    Form Header
                  </span>
                </div>

                <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                  {logoUrl ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200/80">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1.5 shadow-2xs shrink-0 overflow-hidden">
                          <img
                            src={logoUrl}
                            alt="Brand Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-900">
                            Active Logo
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Displayed on form header
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="px-2.5 py-1 text-[11px] font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove logo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-brand-600 bg-gray-50/60 hover:bg-brand-50/20 rounded-xl p-5 text-center cursor-pointer transition-colors group"
                    >
                      <div className="w-9 h-9 mx-auto rounded-full bg-white border border-gray-200 group-hover:border-brand-200 flex items-center justify-center text-gray-400 group-hover:text-brand-600 transition-colors shadow-2xs mb-2">
                        <Upload size={14} />
                      </div>
                      <div className="text-xs font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
                        Upload brand logo
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        PNG, JPG, SVG up to 2MB
                      </div>
                    </div>
                  )}

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  {uploadingLogo && (
                    <div className="text-[11px] text-brand-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                      Uploading logo...
                    </div>
                  )}
                  {logoError && (
                    <div className="text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle size={11} />
                      {logoError}
                    </div>
                  )}
                </div>
              </section>

              {/* 2. Primary Color */}
              <section className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-900 block">
                    Primary Color
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-gray-500 uppercase">
                    {safeThemeColor}
                  </span>
                </div>

                <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
                  {/* Preset Swatches */}
                  <div className="flex items-center justify-between gap-1.5">
                    {ACCENT_PRESETS.map((p) => {
                      const isSelected =
                        safeThemeColor.toLowerCase() === p.hex.toLowerCase();
                      return (
                        <button
                          key={p.hex}
                          type="button"
                          onClick={() => {
                            setThemeColor(p.hex);
                            setLastValidColor(p.hex);
                          }}
                          aria-label={`Select color ${p.name}`}
                          className={`w-7 h-7 rounded-full transition-all cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                            isSelected
                              ? "ring-2 ring-brand-600 ring-offset-2 scale-105 shadow-xs"
                              : "hover:scale-105 border border-gray-200"
                          }`}
                          style={{ backgroundColor: p.hex }}
                          title={p.name}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white drop-shadow-xs" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Code Picker */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-600">
                      Custom color
                    </span>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 border border-gray-200/80 rounded-xl transition-all focus-within:bg-white focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/40 shadow-2xs">
                      <label className="relative w-4 h-4 rounded-full ring-1 ring-black/10 shrink-0 cursor-pointer overflow-hidden block">
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: safeThemeColor }}
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
                          if (val && !val.startsWith("#")) val = `#${val}`;
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
                        className="w-18 text-[11px] font-mono text-gray-800 font-semibold bg-transparent focus:outline-none uppercase"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Field Controls */}
              <section className="space-y-2.5">
                <label className="text-xs font-bold text-gray-900 block">
                  Field Controls
                </label>
                <div className="bg-white border border-gray-200/90 rounded-2xl divide-y divide-gray-100 shadow-2xs overflow-hidden">
                  <div
                    onClick={() => setCollectRating(!collectRating)}
                    className="p-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-gray-900">
                        Star Rating
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Collect 1 to 5 star rating
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
                    className="p-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-gray-900">
                        Customer Photo
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Allow customer avatar upload in introduction
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
                    className="p-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-gray-900">
                        Consent Checkbox
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Require permission checkbox
                      </div>
                    </div>
                    <Switch
                      checked={requireConsent}
                      onChange={setRequireConsent}
                      aria-label="Toggle Consent requirement"
                    />
                  </div>
                </div>
              </section>

              {/* Manual Save Button for Design Settings */}
              <div className="pt-1">
                <BookmarkSaveButton
                  onSave={handleSave}
                  savingStatus={savingStatus}
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SHARE (PURE DIRECT URL SIMPLICITY)                 */}
          {/* ======================================================== */}
          {tab === "share" && (
            <div className="space-y-4">
              <section className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-900 block">
                    Direct Share Link
                  </label>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Open live form</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="bg-white border border-gray-200/90 rounded-2xl p-4 space-y-3.5 shadow-2xs">
                  <div className="bg-gray-50/90 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-mono text-gray-700 break-all select-all">
                    {shareUrl}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white"
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

      {/* ============================================================ */}
      {/* RIGHT PANEL: LIVE INTERACTIVE CANVAS PREVIEW                */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-h-[640px] lg:min-h-0 lg:h-full overflow-hidden bg-gray-50">
        <div className="flex-1 w-full h-full p-4 md:p-6 overflow-hidden flex flex-col">
          {/* macOS Browser Chrome Window */}
          <div className="w-full flex-1 bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col relative">
            {/* macOS Chrome Header */}
            <div className="h-10 bg-gray-50/80 border-b border-gray-200/80 px-4 flex items-center justify-between shrink-0 relative">
              {/* Traffic light control dots */}
              <div className="flex items-center space-x-1.5 z-10 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600/80" />
              </div>

              {/* Centered URL pill */}
              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200/80 rounded-full px-3 py-0.5 text-[11px] text-gray-500 font-mono items-center gap-1.5 shadow-2xs max-w-[220px] truncate pointer-events-none">
                <Lock size={10} className="text-gray-400 shrink-0" />
                <span className="text-gray-400 shrink-0">https://</span>
                <span className="truncate">your-brand.com/c/{safeSlug}</span>
              </div>

              {/* Viewport switch: Desktop vs Mobile */}
              <div className="flex items-center gap-1 z-10 ml-auto md:ml-0 shrink-0">
                <div className="p-0.5 bg-gray-100 rounded-lg flex items-center border border-gray-200/70 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDeviceMode("desktop")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      deviceMode === "desktop"
                        ? "bg-white text-gray-900 shadow-2xs font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Monitor
                      size={12}
                      className={deviceMode === "desktop" ? "text-brand-600" : "text-gray-400"}
                    />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceMode("mobile")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      deviceMode === "mobile"
                        ? "bg-white text-gray-900 shadow-2xs font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Smartphone
                      size={12}
                      className={deviceMode === "mobile" ? "text-brand-600" : "text-gray-400"}
                    />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* In-Canvas Form Card Area */}
            <div className="flex-1 w-full min-h-0 p-3 md:p-6 overflow-y-auto flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3.5 my-auto w-full">
                <div
                  className={`shrink-0 transition-all duration-300 bg-white rounded-2xl border border-gray-200 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] ${
                    deviceMode === "mobile"
                      ? "w-full max-w-[290px] p-4"
                      : "w-full max-w-[350px] p-5"
                  }`}
                >
                  {/* 3-Step Progress Indicator Bar (Clickable in preview to quickly switch steps) */}
                  <div
                    className="flex gap-1 mb-5"
                    role="tablist"
                    aria-label="Step progress indicator"
                  >
                    <button
                      type="button"
                      onClick={() => setActivePage("rating")}
                      title="Rating (Step 1)"
                      className={`flex-1 h-[3.5px] rounded-full transition-all duration-200 cursor-pointer ${
                        activePageIndex >= 0 ? "bg-brand-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      style={activePageIndex >= 0 ? { backgroundColor: safeThemeColor } : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setActivePage("review")}
                      title="Review (Step 2)"
                      className={`flex-1 h-[3.5px] rounded-full transition-all duration-200 cursor-pointer ${
                        activePageIndex >= 1 ? "bg-brand-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      style={activePageIndex >= 1 ? { backgroundColor: safeThemeColor } : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setActivePage("thankyou")}
                      title="Thank You (Step 3)"
                      className={`flex-1 h-[3.5px] rounded-full transition-all duration-200 cursor-pointer ${
                        activePageIndex >= 2 ? "bg-brand-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      style={activePageIndex >= 2 ? { backgroundColor: safeThemeColor } : undefined}
                    />
                  </div>

                {/* Optional Brand Logo */}
                {logoUrl && (
                  <div className="mb-4 flex items-center">
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      className="max-h-8 max-w-[120px] object-contain"
                    />
                  </div>
                )}

                {/* ======================================================== */}
                {/* VIEW 1: RATING PAGE (STEP 1)                             */}
                {/* ======================================================== */}
                {activePage === "rating" && (
                  <section className="animate-step-in">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-snug mb-1.5">
                      {ratingTitle}
                    </h1>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      {ratingSubtitle}
                    </p>

                    {/* Stars */}
                    {collectRating && (
                      <div
                        className="flex gap-0.5 -mx-0.5 mb-1.5"
                        role="group"
                        aria-label="Rating"
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        {[1, 2, 3, 4, 5].map((n) => {
                          const isLit = (hoveredRating || testRating) >= n;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setTestRating(n)}
                              onMouseEnter={() => setHoveredRating(n)}
                              onFocus={() => setHoveredRating(n)}
                              className="w-8 h-8 p-0.5 rounded-lg border-0 bg-transparent cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 transition-transform hover:scale-105"
                              aria-label={`${n} out of 5`}
                            >
                              <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
                                <path
                                  d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"
                                  className={
                                    isLit
                                      ? "fill-star-400 stroke-star-400"
                                      : "fill-none stroke-gray-300 stroke-[1.5]"
                                  }
                                  style={{ transition: "fill .15s, stroke .15s" }}
                                />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Live Rating Label */}
                    <p className="h-4 text-xs text-gray-500 mb-4 font-normal">
                      {LABELS[hoveredRating || testRating] || ""}
                    </p>

                    {/* Continue Button */}
                    <button
                      type="button"
                      disabled={collectRating && !testRating}
                      onClick={() => setActivePage("review")}
                      style={{
                        backgroundColor: safeThemeColor,
                        color: contrastBtnText,
                      }}
                      className="w-full h-9 rounded-xl font-semibold text-xs transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-105 active:scale-[0.99]"
                    >
                      {ratingCta}
                    </button>
                  </section>
                )}

                {/* ======================================================== */}
                {/* VIEW 2: REVIEW PAGE (STEP 2)                             */}
                {/* ======================================================== */}
                {activePage === "review" && (
                  <section className="animate-step-in">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-snug mb-1.5">
                      {headline}
                    </h1>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      {prompt}
                    </p>

                    {/* Testimonial field */}
                    <div className="mb-3.5">
                      <label className="block text-xs font-medium text-gray-900 mb-1">
                        Your review
                      </label>
                      <textarea
                        rows={3}
                        value={testContent}
                        onChange={(e) => setTestContent(e.target.value)}
                        placeholder={reviewPlaceholder}
                        className="w-full min-h-[96px] rounded-xl border border-gray-200 bg-transparent p-2.5 text-xs text-gray-900 placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all leading-relaxed resize-y"
                      />
                    </div>

                    {/* Photo upload */}
                    {collectPhoto && (
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 text-gray-400 text-xs font-medium bg-cover bg-center"
                          style={testPhotoUrl ? { backgroundImage: `url('${testPhotoUrl}')` } : undefined}
                        >
                          {testPhotoUrl ? "" : "+"}
                        </div>
                        <button
                          type="button"
                          className="text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer"
                        >
                          Add photo <span className="text-gray-400 font-normal">(optional)</span>
                        </button>
                      </div>
                    )}

                    {/* 2-Column Row for Name and Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
                      <div>
                        <label className="block text-xs font-medium text-gray-900 mb-1">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={testName}
                          onChange={(e) => setTestName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className="w-full rounded-xl border border-gray-200 bg-transparent px-2.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-900 mb-1">
                          Role / company <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={testRole}
                          onChange={(e) => setTestRole(e.target.value)}
                          placeholder="e.g. Founder at Acme"
                          className="w-full rounded-xl border border-gray-200 bg-transparent px-2.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 placeholder:opacity-70 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Consent checkbox */}
                    {requireConsent && (
                      <label className="flex items-center gap-2 text-xs text-gray-500 mb-4 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={testConsent}
                          onChange={(e) => setTestConsent(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500/40 cursor-pointer"
                        />
                        <span>I allow this review to be shown publicly.</span>
                      </label>
                    )}

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={() => setActivePage("thankyou")}
                      style={{
                        backgroundColor: safeThemeColor,
                        color: contrastBtnText,
                      }}
                      className="w-full h-9 rounded-xl font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 active:scale-[0.99]"
                    >
                      {reviewCta || "Submit review"}
                    </button>

                    {/* Back link */}
                    <div className="mt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setActivePage("rating")}
                        className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                    </div>
                  </section>
                )}

                {/* ======================================================== */}
                {/* VIEW 3: THANK YOU PAGE (STEP 3)                          */}
                {/* ======================================================== */}
                {activePage === "thankyou" && (
                  <section className="animate-step-in pt-2 pb-1 text-left">
                    {/* Animated SVG Checkmark Tick */}
                    <svg
                      className="w-10 h-10 mb-4 block"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                      style={{ color: safeThemeColor }}
                    >
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="tick-circle"
                      />
                      <path
                        d="M15 25l6 6 12-13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="tick-path"
                      />
                    </svg>

                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-snug mb-1.5">
                      {thankYouTitle || "Thank you"}
                    </h1>
                    <p className="text-xs text-gray-500 m-0 leading-relaxed">
                      {thankYouMessage || "Your review has been submitted."}
                    </p>
                  </section>
                )}
              </div>

              {/* Builder Preview Step Navigator */}
              <div
                className={`flex items-center justify-between w-full px-1 shrink-0 ${
                  deviceMode === "mobile" ? "max-w-[290px]" : "max-w-[350px]"
                }`}
              >
                {/* Left: Back button or empty spacer */}
                <div className="flex items-center min-w-[65px]">
                  {activePage !== "rating" && (
                    <button
                      type="button"
                      onClick={() =>
                        setActivePage(activePage === "thankyou" ? "review" : "rating")
                      }
                      className="h-[26px] px-2.5 rounded-full text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={11} />
                      <span>Back</span>
                    </button>
                  )}
                </div>

                {/* Center: Step counter */}
                <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                  <span>
                    {activePage === "rating" && "Step 1 of 3"}
                    {activePage === "review" && "Step 2 of 3"}
                    {activePage === "thankyou" && "Step 3 of 3"}
                  </span>
                </div>

                {/* Right: Next button or Restart */}
                <div className="flex items-center justify-end min-w-[65px]">
                  {activePage === "rating" && (
                    <NextStepButton
                      label="Next"
                      onClick={() => setActivePage("review")}
                    />
                  )}
                  {activePage === "review" && (
                    <NextStepButton
                      label="Next"
                      onClick={() => setActivePage("thankyou")}
                    />
                  )}
                  {activePage === "thankyou" && (
                    <button
                      type="button"
                      onClick={() => setActivePage("rating")}
                      className="h-[26px] px-2.5 rounded-full text-[11px] font-semibold text-brand-600 bg-white border border-brand-200 hover:bg-brand-50 shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>↺ Restart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
