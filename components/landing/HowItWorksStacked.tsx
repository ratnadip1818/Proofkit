"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check, Star } from "lucide-react";

const STEPS = [
  {
    stepNumber: "01",
    subhead: "Step 01 — Collection",
    title: "Collect",
    body: "Share your form link with customers. They write a review, give a rating, done.",
    imageSrc: "/images/step-collect-form.png",
    imageAlt: "Blovi Testimonial Collection Form",
    imageOnLeft: false,
    frameType: "form"
  },
  {
    stepNumber: "02",
    subhead: "Step 02 — Management",
    title: "Manage",
    body: "All reviews land in one dashboard. Pick the best ones to showcase.",
    imageSrc: "/images/step-manage-table.png",
    imageAlt: "Blovi Testimonials Management Dashboard",
    imageOnLeft: true,
    frameType: "browser"
  },
  {
    stepNumber: "03",
    subhead: "Step 03 — Publishing",
    title: "Showcase",
    body: "Paste one line of code on your site. Your Wall of Love goes live instantly.",
    imageSrc: "",
    imageAlt: "Blovi Custom Showcase Visual",
    imageOnLeft: false,
    frameType: "custom"
  }
];

export default function HowItWorksStacked({ titleAs: TitleTag = "h2" }: { titleAs?: "h1" | "h2" } = {}) {
  const reduced = useReducedMotion();

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#fdfbf7] px-5 py-24 md:px-10 md:py-36">
      {/* Soft Blovi blue background glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-[30rem] w-[75rem] -translate-x-1/2 rounded-full bg-[#dbeafe]/60 opacity-70 blur-3xl" />

      <div className="relative mx-auto max-w-[1180px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[720px] text-center mb-20 md:mb-28"
        >
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
            How it works
          </p>
          <TitleTag
            className="mt-4 text-balance text-[clamp(2.65rem,5.1vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-[#173b71]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three simple steps. <br />
            <span
              className="font-serif-accent font-normal italic text-[#2563EB]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              Zero friction social proof.
            </span>
          </TitleTag>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[#587091] md:text-[17px]">
            Collect authentic feedback, manage responses in one calm workspace, and publish proof live on your website.
          </p>
        </motion.div>

        {/* 3 Alternating Step Rows */}
        <div className="flex flex-col gap-24 md:gap-32">
          {STEPS.map((step) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: reduced ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8"
            >
              {/* Text Left / Image Right */}
              {!step.imageOnLeft ? (
                <>
                  <div className="lg:col-span-5 flex flex-col justify-center gap-4 lg:ml-auto lg:mr-0 max-w-[440px]">
                    <p
                      className="text-[17px] font-normal italic text-[#2563EB]"
                      style={{ fontFamily: "var(--font-serif-accent)" }}
                    >
                      {step.subhead}
                    </p>
                    <h3 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] text-[#173b71]">
                      {step.title}
                    </h3>
                    <p className="text-[16px] md:text-[18px] font-normal leading-relaxed text-[#587091] max-w-[460px]">
                      {step.body}
                    </p>
                  </div>
                  <div className="lg:col-span-7">
                    {step.frameType === "custom" ? (
                      <ShowcaseVisual />
                    ) : (
                      <ScreenshotFrame step={step} />
                    )}
                  </div>
                </>
              ) : (
                /* Image Left / Text Right (Alternating) */
                <>
                  <div className="lg:col-span-7 order-2 lg:order-1">
                    {step.frameType === "custom" ? (
                      <ShowcaseVisual />
                    ) : (
                      <ScreenshotFrame step={step} />
                    )}
                  </div>
                  <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center gap-4 lg:mr-auto lg:ml-0 max-w-[440px]">
                    <p
                      className="text-[17px] font-normal italic text-[#2563EB]"
                      style={{ fontFamily: "var(--font-serif-accent)" }}
                    >
                      {step.subhead}
                    </p>
                    <h3 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold tracking-[-0.04em] leading-[1.05] text-[#173b71]">
                      {step.title}
                    </h3>
                    <p className="text-[16px] md:text-[18px] font-normal leading-relaxed text-[#587091] max-w-[460px]">
                      {step.body}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* Custom Showcase Visual Component for Step 3 */}
function ShowcaseVisual() {
  const [copied, setCopied] = useState(false);

  const exactEmbedCode = `<!-- Blovi Widget: WALL OF LOVE (BASE PRESET) -->
<div id="proofkit-widget" data-widget-id="6cfa32bf-191c-4507-8ddd-542912b35993"></div>
<script 
  src="https://www.blovi.space/widget.js" 
  data-user="6cfa32bf-191c-4507-8ddd-542912b35993"
  data-type="wall"
  data-preset="base"
  data-theme="light"
  data-accent="#2564EB"
  data-text-color="#374151"
  data-rating-color="#FBBF24"
  data-rating-border-color="#4E46E5"
  data-highlight-color="#FFCD3640"
  data-show-photos="true"
  data-use-gravatar="true"
  data-fallback-avatar="Placeholder"
  data-show-branding="true"
  data-max="9"
  defer>
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exactEmbedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] text-white shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className="font-mono text-[10.5px] font-semibold text-slate-400">
            Embed Code Snippet
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer shadow-xs"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        {/* Full Code Display */}
        <div className="p-4 font-mono text-[11px] leading-relaxed text-blue-100 select-all overflow-x-auto">
          <span className="text-slate-500">&lt;!-- Blovi Widget: WALL OF LOVE (BASE PRESET) --&gt;</span>
          <br />
          <span className="text-pink-400">&lt;div</span>{" "}
          <span className="text-amber-300">id</span>=
          <span className="text-emerald-300">&quot;proofkit-widget&quot;</span>{" "}
          <span className="text-amber-300">data-widget-id</span>=
          <span className="text-emerald-300">&quot;6cfa32bf-191c-4507-8ddd-542912b35993&quot;</span>
          <span className="text-pink-400">&gt;&lt;/div&gt;</span>
          <br />
          <span className="text-pink-400">&lt;script</span>
          <br />
          {"  "}<span className="text-amber-300">src</span>=<span className="text-emerald-300">&quot;https://www.blovi.space/widget.js&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-user</span>=<span className="text-emerald-300">&quot;6cfa32bf-191c-4507-8ddd-542912b35993&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-type</span>=<span className="text-emerald-300">&quot;wall&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-preset</span>=<span className="text-emerald-300">&quot;base&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-theme</span>=<span className="text-emerald-300">&quot;light&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-accent</span>=<span className="text-emerald-300">&quot;#2564EB&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-text-color</span>=<span className="text-emerald-300">&quot;#374151&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-rating-color</span>=<span className="text-emerald-300">&quot;#FBBF24&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-rating-border-color</span>=<span className="text-emerald-300">&quot;#4E46E5&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-highlight-color</span>=<span className="text-emerald-300">&quot;#FFCD3640&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-show-photos</span>=<span className="text-emerald-300">&quot;true&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-use-gravatar</span>=<span className="text-emerald-300">&quot;true&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-fallback-avatar</span>=<span className="text-emerald-300">&quot;Placeholder&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-show-branding</span>=<span className="text-emerald-300">&quot;true&quot;</span>
          <br />
          {"  "}<span className="text-amber-300">data-max</span>=<span className="text-emerald-300">&quot;9&quot;</span>
          <br />
          {"  "}<span className="text-purple-300">defer</span>
          <span className="text-pink-400">&gt;</span>
          <br />
          <span className="text-pink-400">&lt;/script&gt;</span>
        </div>
      </div>
    </div>
  );
}

{/* High-Resolution Screenshot Frame Container */}
function ScreenshotFrame({ step }: { step: typeof STEPS[0] }) {
  const containerMaxWidth = 
    step.stepNumber === "01" 
      ? "max-w-[420px]" 
      : "max-w-[560px]";

  return (
    <div className={`relative w-full ${containerMaxWidth} mx-auto flex justify-center`}>
      {/* Decorative Outer Aura */}
      <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[#2563EB]/10 to-transparent blur-xl opacity-60" />

      {/* Frame Container */}
      <div className="relative w-full overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition duration-300 hover:shadow-[0_28px_60px_rgba(0,0,0,0.12)]">
        
        {/* Browser Top Bar for Table */}
        {step.frameType === "browser" ? (
          <div className="border border-gray-200/90 bg-white rounded-[24px] overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/90 px-4 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
              </div>
              <div className="w-44 truncate rounded-md border border-gray-200/70 bg-white px-3 py-0.5 text-center font-sans text-[10px] font-medium text-gray-400 select-all shadow-2xs">
                app.blovi.space/manage
              </div>
              <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider">Dashboard</span>
            </div>

            {/* Inset screenshot container prevents bottom border bleeding */}
            <div className="relative w-full p-2 bg-[#faf9f6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={step.imageSrc}
                alt={step.imageAlt}
                className="w-full h-auto object-contain rounded-b-[16px] rounded-t-md border border-gray-200/70 shadow-2xs block"
              />
            </div>
          </div>
        ) : (
          /* Step 1 Collection Form: Clean single container, zero double borders */
          <div className="relative w-full rounded-[24px] border border-gray-200/80 bg-white p-1.5 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.imageSrc}
              alt={step.imageAlt}
              className="w-full h-auto object-contain rounded-[20px] block"
            />
          </div>
        )}
      </div>
    </div>
  );
}
