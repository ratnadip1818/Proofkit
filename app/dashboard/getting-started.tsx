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
            <span className="text-base font-black text-[#2563EB]">{percent}%</span>
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase block tracking-wider">Complete</span>
          </div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-[#FAF8F5] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-2xl p-3 border transition-all duration-200 ${
                step.completed 
                  ? "bg-[#FAF8F5]/30 border-[#ECE7E0]/20 opacity-80" 
                  : "bg-white border-[#ECE7E0]/40 hover:border-[#2563EB]/30 hover:shadow-[0_4px_12px_rgba(37,99,235,0.02)]"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {step.completed ? (
                  <CheckCircle2 size={18} className="text-[#2E9E6B]" fill="rgba(46,158,107,0.1)" />
                ) : (
                  <Circle size={18} className="text-zinc-300 group-hover:text-[#2563EB]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${step.completed ? "text-[#8A8A8A] line-through" : "text-[#1A1A1A]"}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-[#6B6B6B] truncate mt-0.5">
                  {step.description}
                </p>
              </div>
              {!step.completed && (
                <Link
                  href={step.link}
                  className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider transition-colors hover:text-[#1d4ed8] self-center ml-2 border border-[#2563EB]/25 hover:border-[#1d4ed8] rounded-full px-2.5 py-1 bg-white"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight size={10} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
