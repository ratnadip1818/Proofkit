"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock,
  Inbox,
  Layers,
  Link2,
  Sparkles,
  TrendingUp,
  Star,
  ExternalLink
} from "lucide-react";

interface Testimonial {
  id: string;
  status: string;
  rating: number;
  display_body: string;
  author_name: string;
  author_role: string;
  avatar_url?: string;
  created_at: string;
}

interface HomeWorkspaceClientProps {
  user: { id: string; email?: string | null };
  form: { id: string; slug: string; custom_domain?: string | null } | null;
  testimonials: Testimonial[];
  profile: { full_name?: string | null } | null;
  appUrl: string;
}

export default function HomeWorkspaceClient({
  user,
  form,
  testimonials,
  profile,
  appUrl,
}: HomeWorkspaceClientProps) {
  const [greeting, setGreeting] = useState("Good morning");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const approvedCount = testimonials.filter((t) => t.status === "approved").length;
  const pendingCount = testimonials.filter((t) => t.status === "pending").length;
  const hasForm = !!form;
  const formUrl = hasForm
    ? form.custom_domain
      ? `https://${form.custom_domain}`
      : `${appUrl}/c/${form.slug}`
    : `${appUrl}/c/demo`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(formUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Progress checklist calculation
  const step1 = true;
  const step2 = hasForm;
  const step3 = testimonials.length > 0;
  const step4 = approvedCount > 0;
  const completedSteps = [step1, step2, step3, step4].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / 4) * 100);

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="w-full py-8 animate-fade-in font-sans text-ink space-y-8">
      {/* 1. Header Greeting */}
      <div className="pb-6 border-b border-hairline mb-8">
        <h1 className="font-display font-bold text-2xl text-ink tracking-tight flex items-center space-x-2">
          <span>{greeting}, {firstName}</span>
          <span>👋</span>
        </h1>
        <p className="text-ink-secondary text-xs mt-1 leading-relaxed">
          Let's publish your first customer story and build trust with dynamic social proof widgets.
        </p>
      </div>

      {/* 2. Next Best Action Card (Border Left Accent) */}
      <div className="bg-white border border-[#E3E0DB] border-l-[3px] border-l-[#2563EB] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
              NEXT BEST ACTION
            </span>
            <span className="text-xs text-[#787774] font-mono flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              2 min read
            </span>
          </div>

          <h2 className="text-base font-medium text-[#1A1A1A] leading-tight mb-2">
            {!hasForm
              ? "Create your first collection form"
              : testimonials.length === 0
              ? "Collect your first customer story"
              : pendingCount > 0
              ? "Moderate pending customer testimonials"
              : "Publish your social proof widgets"}
          </h2>
          <p className="text-[#787774] text-sm leading-relaxed max-w-2xl mb-4">
            {!hasForm
              ? "Set up a clean, high-converting collection page where clients can easily upload star ratings, text, and video reviews."
              : testimonials.length === 0
              ? "Share your collection form with recent customers to start gathering high-quality testimonials that you can embed on your website."
              : pendingCount > 0
              ? `You have ${pendingCount} review(s) awaiting approval in your inbox. Moderate them to display on live website widgets.`
              : "Your testimonials are ready! Copy one line of embed code to display Wall of Love or Carousel widgets on your website."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
          <div className="flex-1 bg-[#F7F6F3] border border-[#E3E0DB] px-3 py-2 rounded-[6px] text-xs font-mono text-[#1A1A1A] truncate select-all">
            {formUrl}
          </div>
          <button
            onClick={handleCopyUrl}
            className={`flex items-center justify-center space-x-1.5 px-4 py-2 rounded-[6px] text-xs font-medium border border-[#E3E0DB] bg-white text-[#1A1A1A] hover:bg-[#F7F6F3] transition-colors cursor-pointer shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.08)]`}
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#787774]" />
                <span>Copy Form URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Middle Section: Setup Progress & Workspace Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: Setup Progress */}
        <div className="bg-white border border-[#E3E0DB] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
                SETUP PROGRESS
              </span>
              <span className="px-2 py-0.5 rounded bg-[#E8E5E0] text-[#1A1A1A] text-xs font-medium">
                {progressPercent}%
              </span>
            </div>

            {/* Horizontal progress bar (track #E3E0DB, fill #1A1A1A as per Notion spec) */}
            <div className="w-full bg-[#E3E0DB] h-1.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-[#1A1A1A] h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span className="text-[#787774] line-through">Workspace created</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                {step2 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                )}
                <span className={step2 ? "text-[#787774] line-through" : "text-[#1A1A1A]"}>
                  Setup collection form
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                {step3 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                )}
                <span className={step3 ? "text-[#787774] line-through" : "text-[#1A1A1A]"}>
                  Collect reviews
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                {step4 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#AFAFAC] shrink-0" />
                )}
                <span className={step4 ? "text-[#787774] line-through" : "text-[#1A1A1A]"}>
                  Approve testimonials
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E0DB] mt-6">
            <Link
              href="/dashboard/collect"
              className="text-sm text-[#1A1A1A] font-medium flex items-center space-x-1 hover:underline"
            >
              <span>Go to Form Studio</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#787774]" />
            </Link>
          </div>
        </div>

        {/* Column 2: Workspace Health */}
        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
            WORKSPACE HEALTH
          </div>

          <div className="space-y-3">
            {/* Inbox Status */}
            <div className="bg-white border border-[#E3E0DB] rounded-[12px] p-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#787774] shrink-0">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-sm text-[#1A1A1A] block leading-tight">
                    {pendingCount === 0 ? "Inbox Clean" : `${pendingCount} Pending Reviews`}
                  </span>
                  <span className="text-xs text-[#787774] block mt-0.5">
                    {pendingCount === 0 ? "0 pending approvals" : "New submissions await moderation"}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/manage"
                className="text-xs text-[#1A1A1A] hover:underline font-medium"
              >
                View
              </Link>
            </div>

            {/* Testimonials Live */}
            <div className="bg-white border border-[#E3E0DB] rounded-[12px] p-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#787774] shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-sm text-[#1A1A1A] block leading-tight">
                    {approvedCount} Streaming {approvedCount === 1 ? "Review" : "Reviews"}
                  </span>
                  <span className="text-xs text-[#787774] block mt-0.5">
                    In the last 30 days
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/publish"
                className="text-xs text-[#1A1A1A] hover:underline font-medium"
              >
                Analytics
              </Link>
            </div>

            {/* Collection Link */}
            <div className="bg-white border border-[#E3E0DB] rounded-[12px] p-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#787774] shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium text-sm text-[#1A1A1A] block leading-tight">
                    Collection Page Active
                  </span>
                  <span className="text-xs text-[#787774] block mt-0.5">
                    Accepting public submissions
                  </span>
                </div>
              </div>
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1A1A1A] hover:underline font-medium"
              >
                Visit
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Testimonials */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
            RECENT TESTIMONIALS
          </h3>
          <Link
            href="/dashboard/manage"
            className="text-xs font-semibold text-[#1A1A1A] hover:underline flex items-center gap-1"
          >
            <span>VIEW ALL REVIEWS ({testimonials.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-[#E3E0DB] rounded-[12px] py-16 px-4 text-center select-none flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F6F3] flex items-center justify-center text-[#787774] mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] mb-1">No reviews yet</h3>
            <p className="text-sm text-[#787774] max-w-[320px] leading-relaxed">
              Share your link to start collecting social proof.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E3E0DB] rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] divide-y divide-[#E3E0DB]">
            {testimonials.slice(0, 5).map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-sm first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#F7F6F3] flex items-center justify-center font-bold text-[#1A1A1A] text-xs">
                    {t.author_name ? t.author_name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <span className="font-medium text-[#1A1A1A] block leading-tight">{t.author_name || "Anonymous"}</span>
                    <span className="text-xs text-[#787774] block mt-0.5">{t.author_role || "Customer"}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-0.5 text-[#F59E0B]">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      t.status === "approved"
                        ? "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20"
                        : t.status === "pending"
                        ? "bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20"
                        : "bg-[#F7F6F3] text-[#787774]"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
