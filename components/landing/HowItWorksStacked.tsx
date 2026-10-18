"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  Copy,
  Code2,
  Link2,
  Mail,
  MessageCircle,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

interface StepItem {
  id: string;
  stepNumber: string;
  tabLabel: string;
  subhead: string;
  title: string;
  body: string;
  actionPill: string;
  actionNote: string;
  promptBubble: {
    role: string;
    text: string;
  };
  previewLabel: string;
}

const STEPS: StepItem[] = [
  {
    id: "collect",
    stepNumber: "01",
    tabLabel: "Collect",
    subhead: "Step 01 — Collection",
    title: "Collect genuine reviews with a simple link.",
    body: "Send your custom link to clients via WhatsApp, email, or social media. They can leave star ratings, heartfelt quotes, and photos in seconds.",
    actionPill: "Share collection link",
    actionNote: "No login required for your customers",
    promptBubble: {
      role: "Client",
      text: "Blovi made sharing our feedback ridiculously easy — took less than 30 seconds!",
    },
    previewLabel: "3 collection formats ready",
  },
  {
    id: "curate",
    stepNumber: "02",
    tabLabel: "Curate",
    subhead: "Step 02 — Management",
    title: "Approve your best proof in one calm place.",
    body: "Every testimonial lands in your Blovi inbox. Filter by five-star reviews, approve client stories with a single click, or keep private notes.",
    actionPill: "One-click approval",
    actionNote: "Filter by five stars & verified buyers",
    promptBubble: {
      role: "Founder",
      text: "Show only five-star testimonials from verified buyers on our pricing page",
    },
    previewLabel: "Found 9 approved testimonials",
  },
  {
    id: "publish",
    stepNumber: "03",
    tabLabel: "Publish",
    subhead: "Step 03 — Embed & Share",
    title: "Paste two lines of code into any website.",
    body: "Copy your ready-made snippet and drop it into Framer, Webflow, Shopify, or WordPress. It syncs live without you touching code again.",
    actionPill: "Copy embed snippet",
    actionNote: "Updates automatically with zero rebuilds",
    promptBubble: {
      role: "Developer",
      text: "Embed Wall of Love widget with live updating social proof",
    },
    previewLabel: "Live embed ready · 2 lines of code",
  },
];

export default function HowItWorksStacked({
  titleAs: TitleTag = "h2",
}: {
  titleAs?: "h1" | "h2";
} = {}) {
  const [activeTab, setActiveTab] = useState(0);
  const reduced = useReducedMotion();
  const activeStep = STEPS[activeTab];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-6 py-24 text-[#1A1A1A] md:px-12 md:py-36 border-t border-[#E3E0DB]"
    >
      <div className="relative mx-auto max-w-[1240px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[#E3E0DB]/80">
          <div className="max-w-[720px] space-y-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
              How it works
            </p>
            <TitleTag
              className="text-balance text-[clamp(2.4rem,4.5vw,4.25rem)] font-normal leading-[1.05] tracking-[-0.04em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three quiet steps.{" "}
              <span
                className="font-serif-accent font-normal italic text-[#2563EB]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                Zero friction social proof.
              </span>
            </TitleTag>
          </div>

          {/* Mobbin-Inspired Step Switcher Pill Bar */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#E3E0DB] bg-[#EFECE8] p-1.5 self-start md:self-auto">
            {STEPS.map((step, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-[#1A1A1A] shadow-xs"
                      : "text-[#787774] hover:text-[#1A1A1A]"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      isActive ? "text-[#2563EB]" : "text-[#787774]"
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span>{step.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBBIN-INSPIRED 2-COLUMN STUDIO STAGE */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Clean, Bold Information */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStep.id + "-info"}
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
                    {activeStep.subhead}
                  </span>
                  <h3
                    className="text-[32px] sm:text-[38px] lg:text-[42px] font-bold tracking-[-0.035em] leading-[1.1] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeStep.title}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#787774] max-w-[480px]">
                    {activeStep.body}
                  </p>
                </div>

                {/* Mobbin-Style Action Pill + Helper Note */}
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EFECE8] border border-[#E3E0DB] px-5 py-2.5 text-xs font-semibold text-[#1A1A1A] shadow-2xs transition hover:bg-[#E3E0DB] select-none">
                    <span>{activeStep.actionPill}</span>
                    <ArrowRight size={13} className="text-[#787774]" />
                  </div>
                  <span className="text-xs text-[#787774] font-medium">
                    {activeStep.actionNote}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Platform / Feature Icon Strip (Mobbin Style) */}
            <div className="pt-6 border-t border-[#E3E0DB]/60">
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#787774] mb-3.5">
                {activeTab === 0
                  ? "Share collection link via"
                  : activeTab === 1
                  ? "Curation toolset"
                  : "Works with any stack"}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#787774]">
                {activeTab === 0 && (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <MessageCircle size={17} className="text-[#2563EB]" />
                      <span className="font-medium">WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <Mail size={17} />
                      <span className="font-medium">Email</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="font-medium">X (Twitter)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="font-medium">LinkedIn</span>
                    </div>
                  </>
                )}

                {activeTab === 1 && (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span className="font-medium">5-Star Filter</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <ShieldCheck size={17} className="text-emerald-600" />
                      <span className="font-medium">Verified Badges</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <CheckCircle2 size={17} className="text-[#2563EB]" />
                      <span className="font-medium">1-Click Approve</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <Sparkles size={16} className="text-indigo-500" />
                      <span className="font-medium">Sentiment</span>
                    </div>
                  </>
                )}

                {activeTab === 2 && (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
                      </svg>
                      <span className="font-medium">Framer</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <svg className="w-4 h-3 fill-current" viewBox="0 0 24 16">
                        <path d="M23.992 0L17.75 16h-5.263l2.846-7.234h-.132C13.253 11.23 10.985 13.6 7.425 14.153L9.61 0H4.72L1.873 9.423H1.74L0 0h4.72l1.625 5.372h.133C8.425 2.8 10.693.43 14.253 0h9.739z"/>
                      </svg>
                      <span className="font-medium">Webflow</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19.5 7.5L16 4.5h-2c-.3 0-.6.1-.8.4L11 8.5 8.5 7.7l-4.5 14L19.5 24V7.5z"/>
                      </svg>
                      <span className="font-medium">Shopify</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12c0-6.627-5.373-12-12-12zm-8.85 12c0-1.897.604-3.654 1.63-5.093l4.78 13.1C5.748 18.23 3.15 15.42 3.15 12zm8.85 8.85c-1.393 0-2.69-.345-3.83-.952l4.032-11.71 4.135 11.325c-.06.01-.12.022-.182.032-.71.198-1.503.305-2.155.305zm6.542-4.526l-2.616-7.575c.575-.03 1.1-.09 1.1-.09.52-.06.46-.84-.06-.81 0 0-1.558.12-2.578.12-1 0-2.55-.12-2.55-.12-.52-.03-.58.75-.06.81 0 0 .5.06 1.04.09l3.89 10.638c1.11-1.36 1.834-3.085 1.834-4.963z"/>
                      </svg>
                      <span className="font-medium">WordPress</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] transition">
                      <Code2 size={15} className="text-[#2563EB]" />
                      <span className="font-medium">HTML / React</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Mobbin-Style Soft-Rounded Canvas Container */}
          <div className="lg:col-span-7">
            <div className="relative w-full min-h-[480px] sm:min-h-[520px] rounded-[32px] md:rounded-[40px] bg-[#FAF8F5] border border-[#E3E0DB] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-xs">
              
              {/* TOP ROW: Message Prompt Bubble (Mobbin-style) */}
              <div className="w-full flex justify-end">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStep.id + "-bubble"}
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-[420px] rounded-2xl rounded-tr-xs bg-[#EFECE8] border border-[#E3E0DB] px-4 py-3 text-xs sm:text-[13px] text-[#1A1A1A] shadow-2xs"
                  >
                    <span className="font-semibold text-[#2563EB] mr-1.5">
                      {activeStep.promptBubble.role}:
                    </span>
                    <span className="text-[#1A1A1A] font-medium leading-relaxed">
                      &ldquo;{activeStep.promptBubble.text}&rdquo;
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* MIDDLE ROW: Preview Subhead Label */}
              <div className="my-4">
                <span className="text-xs font-semibold text-[#787774] tracking-tight">
                  {activeStep.previewLabel}
                </span>
              </div>

              {/* MAIN VISUAL STAGE */}
              <div className="relative w-full flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStep.id + "-visual"}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {activeTab === 0 && <Step1FormVisual />}
                    {activeTab === 1 && <Step2DashboardVisual />}
                    {activeTab === 2 && <Step3ShareVisual />}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ========================================================================= */
/* VISUAL PREVIEW SUBCOMPONENTS                                              */
/* ========================================================================= */

function Step1FormVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-2">
      <div className="relative w-full max-w-[340px] rounded-2xl bg-white border border-[#E3E0DB] p-3 sm:p-3.5 shadow-xs transition-transform duration-300 hover:scale-[1.02]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/step-collect-form.png"
          alt="Blovi Collection Form"
          className="w-full h-auto object-contain block rounded-xl"
        />
      </div>
    </div>
  );
}

function Step2DashboardVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-2">
      <div className="w-full max-w-[560px] rounded-xl bg-white border border-[#E3E0DB] overflow-hidden shadow-xs transition-transform duration-300 hover:scale-[1.01]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E3E0DB]/80 bg-[#FAF8F5] px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
            <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
            <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
          </div>
          <div className="w-36 truncate rounded-md bg-white px-2.5 py-0.5 text-center font-sans text-[9.5px] font-medium text-[#787774] select-all border border-[#E3E0DB]/60">
            blovi.space/manage
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/step-manage-table.png"
          alt="Blovi Manage Dashboard"
          className="w-full h-auto object-contain block"
        />
      </div>
    </div>
  );
}

function Step3ShareVisual() {
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="https://www.blovi.space/widget.js" data-user="6e037975-54db-4705-b239-20ef10f95eb8" data-type="stack" async></script>\n<div id="blovi-widget" data-widget-id="6e037975-54db-4705-b239-20ef10f95eb8" style="position: fixed; bottom: 24px; left: 24px; z-index: 9999; max-width: 420px; width: 100%;"></div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center p-2">
      <div className="w-full max-w-[560px] rounded-2xl border border-[#E3E0DB] bg-white p-4 sm:p-5 shadow-xs text-left">
        {/* Back button & Title */}
        <div className="flex items-center gap-1.5 text-xs text-[#787774] font-medium">
          <span>← Back</span>
        </div>
        <h4 className="mt-1.5 text-base sm:text-lg font-bold tracking-tight text-[#1A1A1A]">
          Share your widget
        </h4>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
          {/* Left Side Tab Options */}
          <div className="sm:col-span-5 space-y-2">
            <div className="rounded-xl border border-blue-200 bg-[#F0F6FF] p-2.5 text-left">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-blue-900">
                <Code2 size={13} className="text-[#2563EB]" />
                <span>Embed code</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-blue-700/80">
                Copy the embed code for your widget and paste it into your website.
              </p>
            </div>

            <div className="rounded-xl border border-[#E3E0DB] bg-white p-2.5 text-left opacity-70">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#787774]">
                <Link2 size={13} className="text-[#787774]" />
                <span>Link</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-[#787774]">
                Share your widget by copying a direct link to it.
              </p>
            </div>
          </div>

          {/* Right Side Code Card */}
          <div className="sm:col-span-7 rounded-xl border border-[#E3E0DB] bg-white p-3 shadow-2xs">
            <p className="text-xs font-bold text-[#1A1A1A]">Embed code</p>
            <p className="mt-0.5 text-[10px] text-[#787774]">
              Paste this 2-line code snippet where you want to display the embed on your site.
            </p>

            {/* Dark Snippet Box */}
            <div className="mt-2.5 overflow-hidden rounded-xl bg-[#1A1A1A] p-2.5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5 text-[9.5px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Javascript
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md bg-[#2563EB] px-2 py-0.5 text-[9.5px] font-semibold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer shadow-xs"
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  <span>{copied ? "Copied!" : "Copy snippet"}</span>
                </button>
              </div>
              <pre className="font-mono text-[9px] leading-relaxed text-gray-300 overflow-x-auto whitespace-pre-wrap break-all select-all">
                <code>{snippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
