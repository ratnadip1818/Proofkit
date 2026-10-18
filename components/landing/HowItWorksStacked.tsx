"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Copy, Code2, Link2 } from "lucide-react";

interface StepItem {
  id: string;
  stepNumber: string;
  tabLabel: string;
  subhead: string;
  title: string;
  body: string;
  bullets: string[];
}

const STEPS: StepItem[] = [
  {
    id: "collect",
    stepNumber: "01",
    tabLabel: "Collect",
    subhead: "Step 01 — Collection",
    title: "Collect reviews with a simple link",
    body: "Send your custom link to clients via email, WhatsApp, or social media. They can write a review, leave star ratings, or upload a photo in seconds.",
    bullets: [
      "No login required for customers",
      "Collect star ratings, written quotes & photos",
      "Customise with your logo and brand colors",
    ],
  },
  {
    id: "curate",
    stepNumber: "02",
    tabLabel: "Curate",
    subhead: "Step 02 — Management",
    title: "Approve your best reviews in one place",
    body: "Every review lands in your Blovi dashboard. You choose which ones appear on your site and which ones stay private with a single click.",
    bullets: [
      "One-click approve or hide reviews",
      "Filter by five-star ratings and verified buyers",
      "Search and manage all feedback in one place",
    ],
  },
  {
    id: "publish",
    stepNumber: "03",
    tabLabel: "Publish",
    subhead: "Step 03 — Embed & Share",
    title: "Paste two lines of code into your site",
    body: "Copy the embed snippet and paste it into Framer, Webflow, Shopify, or WordPress. It updates automatically whenever you approve new reviews.",
    bullets: [
      "Two-line copy-paste embed code",
      "Automatically matches your website's style",
      "Updates live without editing your site again",
    ],
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
      className="relative overflow-hidden bg-[#FAF8F5] px-6 py-24 text-[#1A1A1A] md:px-12 md:py-36 border-t border-[#E3E0DB]"
    >
      <div className="relative mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="max-w-[780px] space-y-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
            How it works
          </p>
          <TitleTag
            className="text-balance text-[clamp(2.4rem,4.8vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-[#1A1A1A]"
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
          <p className="max-w-[560px] text-[16px] md:text-[17px] leading-relaxed text-[#787774]">
            Send a link to collect reviews, approve the ones you like, and paste two lines of code onto your website.
          </p>
        </div>

        {/* 3-Tab Selector Pill Bar */}
        <div className="mt-12 flex flex-wrap items-center gap-2 sm:gap-3 rounded-full border border-[#E3E0DB] bg-[#EFECE8] p-1.5 w-fit">
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

        {/* 2-Column Studio Stage (Left: Content, Right: Fixed Consistent Sized Canvas) */}
        <div className="mt-8 rounded-[28px] border border-[#E3E0DB] bg-white p-6 sm:p-10 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Step Description & Bullets */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeStep.id + "-content"}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <div>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                      {activeStep.subhead}
                    </span>
                    <h3
                      className="mt-3 text-[24px] sm:text-[28px] md:text-[32px] font-normal tracking-[-0.035em] leading-[1.14] text-[#1A1A1A]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {activeStep.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] md:text-[15.5px] leading-relaxed text-[#787774]">
                      {activeStep.body}
                    </p>
                  </div>

                  {/* Clean, quiet bullet points */}
                  <div className="space-y-3 border-t border-[#E3E0DB]/60 pt-5">
                    {activeStep.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[13.5px] text-[#1A1A1A]">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Check size={10} strokeWidth={2.5} />
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: 100% Consistent Size Preview Canvas */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl bg-[#FAF8F5] border border-[#E3E0DB] p-3 sm:p-5 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -10 }}
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
/* VISUAL PREVIEW SUBCOMPONENTS (CONSISTENT SIZING)                          */
/* ========================================================================= */

function Step1FormVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-[340px] rounded-2xl bg-white border border-[#E3E0DB] p-3 sm:p-3.5 shadow-xs">
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
    <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[560px] rounded-xl bg-white border border-[#E3E0DB] overflow-hidden shadow-xs">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/80 px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
            <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
            <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
          </div>
          <div className="w-36 truncate rounded-md bg-white px-2.5 py-0.5 text-center font-sans text-[9.5px] font-medium text-gray-400 select-all border border-gray-100">
            blovi.space/manage
          </div>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
            Dashboard
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
    <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[560px] rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xs text-left">
        {/* Back button & Title */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
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

            <div className="rounded-xl border border-gray-200/80 bg-white p-2.5 text-left opacity-70">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-gray-700">
                <Link2 size={13} className="text-gray-400" />
                <span>Link</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                Share your widget by copying a direct link to it.
              </p>
            </div>
          </div>

          {/* Right Side Code Card */}
          <div className="sm:col-span-7 rounded-xl border border-gray-200/90 bg-white p-3 shadow-2xs">
            <p className="text-xs font-bold text-[#1A1A1A]">Embed code</p>
            <p className="mt-0.5 text-[10px] text-gray-500">
              Paste this 2-line code snippet where you want to display the embed on your site.
            </p>

            {/* Dark Snippet Box */}
            <div className="mt-2.5 overflow-hidden rounded-xl bg-[#18181B] p-2.5 text-white">
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
