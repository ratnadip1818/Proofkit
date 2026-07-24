"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check, Sliders, Inbox, Filter, Code, Sparkles, ShieldCheck, Globe, Layers } from "lucide-react";

const STEPS = [
  {
    stepNumber: "01",
    subhead: "Step 01 — Collection",
    title: "Effortlessly collect the social proof you need",
    body: "Share a clean, branded form link or import praise your customers already shared.",
    features: [
      {
        icon: Sliders,
        title: "Customizable Forms",
        desc: "Collect star ratings, quotes, and buyer photos with custom colors."
      },
      {
        icon: Inbox,
        title: "Multi-Platform Import",
        desc: "Pull existing testimonials from Twitter/X, Google Reviews, and LinkedIn."
      },
      {
        icon: Globe,
        title: "Custom Domain",
        desc: "Share collection forms on your own branded domain for a professional look."
      }
    ],
    imageSrc: "/images/step-collect-form.png",
    imageAlt: "Blovi Testimonial Collection Form",
    imageOnLeft: false,
    frameType: "form"
  },
  {
    stepNumber: "02",
    subhead: "Step 02 — Management",
    title: "Manage the customer proof in 1 dashboard",
    body: "All customer feedback lands in one calm workspace so you can select your best proof.",
    features: [
      {
        icon: Filter,
        title: "Centralized Workspace",
        desc: "Organize quotes with status tags, ratings, and customer handles."
      },
      {
        icon: ShieldCheck,
        title: "Smart Verification",
        desc: "Tag verified buyers and display authenticity badges automatically."
      }
    ],
    imageSrc: "/images/step-manage-table.png",
    imageAlt: "Blovi Testimonials Management Dashboard",
    imageOnLeft: true,
    frameType: "browser"
  },
  {
    stepNumber: "03",
    subhead: "Step 03 — Publishing",
    title: "Showcase proof anywhere & boost conversions",
    body: "Showcase your customer proof on any website with one simple line of code.",
    features: [
      {
        icon: Layers,
        title: "Wall of Love Widgets",
        desc: "Display responsive testimonial grids that match your brand perfectly."
      },
      {
        icon: Globe,
        title: "No-Code Integration",
        desc: "Paste 1 snippet into Framer, Webflow, Shopify, or Next.js in seconds."
      }
    ],
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
        <div className="flex flex-col gap-24 md:gap-36">
          {STEPS.map((step) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: reduced ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
            >
              {/* Text Left / Visual Right */}
              {!step.imageOnLeft ? (
                <>
                  {/* Left Column: Rich Senja-Style Typography & Micro-Features */}
                  <div className="lg:col-span-6 flex flex-col justify-center gap-6 lg:ml-auto lg:mr-0 max-w-[500px]">
                    <div>
                      <p
                        className="text-[16px] font-medium italic text-[#2563EB] mb-2"
                        style={{ fontFamily: "var(--font-serif-accent)" }}
                      >
                        {step.subhead}
                      </p>
                      <h3
                        className="text-[28px] sm:text-[36px] md:text-[40px] font-extrabold tracking-[-0.035em] leading-[1.1] text-[#173b71]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-[#587091]">
                        {step.body}
                      </p>
                    </div>

                    {/* Senja-Style Micro Feature Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200/70">
                      {step.features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                          <div key={i} className="space-y-1.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-100/80 shadow-2xs">
                              <Icon size={17} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                            <p className="text-[11.5px] leading-relaxed text-slate-500">{feat.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Uniform Background Canvas Card Container */}
                  <div className="lg:col-span-6">
                    <UniformCanvasFrame step={step} />
                  </div>
                </>
              ) : (
                /* Visual Left / Text Right (Alternating) */
                <>
                  {/* Left Column: Uniform Background Canvas Card Container */}
                  <div className="lg:col-span-6 order-2 lg:order-1">
                    <UniformCanvasFrame step={step} />
                  </div>

                  {/* Right Column: Rich Senja-Style Typography & Micro-Features */}
                  <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center gap-6 lg:mr-auto lg:ml-0 max-w-[500px]">
                    <div>
                      <p
                        className="text-[16px] font-medium italic text-[#2563EB] mb-2"
                        style={{ fontFamily: "var(--font-serif-accent)" }}
                      >
                        {step.subhead}
                      </p>
                      <h3
                        className="text-[28px] sm:text-[36px] md:text-[40px] font-extrabold tracking-[-0.035em] leading-[1.1] text-[#173b71]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-[#587091]">
                        {step.body}
                      </p>
                    </div>

                    {/* Senja-Style Micro Feature Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200/70">
                      {step.features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                          <div key={i} className="space-y-1.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-100/80 shadow-2xs">
                              <Icon size={17} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                            <p className="text-[11.5px] leading-relaxed text-slate-500">{feat.desc}</p>
                          </div>
                        );
                      })}
                    </div>
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

{/* UNIFORM BACKGROUND CANVAS FRAME CONTAINER FOR PERFECT 100% VISUAL CONSISTENCY */}
function UniformCanvasFrame({ step }: { step: typeof STEPS[0] }) {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Soft Ambient Glow */}
      <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[#2563EB]/10 to-transparent blur-2xl opacity-60" />

      {/* Uniform Rectangle Background Card Frame */}
      <div className="relative w-full rounded-[30px] border border-slate-200/90 bg-[#FAF8F5] p-4 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_24px_55px_rgba(0,0,0,0.1)] hover:border-blue-300">
        
        {step.frameType === "custom" ? (
          <ShowcaseCodeBox />
        ) : step.frameType === "browser" ? (
          /* Step 2 Browser Dashboard Mockup Frame (Borderless, seamless like Step 3) */
          <div className="w-full rounded-[20px] bg-white overflow-hidden">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/80 px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
              </div>
              <div className="w-36 truncate rounded-md bg-white/80 px-2.5 py-0.5 text-center font-sans text-[9.5px] font-medium text-gray-400 select-all">
                app.blovi.space/manage
              </div>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Dashboard</span>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.imageSrc}
              alt={step.imageAlt}
              className="w-full h-auto object-contain block"
            />
          </div>
        ) : (
          /* Step 1 Collection Form (Direct, no inner container) */
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.imageSrc}
              alt={step.imageAlt}
              className="w-full max-w-[340px] h-auto object-contain block"
            />
          </div>
        )}

      </div>
    </div>
  );
}

{/* Showcase Embed Code Box Component */}
function ShowcaseCodeBox() {
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
    <div className="w-full overflow-hidden rounded-[22px] border border-slate-800 bg-[#0f172a] text-white shadow-md">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
          <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
        </div>
        <span className="font-mono text-[10px] font-semibold text-slate-400">
          Embed Code Snippet
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-blue-600 active:scale-95 cursor-pointer shadow-xs"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          <span>{copied ? "Copied!" : "Copy Code"}</span>
        </button>
      </div>

      {/* Code Display */}
      <div className="p-3.5 font-mono text-[10.5px] leading-relaxed text-blue-100 select-all overflow-x-auto">
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
  );
}
