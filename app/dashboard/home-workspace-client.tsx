"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Copy, 
  Check, 
  Upload, 
  AlertTriangle,
  Sparkles
} from "lucide-react";
import {
  PageContainer,
  SectionCard,
  SectionHeader,
  StatusBadge,
  Button,
} from "./ui-components";

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
  const [copiedAction, setCopiedAction] = useState(false);

  // Set greeting based on local time
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const approved = testimonials.filter((t) => t.status === "approved");
  const importedCount = testimonials.filter((t) => t.status === "approved" || t.status === "pending").length; 
  const hasApproved = approved.length > 0;
  const hasForm = !!form;

  // Onboarding milestones checklist calculations
  const steps = [
    { label: "Workspace created", completed: true },
    { label: "Setup collection form", completed: hasForm },
    { label: "Collect reviews from customers", completed: testimonials.length > 0 },
    { label: "Approve testimonials in inbox", completed: hasApproved },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allComplete = completedCount === steps.length;

  // Next recommended action logic
  const getNextAction = () => {
    if (!hasForm) {
      return {
        title: "Create your first collection page",
        description: "Set up a beautiful, white-labeled link where your users can submit text and video testimonials in seconds.",
        cta: "Create Collection Link",
        href: "/dashboard/collect",
        time: "1 min",
        isCopy: false,
      };
    }
    if (testimonials.length === 0) {
      const shareUrl = `${appUrl}/c/${form.slug}`;
      return {
        title: "Collect your first customer story",
        description: "Copy your custom review page URL and send it to your latest customers or post it on social channels.",
        cta: "Copy Form Link",
        href: shareUrl,
        time: "2 min",
        isCopy: true,
      };
    }
    if (!hasApproved) {
      return {
        title: "Moderate pending testimonials",
        description: "You have received feedback! Approve testimonials to unlock them for widgets or archive hidden ones.",
        cta: "Moderate Inbox",
        href: "/dashboard/manage",
        time: "1 min",
        isCopy: false,
      };
    }
    return {
      title: "Publish testimonial trust widget",
      description: "Choose a layout (Wall of Love, Carousel, Marquee) and copy one line of code to embed on your live website.",
      cta: "Build Trust Widget",
      href: "/dashboard/publish",
      time: "2 min",
      isCopy: false,
    };
  };

  const nextAction = getNextAction();

  const handleCopyAction = () => {
    if (nextAction.isCopy) {
      navigator.clipboard.writeText(nextAction.href);
      setCopiedAction(true);
      setTimeout(() => setCopiedAction(false), 2000);
    }
  };

  const firstName = profile?.full_name?.split(" ")[0];
  const pendingCount = testimonials.filter((t) => t.status === "pending").length;

  return (
    <PageContainer
      title={firstName ? `${greeting}, ${firstName} 👋` : `${greeting} 👋`}
      subtitle="Let's publish your first customer story and build conversion trust."
    >
      <div className="space-y-8 select-none relative">
        {/* Subtle background ambient lights */}
        <div className="absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(232,116,59,0.02)_0%,transparent_70%)] pointer-events-none -z-10" />

        {/* 1. Next Best Action & Onboarding Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Next Best Action Card */}
          <SectionCard className="lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 h-32 w-32 bg-[radial-gradient(circle_at_bottom_right,rgba(232,116,59,0.03),transparent_80%)] pointer-events-none" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E8743B]/10 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#E8743B]">
                  Next Best Action
                </span>
                <span className="text-xs text-[#6B6B6B]">
                  · {nextAction.time}
                </span>
              </div>
              <h2
                className="text-lg font-bold text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {nextAction.title}
              </h2>
              <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-lg">
                {nextAction.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {nextAction.isCopy ? (
                <Button
                  onClick={handleCopyAction}
                  icon={copiedAction ? <Check size={14} /> : <Copy size={14} />}
                >
                  {copiedAction ? "Copied Form Link!" : "Copy Form URL"}
                </Button>
              ) : (
                <Link href={nextAction.href} className="inline-flex">
                  <Button icon={<ArrowRight size={14} />}>
                    {nextAction.cta}
                  </Button>
                </Link>
              )}
            </div>
          </SectionCard>

          {/* Onboarding Checklist Card */}
          <SectionCard className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  Setup Progress
                </h3>
                <span className="text-xs font-bold text-[#E8743B]">
                  {progressPercent}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[#ECE7E0] rounded-full overflow-hidden mb-5">
                <div 
                  className="h-full bg-[#E8743B] rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Steps lists */}
              <div className="flex flex-col gap-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#1A1A1A]">
                    {step.completed ? (
                      <CheckCircle2 size={15} className="text-[#2E9E6B] shrink-0" strokeWidth={2.5} />
                    ) : (
                      <Circle size={15} className="text-[#ECE7E0] shrink-0" strokeWidth={2.5} />
                    )}
                    <span className={step.completed ? "line-through text-[#6B6B6B]" : "font-medium"}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* celebration banner */}
            {allComplete && (
              <div className="mt-4 p-3 bg-green-50/50 border border-green-200/40 rounded-2xl flex items-center gap-2 text-xs text-[#2E9E6B] font-semibold animate-pulse">
                <Sparkles size={13} className="shrink-0" />
                <span>Onboarding complete! Your trust widget is ready.</span>
              </div>
            )}
          </SectionCard>
        </div>

        {/* 2. Workspace Health */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
            Workspace Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Inbox Health card */}
            <SectionCard className="p-4 flex items-start gap-3">
              {pendingCount > 0 ? (
                <>
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">Moderation Pending</h4>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                      {pendingCount} review{pendingCount === 1 ? "" : "s"} waiting for approval.
                    </p>
                    <Link href="/dashboard/manage" className="text-[10px] font-bold text-[#E8743B] mt-2 inline-block hover:underline">
                      Moderate now →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} className="text-[#2E9E6B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">Inbox Clean</h4>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                      All testimonials have been moderated successfully.
                    </p>
                  </div>
                </>
              )}
            </SectionCard>

            {/* Approved testimonials health card */}
            <SectionCard className="p-4 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#2E9E6B] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#1A1A1A]">Testimonials Live</h4>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                  {approved.length} approved review{approved.length === 1 ? "" : "s"} streaming to widgets.
                </p>
                <Link href="/dashboard/publish" className="text-[10px] font-bold text-[#E8743B] mt-2 inline-block hover:underline">
                  Customize Widget →
                </Link>
              </div>
            </SectionCard>

            {/* Campaign form share status */}
            <SectionCard className="p-4 flex items-start gap-3">
              {hasForm ? (
                <>
                  <CheckCircle2 size={18} className="text-[#2E9E6B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">Form Active</h4>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                      Collection form is online and ready for traffic.
                    </p>
                    <Link href="/dashboard/collect" className="text-[10px] font-bold text-[#E8743B] mt-2 inline-block hover:underline">
                      Distribute links →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">No active campaigns</h4>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                      Create a feedback form to begin receiving praise.
                    </p>
                  </div>
                </>
              )}
            </SectionCard>

          </div>
        </div>

        {/* 3. Recent Activity Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
            Recent Activity
          </h2>

          {testimonials.length === 0 ? (
            <SectionCard className="p-8 text-center text-xs text-[#6B6B6B]">
              No activity recorded yet. Share your collection form to receive feedback.
            </SectionCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...testimonials]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 3)
                .map((evt) => {
                  const isApproved = evt.status === "approved";
                  return (
                    <SectionCard key={evt.id} className="flex flex-col justify-between p-5 min-h-[160px]">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#6B6B6B]">
                            {new Date(evt.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                          <StatusBadge status={evt.status as any} label={evt.status} />
                        </div>
                        <p className="text-xs font-medium text-[#1A1A1A] italic line-clamp-3 leading-relaxed">
                          "{evt.display_body}"
                        </p>
                      </div>

                      <div className="border-t border-[#ECE7E0]/60 pt-3 mt-3 flex items-center gap-2">
                        {evt.avatar_url ? (
                          <img
                            src={evt.avatar_url}
                            alt={evt.author_name}
                            className="h-6 w-6 rounded-full object-cover border border-[#ECE7E0]"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF4EE] text-[9px] font-bold text-[#E8743B] border border-[#E8743B]/10">
                            {evt.author_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-[#1A1A1A] truncate">{evt.author_name}</span>
                      </div>
                    </SectionCard>
                  );
                })}
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
}
