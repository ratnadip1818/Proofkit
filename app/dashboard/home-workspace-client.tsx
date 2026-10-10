"use client";

import { useState, useEffect, useMemo, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  Star,
  ExternalLink,
  ArrowRight,
  Mail,
  QrCode,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  Share2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import QrModal from "./qr-modal";
import {
  approveTestimonial,
  updateTestimonialTags,
  deleteTestimonial,
} from "./actions";
import type { WorkspaceTrackingStats } from "@/lib/tracking";

export interface TestimonialItem {
  id: string;
  status: string;
  rating?: number | null;
  display_body?: string | null;
  body_original?: string | null;
  author_name: string;
  author_role?: string | null;
  author_company?: string | null;
  avatar_url?: string | null;
  created_at: string;
  tags?: string[] | null;
  source?: string | null;
}

export interface FormItem {
  id: string;
  slug: string;
  custom_domain?: string | null;
  headline?: string | null;
}

export interface ProfileItem {
  full_name?: string | null;
  plan_tier?: string | null;
  is_lifetime?: boolean | null;
}

export interface LimitsItem {
  planTier: "free" | "pro" | "business";
  approvedCount: number;
  widgetLimit: number | null;
}

interface HomeWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: FormItem | null;
  testimonials: TestimonialItem[];
  profile: ProfileItem | null;
  limits: LimitsItem;
  trackingStats: WorkspaceTrackingStats;
  appUrl: string;
}

export default function HomeWorkspaceClient({
  user,
  form,
  testimonials: initialTestimonials,
  profile,
  limits,
  trackingStats,
  appUrl,
}: HomeWorkspaceClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Local state for testimonials to support optimistic updates
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStepLink, setCopiedStepLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // Active dropdown states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileShareOpen, setMobileShareOpen] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (activeMenuId && !(e.target as HTMLElement).closest("[data-row-menu]")) {
        setActiveMenuId(null);
      }
      if (mobileShareOpen && !(e.target as HTMLElement).closest("[data-mobile-share]")) {
        setMobileShareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenuId, mobileShareOpen]);

  // Local time greeting
  const [timeGreeting, setTimeGreeting] = useState("Good morning");
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setTimeGreeting("Good morning");
    else if (hr < 18) setTimeGreeting("Good afternoon");
    else setTimeGreeting("Good evening");
  }, []);

  // Form URL
  const formUrl = useMemo(() => {
    if (!form) return `${appUrl}/c/demo`;
    if (form.custom_domain) return `https://${form.custom_domain}`;
    return `${appUrl}/c/${form.slug}`;
  }, [form, appUrl]);

  // Name extraction
  const firstName = useMemo(() => {
    if (profile?.full_name?.trim()) {
      return profile.full_name.trim().split(" ")[0];
    }
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "there";
  }, [profile, user]);

  // Date math: "this week" (past 7 days) and "vs last week" (8 to 14 days ago)
  const { thisWeekCount, lastWeekCount, vsLastWeekDiff } = useMemo(() => {
    const now = new Date();
    const msInDay = 86400000;
    const sevenDaysAgo = new Date(now.getTime() - 7 * msInDay);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * msInDay);

    let thisW = 0;
    let lastW = 0;

    for (const t of testimonials) {
      const d = new Date(t.created_at);
      if (isNaN(d.getTime())) continue;
      if (d >= sevenDaysAgo) {
        thisW++;
      } else if (d >= fourteenDaysAgo && d < sevenDaysAgo) {
        lastW++;
      }
    }

    return {
      thisWeekCount: thisW,
      lastWeekCount: lastW,
      vsLastWeekDiff: thisW - lastW,
    };
  }, [testimonials]);

  // Testimonial metrics
  const totalCount = testimonials.length;
  const pendingCount = testimonials.filter((t) => t.status === "pending").length;

  // Average rating
  const { avgRating, ratedCount } = useMemo(() => {
    let sum = 0;
    let count = 0;
    for (const t of testimonials) {
      if (typeof t.rating === "number" && t.rating > 0) {
        sum += t.rating;
        count++;
      }
    }
    return {
      avgRating: count > 0 ? (sum / count).toFixed(1) : null,
      ratedCount: count,
    };
  }, [testimonials]);

  // Form conversion calculation
  const formViews = trackingStats?.formViews ?? null;
  const conversionRate = useMemo(() => {
    if (formViews && formViews > 0) {
      return Math.min(100, Math.round((totalCount / formViews) * 100));
    }
    return null;
  }, [formViews, totalCount]);

  // Widget views
  const widgetViewsMonth = trackingStats?.widgetViewsThisMonth ?? null;
  const totalWidgetViews = trackingStats?.totalWidgetViews ?? null;
  const detectedDomains = trackingStats?.detectedDomains ?? [];
  const hasDetectedWidget = detectedDomains.length > 0 || (totalWidgetViews !== null && totalWidgetViews > 0);

  // Copy collection link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleCopyStepLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedStepLink(true);
      setTimeout(() => setCopiedStepLink(false), 2000);
    } catch {}
  };

  // Mailto link for "Send by email"
  const mailtoLink = useMemo(() => {
    const subject = encodeURIComponent("Could you share a quick review?");
    const body = encodeURIComponent(
      `Hi,\n\nWe would really appreciate your feedback on your experience. Could you take a moment to share a quick review?\n\n${formUrl}\n\nThank you!`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  }, [formUrl]);

  // Quick Action: Approve
  const handleApprove = async (id: string) => {
    setActiveMenuId(null);
    setActionInProgressId(id);
    try {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t))
      );
      await approveTestimonial(id);
      setActionNotice("Testimonial approved ✓");
      setTimeout(() => setActionNotice(null), 2500);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("Approve failed:", err);
      setTestimonials(initialTestimonials);
    } finally {
      setActionInProgressId(null);
    }
  };

  // Quick Action: Feature
  const handleToggleFeature = async (t: TestimonialItem) => {
    setActiveMenuId(null);
    setActionInProgressId(t.id);
    const existingTags = t.tags || [];
    const isCurrentlyFeatured = existingTags.includes("featured");
    const newTags = isCurrentlyFeatured
      ? existingTags.filter((tag) => tag !== "featured")
      : [...existingTags, "featured"];

    try {
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, tags: newTags } : item))
      );
      await updateTestimonialTags(t.id, newTags);
      setActionNotice(isCurrentlyFeatured ? "Removed from featured" : "Marked as featured ✓");
      setTimeout(() => setActionNotice(null), 2500);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("Toggle feature failed:", err);
      setTestimonials(initialTestimonials);
    } finally {
      setActionInProgressId(null);
    }
  };

  // Quick Action: Add to widget (copies single quote embed snippet)
  const handleAddToWidget = async () => {
    setActiveMenuId(null);
    const snippet = `<script src="${appUrl}/widget.js" data-user="${user.id}" data-type="single"></script>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setActionNotice(`Copied single quote widget code ✓`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch {}
  };

  // Quick Action: Delete
  const handleDelete = async (id: string) => {
    setActiveMenuId(null);
    setActionInProgressId(id);
    try {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      await deleteTestimonial(id);
      setActionNotice("Testimonial deleted ✓");
      setTimeout(() => setActionNotice(null), 2500);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("Delete failed:", err);
      setTestimonials(initialTestimonials);
    } finally {
      setActionInProgressId(null);
    }
  };

  // Determine if a testimonial is a sample/seed
  const isSampleTestimonial = (t: TestimonialItem) => {
    return (
      t.source === "csv" ||
      t.source === "sample" ||
      (t.tags && (t.tags.includes("sample") || t.tags.includes("demo") || t.tags.includes("csv"))) ||
      t.author_name.toLowerCase().includes("sample")
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-7 font-sans text-[#1A1A1A]">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in border border-gray-700">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 1. GREETING + STATUS LINE + HEADER ACTIONS */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1A1A] leading-tight">
            {timeGreeting}, {firstName}
          </h1>
          <p className="text-sm text-[#787774] font-normal leading-relaxed mt-1">
            {totalCount === 0
              ? "Let's collect your first testimonial."
              : pendingCount > 0
              ? `You collected ${thisWeekCount} new ${thisWeekCount === 1 ? "testimonial" : "testimonials"} this week. ${pendingCount} waiting for your approval.`
              : `You collected ${thisWeekCount} new ${thisWeekCount === 1 ? "testimonial" : "testimonials"} this week. You're all caught up.`}
          </p>
        </div>

        {/* Desktop Header Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3E0DB] bg-white text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors shadow-2xs cursor-pointer"
            title="Copy collection link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#787774]" />
                <span>Copy collection link</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="p-2 rounded-xl border border-[#E3E0DB] bg-white text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors shadow-2xs cursor-pointer"
            title="Show QR code"
            aria-label="Show QR code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          <a
            href={mailtoLink}
            className="p-2 rounded-xl border border-[#E3E0DB] bg-white text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors shadow-2xs cursor-pointer"
            title="Send by email"
            aria-label="Send by email"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Header Action Dropdown */}
        <div className="sm:hidden relative" data-mobile-share>
          <button
            onClick={() => setMobileShareOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3E0DB] bg-white text-xs font-medium text-[#1A1A1A] shadow-2xs cursor-pointer w-fit"
          >
            <Share2 className="w-3.5 h-3.5 text-[#787774]" />
            <span>Share</span>
            <ChevronDown className="w-3 h-3 text-[#787774]" />
          </button>

          {mobileShareOpen && (
            <div className="absolute left-0 mt-1.5 w-52 bg-white border border-[#E3E0DB] rounded-xl shadow-lg p-1.5 z-40 space-y-1">
              <button
                onClick={() => {
                  handleCopyLink();
                  setMobileShareOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#787774]" />
                <span>{copiedLink ? "Copied ✓" : "Copy collection link"}</span>
              </button>
              <button
                onClick={() => {
                  setIsQrModalOpen(true);
                  setMobileShareOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#787774]" />
                <span>Show QR code</span>
              </button>
              <a
                href={mailtoLink}
                onClick={() => setMobileShareOpen(false)}
                className="w-full text-left px-2.5 py-1.5 text-xs text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg flex items-center gap-2 block cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#787774]" />
                <span>Send by email</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 2. STAT CARDS (COMPACT ROW OF 4) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Testimonials */}
        <div className="bg-white border border-[#E3E0DB] rounded-xl p-4 shadow-2xs flex flex-col justify-between min-h-[96px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
            Testimonials
          </span>
          <div className="my-1">
            <span className="font-display text-2xl sm:text-[26px] font-bold text-[#1A1A1A] tracking-tight">
              {totalCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#787774]">
            <span>{thisWeekCount} new this week</span>
            {lastWeekCount > 0 && (
              <span
                className={`font-medium ${
                  vsLastWeekDiff > 0
                    ? "text-[#2563EB]"
                    : "text-[#787774]"
                }`}
              >
                {vsLastWeekDiff > 0
                  ? `+${vsLastWeekDiff} vs last week`
                  : `${vsLastWeekDiff} vs last week`}
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Average rating */}
        <div className="bg-white border border-[#E3E0DB] rounded-xl p-4 shadow-2xs flex flex-col justify-between min-h-[96px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
            Average rating
          </span>
          <div className="my-1 flex items-center gap-1.5">
            <span className="font-display text-2xl sm:text-[26px] font-bold text-[#1A1A1A] tracking-tight">
              {avgRating ? avgRating : "—"}
            </span>
            <span className="text-[#F59E0B] text-lg font-bold">★</span>
          </div>
          <div className="text-xs text-[#787774]">
            {ratedCount > 0 ? `across ${ratedCount} reviews` : "No rated reviews yet"}
          </div>
        </div>

        {/* Card 3: Form conversion */}
        <div className="bg-white border border-[#E3E0DB] rounded-xl p-4 shadow-2xs flex flex-col justify-between min-h-[96px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
            Form conversion
          </span>
          <div className="my-1">
            <span className="font-display text-2xl sm:text-[26px] font-bold text-[#1A1A1A] tracking-tight">
              {conversionRate !== null ? `${conversionRate}%` : "—"}
            </span>
          </div>
          <div className="text-xs text-[#787774] truncate">
            {conversionRate !== null
              ? "of visitors submitted"
              : "Starts counting once your widget is live"}
          </div>
        </div>

        {/* Card 4: Widget views */}
        <div className="bg-white border border-[#E3E0DB] rounded-xl p-4 shadow-2xs flex flex-col justify-between min-h-[96px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
            Widget views
          </span>
          <div className="my-1">
            <span className="font-display text-2xl sm:text-[26px] font-bold text-[#1A1A1A] tracking-tight">
              {widgetViewsMonth !== null ? widgetViewsMonth : "—"}
            </span>
          </div>
          <div className="text-xs text-[#787774] truncate">
            {widgetViewsMonth !== null
              ? "this month"
              : "Starts counting once your widget is live"}
          </div>
        </div>
      </section>

      {/* 3. YOUR NEXT STEP (FULL-WIDTH CARD, UNDER 120px ON DESKTOP) */}
      <section className="bg-white border border-[#E3E0DB] border-l-[3.5px] border-l-[#2563EB] rounded-xl p-4 sm:p-5 shadow-2xs">
        {pendingCount > 0 ? (
          /* STATE A: PENDING APPROVALS */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A] tracking-tight leading-snug">
                Approve {pendingCount} new {pendingCount === 1 ? "testimonial" : "testimonials"}
              </h2>
              <p className="text-xs text-[#787774] mt-0.5 leading-relaxed">
                They won&apos;t appear in your widgets until you approve them.
              </p>
            </div>
            <Link
              href="/dashboard/manage?status=pending"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 text-center shadow-xs self-start sm:self-auto"
            >
              Review now
            </Link>
          </div>
        ) : !hasDetectedWidget ? (
          /* STATE B: NO WIDGET INSTALLED/DETECTED (NEUTRAL/SOFT ACCENT, NOT A WARNING) */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A] tracking-tight leading-snug">
                Show your testimonials on your website
              </h2>
              <p className="text-xs text-[#787774] mt-0.5">
                It takes about 2 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[11px] text-[#787774]">
                <span>1. Pick a widget</span>
                <span className="text-[#AFAFAC]">·</span>
                <span>2. Copy one line of code</span>
                <span className="text-[#AFAFAC]">·</span>
                <span>3. Paste it into your site</span>
              </div>
            </div>
            <Link
              href="/dashboard/publish"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 text-center shadow-xs self-start sm:self-auto"
            >
              Get embed code
            </Link>
          </div>
        ) : (
          /* STATE C: ALL CAUGHT UP, COLLECT MORE */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A] tracking-tight leading-snug">
                Collect more testimonials
              </h2>
              <p className="text-xs text-[#787774] mt-0.5 leading-relaxed">
                Send your link to a customer who&apos;s happy with your product.
              </p>
            </div>
            <button
              onClick={handleCopyStepLink}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs self-start sm:self-auto flex items-center gap-1.5"
            >
              {copiedStepLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy collection link</span>
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* 4. LATEST TESTIMONIALS (COMPACT, 3 MAX, 56px ROWS) */}
      <section className="bg-white border border-[#E3E0DB] rounded-xl shadow-2xs overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#F0ECE6] flex items-center justify-between">
          <h2 className="font-serif text-base sm:text-lg font-normal text-[#1A1A1A] tracking-tight">
            Latest testimonials
          </h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <p className="text-xs sm:text-sm text-[#787774] max-w-sm mx-auto leading-relaxed">
              No testimonials yet. Share your link with your first customer.
            </p>
            <button
              onClick={handleCopyLink}
              className="mt-3.5 inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Copied ✓" : "Copy link"}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#F0ECE6]">
            {testimonials.slice(0, 3).map((t) => {
              const isFeatured = t.tags?.includes("featured");
              const quoteRaw = t.display_body || t.body_original || "No text provided.";
              const isMenuOpen = activeMenuId === t.id;

              return (
                <div
                  key={t.id}
                  className="px-4 py-2.5 sm:min-h-[56px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF9F6]/60 transition-colors text-xs"
                >
                  {/* Left Side: Avatar, Author, Quote */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Avatar initial */}
                    {t.avatar_url ? (
                      <img
                        src={t.avatar_url}
                        alt={t.author_name}
                        className="w-7 h-7 rounded-full object-cover border border-[#E3E0DB] shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center font-bold text-[11px] shrink-0">
                        {t.author_name ? t.author_name[0].toUpperCase() : "?"}
                      </div>
                    )}

                    {/* Desktop Content Row: Name + role + quote on one line */}
                    <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-medium text-[#1A1A1A] truncate max-w-[120px]">
                          {t.author_name || "Anonymous"}
                        </span>
                        {isSampleTestimonial(t) && (
                          <span className="text-[10px] font-medium bg-[#F0ECE6] text-[#787774] px-1.5 py-0.2 rounded">
                            Sample
                          </span>
                        )}
                        <span className="text-[11px] text-[#787774] truncate max-w-[130px] hidden md:inline">
                          · {t.author_role || t.author_company || "Customer"}
                        </span>
                      </div>

                      {/* Truncated one-line quote with ellipsis */}
                      <p className="text-[11px] text-[#4A4946] truncate italic flex-1 max-w-full sm:max-w-md lg:max-w-lg">
                        &ldquo;{quoteRaw}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Rating + Status Badge + ⋯ Menu */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pl-9 sm:pl-0">
                    {t.rating && (
                      <div className="flex items-center gap-0.5 text-[#F59E0B]">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                    )}

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                        t.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : isFeatured
                          ? "bg-blue-50 text-[#2563EB] border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {t.status === "pending" ? "Pending" : isFeatured ? "Featured" : "Approved"}
                    </span>

                    {/* ⋯ Dropdown Menu per row */}
                    <div className="relative" data-row-menu>
                      <button
                        onClick={() => setActiveMenuId((prev) => (prev === t.id ? null : t.id))}
                        className="p-1 rounded-md text-[#787774] hover:text-[#1A1A1A] hover:bg-[#F0ECE6] transition-colors cursor-pointer"
                        title="More actions"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#E3E0DB] rounded-xl shadow-lg p-1 z-30 space-y-0.5 animate-fade-in text-xs">
                          {t.status === "pending" && (
                            <button
                              onClick={() => handleApprove(t.id)}
                              className="w-full text-left px-2.5 py-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleFeature(t)}
                            className="w-full text-left px-2.5 py-1.5 text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg cursor-pointer"
                          >
                            {isFeatured ? "Unfeature" : "Feature"}
                          </button>
                          <button
                            onClick={handleAddToWidget}
                            className="w-full text-left px-2.5 py-1.5 text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg cursor-pointer"
                          >
                            Add to widget
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="w-full text-left px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer flex items-center justify-between"
                          >
                            <span>Delete</span>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Link: View all reviews */}
        <div className="px-4 py-3 border-t border-[#F0ECE6] bg-[#FAF9F6]/40">
          <Link
            href="/dashboard/manage"
            className="text-xs font-medium text-[#1A1A1A] hover:text-[#2563EB] hover:underline inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View all reviews ({totalCount}) →</span>
          </Link>
        </div>
      </section>

      {/* QR Code Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={formUrl}
      />
    </div>
  );
}
