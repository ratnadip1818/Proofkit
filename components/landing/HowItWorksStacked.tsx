"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Copy, Code2, Link2 } from "lucide-react";

interface StepItem {
  id: string;
  stepNumber: string;
  tabLabel: string;
  title: string;
  body: string;
  bullets: string[];
}

const STEPS: StepItem[] = [
  {
    id: "collect",
    stepNumber: "01",
    tabLabel: "Collect",
    title: "Collect reviews with a simple link",
    body: "Send your custom link to clients via email, WhatsApp, or social media. They can write a review, leave star ratings, or upload a photo in seconds.",
    bullets: [
      "No login required for customers",
      "Star ratings, quotes & photos",
      "Custom colors and logo",
    ],
  },
  {
    id: "curate",
    stepNumber: "02",
    tabLabel: "Curate",
    title: "Approve your best reviews in one place",
    body: "Every review lands in your Blovi dashboard. You choose which ones appear on your site and which ones stay private with a single click.",
    bullets: [
      "One-click approve or hide",
      "Filter five-star reviews",
      "Auto-tag verified buyers",
    ],
  },
  {
    id: "publish",
    stepNumber: "03",
    tabLabel: "Publish",
    title: "Paste two lines of code into your site",
    body: "Copy the embed snippet and paste it into Framer, Webflow, Shopify, or WordPress. It updates automatically whenever you approve new reviews.",
    bullets: [
      "Two-line copy-paste embed",
      "Matches your site's style",
      "Updates live without redeploying",
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
      className="relative overflow-hidden bg-[#FAF8F5] px-6 py-24 text-[#141413] md:px-12 md:py-36 border-t border-[#EAE6DF]"
    >
      <div className="relative mx-auto max-w-[1240px]">
        {/* Centered Section Header */}
        <div className="mx-auto max-w-[780px] text-center space-y-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#63724E]">
            How it works
          </p>
          <TitleTag
            className="text-balance text-[clamp(2.4rem,4.8vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-[#141413]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three simple steps to show{" "}
            <span
              className="font-serif-accent font-normal italic text-[#2563EB]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              real customer proof.
            </span>
          </TitleTag>
          <p className="mx-auto max-w-[560px] text-[16px] md:text-[17px] leading-relaxed text-[#6E6C68]">
            Send a link to collect reviews, approve the ones you like, and paste two lines of code onto your website.
          </p>
        </div>

        {/* Centered 3-Tab Selector Pill Bar */}
        <div className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border border-[#E5E0D8] bg-[#F3EFE7] p-1.5 w-fit">
          {STEPS.map((step, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-[#141413] shadow-xs"
                    : "text-[#6E6C68] hover:text-[#141413]"
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-medium ${
                    isActive ? "text-[#2563EB]" : "text-[#9A9893]"
                  }`}
                >
                  {step.stepNumber}
                </span>
                <span>{step.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Description (Centered, Simple & Real) */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep.id + "-info"}
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-[620px] text-center space-y-2.5"
          >
            <h3
              className="text-[22px] sm:text-[26px] font-normal tracking-[-0.03em] text-[#141413]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {activeStep.title}
            </h3>
            <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#6E6C68]">
              {activeStep.body}
            </p>

            {/* Simple Feature Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {activeStep.bullets.map((bullet, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E0D8] bg-[#F4F0E8]/70 px-3 py-1 text-[12px] font-medium text-[#4D4B46]"
                >
                  <Check size={11} className="text-emerald-600" strokeWidth={2.5} />
                  {bullet}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Centered Showcase Stage with Soft Ambient Edge Fade (Not a Sharp Hard Card) */}
        <div className="relative mx-auto mt-10 w-full max-w-[840px] rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#F2ECE1]/50 via-[#F7F3EB]/30 to-transparent p-2.5 sm:p-5">
          {/* Ambient Center Glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(250,248,245,0.4)_65%,transparent_100%)] blur-xl" />

          {/* Consistent Size Frame (Uniform 440px Height across all 3 steps) */}
          <div className="relative w-full h-[420px] sm:h-[450px] flex items-center justify-center overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#EAE6DF]/70 bg-gradient-to-b from-white/90 to-[#FAF8F5]/70 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.04)] backdrop-blur-xs">
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
    </section>
  );
}

/* ========================================================================= */
/* VISUAL PREVIEW SUBCOMPONENTS (UNIFORM SIZING & SOFT AMBIENT CENTERING)    */
/* ========================================================================= */

function Step1FormVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-[340px] rounded-2xl bg-white p-3 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#EAE6DF]">
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
    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[640px] rounded-2xl bg-white border border-[#EAE6DF] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
            <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
            <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
          </div>
          <div className="w-36 truncate rounded-md bg-white px-2.5 py-0.5 text-center font-sans text-[9.5px] font-medium text-gray-400 select-all border border-gray-100">
            blovi.space/manage
          </div>
          <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider">
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
    <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[640px] rounded-2xl bg-white border border-[#EAE6DF] p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] text-left">
        {/* Back button & Title */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span>← Back</span>
        </div>
        <h4 className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-[#141413]">
          Share your widget
        </h4>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* Left Side Tab Options */}
          <div className="sm:col-span-5 space-y-2.5">
            <div className="rounded-xl border border-blue-200 bg-[#F0F6FF] p-3 text-left">
              <div className="flex items-center gap-2 font-semibold text-xs text-blue-900">
                <Code2 size={13} className="text-[#2563EB]" />
                <span>Embed code</span>
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-blue-700/80">
                Copy the embed code for your widget and paste it into your website.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200/80 bg-white p-3 text-left opacity-70">
              <div className="flex items-center gap-2 font-semibold text-xs text-gray-700">
                <Link2 size={13} className="text-gray-400" />
                <span>Link</span>
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-gray-500">
                Share your widget by copying a direct link to it.
              </p>
            </div>
          </div>

          {/* Right Side Code Card */}
          <div className="sm:col-span-7 rounded-xl border border-gray-200/90 bg-white p-3.5 sm:p-4 shadow-2xs">
            <p className="text-xs font-bold text-[#141413]">Embed code</p>
            <p className="mt-0.5 text-[10.5px] text-gray-500">
              Paste this 2-line code snippet where you want to display the embed on your site.
            </p>

            {/* Dark Snippet Box */}
            <div className="mt-3 overflow-hidden rounded-xl bg-[#141413] p-3 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Javascript
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md bg-[#2563EB] px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer shadow-xs"
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copied ? "Copied!" : "Copy snippet"}</span>
                </button>
              </div>
              <pre className="font-mono text-[9.5px] leading-relaxed text-gray-300 overflow-x-auto whitespace-pre-wrap break-all select-all">
                <code>{snippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
