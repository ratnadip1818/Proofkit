"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Share2, Clipboard, ShieldCheck, Code } from "lucide-react";

interface GettingStartedProps {
  hasForm: boolean;
  hasTestimonials: boolean;
  hasApproved: boolean;
}

export default function GettingStarted({
  hasForm,
  hasTestimonials,
  hasApproved,
}: GettingStartedProps) {
  // Check if they copied the embed snippet in this session
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  useEffect(() => {
    // We can listen to a custom event or check localStorage to see if they copied the widget snippet
    const handleCopy = () => setCopiedEmbed(true);
    window.addEventListener("proofkit-copied-snippet", handleCopy);
    return () => window.removeEventListener("proofkit-copied-snippet", handleCopy);
  }, []);

  const steps = [
    {
      id: "form",
      title: "Create your collection form",
      description: "Set up the page where customers write their reviews.",
      completed: hasForm,
      link: "/dashboard/forms",
      actionLabel: "Configure form",
      icon: ShieldCheck,
    },
    {
      id: "collect",
      title: "Collect your first testimonial",
      description: "Share your custom link to receive star ratings and testimonials.",
      completed: hasTestimonials,
      link: "/dashboard", // or copy link
      actionLabel: "Get link",
      icon: Share2,
    },
    {
      id: "approve",
      title: "Approve or polish feedback",
      description: "Polish review clarity with AI and toggle approval state to display it.",
      completed: hasApproved,
      link: "/dashboard/testimonials",
      actionLabel: "Review feedback",
      icon: Clipboard,
    },
    {
      id: "embed",
      title: "Embed the Wall of Love on your site",
      description: "Copy and paste the HTML snippet into your landing page or website builder.",
      completed: copiedEmbed || (hasApproved && hasTestimonials), // Fallback to make it easy to clear
      link: "/dashboard/widgets",
      actionLabel: "Get embed snippet",
      icon: Code,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const percent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#ECE7E0]/60 pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Getting Started Roadmap
          </h2>
          <p className="mt-1 text-xs text-[#6B6B6B]">
            Complete these steps to launch your Wall of Love.
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-[#E8743B]">{percent}%</span>
          <span className="text-xs text-[#6B6B6B] block">Complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1.5 w-full rounded-full bg-[#FAF8F5]">
        <div
          className="h-full rounded-full bg-[#E8743B] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="mt-6 space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
                step.completed ? "bg-[#FAF8F5]/40" : "hover:bg-[#FAF8F5]/40"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {step.completed ? (
                  <CheckCircle2 size={18} className="text-[#2E9E6B]" fill="rgba(46,158,107,0.1)" />
                ) : (
                  <Circle size={18} className="text-[#6B6B6B]/40" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    step.completed ? "text-[#6B6B6B] line-through decoration-[#6B6B6B]/30" : "text-[#1A1A1A]"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-[#6B6B6B] leading-relaxed">
                  {step.description}
                </p>
              </div>
              {!step.completed && (
                <Link
                  href={step.link}
                  className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#E8743B] transition-colors hover:text-[#CF5F2C] self-center"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
