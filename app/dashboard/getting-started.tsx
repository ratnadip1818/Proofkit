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
      title: "Approve feedback",
      description: "Toggle approval state to display your reviews in widgets.",
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
    <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
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
            <span className="text-base font-black text-[#E8743B]">{percent}%</span>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase block tracking-wider">Complete</span>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-[#FAF8F5] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E8743B] to-[#F19E6E] transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="mt-6 space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 rounded-2xl p-3 border transition-all duration-200 ${
                  step.completed 
                    ? "bg-[#FAF8F5]/30 border-[#ECE7E0]/20 opacity-80" 
                    : "bg-white border-[#ECE7E0]/40 hover:border-[#E8743B]/30 hover:shadow-[0_4px_12px_rgba(232,116,59,0.02)]"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {step.completed ? (
                    <CheckCircle2 size={18} className="text-[#2E9E6B]" fill="rgba(46,158,107,0.1)" />
                  ) : (
                    <Circle size={18} className="text-zinc-300 group-hover:text-[#E8743B]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold leading-tight ${
                      step.completed ? "text-[#6B6B6B] line-through decoration-[#6B6B6B]/30" : "text-[#1A1A1A]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs text-[#6B6B6B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {!step.completed && (
                  <Link
                    href={step.link}
                    className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-[#E8743B] uppercase tracking-wider transition-colors hover:text-[#CF5F2C] self-center ml-2 border border-[#E8743B]/25 hover:border-[#CF5F2C] rounded-full px-2.5 py-1 bg-white"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight size={10} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
