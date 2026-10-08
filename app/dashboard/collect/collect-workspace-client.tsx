"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Check,
  Lock,
  ExternalLink,
  Smartphone,
  Monitor,
  Copy,
  Layers,
  Paintbrush,
  AlertCircle,
  Upload,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  RotateCcw,
  Globe,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Pencil,
  Settings,
  Sliders,
  Star,
} from "lucide-react";
import { updateForm, uploadFormLogo, checkCustomDomainStatus } from "../actions";

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

function BookmarkSaveButton({
  onSave,
  savingStatus,
}: {
  onSave: () => void;
  savingStatus: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="flex justify-end pt-2">
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
            <Loader2 size={10} className="text-white animate-spin" />
          ) : savingStatus === "saved" ? (
            <Check size={10} className="text-white stroke-[3]" />
          ) : (
            <svg viewBox="0 0 384 512" height="0.65em" className="icon fill-white">
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

const CNAME_TARGET = "cname.vercel-dns.com";
const APEX_A_RECORD = "76.76.21.21";
const POLL_MS = 30000;

const cleanDomain = (v: string) =>
  v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\s/g, "");

const DOMAIN_RE = /^(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/;
const isApex = (d: string) => d.split(".").length === 2;
const hostLabel = (d: string) => d.split(".").slice(0, -2).join(".") || "@";

function DnsCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy DNS target"
      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
      title="Copy"
    >
      {copied ? <Check size={11} className="text-emerald-600 stroke-[3]" /> : <Copy size={11} />}
    </button>
  );
}

const PILLS = {
  pending: { text: "Waiting for DNS", cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Clock, spin: false },
  issuing: { text: "Issuing SSL", cls: "bg-blue-50 text-blue-800 ring-blue-200", Icon: Loader2, spin: true },
  active: { text: "Active", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", Icon: CheckCircle2, spin: false },
  failed: { text: "DNS Error", cls: "bg-red-50 text-red-800 ring-red-200", Icon: XCircle, spin: false },
};

function StatusPill({ status }: { status: "pending" | "issuing" | "active" | "failed" }) {
  const item = PILLS[status] || PILLS.pending;
  const { text, cls, Icon, spin } = item;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${cls}`}>
      <Icon size={10} className={spin ? "animate-spin" : ""} />
      <span>{text}</span>
    </span>
  );
}

function CustomDomainPanel({
  formId,
  initialDomain,
  onDomainChange,
}: {
  formId: string;
  initialDomain: string | null;
  onDomainChange: (domain: string | null) => void;
}) {
  const [input, setInput] = useState("");
  const [domain, setDomain] = useState<string | null>(initialDomain || null);
  const [status, setStatus] = useState<"pending" | "issuing" | "active" | "failed" | null>(
    initialDomain ? "active" : null
  );
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const cleaned = cleanDomain(input);
  const valid = DOMAIN_RE.test(cleaned);
  const apex = valid && isApex(cleaned);

  const connect = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      const res = await updateForm(formId, { custom_domain: cleaned });
      if (res.error) {
        setStatus("failed");
        setReason(res.error);
        setBusy(false);
        return;
      }
      setDomain(cleaned);
      onDomainChange(cleaned);

      const checkRes = await checkCustomDomainStatus(cleaned);
      if (checkRes.status === "verified") {
        setStatus("active");
        setReason("");
      } else if (checkRes.status === "failed") {
        setStatus("failed");
        setReason(checkRes.error || "DNS not pointing yet.");
      } else {
        setStatus("pending");
        setReason("");
      }
    } catch (err: any) {
      setStatus("failed");
      setReason(err.message || "Failed to connect.");
    } finally {
      setBusy(false);
    }
  };

  const check = async () => {
    if (!domain || checking) return;
    setChecking(true);
    try {
      const checkRes = await checkCustomDomainStatus(domain);
      if (checkRes.status === "verified") {
        setStatus("active");
        setReason("");
      } else if (checkRes.status === "failed") {
        setStatus("failed");
        setReason(checkRes.error || "DNS record not found yet.");
      } else {
        setStatus("pending");
        setReason("");
      }
    } catch (err: any) {
      setStatus("failed");
      setReason(err.message || "Failed to check DNS.");
    } finally {
      setChecking(false);
    }
  };

  const remove = async () => {
    await updateForm(formId, { custom_domain: null });
    if (timer.current) clearTimeout(timer.current);
    setDomain(null);
    setStatus(null);
    setInput("");
    setReason("");
    onDomainChange(null);
  };

  useEffect(() => {
    if (status === "pending" || status === "issuing") {
      timer.current = setTimeout(check, POLL_MS);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }
  }, [status, checking]); // eslint-disable-line

  const connected = !!domain;
  const dnsDomain = connected ? domain : cleaned;
  const showApex = connected ? isApex(domain) : apex;

  return (
    <section className="space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Globe size={13} className="text-brand-600" />
          <label className="text-xs font-bold text-gray-900 block">
            Custom Domain
          </label>
        </div>
        {connected ? (
          <StatusPill status={status || "pending"} />
        ) : (
          <span className="text-[11px] text-gray-400 font-medium">Optional</span>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
        {!connected ? (
          <div className="space-y-2">
            <div className="flex rounded-xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 overflow-hidden bg-white shadow-2xs">
              <span className="flex items-center bg-slate-50 px-2.5 font-mono text-xs text-slate-400 border-r border-slate-200 select-none">
                https://
              </span>
              <input
                id="cd-input"
                value={input}
                onChange={(e) => setInput(cleanDomain(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && connect()}
                placeholder="reviews.yourbrand.com"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={connect}
                disabled={!valid || busy}
                className="px-3 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 disabled:bg-slate-100 disabled:text-slate-400 text-white transition cursor-pointer shrink-0 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {busy && <Loader2 size={11} className="animate-spin" />}
                <span>Connect</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              {cleaned.length > 0 && !valid ? (
                <span className="text-red-500">Enter a valid domain (e.g. reviews.yourbrand.com).</span>
              ) : apex ? (
                <span>Tip: A subdomain like <code className="font-mono text-brand-600">reviews.yourbrand.com</code> is easiest to set up.</span>
              ) : (
                <span>Collect reviews on your own domain with automatic SSL.</span>
              )}
            </p>

            {valid && (
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
                  <span>Add this DNS record to connect:</span>
                  <span className="text-[10px] text-slate-400">Cloudflare: DNS only</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold block">Type</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{showApex ? "A" : "CNAME"}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold block">Host</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{showApex ? "@" : hostLabel(dnsDomain)}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold block">Target</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-slate-800 text-[11px] truncate">{showApex ? APEX_A_RECORD : CNAME_TARGET}</span>
                      <DnsCopyButton value={showApex ? APEX_A_RECORD : CNAME_TARGET} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="font-mono text-xs font-semibold text-slate-900 truncate">{domain}</span>
              <div className="flex items-center gap-1 shrink-0">
                {status === "active" && (
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-slate-400 hover:text-brand-600 rounded transition cursor-pointer"
                    title="Open live custom domain"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
                {(status === "pending" || status === "failed") && (
                  <button
                    type="button"
                    onClick={check}
                    disabled={checking}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded transition cursor-pointer disabled:opacity-50"
                    title="Check DNS status"
                  >
                    <RefreshCw size={12} className={checking ? "animate-spin text-brand-600" : ""} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={remove}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                  title="Remove domain"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {status === "active" && (
              <p className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck size={12} className="shrink-0" /> Live with automatic SSL.
              </p>
            )}
            {status === "issuing" && (
              <p className="flex items-center gap-1 text-[11px] text-brand-700 font-medium">
                <Loader2 size={12} className="animate-spin shrink-0" /> DNS verified. Issuing SSL certificate (~1 min).
              </p>
            )}
            {status === "failed" && (
              <p className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                <XCircle size={12} className="shrink-0" /> {reason || "DNS record not found. Check settings and retry."}
              </p>
            )}

            {status !== "active" && (
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-medium">
                  <span>DNS Record:</span>
                  <span className="text-[10px] text-slate-400">Cloudflare: DNS only</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold block">Type</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{showApex ? "A" : "CNAME"}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold block">Host</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{showApex ? "@" : hostLabel(dnsDomain)}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold block">Target</span>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-bold text-slate-800 text-[11px] truncate">{showApex ? APEX_A_RECORD : CNAME_TARGET}</span>
                      <DnsCopyButton value={showApex ? APEX_A_RECORD : CNAME_TARGET} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function CollectWorkspaceClient({
  form,
  appUrl,
}: CollectWorkspaceClientProps) {
  // Mode State: "form" (studio canvas) | "settings" (form settings)
  const [mainMode, setMainMode] = useState<"form" | "settings">("form");

  // Parse initial metadata safely stored in custom_css
  const initialMeta = useRef(parseFormMetadata(form.custom_css));

  // Inspector tab State: "pages" | "design"
  const [tab, setTab] = useState<"pages" | "design">("pages");

  // Selected step: "rating" | "review" | "thankyou"
  const [activePage, setActivePage] = useState<"rating" | "review" | "thankyou">("rating");

  // Step 1: Rating Page Copy
  const [ratingTitle, setRatingTitle] = useState(
    initialMeta.current.rating_title || "How was your experience with {business_name}?"
  );
  const [ratingSubtitle, setRatingSubtitle] = useState(
    initialMeta.current.rating_subtitle || "Your honest rating takes 2 seconds and means a lot to us."
  );
  const [ratingCta, setRatingCta] = useState(
    initialMeta.current.rating_cta || "Next →"
  );

  // Step 2: Review Page Copy
  const [headline, setHeadline] = useState(
    form.headline || "Tell us what stood out"
  );
  const [prompt, setPrompt] = useState(
    form.prompt || "A sentence or two is plenty. Your words help others decide, and they genuinely make our day."
  );
  const [reviewPlaceholder, setReviewPlaceholder] = useState(
    initialMeta.current.review_placeholder || "What did you love? What problem did we help you solve? What would you tell a friend?"
  );
  const [reviewCta, setReviewCta] = useState(
    initialMeta.current.review_cta || "Share my review"
  );

  // Step 3: Thank You Page Copy
  const [thankYouTitle, setThankYouTitle] = useState(
    initialMeta.current.thank_you_title || "You just made our day! 🎉"
  );
  const [thankYouMessage, setThankYouMessage] = useState(
    form.thank_you_message || "Thank you for taking the time to share this. Every word helps us improve and helps others find us. We're so glad to have you with us."
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

  // Active Custom Domain state for shareUrl
  const [activeCustomDomain, setActiveCustomDomain] = useState(form.custom_domain || "");

  // Interactive preview test states
  const [testRating, setTestRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [testContent, setTestContent] = useState("");
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testConsent, setTestConsent] = useState(true);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyLinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (copyLinkTimerRef.current) clearTimeout(copyLinkTimerRef.current);
    };
  }, []);

  const applyRecommendedDefaults = () => {
    setRatingTitle("How was your experience with {business_name}?");
    setRatingSubtitle("Your honest rating takes 2 seconds and means a lot to us.");
    setRatingCta("Next →");
    setHeadline("Tell us what stood out");
    setPrompt(
      "A sentence or two is plenty. Your words help others decide, and they genuinely make our day."
    );
    setReviewPlaceholder(
      "What did you love? What problem did we help you solve? What would you tell a friend?"
    );
    setReviewCta("Share my review");
    setThankYouTitle("You just made our day! 🎉");
    setThankYouMessage(
      "Thank you for taking the time to share this. Every word helps us improve and helps others find us. We're so glad to have you with us."
    );
  };

  const safeSlug = form.slug || "reviews";
  const shareUrl = activeCustomDomain.trim()
    ? `https://${activeCustomDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")}`
    : `${appUrl.replace(/\/$/, "")}/c/${safeSlug}`;

  const safeThemeColor = isValidHexColor(themeColor)
    ? normalizeHexColor(themeColor)
    : lastValidColor;
  const contrastBtnText = getContrastTextColor(safeThemeColor);

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

  const inputClass =
    "w-full text-xs rounded-xl px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 bg-gray-50/80 border border-gray-200/90 shadow-2xs transition-all duration-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/40 focus:outline-none focus:shadow-inner font-normal";
  const textareaClass =
    "w-full text-xs rounded-xl px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 bg-gray-50/80 border border-gray-200/90 shadow-2xs transition-all duration-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/40 focus:outline-none focus:shadow-inner font-normal resize-none leading-relaxed";

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-[#F8FAFC] font-sans text-gray-900 select-none">
      {/* ============================================================ */}
      {/* 1. TOP STUDIO NAVIGATION BAR                                */}
      {/* ============================================================ */}
      <header className="h-14 w-full bg-[#0B0F19] border-b border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 select-none">
        {/* Left: Back to all forms + form title & slug */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <Link
            href="/dashboard/collect"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-900/60 hover:bg-gray-800 text-xs font-semibold text-gray-200 transition-colors shrink-0"
          >
            <ArrowLeft size={13} />
            <span>All Forms</span>
          </Link>
          <div className="h-4 w-px bg-gray-800 shrink-0 hidden sm:block" />
          <span className="text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[200px]">
            {headline || "Feedback Form"}
          </span>
          <span className="hidden md:inline-block text-[10.5px] font-mono text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800 truncate">
            /c/{form.slug}
          </span>
        </div>

        {/* Center: Mode Switcher (Form vs Settings) */}
        <div className="flex items-center gap-1 bg-[#161B26] p-1 rounded-xl border border-gray-800 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setMainMode("form")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mainMode === "form"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Pencil size={13} />
            <span>Form</span>
          </button>
          <button
            type="button"
            onClick={() => setMainMode("settings")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mainMode === "settings"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Settings size={13} />
            <span>Settings</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Live link</span>
            <ExternalLink size={12} className="text-gray-400" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={savingStatus === "saving"}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            {savingStatus === "saving" ? (
              <Loader2 size={13} className="animate-spin text-white" />
            ) : savingStatus === "saved" ? (
              <Check size={13} className="text-white stroke-[3]" />
            ) : null}
            <span>
              {savingStatus === "saving"
                ? "Saving..."
                : savingStatus === "saved"
                ? "Saved!"
                : "Save changes"}
            </span>
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. BODY CONTENT: FORM CANVAS OR SETTINGS VIEW                */}
      {/* ============================================================ */}
      {mainMode === "form" ? (
        <div className="flex-1 w-full flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* ========================================================== */}
          {/* LEFT/CENTER: STUDIO CANVAS WITH 3 CONNECTED FORM CARDS     */}
          {/* ========================================================== */}
          <main
            className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-6 sm:p-10 relative bg-[#F8FAFC]"
            style={{
              backgroundImage: "radial-gradient(#CBD5E1 1.25px, transparent 1.25px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Top Canvas Controls (Desktop/Mobile preview width switcher) */}
            <div className="sticky top-0 z-10 mb-8 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-gray-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setDeviceMode("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    deviceMode === "desktop"
                      ? "bg-gray-100 text-gray-900 font-semibold shadow-2xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Monitor size={13} className={deviceMode === "desktop" ? "text-brand-600" : "text-gray-400"} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode("mobile")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    deviceMode === "mobile"
                      ? "bg-gray-100 text-gray-900 font-semibold shadow-2xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Smartphone size={13} className={deviceMode === "mobile" ? "text-brand-600" : "text-gray-400"} />
                  <span>Mobile</span>
                </button>
              </div>

              <div className="pointer-events-auto">
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-2xs text-xs font-medium text-gray-700 hover:text-brand-600 transition-colors"
                >
                  <span>Preview live</span>
                  <ExternalLink size={12} className="text-gray-400" />
                </a>
              </div>
            </div>

            {/* Canvas Cards Stack */}
            <div
              className={`mx-auto flex flex-col items-center pb-24 transition-all duration-300 ${
                deviceMode === "mobile" ? "max-w-[360px]" : "max-w-[480px]"
              }`}
            >
              {/* ---------------------------------------------------- */}
              {/* CARD 1: RATING PAGE                                   */}
              {/* ---------------------------------------------------- */}
              <div
                onClick={() => setActivePage("rating")}
                className={`w-full bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  activePage === "rating"
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                    : "border-gray-200/90 hover:border-gray-300 shadow-2xs"
                }`}
              >
                {/* Card Studio Header Bar */}
                <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        activePage === "rating"
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      1
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Rating Page
                    </span>
                  </div>

                  {/* Rating Switch */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {collectRating ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={collectRating}
                      onChange={setCollectRating}
                      aria-label="Toggle rating page"
                    />
                  </div>
                </div>

                {/* Card Preview Body */}
                <div className="p-6">
                  {/* Progress Pill Bar */}
                  <div className="flex gap-1 mb-5" role="tablist">
                    <div
                      className="flex-1 h-[3.5px] rounded-full"
                      style={{ backgroundColor: safeThemeColor }}
                    />
                    <div className="flex-1 h-[3.5px] rounded-full bg-gray-200" />
                    <div className="flex-1 h-[3.5px] rounded-full bg-gray-200" />
                  </div>

                  {/* Brand Logo */}
                  {logoUrl && (
                    <div className="mb-4 flex items-center">
                      <img
                        src={logoUrl}
                        alt="Brand Logo"
                        className="max-h-8 max-w-[120px] object-contain"
                      />
                    </div>
                  )}

                  {!collectRating ? (
                    <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Star rating is turned off
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Reviewers will skip straight to the review page.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-snug mb-1">
                        {ratingTitle}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        {ratingSubtitle}
                      </p>

                      {/* 5 Interactive Stars */}
                      <div
                        className="flex gap-1 -mx-0.5 mb-1.5"
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        {[1, 2, 3, 4, 5].map((n) => {
                          const isLit = (hoveredRating || testRating) >= n;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTestRating(n);
                              }}
                              onMouseEnter={() => setHoveredRating(n)}
                              className="w-8 h-8 p-0.5 rounded-lg border-0 bg-transparent cursor-pointer transition-transform hover:scale-105"
                              aria-label={`${n} stars`}
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

                      <p className="h-4 text-xs text-gray-400 mb-4 font-normal">
                        {LABELS[hoveredRating || testRating] || ""}
                      </p>

                      {/* Continue Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePage("review");
                        }}
                        style={{
                          backgroundColor: safeThemeColor,
                          color: contrastBtnText,
                        }}
                        className="w-full h-9 rounded-xl font-semibold text-xs transition-all shadow-xs flex items-center justify-center cursor-pointer hover:brightness-105 active:scale-[0.99]"
                      >
                        {ratingCta || "Next →"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical Connector Line */}
              <div className="w-px h-8 border-l-2 border-dashed border-gray-300 my-1" />

              {/* ---------------------------------------------------- */}
              {/* CARD 2: REVIEW PAGE                                   */}
              {/* ---------------------------------------------------- */}
              <div
                onClick={() => setActivePage("review")}
                className={`w-full bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  activePage === "review"
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                    : "border-gray-200/90 hover:border-gray-300 shadow-2xs"
                }`}
              >
                {/* Card Studio Header Bar */}
                <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        activePage === "review"
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      2
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Review Page
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Main Step</span>
                </div>

                {/* Card Preview Body */}
                <div className="p-6">
                  {/* Progress Pill Bar */}
                  <div className="flex gap-1 mb-5" role="tablist">
                    <div
                      className="flex-1 h-[3.5px] rounded-full"
                      style={{ backgroundColor: safeThemeColor }}
                    />
                    <div
                      className="flex-1 h-[3.5px] rounded-full"
                      style={{ backgroundColor: safeThemeColor }}
                    />
                    <div className="flex-1 h-[3.5px] rounded-full bg-gray-200" />
                  </div>

                  {/* Brand Logo */}
                  {logoUrl && (
                    <div className="mb-4 flex items-center">
                      <img
                        src={logoUrl}
                        alt="Brand Logo"
                        className="max-h-8 max-w-[120px] object-contain"
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-snug mb-1">
                    {headline}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    {prompt}
                  </p>

                  {/* Review Textarea */}
                  <div className="mb-3.5">
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                      Your review
                    </label>
                    <textarea
                      rows={3}
                      value={testContent}
                      onChange={(e) => setTestContent(e.target.value)}
                      placeholder={reviewPlaceholder}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full min-h-[88px] rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-all leading-relaxed resize-y shadow-2xs"
                    />
                  </div>

                  {/* Customer Photo Upload Slot */}
                  {collectPhoto && (
                    <div className="flex items-center gap-2.5 mb-3.5">
                      <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 text-gray-400 text-xs font-medium bg-gray-50">
                        +
                      </div>
                      <span className="text-xs font-medium text-brand-600">
                        Add photo <span className="text-gray-400 font-normal">(optional)</span>
                      </span>
                    </div>
                  )}

                  {/* Full Name & Role inputs */}
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
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-2.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
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
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-2.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-600 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Consent checkbox */}
                  {requireConsent && (
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 text-xs text-gray-500 mb-4 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={testConsent}
                        onChange={(e) => setTestConsent(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500/40 cursor-pointer"
                      />
                      <span>I allow this review to be shown publicly.</span>
                    </label>
                  )}

                  {/* Submit CTA button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePage("thankyou");
                    }}
                    style={{
                      backgroundColor: safeThemeColor,
                      color: contrastBtnText,
                    }}
                    className="w-full h-9 rounded-xl font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 active:scale-[0.99]"
                  >
                    {reviewCta || "Share my review"}
                  </button>
                </div>
              </div>

              {/* Vertical Connector Line */}
              <div className="w-px h-8 border-l-2 border-dashed border-gray-300 my-1" />

              {/* ---------------------------------------------------- */}
              {/* CARD 3: THANK YOU PAGE                                */}
              {/* ---------------------------------------------------- */}
              <div
                onClick={() => setActivePage("thankyou")}
                className={`w-full bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  activePage === "thankyou"
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                    : "border-gray-200/90 hover:border-gray-300 shadow-2xs"
                }`}
              >
                {/* Card Studio Header Bar */}
                <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        activePage === "thankyou"
                          ? "bg-brand-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      3
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      Thank You Page
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Completion</span>
                </div>

                {/* Card Preview Body */}
                <div className="p-6">
                  {/* Progress Pill Bar */}
                  <div className="flex gap-1 mb-5" role="tablist">
                    <div
                      className="flex-1 h-[3.5px] rounded-full"
                      style={{ backgroundColor: safeThemeColor }}
                    />
                    <div
                      className="flex-1 h-[3.5px] rounded-full"
                      style={{ backgroundColor: safeThemeColor }}
                    />
                    <div
                      className="flex-1 h-[3.5px] rounded-full"
                      style={{ backgroundColor: safeThemeColor }}
                    />
                  </div>

                  {/* Brand Logo */}
                  {logoUrl && (
                    <div className="mb-4 flex items-center">
                      <img
                        src={logoUrl}
                        alt="Brand Logo"
                        className="max-h-8 max-w-[120px] object-contain"
                      />
                    </div>
                  )}

                  {/* Checkmark tick */}
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
                    />
                    <path
                      d="M15 25l6 6 12-13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-snug mb-1.5">
                    {thankYouTitle || "You just made our day! 🎉"}
                  </h3>
                  <p className="text-xs text-gray-500 m-0 leading-relaxed">
                    {thankYouMessage}
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* ========================================================== */}
          {/* RIGHT: INSPECTOR PANEL (PAGES & DESIGN)                    */}
          {/* ========================================================== */}
          <aside className="w-full lg:w-[340px] xl:w-[360px] bg-white border-t lg:border-t-0 lg:border-l border-gray-200/90 flex flex-col h-auto lg:h-full shrink-0 z-20 shadow-xs overflow-hidden">
            {/* Inspector Top Tabs: Pages | Design */}
            <div className="p-3.5 border-b border-gray-200/80 bg-white shrink-0">
              <div className="grid grid-cols-2 p-1 bg-gray-100/90 rounded-xl border border-gray-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setTab("pages")}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    tab === "pages"
                      ? "bg-white text-brand-600 shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Layers size={14} className={tab === "pages" ? "text-brand-600" : "text-gray-400"} />
                  <span>Pages</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTab("design")}
                  className={`flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    tab === "design"
                      ? "bg-white text-brand-600 shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Paintbrush size={14} className={tab === "design" ? "text-brand-600" : "text-gray-400"} />
                  <span>Design</span>
                </button>
              </div>
            </div>

            {/* Inspector Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">
              {/* ---------------------------------------------------- */}
              {/* TAB 1: PAGES CONFIGURATION                            */}
              {/* ---------------------------------------------------- */}
              {tab === "pages" && (
                <div className="space-y-4">
                  {/* Step Selector Pills */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100/90 rounded-xl border border-gray-200/80 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setActivePage("rating")}
                      className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center truncate ${
                        activePage === "rating"
                          ? "bg-white text-gray-900 shadow-2xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      1. Rating
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePage("review")}
                      className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center truncate ${
                        activePage === "review"
                          ? "bg-white text-gray-900 shadow-2xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      2. Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePage("thankyou")}
                      className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center truncate ${
                        activePage === "thankyou"
                          ? "bg-white text-gray-900 shadow-2xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      3. Thank You
                    </button>
                  </div>

                  {/* Context Note */}
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start justify-between gap-2 shadow-2xs">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold block leading-tight">
                          {activePage === "rating" && "Step 1: Rating Page"}
                          {activePage === "review" && "Step 2: Review Page"}
                          {activePage === "thankyou" && "Step 3: Thank You Page"}
                        </span>
                        <span className="text-[11px] text-blue-700/80 leading-normal block mt-0.5">
                          {activePage === "rating" && "Collect 1 to 5 star ratings from your customers."}
                          {activePage === "review" && "Capture customer praise, headline prompt, and consent."}
                          {activePage === "thankyou" && "Appreciation message shown immediately after submitting."}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={applyRecommendedDefaults}
                      className="text-[10px] font-medium text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 cursor-pointer bg-blue-100/60 hover:bg-blue-100 px-2 py-0.5 rounded-md shrink-0"
                      title="Load recommended copy"
                    >
                      <RotateCcw size={10} />
                      <span>Defaults</span>
                    </button>
                  </div>

                  {/* Page 1: Rating Copy Fields */}
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
                            placeholder="e.g. How was your experience with {business_name}?"
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
                            placeholder="e.g. Your honest rating takes 2 seconds and means a lot to us."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 block">
                            Call to action button
                          </label>
                          <input
                            type="text"
                            value={ratingCta}
                            onChange={(e) => setRatingCta(e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Next →"
                          />
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-gray-800 block">
                              Star Rating Step
                            </span>
                            <span className="text-[11px] text-gray-500 block">
                              Enable or skip star rating
                            </span>
                          </div>
                          <Switch
                            checked={collectRating}
                            onChange={setCollectRating}
                            aria-label="Toggle rating"
                          />
                        </div>
                      </div>

                      <BookmarkSaveButton
                        onSave={handleSave}
                        savingStatus={savingStatus}
                      />
                    </div>
                  )}

                  {/* Page 2: Review Copy Fields */}
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
                            placeholder="e.g. Tell us what stood out"
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
                            placeholder="e.g. A sentence or two is plenty. Your words help others decide, and they genuinely make our day."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 block">
                            Review placeholder
                          </label>
                          <input
                            type="text"
                            value={reviewPlaceholder}
                            onChange={(e) => setReviewPlaceholder(e.target.value)}
                            className={inputClass}
                            placeholder="e.g. What did you love? What problem did we help you solve?"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700 block">
                            Call to action button
                          </label>
                          <input
                            type="text"
                            value={reviewCta}
                            onChange={(e) => setReviewCta(e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Share my review"
                          />
                        </div>
                      </div>

                      <BookmarkSaveButton
                        onSave={handleSave}
                        savingStatus={savingStatus}
                      />
                    </div>
                  )}

                  {/* Page 3: Thank You Copy Fields */}
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
                            placeholder="e.g. You just made our day! 🎉"
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
                            placeholder="e.g. Thank you for taking the time to share this..."
                          />
                        </div>
                      </div>

                      <BookmarkSaveButton
                        onSave={handleSave}
                        savingStatus={savingStatus}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 2: DESIGN & BRANDING                             */}
              {/* ---------------------------------------------------- */}
              {tab === "design" && (
                <div className="space-y-5">
                  {/* 1. Brand Logo */}
                  <section className="space-y-2.5">
                    <label className="text-xs font-bold text-gray-900 block">
                      Brand Logo
                    </label>

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
                      {/* Presets */}
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

                      {/* Custom Hex Input */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-600">
                          Custom hex
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
                          aria-label="Toggle Star Rating"
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
                            Allow photo avatar upload
                          </div>
                        </div>
                        <Switch
                          checked={collectPhoto}
                          onChange={setCollectPhoto}
                          aria-label="Toggle Customer Photo"
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
                            Require public display permission
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

                  {/* Save changes button */}
                  <div className="pt-1">
                    <BookmarkSaveButton
                      onSave={handleSave}
                      savingStatus={savingStatus}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : (
        /* ============================================================ */
        /* SETTINGS MODE: CLEAN CENTERED FORM SETTINGS VIEW            */
        /* ============================================================ */
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 space-y-8 pb-20">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Form settings
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Configure your public link, custom domain, and collection preferences.
              </p>
            </div>

            {/* 1. Form Slug Section */}
            <section className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-900 block">
                  Form slug
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Your form's public link. Changing it breaks any links you've already shared.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 gap-3">
                <div className="font-mono text-xs text-gray-700 truncate min-w-0 select-all">
                  {shareUrl}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-white text-xs font-medium text-gray-700 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? <Check size={12} className="text-emerald-600 stroke-[3]" /> : <Copy size={12} />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-white text-gray-500 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                    title="Open live link"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </section>

            {/* 2. Custom Domain Section */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs">
              <CustomDomainPanel
                formId={form.id}
                initialDomain={activeCustomDomain || null}
                onDomainChange={(d) => setActiveCustomDomain(d || "")}
              />
            </div>

            {/* 3. Collection Preferences */}
            <section className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-900 block">
                  Collection Preferences
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Toggle what inputs to require or collect from reviewers.
                </p>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-200/80 rounded-xl overflow-hidden">
                <div
                  onClick={() => setCollectRating(!collectRating)}
                  className="p-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer select-none"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-gray-900">
                      Star Rating Page
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Collect 1 to 5 star rating before review prompt
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
                      Allow customers to upload their photo avatar
                    </div>
                  </div>
                  <Switch
                    checked={collectPhoto}
                    onChange={setCollectPhoto}
                    aria-label="Toggle Photo upload"
                  />
                </div>

                <div
                  onClick={() => setRequireConsent(!requireConsent)}
                  className="p-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer select-none"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-gray-900">
                      Require Public Consent
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Show mandatory consent checkbox for marketing use
                    </div>
                  </div>
                  <Switch
                    checked={requireConsent}
                    onChange={setRequireConsent}
                    aria-label="Toggle Consent checkbox"
                  />
                </div>
              </div>
            </section>

            {/* 4. Restore Defaults */}
            <section className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-gray-900 block">
                  Reset Copy to Recommended Defaults
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Restores high-converting ProofKit default prompt and thank you messaging.
                </p>
              </div>
              <button
                type="button"
                onClick={applyRecommendedDefaults}
                className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RotateCcw size={12} />
                <span>Reset copy</span>
              </button>
            </section>

            {/* Save in settings view */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={savingStatus === "saving"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {savingStatus === "saving" ? (
                  <Loader2 size={13} className="animate-spin text-white" />
                ) : savingStatus === "saved" ? (
                  <Check size={13} className="text-white stroke-[3]" />
                ) : null}
                <span>
                  {savingStatus === "saving"
                    ? "Saving changes..."
                    : savingStatus === "saved"
                    ? "Changes saved!"
                    : "Save changes"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
