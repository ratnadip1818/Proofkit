"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
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
  Circle,
  AlertCircle,
  Code2,
  Sparkles,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import QrModal from "./qr-modal";
import { approveTestimonial, updateTestimonialTags } from "./actions";
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
  const [isPendingTransition, startTransition] = useTransition();

  // Local state for testimonials to support optimistic updates
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWidgetKey, setCopiedWidgetKey] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // Sync state if props change
  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

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
  const approvedCount = testimonials.filter((t) => t.status === "approved").length;

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

  // Plan limits
  const planTier = limits.planTier || "free";
  const planLimit = planTier === "free" ? 10 : null;
  const isNearLimit = planTier === "free" && totalCount >= 8;

  // Copy collection link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  // Copy widget embed code snippet
  const handleCopyEmbedCode = async (widgetKey: string, snippetType: string) => {
    const code = `<script src="${appUrl}/widget.js" data-user="${user.id}" data-type="${snippetType}"></script>`;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedWidgetKey(widgetKey);
      setTimeout(() => setCopiedWidgetKey(null), 2000);
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
    setActionInProgressId(id);
    try {
      // Optimistic update
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
      // Revert if failed
      setTestimonials(initialTestimonials);
    } finally {
      setActionInProgressId(null);
    }
  };

  // Quick Action: Feature
  const handleToggleFeature = async (t: TestimonialItem) => {
    setActionInProgressId(t.id);
    const existingTags = t.tags || [];
    const isCurrentlyFeatured = existingTags.includes("featured");
    const newTags = isCurrentlyFeatured
      ? existingTags.filter((tag) => tag !== "featured")
      : [...existingTags, "featured"];

    try {
      // Optimistic update
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

  // Quick Action: Add to widget (copies embed snippet for this item)
  const handleAddToWidget = async (t: TestimonialItem) => {
    const snippet = `<script src="${appUrl}/widget.js" data-user="${user.id}" data-type="single"></script>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setActionNotice(`Copied single quote widget code ✓`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch {}
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

  // Needs your attention items
  const attentionItems = useMemo(() => {
    const items: Array<{
      id: string;
      message: string;
      actionText: string;
      actionHref?: string;
      onClick?: () => void;
    }> = [];

    if (pendingCount > 0) {
      items.push({
        id: "pending",
        message: `${pendingCount} ${pendingCount === 1 ? "testimonial is" : "testimonials are"} waiting for approval`,
        actionText: "Review",
        actionHref: "/dashboard/manage?status=pending",
      });
    }

    if (!hasDetectedWidget) {
      items.push({
        id: "widget_install",
        message: "We haven't detected your widget on any site yet",
        actionText: "Check install",
        actionHref: "/dashboard/publish",
      });
    }

    if (isNearLimit) {
      items.push({
        id: "plan_limit",
        message: `You've used ${totalCount} of ${planLimit} testimonials`,
        actionText: "Upgrade",
        actionHref: "/dashboard/billing",
      });
    }

    return items;
  }, [pendingCount, hasDetectedWidget, isNearLimit, totalCount, planLimit]);

  // Widget definitions for Section 5
  const widgetCards = [
    {
      key: "wall",
      type: "wall",
      name: "Wall of Love",
      description: "Masonry grid that displays your top reviews with photo avatars.",
      status: trackingStats?.widgetsStatus?.wall,
    },
    {
      key: "carousel",
      type: "carousel",
      name: "Carousel",
      description: "Touch-friendly slider ideal for homepages and landing heroes.",
      status: trackingStats?.widgetsStatus?.carousel,
    },
    {
      key: "marquee",
      type: "marquee",
      name: "Marquee",
      description: "Endless smooth scrolling ticker for maximum credibility.",
      status: trackingStats?.widgetsStatus?.marquee,
    },
    {
      key: "single",
      type: "single",
      name: "Single Quote",
      description: "High-impact spotlight card beside conversion checkout buttons.",
      status: trackingStats?.widgetsStatus?.single,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-8 font-sans text-[#1A1A1A]">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs font-medium px-4 py-2.5 rounded-[10px] shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 1. GREETING + STATUS LINE */}
      <section className="space-y-1.5 pb-2">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-tight text-[#1A1A1A] leading-tight">
          {timeGreeting}, {firstName}
        </h1>
        <p className="text-sm text-[#787774] font-normal leading-relaxed">
          {totalCount === 0
            ? "Let's collect your first testimonial."
            : pendingCount > 0
            ? `You collected ${thisWeekCount} new ${thisWeekCount === 1 ? "testimonial" : "testimonials"} this week. ${pendingCount} waiting for your approval.`
            : `You collected ${thisWeekCount} new ${thisWeekCount === 1 ? "testimonial" : "testimonials"} this week. You're all caught up.`}
        </p>
      </section>

      {/* 2. STAT CARDS OR GET STARTED CHECKLIST */}
      {totalCount === 0 ? (
        /* NEW USER: GET STARTED CHECKLIST */
        <section className="bg-white border border-[#E8E5E0] rounded-[14px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE6]">
            <div>
              <h2 className="font-serif text-lg font-normal text-[#1A1A1A] tracking-tight">
                Get started
              </h2>
              <p className="text-xs text-[#787774] mt-0.5">
                Complete these steps to collect social proof and embed your live widget.
              </p>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-[6px] bg-[#F7F5F2] text-[#787774] border border-[#E8E5E0]">
              Step 1 of 5
            </span>
          </div>

          <div className="space-y-3">
            {/* Step 1: Create workspace */}
            <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-[#FAF9F6] border border-[#F0ECE6]">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] block">
                    Create workspace
                  </span>
                  <span className="text-[11px] text-[#787774] block">
                    Workspace and database initialized.
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#787774] font-medium">Done ✓</span>
            </div>

            {/* Step 2: Customize form */}
            <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-white border border-[#E8E5E0]">
              <div className="flex items-center gap-3">
                <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] block">
                    Customize form
                  </span>
                  <span className="text-[11px] text-[#787774] block">
                    Edit questions, colors, and branding for your collection page.
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/collect"
                className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded-[10px] transition-colors cursor-pointer shrink-0"
              >
                Customize
              </Link>
            </div>

            {/* Step 3: Share link */}
            <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-white border border-[#E8E5E0]">
              <div className="flex items-center gap-3">
                <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] block">
                    Share link
                  </span>
                  <span className="text-[11px] text-[#787774] block">
                    Send your public collection link to your first customers.
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded-[10px] transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? "Copied ✓" : "Copy link"}
              </button>
            </div>

            {/* Step 4: Approve first testimonial */}
            <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-white border border-[#E8E5E0]">
              <div className="flex items-center gap-3">
                <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] block">
                    Approve first testimonial
                  </span>
                  <span className="text-[11px] text-[#787774] block">
                    Review and publish incoming submissions to your widget feed.
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#787774]">Waiting for review</span>
            </div>

            {/* Step 5: Publish widget */}
            <div className="flex items-center justify-between p-3.5 rounded-[10px] bg-white border border-[#E8E5E0]">
              <div className="flex items-center gap-3">
                <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] block">
                    Publish widget
                  </span>
                  <span className="text-[11px] text-[#787774] block">
                    Paste one line of HTML embed code on your website.
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/publish"
                className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-3 py-1.5 rounded-[10px] transition-colors cursor-pointer shrink-0"
              >
                Publish
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* STAT CARDS ROW (4 CARDS) */
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Testimonials */}
          <div className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
              Testimonials
            </span>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                {totalCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#787774]">
              <span>{thisWeekCount} new this week</span>
              <span
                className={`font-medium ${
                  vsLastWeekDiff > 0
                    ? "text-emerald-700"
                    : vsLastWeekDiff < 0
                    ? "text-[#787774]"
                    : "text-[#787774]"
                }`}
              >
                {vsLastWeekDiff > 0
                  ? `+${vsLastWeekDiff} vs last week`
                  : vsLastWeekDiff < 0
                  ? `${vsLastWeekDiff} vs last week`
                  : "same as last week"}
              </span>
            </div>
          </div>

          {/* Card 2: Average rating */}
          <div className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
              Average rating
            </span>
            <div className="my-3 flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                {avgRating ? avgRating : "—"}
              </span>
              <span className="text-amber-500 text-xl font-bold">★</span>
            </div>
            <div className="text-xs text-[#787774]">
              {ratedCount > 0 ? `across ${ratedCount} reviews` : "No rated reviews yet"}
            </div>
          </div>

          {/* Card 3: Form conversion */}
          <div className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
              Form conversion
            </span>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                {conversionRate !== null ? `${conversionRate}%` : "—"}
              </span>
            </div>
            <div className="text-xs text-[#787774]">
              {conversionRate !== null
                ? "of visitors submitted"
                : "Starts counting once your widget is live"}
            </div>
          </div>

          {/* Card 4: Widget views */}
          <div className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
              Widget views
            </span>
            <div className="my-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                {widgetViewsMonth !== null ? widgetViewsMonth : "—"}
              </span>
            </div>
            <div className="text-xs text-[#787774]">
              {widgetViewsMonth !== null
                ? "this month"
                : "Starts counting once your widget is live"}
            </div>
          </div>
        </section>
      )}

      {/* 3. NEEDS YOUR ATTENTION */}
      <section className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {attentionItems.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-[#787774] py-1 font-normal">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>You&apos;re all caught up ✓</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE6]">
              <h2 className="font-serif text-base font-normal text-[#1A1A1A] tracking-tight">
                Needs your attention
              </h2>
              <span className="text-[11px] font-mono text-[#787774]">
                {attentionItems.length} {attentionItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-[#F0ECE6]">
              {attentionItems.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-1 last:pb-1"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]">
                      {item.message}
                    </span>
                  </div>

                  {item.actionHref && (
                    <Link
                      href={item.actionHref}
                      className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-3.5 py-1.5 rounded-[10px] transition-colors cursor-pointer shrink-0 text-center"
                    >
                      {item.actionText}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. TWO-COLUMN SECTION: LATEST TESTIMONIALS + GET MORE TESTIMONIALS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Wider): LATEST TESTIMONIALS */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[#E8E5E0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#F0ECE6] flex items-center justify-between">
            <h2 className="font-serif text-lg font-normal text-[#1A1A1A] tracking-tight">
              Latest testimonials
            </h2>
            {totalCount > 0 && (
              <span className="text-xs text-[#787774] font-mono">
                Showing {Math.min(5, totalCount)} of {totalCount}
              </span>
            )}
          </div>

          {testimonials.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <p className="text-sm text-[#787774] max-w-sm mx-auto leading-relaxed">
                No testimonials yet. Share your link with your first customer.
              </p>
              <button
                onClick={handleCopyLink}
                className="mt-4 inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-3.5 py-2 rounded-[10px] transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? "Copied ✓" : "Copy link"}</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F0ECE6]">
              {testimonials.slice(0, 5).map((t) => {
                const isFeatured = t.tags?.includes("featured");
                const quoteExcerpt =
                  t.display_body || t.body_original || "No text provided.";
                const truncatedQuote =
                  quoteExcerpt.length > 140
                    ? quoteExcerpt.slice(0, 140).trim() + "…"
                    : quoteExcerpt;

                return (
                  <div key={t.id} className="p-4 sm:p-5 space-y-3 hover:bg-[#FAF9F6]/50 transition-colors">
                    {/* Top Row: Author + Rating + Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {t.avatar_url ? (
                          <img
                            src={t.avatar_url}
                            alt={t.author_name}
                            className="w-8 h-8 rounded-full object-cover border border-[#E8E5E0]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#F7F5F2] border border-[#E8E5E0] flex items-center justify-center font-bold text-xs text-[#1A1A1A]">
                            {t.author_name ? t.author_name[0].toUpperCase() : "?"}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs sm:text-sm text-[#1A1A1A] leading-tight">
                              {t.author_name || "Anonymous"}
                            </span>
                            {isSampleTestimonial(t) && (
                              <span className="text-[10px] font-medium bg-[#F0ECE6] text-[#787774] px-1.5 py-0.5 rounded">
                                Sample
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#787774] block mt-0.5">
                            {[t.author_role, t.author_company].filter(Boolean).join(" · ") ||
                              "Verified Customer"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {t.rating && (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        )}

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                            t.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : isFeatured
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {t.status === "pending" ? "Pending" : isFeatured ? "Featured" : "Approved"}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Quote Excerpt */}
                    <p className="text-xs sm:text-sm text-[#4A4946] leading-relaxed italic pl-11">
                      &ldquo;{truncatedQuote}&rdquo;
                    </p>

                    {/* Bottom: Quick Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1 pl-11">
                      {t.status === "pending" && (
                        <button
                          onClick={() => handleApprove(t.id)}
                          disabled={actionInProgressId === t.id}
                          className="bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-medium px-3 py-1 rounded-[8px] transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleFeature(t)}
                        disabled={actionInProgressId === t.id}
                        className={`text-[11px] font-medium px-3 py-1 rounded-[8px] border transition-colors cursor-pointer ${
                          isFeatured
                            ? "border-[#E8E5E0] bg-[#F7F5F2] text-[#1A1A1A] hover:bg-[#EAE6DF]"
                            : "border-[#E8E5E0] bg-white text-[#1A1A1A] hover:bg-[#F7F5F2]"
                        }`}
                      >
                        {isFeatured ? "Unfeature" : "Feature"}
                      </button>

                      <button
                        onClick={() => handleAddToWidget(t)}
                        className="text-[11px] font-medium px-3 py-1 rounded-[8px] border border-[#E8E5E0] bg-white text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors cursor-pointer"
                      >
                        Add to widget
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Link at bottom: View all reviews */}
          <div className="p-4 border-t border-[#F0ECE6] bg-[#FAF9F6]/50">
            <Link
              href="/dashboard/manage"
              className="text-xs font-medium text-[#1A1A1A] hover:underline inline-flex items-center gap-1.5"
            >
              <span>View all reviews ({totalCount})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#787774]" />
            </Link>
          </div>
        </div>

        {/* Right Column: GET MORE TESTIMONIALS */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-[#E8E5E0] rounded-[14px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div>
            <h2 className="font-serif text-lg font-normal text-[#1A1A1A] tracking-tight">
              Get more testimonials
            </h2>
            <p className="text-xs text-[#787774] mt-1 leading-relaxed">
              Share your public collection form link with satisfied clients.
            </p>
          </div>

          {/* Collection Link Input + Copy Button */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#787774] block">
              Collection link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={formUrl}
                className="w-full bg-[#FAF9F6] border border-[#E8E5E0] rounded-[10px] px-3 py-2 text-xs font-mono text-[#1A1A1A] truncate select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-3.5 py-2 rounded-[10px] transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied ✓</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Secondary Actions: Send by email & Show QR code */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href={mailtoLink}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] border border-[#E8E5E0] bg-white text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#787774]" />
              <span>Send by email</span>
            </a>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] border border-[#E8E5E0] bg-white text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors shadow-xs cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#787774]" />
              <span>Show QR code</span>
            </button>
          </div>

          {/* Small Tip Text */}
          <div className="pt-4 border-t border-[#F0ECE6]">
            <p className="text-xs text-[#787774] leading-relaxed">
              Ask right after a customer succeeds with your product. That&apos;s when they respond most.
            </p>
          </div>
        </div>
      </section>

      {/* 5. YOUR WIDGETS */}
      <section className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE6]">
          <div>
            <h2 className="font-serif text-lg font-normal text-[#1A1A1A] tracking-tight">
              Your widgets
            </h2>
            <p className="text-xs text-[#787774] mt-0.5">
              Live embeds displaying approved social proof across websites.
            </p>
          </div>
          <Link
            href="/dashboard/publish"
            className="text-xs font-medium text-[#1A1A1A] hover:underline inline-flex items-center gap-1"
          >
            <span>Manage widgets →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgetCards.map((w) => {
            const isInstalled = w.status?.installed ?? false;
            const domain = w.status?.domain ?? null;
            const views = w.status?.views ?? 0;
            const isCopied = copiedWidgetKey === w.key;

            return (
              <div
                key={w.key}
                className="p-4 rounded-[12px] bg-[#FAF9F6] border border-[#E8E5E0] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif text-sm font-medium text-[#1A1A1A]">
                      {w.name}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isInstalled ? "bg-emerald-500" : "bg-[#AFAFAC]"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-[#787774] leading-relaxed line-clamp-2">
                    {w.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE6DF] flex flex-col gap-2">
                  <div className="text-[11px] font-medium text-[#1A1A1A] truncate">
                    {isInstalled ? (
                      <span className="text-emerald-700">
                        Live on {domain || "website"} · {views} {views === 1 ? "view" : "views"}
                      </span>
                    ) : (
                      <span className="text-[#787774]">Not installed</span>
                    )}
                  </div>

                  {!isInstalled && (
                    <button
                      onClick={() => handleCopyEmbedCode(w.key, w.type)}
                      className="w-full bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-medium py-1.5 px-3 rounded-[8px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Code2 className="w-3 h-3" />
                          <span>Copy embed code</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PLAN USAGE (SMALL, QUIET CARD) */}
      <section className="bg-white/80 border border-[#E8E5E0] rounded-[12px] p-4 text-xs text-[#787774] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1 max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-[#1A1A1A] font-medium">
              {planTier === "free"
                ? `Free plan · ${totalCount} of ${planLimit} testimonials`
                : `Pro plan · ${totalCount} testimonials (Unlimited)`}
            </span>
            {planTier === "free" && (
              <span className="text-[11px] font-mono text-[#787774]">
                {Math.min(100, Math.round((totalCount / (planLimit || 10)) * 100))}% used
              </span>
            )}
          </div>

          {planTier === "free" && (
            <div className="w-full h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1A1A1A] rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totalCount / (planLimit || 10)) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>

        {planTier === "free" && (
          <Link
            href="/dashboard/billing"
            className="text-xs font-semibold text-[#1A1A1A] hover:underline shrink-0"
          >
            Upgrade
          </Link>
        )}
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
