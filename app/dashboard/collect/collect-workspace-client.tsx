"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Lock,
  ExternalLink,
  Copy,
  Layers,
  Paintbrush,
  AlertCircle,
  Upload,
  Trash2,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Globe,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Pencil,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { updateForm, uploadFormLogo, checkCustomDomainStatus } from "../actions";

interface FormRow {
  id: string;
  slug: string;
  name?: string;
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
  welcome_title?: string;
  welcome_subtitle?: string;
  welcome_sender_name?: string;
  welcome_sender_note?: string;
  welcome_cta?: string;
  rating_title?: string;
  rating_subtitle?: string;
  rating_cta?: string;
  review_placeholder?: string;
  review_cta?: string;
  thank_you_title?: string;
  show_branding?: boolean;
  page_layout?: "wide" | "compact";
  button_style?: "fancy" | "plain";
  heading_font?: string;
  body_font?: string;
}

interface CollectWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: FormRow;
  appUrl: string;
}

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const CURATED_FONTS = [
  { name: "Instrument Serif", label: "Instrument Serif" },
  { name: "Plus Jakarta Sans", label: "Plus Jakarta Sans" },
  { name: "DM Sans", label: "DM Sans" },
  { name: "Inter", label: "Inter" },
  { name: "Outfit", label: "Outfit" },
  { name: "Manrope", label: "Manrope" },
  { name: "Space Grotesk", label: "Space Grotesk" },
  { name: "Urbanist", label: "Urbanist" },
  { name: "Poppins", label: "Poppins" },
  { name: "Montserrat", label: "Montserrat" },
  { name: "Playfair Display", label: "Playfair Display" },
  { name: "Lora", label: "Lora" },
  { name: "Fraunces", label: "Fraunces" },
  { name: "Bricolage Grotesque", label: "Bricolage Grotesque" },
  { name: "Instrument Sans", label: "Instrument Sans" },
];

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
  const router = useRouter();

  // Mode State: "form" (studio canvas) | "settings" (form settings)
  const [mainMode, setMainMode] = useState<"form" | "settings">("form");

  // Parse initial metadata safely stored in custom_css
  const initialMeta = useRef(parseFormMetadata(form.custom_css));

  // Inspector tab State: "pages" | "design"
  const [tab, setTab] = useState<"pages" | "design">("pages");

  // Selected step: "welcome" | "rating" | "review" | "thankyou" (controlled by clicking cards or tools on canvas)
  const [activePage, setActivePage] = useState<"welcome" | "rating" | "review" | "thankyou">("welcome");

  // Step 0: Welcome Page Copy
  const [welcomeTitle, setWelcomeTitle] = useState(
    initialMeta.current.welcome_title || "A little note from you means a lot to us."
  );
  const [welcomeSubtitle, setWelcomeSubtitle] = useState(
    initialMeta.current.welcome_subtitle || "Your experience can help someone else find the right fit."
  );
  const [welcomeSenderName, setWelcomeSenderName] = useState(
    initialMeta.current.welcome_sender_name || (form.name || "Our Team")
  );
  const [welcomeSenderNote, setWelcomeSenderNote] = useState(
    initialMeta.current.welcome_sender_note || "Hey, we'd love to hear how it went."
  );
  const [welcomeCta, setWelcomeCta] = useState(
    initialMeta.current.welcome_cta || "Share feedback →"
  );

  // Step 1: Rating Page Copy
  const [ratingTitle, setRatingTitle] = useState(
    initialMeta.current.rating_title || `How was your experience with ${form.name || "Blovi"}?`
  );
  const [ratingSubtitle, setRatingSubtitle] = useState(
    initialMeta.current.rating_subtitle || "Your honest rating means a lot to us."
  );
  const [ratingCta, setRatingCta] = useState(
    initialMeta.current.rating_cta || "Continue →"
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
    initialMeta.current.thank_you_title || "You just made our day."
  );
  const [thankYouMessage, setThankYouMessage] = useState(
    form.thank_you_message || "Thank you for sharing a little of your experience. Your words help others find the right fit."
  );

  // Design States
  const [logoUrl, setLogoUrl] = useState<string | null>(initialMeta.current.logo_url || null);
  const [themeColor, setThemeColor] = useState(form.theme_color || "#6556A8");
  const [lastValidColor, setLastValidColor] = useState(
    normalizeHexColor(form.theme_color || "#6556A8")
  );
  const [collectPhoto, setCollectPhoto] = useState(form.collect_photo ?? true);
  const [collectRating, setCollectRating] = useState(form.collect_rating ?? true);
  const [requireConsent, setRequireConsent] = useState(form.require_consent ?? true);
  const [showBranding, setShowBranding] = useState<boolean>(
    initialMeta.current.show_branding !== undefined ? !!initialMeta.current.show_branding : true
  );
  const [headingFont, setHeadingFont] = useState<string>(
    initialMeta.current.heading_font || form.custom_font || "Instrument Serif"
  );
  const [bodyFont, setBodyFont] = useState<string>(
    initialMeta.current.body_font || "DM Sans"
  );

  // UI Status
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; size: number; delay: number }[]>([]);

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

  // Reels navigation & scroll detection refs
  const mainRef = useRef<HTMLElement>(null);
  const welcomeCardRef = useRef<HTMLDivElement>(null);
  const ratingCardRef = useRef<HTMLDivElement>(null);
  const reviewCardRef = useRef<HTMLDivElement>(null);
  const thankYouCardRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  const scrollToPage = (page: "welcome" | "rating" | "review" | "thankyou") => {
    setActivePage(page);
    const refMap = {
      welcome: welcomeCardRef.current,
      rating: ratingCardRef.current,
      review: reviewCardRef.current,
      thankyou: thankYouCardRef.current,
    };
    const target = refMap[page];
    if (target) {
      isScrollingProgrammatically.current = true;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 700);
    }
  };

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      const cards: Array<{
        page: "welcome" | "rating" | "review" | "thankyou";
        el: HTMLElement | null;
      }> = [
        { page: "welcome", el: welcomeCardRef.current },
        { page: "rating", el: ratingCardRef.current },
        { page: "review", el: reviewCardRef.current },
        { page: "thankyou", el: thankYouCardRef.current },
      ];

      let closestPage = activePage;
      let minDistance = Infinity;

      cards.forEach(({ page, el }) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestPage = page;
        }
      });

      if (closestPage !== activePage) {
        setActivePage(closestPage);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activePage]);

  const triggerSparkle = () => {
    const id = Date.now();
    const newSparks = [
      { id: id + 1, left: "62%", top: "26%", size: 16, delay: 0 },
      { id: id + 2, left: "22%", top: "34%", size: 12, delay: 0.12 },
    ];
    setSparkles(newSparks);
    setTimeout(() => setSparkles([]), 1000);
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (copyLinkTimerRef.current) clearTimeout(copyLinkTimerRef.current);
    };
  }, []);

  const applyRecommendedDefaults = () => {
    setWelcomeTitle("A little note from you means a lot to us.");
    setWelcomeSubtitle("Your experience can help someone else find the right fit.");
    setWelcomeSenderName(form.name || "Our Team");
    setWelcomeSenderNote("Hey, we'd love to hear how it went.");
    setWelcomeCta("Share feedback →");
    setRatingTitle(`How was your experience with ${form.name || "Blovi"}?`);
    setRatingSubtitle("Your honest rating means a lot to us.");
    setRatingCta("Continue →");
    setHeadline("Tell us what stood out.");
    setPrompt(
      "A sentence or two is plenty. Your words help others decide, and they genuinely make our day."
    );
    setReviewPlaceholder(
      "What did you love? What changed for you?"
    );
    setReviewCta("Share my review →");
    setThankYouTitle("You just made our day.");
    setThankYouMessage(
      "Thank you for sharing a little of your experience. Your words help others find the right fit."
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
          welcome_title: welcomeTitle,
          welcome_subtitle: welcomeSubtitle,
          welcome_sender_name: welcomeSenderName,
          welcome_sender_note: welcomeSenderNote,
          welcome_cta: welcomeCta,
          rating_title: ratingTitle,
          rating_subtitle: ratingSubtitle,
          rating_cta: ratingCta,
          review_placeholder: reviewPlaceholder,
          review_cta: reviewCta,
          thank_you_title: thankYouTitle,
          show_branding: showBranding,
          heading_font: headingFont,
          body_font: bodyFont,
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
        custom_font: headingFont || bodyFont,
        custom_css: serializedCss,
      });

      if (!isMountedRef.current) return;

      if (res?.error) {
        setSavingStatus("error");
      } else {
        setSavingStatus("saved");
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => {
          router.push("/dashboard/collect");
          router.refresh();
        }, 400);
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
    "w-full text-xs rounded-lg px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none font-normal";

  return (
    <div className="flex flex-col h-screen w-full max-w-full overflow-hidden bg-[#F8FAFC] font-sans text-gray-900 select-none">
      {/* Global hidden file input for logo uploads across canvas & inspector */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleLogoUpload}
        className="hidden"
      />

      {/* ============================================================ */}
      {/* 1. TOP STUDIO NAVIGATION BAR                                */}
      {/* ============================================================ */}
      <header className="h-14 w-full bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 select-none shadow-2xs">
        {/* Left: Back to all forms + form title & slug */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <Link
            href="/dashboard/collect"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>All Forms</span>
          </Link>
          <div className="h-4 w-px bg-gray-200 shrink-0 hidden sm:block" />
          <span className="text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
            {headline || "Feedback Form"}
          </span>
          <span className="hidden md:inline-block text-[11px] font-mono text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md truncate">
            /c/{form.slug}
          </span>
        </div>

        {/* Center: Mode Switcher (Form vs Settings) */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setMainMode("form")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mainMode === "form"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 font-medium"
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
                : "text-gray-600 hover:text-gray-900 font-medium"
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-200 hover:text-brand-600 bg-white hover:bg-brand-50/50 text-xs font-medium text-gray-700 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Live link</span>
            <ExternalLink size={12} className="text-gray-400" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={savingStatus === "saving"}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 shrink-0"
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
            ref={mainRef}
            className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-6 sm:p-10 relative scroll-smooth snap-y snap-mandatory"
            style={{
              background: `radial-gradient(ellipse at 50% 9%, color-mix(in srgb, ${safeThemeColor} 13%, transparent), transparent 40%), #faf9f6`,
            }}
          >
            {/* Dynamic Google Fonts for live typography preview */}
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
                headingFont
              ).replace(/%20/g, "+")}&family=${encodeURIComponent(
                bodyFont
              ).replace(/%20/g, "+")}&display=swap`}
            />

            <style>{`
              :root {
                --accent: ${safeThemeColor};
                --ink: #292723;
                --mut: #77716b;
                --bg: #faf9f6;
                --card: rgba(255, 254, 252, .92);
                --field: #fffdfa;
                --line: #e9e5df;
                --soft: #f8f6f2;
              }
              .blovi-shell { width: min(100%, 476px); }
              .blovi-shell,
              .blovi-card,
              .blovi-inner,
              .blovi-step,
              .blovi-sub,
              .blovi-owner,
              .blovi-btn,
              .blovi-lbl,
              .blovi-note,
              .blovi-hint,
              .blovi-cnt,
              .blovi-chip,
              .blovi-grid,
              .blovi-cons,
              .blovi-thx,
              .blovi-sum,
              .blovi-visit,
              .blovi-brand,
              input.blovi-t,
              textarea.blovi-textarea,
              label.blovi-l {
                font-family: '${bodyFont}', var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
              }
              .blovi-card {
                position: relative;
                overflow: hidden;
                min-height: 560px;
                border-radius: 28px;
                background: var(--card);
                border: 1px solid rgba(0, 0, 0, 0.06);
                box-shadow: 0 1px 2px rgba(37,31,26,.05), 0 24px 72px -32px rgba(41,35,29,.28);
              }
              .blovi-bar {
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 2px;
                background: rgba(79,63,49,.1);
                z-index: 10;
              }
              .blovi-bar i {
                display: block;
                height: 100%;
                background: var(--accent);
                border-radius: 0 99px 99px 0;
                transition: width .35s cubic-bezier(.22,1,.36,1);
              }
              .blovi-inner {
                min-height: 560px;
                padding: 40px 38px 28px;
                display: flex;
                flex-direction: column;
              }
              .blovi-step {
                display: flex;
                flex-direction: column;
                flex: 1;
                animation: bloviIn .3s cubic-bezier(.22,1,.36,1);
              }
              @keyframes bloviIn {
                from { opacity: 0; transform: translateY(9px); }
                to { opacity: 1; transform: none; }
              }
              .blovi-back {
                position: absolute;
                left: 24px; top: 22px;
                border: 0;
                background: none;
                color: var(--mut);
                font: inherit;
                font-size: 12px;
                cursor: pointer;
                padding: 6px 8px;
                border-radius: 8px;
                z-index: 20;
                transition: color .15s;
              }
              .blovi-back:hover { color: var(--accent); }
              .blovi-h1 {
                margin: 0;
                text-align: center;
                font-weight: 400;
                font-size: 37px;
                line-height: 1.05;
                letter-spacing: -.035em;
                font-family: '${headingFont}', Georgia, serif !important;
              }
              .blovi-sub {
                max-width: 350px;
                margin: 12px auto 0;
                text-align: center;
                color: var(--mut);
                font-size: 14px;
                line-height: 1.65;
              }
              .blovi-co {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 0 0 26px;
                font-size: 14px;
                font-weight: 600;
              }
              .blovi-co b {
                width: 34px; height: 34px;
                border-radius: 11px;
                display: grid;
                place-items: center;
                background: color-mix(in srgb, var(--accent) 12%, #fff);
                color: var(--accent);
                font: 600 18px Georgia, serif;
              }
              .blovi-brand-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 28px;
              }
              .blovi-brand-logo img {
                max-height: 44px;
                max-width: 170px;
                width: auto;
                height: auto;
                object-fit: contain;
                display: block;
              }
              .blovi-owner {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 24px;
                font-size: 12px;
                color: var(--mut);
                line-height: 1.45;
              }
              .blovi-owner span.blovi-av {
                width: 34px; height: 34px;
                border-radius: 50%;
                display: grid;
                place-items: center;
                font-size: 10px;
                font-weight: 700;
                color: #735846;
                background: linear-gradient(145deg, #f0dfce, #ddc2a5);
                border: 2px solid #fff;
                flex: none;
              }
              .blovi-owner strong { color: var(--ink); }
              .blovi-btn {
                width: 100%;
                min-height: 52px;
                border: 0;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                cursor: pointer;
                color: #fff;
                font: inherit;
                font-size: 14px;
                font-weight: 650;
                background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 88%, #a99de6), var(--accent) 72%);
                box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 5px 13px color-mix(in srgb, var(--accent) 22%, transparent);
                transition: transform .2s, filter .2s;
              }
              .blovi-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                filter: brightness(1.05);
              }
              .blovi-btn:active:not(:disabled) {
                transform: scale(.985);
              }
              .blovi-btn:disabled {
                opacity: .45;
                cursor: not-allowed;
                box-shadow: none;
              }
              .blovi-push {
                margin-top: auto;
                padding-top: 28px;
              }
              .blovi-hint {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                margin-top: 14px;
                color: var(--mut);
                font-size: 11px;
              }
              .blovi-hint i {
                width: 4px; height: 4px;
                border-radius: 50%;
                background: #b7aea5;
              }
              .blovi-stars {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin: 34px 0 8px;
              }
              .blovi-star {
                width: 56px; height: 60px;
                border: 0;
                background: none;
                padding: 0;
                display: grid;
                place-items: center;
                color: #e5ded5;
                cursor: pointer;
                transition: color .15s, transform .2s cubic-bezier(.2,.9,.3,1.5);
              }
              .blovi-star svg {
                width: 45px; height: 45px;
                fill: currentColor;
                stroke: #cb9130;
                stroke-width: 1.7;
                stroke-linejoin: round;
              }
              .blovi-star.on {
                color: #e7ae47;
                transform: scale(1.05);
              }
              .blovi-star.hv { color: #f0c66e; }
              .blovi-star:active { transform: scale(.9); }
              .blovi-lbl {
                min-height: 27px;
                text-align: center;
                color: #8a6b2f;
                font-size: 13px;
                font-weight: 620;
              }
              .blovi-note {
                text-align: center;
                color: var(--mut);
                font-size: 12px;
                margin: 10px 0 0;
              }
              .blovi-spark {
                position: absolute;
                font-size: 18px;
                color: #e3aa49;
                pointer-events: none;
                animation: bloviSpark .8s ease-out forwards;
              }
              @keyframes bloviSpark {
                0% { opacity: 0; transform: scale(.2) rotate(-25deg); }
                40% { opacity: 1; transform: scale(1.1); }
                100% { opacity: 0; transform: scale(.7) rotate(25deg); }
              }
              .blovi-rev h1 {
                text-align: left;
                font-size: 33px;
              }
              .blovi-rev .blovi-sub {
                text-align: left;
                margin: 9px 0 16px;
                font-size: 13px;
                max-width: none;
              }
              label.blovi-l {
                font-size: 12px;
                font-weight: 650;
                display: block;
                margin-bottom: 7px;
              }
              label.blovi-l small {
                font-weight: 450;
                color: var(--mut);
              }
              .blovi-textarea, input.blovi-t {
                width: 100%;
                border: 1px solid var(--line);
                border-radius: 13px;
                background: var(--field);
                color: var(--ink);
                font: inherit;
                font-size: 13px;
                padding: 12px 13px;
                transition: border .2s, box-shadow .2s;
              }
              .blovi-textarea {
                min-height: 110px;
                resize: vertical;
                line-height: 1.6;
              }
              input.blovi-t {
                height: 43px;
                padding: 0 11px;
                font-size: 12px;
                border-radius: 11px;
              }
              .blovi-textarea:focus, input.blovi-t:focus {
                outline: 0;
                border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
                box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
              }
              .blovi-cnt {
                text-align: right;
                font-size: 10px;
                color: var(--mut);
                margin-top: 4px;
              }
              .blovi-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 7px;
                margin: 8px 0 15px;
              }
              .blovi-chip {
                border: 1px solid var(--line);
                border-radius: 99px;
                background: var(--field);
                color: var(--mut);
                padding: 7px 10px;
                font: inherit;
                font-size: 10px;
                cursor: pointer;
                transition: all .15s;
              }
              .blovi-chip:hover {
                border-color: var(--accent);
                color: var(--accent);
              }
              .blovi-ph {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 15px;
              }
              .blovi-up {
                position: relative;
                width: 60px; height: 60px;
                border: 1px dashed #d3cbc1;
                border-radius: 50%;
                display: grid;
                place-items: center;
                background: var(--soft);
                cursor: pointer;
                overflow: hidden;
                font-size: 20px;
                flex: none;
                transition: border-color .15s;
              }
              .blovi-up:hover { border-color: var(--accent); }
              .blovi-up img { width: 100%; height: 100%; object-fit: cover; }
              .blovi-ph strong { font-size: 12px; }
              .blovi-ph span {
                display: block;
                font-size: 10px;
                color: var(--mut);
                margin-top: 3px;
              }
              .blovi-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 14px;
              }
              .blovi-cons {
                display: flex;
                gap: 9px;
                align-items: flex-start;
                font-size: 11px;
                color: var(--mut);
                line-height: 1.5;
                cursor: pointer;
                margin-bottom: 6px;
                user-select: none;
              }
              .blovi-cons input {
                appearance: none;
                width: 17px; height: 17px;
                flex: none;
                border: 1px solid #cfc8bf;
                border-radius: 5px;
                margin: 0;
                background: var(--field);
                cursor: pointer;
                display: grid;
                place-items: center;
                transition: all .15s;
              }
              .blovi-cons input:checked {
                background: var(--accent);
                border-color: var(--accent);
              }
              .blovi-cons input::after {
                content: "";
                width: 8px; height: 4px;
                margin-top: -2px;
                border-left: 1.7px solid #fff;
                border-bottom: 1.7px solid #fff;
                transform: rotate(-45deg) scale(.3);
                opacity: 0;
                transition: .18s;
              }
              .blovi-cons input:checked::after {
                opacity: 1;
                transform: rotate(-45deg) scale(1);
              }
              .blovi-thx {
                align-items: center;
                justify-content: center;
                text-align: center;
              }
              .blovi-chk {
                width: 65px; height: 65px;
                border-radius: 50%;
                display: grid;
                place-items: center;
                margin-bottom: 20px;
                color: var(--accent);
                background: color-mix(in srgb, var(--accent) 9%, #fff);
                box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent);
              }
              .blovi-chk path {
                stroke-dasharray: 30;
                stroke-dashoffset: 30;
                animation: bloviDraw .5s .15s ease forwards;
              }
              @keyframes bloviDraw {
                to { stroke-dashoffset: 0; }
              }
              .blovi-sum {
                width: 100%;
                margin-top: 22px;
                padding: 14px 16px;
                border-radius: 15px;
                background: var(--soft);
                text-align: left;
              }
              .blovi-sum .blovi-s {
                color: #dfa943;
                letter-spacing: 2px;
                font-size: 15px;
              }
              .blovi-sum q {
                display: block;
                margin-top: 7px;
                font-size: 17px;
                line-height: 1.35;
                color: var(--ink);
                quotes: none;
                font-family: '${headingFont}', Georgia, serif;
              }
              .blovi-sum small {
                display: block;
                margin-top: 7px;
                font-size: 10px;
                color: var(--mut);
              }
              .blovi-lk {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin-top: 16px;
                font-size: 11px;
              }
              .blovi-lk a, .blovi-lk button {
                color: var(--mut);
                background: none;
                border: 0;
                font: inherit;
                cursor: pointer;
                text-decoration: none;
                transition: color .15s;
              }
              .blovi-lk a:hover, .blovi-lk button:hover {
                color: var(--accent);
              }
              .blovi-visit {
                margin-top: 14px;
                color: var(--accent);
                font-size: 11px;
                font-weight: 620;
                display: inline-block;
                cursor: pointer;
              }
              .blovi-brand {
                display: flex;
                justify-content: center;
                margin-top: 16px;
              }
              .blovi-brand span {
                display: inline-flex;
                gap: 6px;
                align-items: center;
                padding: 6px 10px;
                border: 1px solid rgba(88, 76, 64, .1);
                border-radius: 99px;
                font-size: 9px;
                color: var(--mut);
              }
              .blovi-brand em {
                font-style: normal;
                color: var(--accent);
                font-weight: 800;
              }
                            
              @media (max-width: 420px) {
                .blovi-inner { padding: 40px 22px 24px; }
                .blovi-grid { grid-template-columns: 1fr; }
                .blovi-h1 { font-size: 33px; }
                .blovi-star { width: 50px; }
                .blovi-stars { gap: 4px; }
              }
            `}</style>

            

            {/* 4 Pages Stacked Vertically Like Reels with Snap Scrolling */}
            <div className="mx-auto flex flex-col items-center gap-14 pb-44 w-full max-w-[480px]">
              {/* ======================================================== */}
              {/* REEL 1: WELCOME PAGE                                     */}
              {/* ======================================================== */}
              <div
                id="canvas-reel-welcome"
                ref={welcomeCardRef}
                onClick={() => setActivePage("welcome")}
                className="blovi-shell w-full snap-center scroll-mt-20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full px-1 mb-2.5 select-none text-left">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-200/80 text-gray-700">
                    1
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    Welcome Page
                  </span>
                </div>

                <section className="blovi-card" aria-label="Welcome page">
                  {/* Top Progress Line */}
                  <div className="blovi-bar">
                    <i style={{ width: "0%" }} />
                  </div>

                  <div className="blovi-inner">
                    <div className="blovi-step">
                      <div style={{ margin: "auto 0", textAlign: "center" }}>
                        {/* Custom Brand Logo - Medium size, positioned close to Our Team */}
                        <div className="blovi-brand-logo">
                          {logoUrl ? (
                            <div className="group relative inline-flex items-center justify-center">
                              <img
                                src={logoUrl}
                                alt={form.name || "Brand logo"}
                                className="cursor-pointer transition-transform group-hover:scale-105"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  logoInputRef.current?.click();
                                }}
                                title="Click to change logo"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  logoInputRef.current?.click();
                                }}
                                className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-white text-gray-700 hover:text-brand-600 border border-gray-200 rounded-full p-1 shadow-xs transition-opacity cursor-pointer"
                                title="Change logo"
                              >
                                <Pencil size={11} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                logoInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-gray-300 hover:border-brand-500 bg-white/90 hover:bg-white text-xs font-medium text-gray-500 hover:text-brand-600 transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
                              title="Upload brand logo"
                            >
                              <Upload size={12} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
                              <span>Upload logo</span>
                            </button>
                          )}
                        </div>

                        <div className="blovi-owner">
                          <span className="blovi-av">
                            {(welcomeSenderName || form.name || "B").slice(0, 2).toUpperCase()}
                          </span>
                          <span style={{ textAlign: "left", maxWidth: 235 }}>
                            <strong>{welcomeSenderName || form.name || "Our Team"}</strong>
                            <br />
                            {welcomeSenderNote || "Hey, we'd love to hear how it went."}
                          </span>
                        </div>

                        <h1 className="blovi-h1">
                          {welcomeTitle || "A little note from you means a lot to us."}
                        </h1>
                        <p className="blovi-sub">
                          {welcomeSubtitle || "Your experience can help someone else find the right fit."}
                        </p>
                      </div>

                      <div className="blovi-push">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToPage("rating");
                          }}
                          className="blovi-btn"
                        >
                          {welcomeCta || "Share feedback →"}
                        </button>
                        <div className="blovi-hint">
                          <i /> Takes about 30 seconds
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* ======================================================== */}
              {/* REEL 2: RATING PAGE                                      */}
              {/* ======================================================== */}
              <div
                id="canvas-reel-rating"
                ref={ratingCardRef}
                onClick={() => setActivePage("rating")}
                className="blovi-shell w-full snap-center scroll-mt-20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full px-1 mb-2.5 select-none text-left">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-200/80 text-gray-700">
                    2
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    Rating Page
                  </span>
                </div>

                <section className="blovi-card" aria-label="Rating page">
                  {/* Top Progress Line */}
                  <div className="blovi-bar">
                    <i style={{ width: "33.3%" }} />
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToPage("welcome");
                    }}
                    className="blovi-back"
                  >
                    ← Back
                  </button>

                  <div className="blovi-inner">
                    <div className="blovi-step" style={{ paddingTop: 30, position: "relative" }}>
                      {sparkles.map((sp) => (
                        <span
                          key={sp.id}
                          className="blovi-spark"
                          style={{
                            left: sp.left,
                            top: sp.top,
                            fontSize: `${sp.size}px`,
                            animationDelay: `${sp.delay}s`,
                          }}
                        >
                          ✦
                        </span>
                      ))}

                      <h1 className="blovi-h1">
                        {ratingTitle || `How was your experience with ${form.name || "Blovi"}?`}
                      </h1>
                      <p className="blovi-sub">
                        {ratingSubtitle || "Your honest rating means a lot to us."}
                      </p>

                      <div className="blovi-stars" role="radiogroup" aria-label="Rate your experience from 1 to 5 stars">
                        {[1, 2, 3, 4, 5].map((i) => {
                          const activeVal = hoveredRating || testRating;
                          const isOn = i <= activeVal;
                          const isHoverOnly = Boolean(hoveredRating && i <= hoveredRating && i > testRating);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTestRating(i);
                                if (i === 5) triggerSparkle();
                              }}
                              onMouseEnter={() => setHoveredRating(i)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className={`blovi-star ${isOn ? "on" : ""} ${isHoverOnly ? "hv" : ""}`}
                              role="radio"
                              aria-checked={testRating === i}
                              aria-label={`${i} stars`}
                            >
                              <svg viewBox="0 0 24 24">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>

                      <div className="blovi-lbl" aria-live="polite">
                        {(hoveredRating || testRating) ? ["Poor", "Fair", "Good", "Great", "Loved it"][(hoveredRating || testRating) - 1] : ""}
                      </div>

                      <p className="blovi-note">
                        {testRating ? "Thank you for being honest with us." : "Tap a star to get started"}
                      </p>

                      <div className="blovi-push">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToPage("review");
                          }}
                          className="blovi-btn"
                        >
                          {ratingCta || "Continue →"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* ======================================================== */}
              {/* REEL 3: REVIEW PAGE                                      */}
              {/* ======================================================== */}
              <div
                id="canvas-reel-review"
                ref={reviewCardRef}
                onClick={() => setActivePage("review")}
                className="blovi-shell w-full snap-center scroll-mt-20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full px-1 mb-2.5 select-none text-left">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-200/80 text-gray-700">
                    3
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    Review Page
                  </span>
                </div>

                <section className="blovi-card" aria-label="Review page">
                  {/* Top Progress Line */}
                  <div className="blovi-bar">
                    <i style={{ width: "66.6%" }} />
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToPage(collectRating ? "rating" : "welcome");
                    }}
                    className="blovi-back"
                  >
                    ← Back
                  </button>

                  <div className="blovi-inner">
                    <div className="blovi-step blovi-rev" style={{ paddingTop: 26 }}>
                      <h1 className="blovi-h1">
                        {headline || "Tell us what stood out."}
                      </h1>
                      <p className="blovi-sub">
                        {prompt || "A sentence or two is plenty. Your words help others decide, and they genuinely make our day."}
                      </p>

                      <label className="blovi-l">
                        Your review
                      </label>
                      <textarea
                        maxLength={1000}
                        value={testContent}
                        onChange={(e) => setTestContent(e.target.value)}
                        placeholder={reviewPlaceholder || "What did you love? What changed for you?"}
                        className="blovi-textarea"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="blovi-cnt">{testContent.length} / 1000</div>

                      <div className="blovi-chips">
                        {[
                          ["What did you love?", "What I loved most was "],
                          ["What problem did we solve?", "Before working together, I was struggling with "],
                          ["What would you tell a friend?", "I would recommend them to a friend because "],
                        ].map(([chipLabel, starter], idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const trimmed = testContent.trim();
                              const next = trimmed ? (trimmed + (/[.!?]$/.test(trimmed) ? " " : ". ") + starter) : starter;
                              setTestContent(next);
                            }}
                            className="blovi-chip"
                          >
                            {chipLabel}
                          </button>
                        ))}
                      </div>

                      {/* Photo Upload */}
                      {collectPhoto && (
                        <div className="blovi-ph">
                          <label className="blovi-up" title="Add a photo">
                            <span>📷</span>
                          </label>
                          <div>
                            <strong>
                              Add a photo <span style={{ display: "inline", color: "var(--mut)", fontWeight: 450 }}>(optional)</span>
                            </strong>
                            <span>Drop an image here or tap to browse</span>
                          </div>
                        </div>
                      )}

                      {/* Author Name and Role Grid */}
                      <div className="blovi-grid">
                        <div>
                          <label className="blovi-l">
                            Your name
                          </label>
                          <input
                            className="blovi-t"
                            placeholder="e.g. Jane Doe"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div>
                          <label className="blovi-l">
                            Role / company <small>optional</small>
                          </label>
                          <input
                            className="blovi-t"
                            placeholder="e.g. Founder at Acme"
                            value={testRole}
                            onChange={(e) => setTestRole(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* Consent Checkbox */}
                      {requireConsent && (
                        <label className="blovi-cons" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={testConsent}
                            onChange={(e) => setTestConsent(e.target.checked)}
                          />
                          <span>I’m happy for {form.name || "Blovi"} to share my review publicly.</span>
                        </label>
                      )}

                      <div className="blovi-push" style={{ paddingTop: 12 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToPage("thankyou");
                          }}
                          className="blovi-btn"
                        >
                          {reviewCta || "Share my review →"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* ======================================================== */}
              {/* REEL 4: THANK YOU PAGE                                   */}
              {/* ======================================================== */}
              <div
                id="canvas-reel-thankyou"
                ref={thankYouCardRef}
                onClick={() => scrollToPage("thankyou")}
                className="blovi-shell w-full snap-center scroll-mt-20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full px-1 mb-2.5 select-none text-left">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-200/80 text-gray-700">
                    4
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    Thank You Page
                  </span>
                </div>

                <section className="blovi-card" aria-label="Thank you page">
                  {/* Top Progress Line */}
                  <div className="blovi-bar">
                    <i style={{ width: "100%" }} />
                  </div>

                  <div className="blovi-inner">
                    <div className="blovi-step blovi-thx">
                      <div className="blovi-chk">
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                          <path
                            d="M8.5 17.5l5.5 5.5 11.5-12"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <h1 className="blovi-h1">
                        {thankYouTitle || "You just made our day."}
                      </h1>
                      <p className="blovi-sub">
                        {thankYouMessage || "Thank you for sharing a little of your experience. Your words help others find the right fit."}
                      </p>

                      <div className="blovi-sum">
                        <div className="blovi-s">
                          {"★".repeat(testRating || 5)}{"☆".repeat(5 - (testRating || 5))}
                        </div>
                        <q>“{testContent.trim() || "Blovi completely changed how we ship. The team was fast, thoughtful and easy to work with."}”</q>
                        <small>
                          — {testName || "Jane Doe"}{testRole ? `, ${testRole}` : ", Founder at Acme"} · {testRating || 5} out of 5 stars
                        </small>
                      </div>

                      <div className="blovi-lk">
                        <button type="button" onClick={(e) => e.stopPropagation()}>Share on X</button>
                        <button type="button" onClick={(e) => e.stopPropagation()}>LinkedIn</button>
                      </div>

                      <div className="blovi-visit">Visit {form.name || "Blovi"} ↗</div>
                      <div className="blovi-lk" style={{ marginTop: 8 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToPage("welcome");
                          }}
                        >
                          Start again
                        </button>
                      </div>

                      {showBranding && (
                        <div className="blovi-brand">
                          <span>
                            <em>///</em> Powered by Blovi
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>

          {/* ========================================================== */}
          {/* RIGHT: INSPECTOR PANEL (PAGES & DESIGN)                    */}
          {/* ========================================================== */}
          <aside className="w-full lg:w-[340px] xl:w-[360px] bg-white border-t lg:border-t-0 lg:border-l border-gray-200/90 flex flex-col h-auto lg:h-full shrink-0 z-20 shadow-xs overflow-hidden">
            {/* Inspector Top Tabs: Pages | Design (Edge-to-edge tabs matching Senja) */}
            <div className="grid grid-cols-2 border-b border-gray-200 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setTab("pages")}
                className={`flex items-center justify-center gap-2 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer border-r border-gray-100 ${
                  tab === "pages"
                    ? "border-b-brand-600 text-brand-600"
                    : "border-b-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Layers size={15} />
                <span>Pages</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("design")}
                className={`flex items-center justify-center gap-2 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  tab === "design"
                    ? "border-b-brand-600 text-brand-600"
                    : "border-b-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Paintbrush size={15} />
                <span>Design</span>
              </button>
            </div>

            {/* Sub-header title: Rating page / Review page / Thank you page / Branding */}
            <div className="px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
              <h2 className="text-xs font-bold text-gray-700 tracking-tight">
                {tab === "pages" ? (
                  activePage === "welcome"
                    ? "Welcome page"
                    : activePage === "rating"
                    ? "Rating page"
                    : activePage === "review"
                    ? "Review page"
                    : "Thank you page"
                ) : (
                  "Branding"
                )}
              </h2>
            </div>

            {/* Inspector Tab Content: Clean, sharp, card-less layout matching Senja */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* ---------------------------------------------------- */}
              {/* TAB 1: PAGES CONFIGURATION                            */}
              {/* ---------------------------------------------------- */}
              {tab === "pages" && (
                <div className="space-y-4">
                  {/* WHAT'S THIS? Box */}
                  <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-brand-600 rounded-xs" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        What's this?
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {activePage === "welcome" &&
                        "The welcome screen greets your customer with your brand, avatar, and personal message to encourage feedback."}
                      {activePage === "rating" &&
                        "Use this page to collect ratings from your customers. Ratings can be displayed in widgets, images, Walls of Love, and more!"}
                      {activePage === "review" &&
                        "Capture customer testimonials, reviews, full name, role, and public permission."}
                      {activePage === "thankyou" &&
                        "Appreciation message shown immediately to your customers after they submit."}
                    </p>
                  </div>

                  {/* Page 0: Welcome Copy Fields */}
                  {activePage === "welcome" && (
                    <div className="space-y-4">
                      {/* Brand Logo Upload */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-2">
                          Brand logo
                        </label>

                        {logoUrl ? (
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-28 rounded-xl border border-gray-200 p-1.5 flex items-center justify-center bg-white shadow-2xs">
                              <img
                                src={logoUrl}
                                alt="Brand logo"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="text-xs font-medium text-gray-700 hover:text-brand-600 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 hover:border-brand-500 text-gray-500 hover:text-brand-600 transition-colors cursor-pointer bg-white"
                          >
                            <Upload size={14} />
                            <span className="text-xs font-medium">Upload brand logo</span>
                          </button>
                        )}

                        {uploadingLogo && (
                          <div className="text-[11px] text-brand-600 flex items-center gap-1.5 mt-1.5">
                            <Loader2 size={12} className="animate-spin text-brand-600" />
                            <span>Uploading logo...</span>
                          </div>
                        )}
                        {logoError && (
                          <div className="text-[11px] text-red-600 flex items-center gap-1 mt-1.5">
                            <AlertCircle size={11} />
                            <span>{logoError}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Page title
                        </label>
                        <input
                          type="text"
                          value={welcomeTitle}
                          onChange={(e) => setWelcomeTitle(e.target.value)}
                          className={inputClass}
                          placeholder="A little note from you means a lot to us."
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Subtitle
                        </label>
                        <textarea
                          rows={3}
                          value={welcomeSubtitle}
                          onChange={(e) => setWelcomeSubtitle(e.target.value)}
                          placeholder="Your experience can help someone else find the right fit."
                          className={`${inputClass} resize-none leading-relaxed`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Sender name
                        </label>
                        <input
                          type="text"
                          value={welcomeSenderName}
                          onChange={(e) => setWelcomeSenderName(e.target.value)}
                          className={inputClass}
                          placeholder="e.g. Mara Ellis or Team"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Personal greeting note
                        </label>
                        <input
                          type="text"
                          value={welcomeSenderNote}
                          onChange={(e) => setWelcomeSenderNote(e.target.value)}
                          className={inputClass}
                          placeholder="Hey, we'd love to hear how it went."
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Call to action
                        </label>
                        <input
                          type="text"
                          value={welcomeCta}
                          onChange={(e) => setWelcomeCta(e.target.value)}
                          className={inputClass}
                          placeholder="Share feedback →"
                        />
                      </div>
                    </div>
                  )}

                  {/* Page 1: Rating Copy Fields */}
                  {activePage === "rating" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Page title
                        </label>
                        <input
                          type="text"
                          value={ratingTitle}
                          onChange={(e) => setRatingTitle(e.target.value)}
                          className={inputClass}
                          placeholder="How was your experience?"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Subtitle
                        </label>
                        <textarea
                          rows={3}
                          value={ratingSubtitle}
                          onChange={(e) => setRatingSubtitle(e.target.value)}
                          placeholder="Your honest rating means a lot to us."
                          className={`${inputClass} resize-none leading-relaxed`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Call to action
                        </label>
                        <input
                          type="text"
                          value={ratingCta}
                          onChange={(e) => setRatingCta(e.target.value)}
                          className={inputClass}
                          placeholder="Continue →"
                        />
                      </div>
                    </div>
                  )}

                  {/* Page 2: Review Copy Fields */}
                  {activePage === "review" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Page title
                        </label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          className={inputClass}
                          placeholder="Tell us what stood out"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Subtitle
                        </label>
                        <textarea
                          rows={3}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="A sentence or two is plenty. Your words help others decide, and they genuinely make our day."
                          className={`${inputClass} resize-none leading-relaxed`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Review placeholder
                        </label>
                        <input
                          type="text"
                          value={reviewPlaceholder}
                          onChange={(e) => setReviewPlaceholder(e.target.value)}
                          className={inputClass}
                          placeholder="What did you love? What problem did we help you solve?"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Call to action
                        </label>
                        <input
                          type="text"
                          value={reviewCta}
                          onChange={(e) => setReviewCta(e.target.value)}
                          className={inputClass}
                          placeholder="Share my review"
                        />
                      </div>

                      <div className="pt-3 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">
                            Allow customer photo upload
                          </span>
                          <Switch
                            checked={collectPhoto}
                            onChange={setCollectPhoto}
                            aria-label="Toggle photo upload"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">
                            Require public consent checkbox
                          </span>
                          <Switch
                            checked={requireConsent}
                            onChange={setRequireConsent}
                            aria-label="Toggle consent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page 3: Thank You Copy Fields */}
                  {activePage === "thankyou" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={thankYouTitle}
                          onChange={(e) => setThankYouTitle(e.target.value)}
                          className={inputClass}
                          placeholder="You just made our day! 🎉"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1.5">
                          Thank you message
                        </label>
                        <textarea
                          rows={3}
                          value={thankYouMessage}
                          onChange={(e) => setThankYouMessage(e.target.value)}
                          placeholder="Thank you for taking the time to share this..."
                          className={`${inputClass} resize-none leading-relaxed`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 2: DESIGN & BRANDING (Matches Image 2)           */}
              {/* ---------------------------------------------------- */}
              {tab === "design" && (
                <div className="space-y-5">
                  {/* 1. Logo Upload Trigger */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-2">
                      Logo
                    </label>

                    {logoUrl ? (
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-28 rounded-xl border border-gray-200 p-1.5 flex items-center justify-center bg-white shadow-2xs">
                          <img
                            src={logoUrl}
                            alt="Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="text-xs font-medium text-gray-700 hover:text-brand-600 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 hover:border-brand-500 text-gray-500 hover:text-brand-600 transition-colors cursor-pointer bg-white"
                      >
                        <Upload size={14} />
                        <span className="text-xs font-medium">Upload brand logo</span>
                      </button>
                    )}

                    {uploadingLogo && (
                      <div className="text-[11px] text-brand-600 flex items-center gap-1.5 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                        Uploading logo...
                      </div>
                    )}
                    {logoError && (
                      <div className="text-[11px] text-red-600 flex items-center gap-1 mt-1.5">
                        <AlertCircle size={11} />
                        {logoError}
                      </div>
                    )}
                  </div>

                  {/* 2. Primary Color Input Box */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-lg bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-colors">
                      <label className="relative w-5 h-5 rounded-full shrink-0 cursor-pointer overflow-hidden block">
                        <span
                          className="absolute inset-0 rounded-full ring-1 ring-black/10"
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
                        className="w-full text-xs font-mono font-medium text-gray-800 bg-transparent focus:outline-none uppercase"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  {/* 3. Heading Font Dropdown */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      Heading Font
                    </label>
                    <div className="relative">
                      <select
                        value={headingFont}
                        onChange={(e) => setHeadingFont(e.target.value)}
                        className="w-full text-xs rounded-lg px-3.5 py-2.5 text-gray-900 border border-gray-200 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none pr-8 cursor-pointer transition-colors"
                      >
                        {CURATED_FONTS.map((font) => (
                          <option key={font.name} value={font.name}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  {/* 4. Body Font Dropdown */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1.5">
                      Body Font
                    </label>
                    <div className="relative">
                      <select
                        value={bodyFont}
                        onChange={(e) => setBodyFont(e.target.value)}
                        className="w-full text-xs rounded-lg px-3.5 py-2.5 text-gray-900 border border-gray-200 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 appearance-none pr-8 cursor-pointer transition-colors"
                      >
                        {CURATED_FONTS.map((font) => (
                          <option key={font.name} value={font.name}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Show Blovi Powered By Toggle */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Switch
                      checked={showBranding}
                      onChange={setShowBranding}
                      aria-label="Toggle Blovi Powered By badge"
                    />
                    <span className="text-xs text-gray-700 font-medium select-none">
                      Show Blovi Powered By
                    </span>
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
                Configure your public link and custom domain.
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
          </div>
        </div>
      )}
    </div>
  );
}
