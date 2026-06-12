"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";
import Reveal from "./Reveal";

const ORIGINAL = "luv this app, saved me so much time tbh, def recommend!!";
const POLISHED = "I love this app — it saved me so much time. Highly recommend!";

const CHIPS = ["grammar", "clarity", "typos", "meaning preserved"];

export default function AiPolish() {
  const sectionRef = useRef<HTMLElement>(null);
  const polishedRef = useRef<HTMLParagraphElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Hide everything before first paint — otherwise elements render
      // visible and "blink out" one by one as their tween starts
      gsap.set(".polish-original", { autoAlpha: 0, x: -40 });
      gsap.set(".polish-button", { autoAlpha: 0, scale: 0 });
      gsap.set(".polish-result", { autoAlpha: 0, x: 40 });
      gsap.set(".polish-badge", { autoAlpha: 0, scale: 0, rotate: -12 });
      gsap.set(".polish-chip", { autoAlpha: 0, y: 16 });
      // Seed the polished card with the messy text so the scramble reveals
      // the clean version once, instead of re-scrambling visible text
      if (polishedRef.current) {
        polishedRef.current.textContent = `“${ORIGINAL}”`;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ".polish-stage", start: "top 70%", once: true },
      });

      tl.to(".polish-original", { autoAlpha: 1, x: 0, duration: 0.7 })
        .to(
          ".polish-button",
          { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.2)" },
          "-=0.2",
        )
        .to(".polish-result", { autoAlpha: 1, x: 0, duration: 0.7 }, "-=0.1")
        .to(".polish-button", {
          scale: 1.18,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to(
          polishedRef.current,
          {
            duration: 1.8,
            scrambleText: {
              text: `“${POLISHED}”`,
              chars: "lowerCase",
              speed: 0.5,
              // keep the string at its final length the whole time so the
              // card never reflows mid-scramble
              tweenLength: false,
            },
          },
          "-=0.1",
        )
        .to(
          ".polish-badge",
          { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" },
          "-=0.5",
        )
        .to(
          ".polish-chip",
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=1.2",
        );

      // Slow ambient pulse on the glow behind the button
      gsap.to(".polish-glow", {
        scale: 1.35,
        opacity: 0.5,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain relative w-full overflow-hidden bg-[#16161D] px-5 py-28 md:px-10 md:py-36"
    >
      {/* Ambient orange glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(232,116,59,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8743B] md:text-xs">
            ✦ AI-powered
          </p>
          <h2
            className="mx-auto max-w-3xl text-center text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One-click AI polish,{" "}
            <span
              className="font-normal italic text-[#E8743B]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              built in.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-[#9CA3AF] md:text-lg">
            Turn rough customer feedback into polished social proof instantly.
            AI fixes grammar, clarity and typos — without changing the
            customer&apos;s meaning. The original is always shown side by side.
            You decide what to keep.
          </p>
        </Reveal>

        {/* Before / button / after stage */}
        <div className="polish-stage mx-auto mt-16 grid max-w-4xl items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          {/* Original */}
          <div className="polish-original rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-7">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Original
            </p>
            <p className="text-base leading-relaxed text-[#9CA3AF] md:text-lg">
              &ldquo;{ORIGINAL}&rdquo;
            </p>
          </div>

          {/* AI button */}
          <div className="relative flex justify-center">
            <div
              className="polish-glow absolute h-16 w-16 rounded-full bg-[#E8743B]/40 blur-2xl"
              aria-hidden="true"
            />
            <div className="polish-button relative flex h-14 w-14 items-center justify-center rounded-full bg-[#E8743B] shadow-[0_8px_32px_rgba(232,116,59,0.5)]">
              <Sparkles size={22} className="text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Polished */}
          <div className="polish-result relative rounded-2xl border border-[#E8743B]/40 bg-white p-6 shadow-[0_24px_64px_rgba(232,116,59,0.25)] md:p-7">
            <span className="polish-badge absolute -top-3 right-5 rounded-full bg-[#E8743B] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
              Edited for clarity
            </span>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8743B]">
              AI-improved
            </p>
            {/* Invisible copy of the final text reserves the exact height at
                every breakpoint, so the card can't resize during the scramble */}
            <div className="relative">
              <p
                className="invisible text-base leading-relaxed md:text-lg"
                aria-hidden="true"
              >
                &ldquo;{POLISHED}&rdquo;
              </p>
              <p
                ref={polishedRef}
                className="absolute inset-0 text-base leading-relaxed text-[#1A1A1A] md:text-lg"
              >
                &ldquo;{POLISHED}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* What it fixes */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="polish-chip rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#9CA3AF]"
            >
              ✓ {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
