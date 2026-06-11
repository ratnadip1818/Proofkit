"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

const ITEMS = [
  "Pay once",
  "Own it forever",
  "AI polish",
  "Wall of Love",
  "No subscription",
  "One script tag",
];

function Row({ outline = false }: { outline?: boolean }) {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-6 md:gap-10">
          <span
            className={`whitespace-nowrap text-2xl font-extrabold uppercase tracking-tight md:text-4xl ${
              outline ? "text-outline" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item}
          </span>
          <span className="text-xl text-[#E8743B] md:text-3xl" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * Full-bleed ink band, slightly rotated, with a CSS-driven infinite marquee.
 * GSAP skews the track with scroll velocity for that hand-made feel.
 */
export default function MarqueeStrip() {
  const bandRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const band = bandRef.current;
    if (!band || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const skewTo = gsap.quickTo(".marquee-skew", "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });
      ScrollTrigger.create({
        trigger: band,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / 320));
        },
      });
    }, band);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bandRef}
      className="relative w-full overflow-hidden py-8 [background:linear-gradient(to_bottom,#FAF8F5_50%,#16161D_50%)]"
    >
      <div className="rotate-[-1.5deg] scale-[1.03] bg-[#16161D] py-5 shadow-xl md:py-7">
        <div className="marquee-skew">
          <div
            className="animate-marquee-x flex w-max"
            style={{ "--marquee-duration": "26s" } as React.CSSProperties}
          >
            {/* two identical halves -> translateX(-50%) loops seamlessly */}
            <div className="flex w-max items-center gap-6 pr-6 md:gap-10 md:pr-10">
              <Row />
              <Row outline />
            </div>
            <div
              className="flex w-max items-center gap-6 pr-6 md:gap-10 md:pr-10"
              aria-hidden="true"
            >
              <Row />
              <Row outline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
