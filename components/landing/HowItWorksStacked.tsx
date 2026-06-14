"use client";

import { useRef } from "react";
import { Link2, Sparkles, Code2 } from "lucide-react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";
import Reveal from "./Reveal";

const STEPS = [
  {
    num: "01",
    icon: Link2,
    title: "Collect",
    desc: "Share your collection form link with customers. They fill out a short form — name, role, rating and their testimonial. No login needed on their end.",
    theme: {
      card: "bg-white border border-[#ECE7E0]",
      num: "text-[#ECE7E0]",
      title: "text-[#1A1A1A]",
      desc: "text-[#6B6B6B]",
      iconWrap: "bg-[#E8743B]/10",
      icon: "text-[#E8743B]",
    },
    visual: (
      <div className="w-full max-w-[280px] space-y-3 rounded-2xl border border-[#ECE7E0] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-left">
        {/* Photo upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-semibold text-[#1A1A1A]">
            Your photo <span className="font-normal text-[#6B6B6B]">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0]">
              <svg
                className="h-3.5 w-3.5 text-[#D9D3CB]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div className="rounded border border-[#ECE7E0] bg-white px-2 py-0.5 text-[8px] font-medium text-[#6B6B6B]">
              Upload photo
            </div>
          </div>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-semibold text-[#1A1A1A]">
            Your name <span className="text-red-500">*</span>
          </label>
          <div className="rounded-md border border-[#ECE7E0] bg-[#FAF8F5] px-2.5 py-1.5 text-[9px] text-[#6B6B6B]">
            Maria Kowalski
          </div>
        </div>

        {/* Role input */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-semibold text-[#1A1A1A]">
            Your role <span className="font-normal text-[#6B6B6B]">(optional)</span>
          </label>
          <div className="rounded-md border border-[#ECE7E0] bg-[#FAF8F5] px-2.5 py-1.5 text-[9px] text-[#6B6B6B]">
            Founder, Lume
          </div>
        </div>

        {/* Rating input */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-semibold text-[#1A1A1A]">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-0.5 text-xs text-[#E8743B]">★★★★★</div>
        </div>

        {/* Testimonial input */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-semibold text-[#1A1A1A]">
            Your testimonial <span className="text-red-500">*</span>
          </label>
          <div className="h-12 rounded-md border border-[#ECE7E0] bg-[#FAF8F5] px-2.5 py-1 text-[9px] leading-relaxed text-[#6B6B6B] overflow-hidden">
            luv this app, saved me so much time…
          </div>
        </div>

        {/* Submit button */}
        <div className="rounded-md bg-[#E8743B] py-2 text-center text-[9px] font-bold text-white shadow-sm">
          Submit testimonial
        </div>
      </div>
    ),
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Polish",
    desc: "Approve testimonials in your dashboard and improve any of them with one click using AI. The original is always preserved — you choose what goes live.",
    theme: {
      card: "bg-[#16161D] border border-white/10",
      num: "text-white/10",
      title: "text-white",
      desc: "text-[#9CA3AF]",
      iconWrap: "bg-[#E8743B]/20",
      icon: "text-[#E8743B]",
    },
    visual: (
      <div className="w-full max-w-[280px] space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Original</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/60">
            “luv this app, saved me so much time tbh”
          </p>
        </div>
        <div className="flex justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8743B] shadow-lg">
            <Sparkles size={15} className="text-white" />
          </span>
        </div>
        <div className="rounded-2xl border border-[#E8743B]/50 bg-white p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#E8743B]">AI-improved</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#1A1A1A]">
            “I love this app — it saved me so much time.”
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "03",
    icon: Code2,
    title: "Embed",
    desc: "Paste one script tag — your Wall of Love (or Carousel, Marquee, Single Quote) appears on your site instantly and auto-resizes.",
    theme: {
      card: "bg-[#E8743B] border border-[#CF5F2C]",
      num: "text-white/20",
      title: "text-white",
      desc: "text-white/85",
      iconWrap: "bg-white/15",
      icon: "text-white",
    },
    visual: (
      <div className="w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#16161D] shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="ml-2 text-[9px] text-white/40">index.html</span>
        </div>
        <pre className="overflow-x-auto p-4 text-[9px] leading-relaxed md:text-[10px]">
          <code>
            <span className="text-[#9CA3AF]">{"<!-- one line, that's it -->"}</span>
            {"\n"}
            <span className="text-[#7DD3FC]">{"<script"}</span>
            <span className="text-[#FDBA74]">{" src"}</span>
            <span className="text-white">{"="}</span>
            <span className="text-[#86EFAC]">{'"blovi.space/embed.js"'}</span>
            <span className="text-[#7DD3FC]">{">"}</span>
            <span className="text-[#7DD3FC]">{"</script>"}</span>
          </code>
        </pre>
      </div>
    ),
  },
];

export default function HowItWorksStacked() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".step-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // As the next card slides up, scale this one back into the deck
        gsap.to(card, {
          scale: 0.92,
          autoAlpha: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top center",
            end: "top top+=240",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="w-full bg-[#FAF8F5] px-5 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <Reveal>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B] md:text-xs">
            How it works
          </p>
          <h2
            className="text-center text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three steps to{" "}
            <span
              className="font-normal italic text-[#E8743B]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              social proof.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base text-[#6B6B6B] md:text-lg">
            From zero to embedded testimonials in under 10 minutes.
          </p>
        </Reveal>

        {/* Stacking deck */}
        <div className="mt-16 flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="step-card sticky will-change-transform"
              style={{ top: `calc(96px + ${i * 28}px)` }}
            >
              <div
                className={`grid items-center gap-8 rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(26,26,26,0.10)] md:grid-cols-2 md:p-14 ${step.theme.card}`}
              >
                <div>
                  <span
                    className={`block text-6xl font-extrabold leading-none md:text-8xl ${step.theme.num}`}
                    style={{ fontFamily: "var(--font-display)" }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>
                  <div className={`mt-6 flex h-12 w-12 items-center justify-center rounded-xl ${step.theme.iconWrap}`}>
                    <step.icon size={24} className={step.theme.icon} strokeWidth={2} />
                  </div>
                  <h3
                    className={`mt-5 text-3xl font-extrabold md:text-4xl ${step.theme.title}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.title}
                  </h3>
                  <p className={`mt-3 max-w-md text-sm leading-relaxed md:text-base ${step.theme.desc}`}>
                    {step.desc}
                  </p>
                </div>
                <div className="flex justify-center">{step.visual}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
