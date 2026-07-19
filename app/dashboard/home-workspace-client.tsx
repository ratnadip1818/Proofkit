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
    <div className="w-full max-w-6xl mx-auto py-8 px-6 space-y-6 animate-fade-in font-sans">
      {/* Header Greeting */}
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900 tracking-tight flex items-center space-x-2">
          <span>{greeting}, {firstName}</span>
          <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-gray-500 text-xs mt-1 font-sans leading-relaxed">
          Let's publish your first customer story and build trust with dynamic social proof widgets.
        </p>
      </div>

      {/* Main Grid: Next Action Card & Setup Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Next Best Action Card */}
        <div className="lg:col-span-2 bg-white border border-[#ecebe6] rounded-xl p-5 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                Next Best Action
              </span>
              <span className="text-[10px] text-gray-400 font-mono flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                2 min read
              </span>
            </div>

            <h2 className="font-display font-semibold text-base text-gray-900 leading-tight">
              {!hasForm
                ? "Create your first collection form"
                : testimonials.length === 0
                ? "Collect your first customer story"
                : pendingCount > 0
                ? "Moderate pending customer testimonials"
                : "Publish your social proof widgets"}
            </h2>
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">
              {!hasForm
                ? "Set up a clean, high-converting collection page where clients can easily upload star ratings, text, and video reviews."
                : testimonials.length === 0
                ? "Copy your custom review collection URL and send it directly to your latest clients or feature it on your social profiles."
                : pendingCount > 0
                ? `You have ${pendingCount} review(s) awaiting approval in your inbox. Moderate them to display on live website widgets.`
                : "Your testimonials are ready! Copy one line of embed code to display Wall of Love or Carousel widgets on your website."}
            </p>
          </div>

          <div className="mt-5 flex items-center space-x-3">
            <div className="flex-1 bg-[#FAF9F6] border border-[#ecebe6] px-3 py-2 rounded-lg text-xs font-mono text-gray-600 truncate">
              {formUrl}
            </div>
            <button
              onClick={handleCopyUrl}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                copiedUrl 
                  ? "bg-green-600 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
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

        {/* Setup Progress */}
        <div className="bg-white border border-[#ecebe6] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display font-semibold text-xs text-gray-900 uppercase tracking-wider">
                Setup Progress
              </span>
              <span className="font-mono text-xs font-bold text-blue-600">{progressPercent}%</span>
            </div>

            {/* Slider progress bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-gray-500 line-through">Workspace created</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs">
                {step2 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className={step2 ? "text-gray-500 line-through" : "text-gray-700 font-medium"}>
                  Setup collection form
                </span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs">
                {step3 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className={step3 ? "text-gray-500 line-through" : "text-gray-700 font-medium"}>
                  Collect reviews from customers
                </span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs">
                {step4 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className={step4 ? "text-gray-500 line-through" : "text-gray-700 font-medium"}>
                  Approve testimonials in inbox
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ecebe6]/60 mt-4">
            <Link
              href="/dashboard/collect"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 hover:underline"
            >
              <span>Go to Form Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Workspace Health Statistics Grid */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-wider">
          Workspace Health
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Inbox Status */}
          <div className="bg-white border border-[#ecebe6] rounded-xl p-4 flex items-start space-x-3.5 hover:border-gray-300 transition-all shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm text-gray-900 block leading-tight">
                {pendingCount === 0 ? "Inbox Clean" : `${pendingCount} Pending Reviews`}
              </span>
              <span className="text-[11px] text-gray-500 block mt-1 leading-relaxed">
                {pendingCount === 0
                  ? "All customer reviews are moderated and up to date."
                  : "You have new customer reviews waiting for approval."}
              </span>
              <Link
                href="/dashboard/manage"
                className="text-[11px] text-blue-600 font-medium hover:underline mt-2 inline-flex items-center"
              >
                Open Inbox →
              </Link>
            </div>
          </div>

          {/* Testimonials Live */}
          <div className="bg-white border border-[#ecebe6] rounded-xl p-4 flex items-start space-x-3.5 hover:border-gray-300 transition-all shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm text-gray-900 block leading-tight">
                {approvedCount} Streaming Reviews
              </span>
              <span className="text-[11px] text-gray-500 block mt-1 leading-relaxed">
                {approvedCount > 0
                  ? `${approvedCount} approved review(s) active in live widgets.`
                  : "Collect & approve reviews to stream them on widgets."}
              </span>
              <Link
                href="/dashboard/publish"
                className="text-[11px] text-blue-600 font-medium hover:underline mt-2 inline-flex items-center"
              >
                Customize Widgets →
              </Link>
            </div>
          </div>

          {/* Collection Link */}
          <div className="bg-white border border-[#ecebe6] rounded-xl p-4 flex items-start space-x-3.5 hover:border-gray-300 transition-all shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm text-gray-900 block leading-tight">
                Collection Page Active
              </span>
              <span className="text-[11px] text-gray-500 block mt-1 leading-relaxed">
                Your custom review collection page is ready to accept user feedback.
              </span>
              <Link
                href="/dashboard/collect"
                className="text-[11px] text-blue-600 font-medium hover:underline mt-2 inline-flex items-center"
              >
                Configure Form →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="bg-white border border-[#ecebe6] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ecebe6]/60 mb-4">
          <span className="font-display font-semibold text-xs text-gray-900 uppercase tracking-wider">
            Recent Testimonials
          </span>
          <Link href="/dashboard/manage" className="text-[10px] text-blue-600 hover:underline font-mono uppercase">
            View All Reviews ({testimonials.length}) →
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No testimonials collected yet. Share your collection page URL to get started!
          </div>
        ) : (
          <div className="divide-y divide-[#ecebe6]/60">
            {testimonials.slice(0, 5).map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-xs">
                    {t.author_name ? t.author_name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">{t.author_name || "Anonymous"}</span>
                    <span className="text-[11px] text-gray-500">{t.author_role || "Customer"}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === "approved"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : t.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-600"
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
