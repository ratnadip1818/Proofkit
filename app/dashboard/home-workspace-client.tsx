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
  form: { id: string; slug: string } | null;
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
  const formUrl = hasForm ? `${appUrl}/c/${form.slug}` : `${appUrl}/c/demo`;

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
    <div className="w-full py-8 space-y-8 animate-fade-in font-sans text-ink">
      {/* 1. Header Greeting */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink tracking-tight flex items-center space-x-2">
          <span>{greeting}, {firstName}</span>
          <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-ink-secondary text-xs mt-1 font-sans leading-relaxed">
          Let's publish your first customer story and build trust with dynamic social proof widgets.
        </p>
      </div>

      {/* 2. Next Best Action Card (Full Width) */}
      <div className="bg-surface border border-accent/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-accent/40">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent" />
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-accent/5 text-accent border border-accent/15 uppercase tracking-wider">
              Next Best Action
            </span>
            <span className="text-[10px] text-ink-secondary/70 font-mono flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              2 min read
            </span>
          </div>

          <h2 className="font-display font-bold text-base text-ink leading-tight mb-2">
            {!hasForm
              ? "Create your first collection form"
              : testimonials.length === 0
              ? "Collect your first customer story"
              : pendingCount > 0
              ? "Moderate pending customer testimonials"
              : "Publish your social proof widgets"}
          </h2>
          <p className="text-ink-secondary text-xs leading-relaxed max-w-2xl mb-4">
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
          <div className="flex-1 bg-canvas border border-hairline px-3.5 py-2.5 rounded-xl text-xs font-mono text-ink-secondary truncate select-all">
            {formUrl}
          </div>
          <button
            onClick={handleCopyUrl}
            className={`flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer shrink-0 ${
              copiedUrl 
                ? "bg-green-600 text-white" 
                : "bg-accent hover:bg-accent-hover text-white active:scale-95"
            }`}
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Form URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Middle Section: Setup Progress & Workspace Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: Setup Progress */}
        <div className="bg-surface border border-hairline rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-ink-secondary">
                Setup Progress
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-canvas text-ink-secondary text-[11px] font-mono font-bold">
                {progressPercent}%
              </span>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full bg-canvas h-2 rounded-full overflow-hidden mb-6 border border-hairline/30">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-ink-secondary line-through">Workspace created</span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                {step2 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-secondary/30 shrink-0" />
                )}
                <span className={step2 ? "text-ink-secondary line-through" : "text-ink font-medium"}>
                  Setup collection form
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                {step3 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-secondary/30 shrink-0" />
                )}
                <span className={step3 ? "text-ink-secondary line-through" : "text-ink font-medium"}>
                  Collect reviews
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                {step4 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-ink-secondary/30 shrink-0" />
                )}
                <span className={step4 ? "text-ink-secondary line-through" : "text-ink font-medium"}>
                  Approve testimonials
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-hairline mt-6">
            <Link
              href="/dashboard/collect"
              className="text-xs text-accent hover:text-accent-hover font-bold flex items-center space-x-1 hover:underline"
            >
              <span>Go to Form Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Workspace Health */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink-secondary">
            Workspace Health
          </h3>

          <div className="space-y-3">
            {/* Inbox Status */}
            <div className="bg-surface border border-hairline rounded-2xl p-4 flex items-center justify-between hover:border-ink-secondary/20 transition-all shadow-xs group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 shrink-0">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-semibold text-sm text-ink block leading-tight">
                    {pendingCount === 0 ? "Inbox Clean" : `${pendingCount} Pending Reviews`}
                  </span>
                  <span className="text-[11px] text-ink-secondary block mt-0.5 leading-relaxed">
                    {pendingCount === 0 ? "0 pending approvals" : "New submissions await moderation"}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/manage"
                className="text-[11px] font-bold text-ink-secondary hover:text-accent flex items-center gap-1 bg-canvas group-hover:bg-accent/5 px-3 py-1.5 rounded-lg border border-hairline transition-all"
              >
                <span>View</span>
              </Link>
            </div>

            {/* Testimonials Live */}
            <div className="bg-surface border border-hairline rounded-2xl p-4 flex items-center justify-between hover:border-ink-secondary/20 transition-all shadow-xs group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-semibold text-sm text-ink block leading-tight">
                    {approvedCount} Streaming {approvedCount === 1 ? "Review" : "Reviews"}
                  </span>
                  <span className="text-[11px] text-ink-secondary block mt-0.5 leading-relaxed">
                    In the last 30 days
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/publish"
                className="text-[11px] font-bold text-ink-secondary hover:text-accent flex items-center gap-1 bg-canvas group-hover:bg-accent/5 px-3 py-1.5 rounded-lg border border-hairline transition-all"
              >
                <span>Analytics</span>
              </Link>
            </div>

            {/* Collection Link */}
            <div className="bg-surface border border-hairline rounded-2xl p-4 flex items-center justify-between hover:border-ink-secondary/20 transition-all shadow-xs group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-display font-semibold text-sm text-ink block leading-tight">
                    Collection Page Active
                  </span>
                  <span className="text-[11px] text-ink-secondary block mt-0.5 leading-relaxed">
                    Accepting public submissions
                  </span>
                </div>
              </div>
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-ink-secondary hover:text-accent flex items-center gap-1 bg-canvas group-hover:bg-accent/5 px-3 py-1.5 rounded-lg border border-hairline transition-all"
              >
                <span>Visit</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Testimonials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink-secondary">
            Recent Testimonials
          </h3>
          <Link
            href="/dashboard/manage"
            className="text-xs font-bold text-ink hover:text-accent flex items-center gap-1 transition-all"
          >
            <span>VIEW ALL REVIEWS ({testimonials.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-surface border-2 border-dashed border-hairline rounded-3xl p-16 text-center select-none shadow-xs">
            <div className="text-accent/30 mx-auto mb-4 flex justify-center">
              <Sparkles className="w-10 h-10 text-accent/40" />
            </div>
            <h3 className="text-sm font-bold text-ink font-display">No reviews yet</h3>
            <p className="text-xs text-ink-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">
              Share your link to start collecting social proof.
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-sm divide-y divide-hairline">
            {testimonials.slice(0, 5).map((t) => (
              <div key={t.id} className="py-4 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-canvas flex items-center justify-center font-bold text-ink-secondary text-xs border border-hairline/45">
                    {t.author_name ? t.author_name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <span className="font-semibold text-ink block leading-tight">{t.author_name || "Anonymous"}</span>
                    <span className="text-[10px] text-ink-secondary block mt-0.5">{t.author_role || "Customer"}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === "approved"
                        ? "bg-green-500/10 text-green-700 border border-green-500/20"
                        : t.status === "pending"
                        ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                        : "bg-canvas text-ink-secondary"
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
