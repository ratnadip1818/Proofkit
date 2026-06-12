"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

const LINE_ONE = ["$49", "once."];
const LINE_TWO = ["Yours", "forever."];

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
      tl.fromTo(
        ".cta-word",
        { yPercent: 115 },
        { yPercent: 0, duration: 1, stagger: 0.09 },
      ).fromTo(
        ".cta-fade",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
        "-=0.5",
      );

      // Slow background marquee drift
      gsap.to(".cta-bg-track", {
        xPercent: -50,
        ease: "none",
        duration: 40,
        repeat: -1,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain relative w-full overflow-hidden bg-[#E8743B] px-5 py-32 md:px-10 md:py-44"
    >
      {/* Oversized outline wordmark drifting behind */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="cta-bg-track flex w-max">
          {[0, 1].map((half) => (
            <div key={half} className="flex w-max shrink-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="px-8 text-[22vw] font-extrabold leading-none text-white/10 md:text-[16vw]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Blovi✦
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] text-center">
        <p className="cta-fade mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 md:text-xs">
          Ready when you are
        </p>

        <h2
          className="text-[clamp(3rem,10vw,8rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="block">
            {LINE_ONE.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="cta-word inline-block will-change-transform">
                  {word}
                  {i < LINE_ONE.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </span>
          <span className="block">
            {LINE_TWO.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span
                  className={`cta-word inline-block will-change-transform ${
                    i === LINE_TWO.length - 1 ? "pr-[0.06em] font-normal italic" : ""
                  }`}
                  style={
                    i === LINE_TWO.length - 1
                      ? { fontFamily: "var(--font-serif-accent)" }
                      : undefined
                  }
                >
                  {word}
                  {i < LINE_TWO.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </span>
        </h2>

        <p className="cta-fade mx-auto mt-7 max-w-md text-base leading-relaxed text-white/90 md:text-lg">
          Stop paying monthly for something you can own outright. Collect
          testimonials, embed your Wall of Love, and never think about this
          line item again.
        </p>

        <div className="cta-fade mt-10">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-[#1A1A1A] shadow-[0_24px_64px_rgba(22,22,29,0.3)] transition-all hover:scale-[1.04] hover:shadow-[0_28px_72px_rgba(22,22,29,0.4)] active:scale-95"
          >
            Get Blovi now
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="cta-fade mt-6 text-sm text-white/80">
          No subscription · No per-seat fees · 30-day money-back guarantee
        </p>
      </div>
    </section>
  );
}
