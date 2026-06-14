"use client";

import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";
import Reveal from "./Reveal";

const ORIGINAL = "luv this app, saved me so much time tbh, def recommend!!";
const POLISHED = "I love this app — it saved me so much time. Highly recommend!";
const POLISHED_WORDS = `“${POLISHED}”`.split(" ");

const CHIPS = ["grammar", "clarity", "typos", "meaning preserved"];

export default function AiPolish() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Hide elements before animation starts
      gsap.set(".polish-original", { autoAlpha: 0, x: -40 });
      gsap.set(".polish-button", { autoAlpha: 0, scale: 0 });
      gsap.set(".polish-result", { autoAlpha: 0, x: 40 });
      gsap.set(".polish-badge", { autoAlpha: 0, scale: 0, rotate: -12 });
      gsap.set(".polish-chip", { autoAlpha: 0, y: 16 });
      gsap.set(".polish-word", { autoAlpha: 0, y: 8 });
      gsap.set(".polish-initial-text", { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ".polish-stage", start: "top 70%", once: true },
      });

      tl.to(".polish-original", { autoAlpha: 1, x: 0, duration: 0.7 })
        .to(
          ".polish-button",
          { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.2)" },
          "-=0.2"
        )
        .to(".polish-result", { autoAlpha: 1, x: 0, duration: 0.7 }, "-=0.1")
        .to(".polish-button", {
          scale: 1.12,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        })
        .to(
          ".polish-initial-text",
          {
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          ".polish-word",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.15"
        )
        .to(
          ".polish-badge",
          { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" },
          "-=0.5"
        )
        .to(
          ".polish-chip",
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=1.2"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain relative w-full overflow-hidden bg-[#000000] border-t border-white/10 px-5 py-28 md:px-10 md:py-36"
    >
      <div className="relative mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8A8A8A] md:text-xs">
            ✦ AI-powered
          </p>
          <h2
            className="mx-auto max-w-3xl text-center text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One-click AI polish,{" "}
            <span
              className="font-normal italic text-[#ECE7E0]"
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
          <div className="polish-original rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.6)] md:p-7">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A8A8A]">
              Original
            </p>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              &ldquo;{ORIGINAL}&rdquo;
            </p>
          </div>

          {/* AI button */}
          <div className="relative flex justify-center">
            <div className="polish-button relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#16161D] text-white hover:bg-[#222226] hover:border-white/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <Sparkles size={20} className="text-[#E8743B]" strokeWidth={2} />
            </div>
          </div>

          {/* Polished */}
          <div className="polish-result relative rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.6)] md:p-7">
            <span className="polish-badge absolute -top-3 right-5 rounded-full border border-white/10 bg-[#1A1A1A] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80">
              Edited for clarity
            </span>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
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
              <p className="polish-initial-text absolute inset-0 text-base leading-relaxed text-white/80 md:text-lg">
                &ldquo;{ORIGINAL}&rdquo;
              </p>
              <p className="absolute inset-0 text-base leading-relaxed text-white md:text-lg">
                {POLISHED_WORDS.map((word, i) => (
                  <span
                    key={i}
                    className="polish-word inline-block mr-1 will-change-transform"
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* What it fixes */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="polish-chip rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80"
            >
              ✓ {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
