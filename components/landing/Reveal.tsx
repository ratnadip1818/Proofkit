"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

/** Scroll-triggered fade-up reveal (GSAP replacement for the old FadeIn). */
export default function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
