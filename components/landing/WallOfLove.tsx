"use client";

import { useEffect, useRef } from "react";

const WIDGET_URL =
  "https://www.blovi.space/embed/6e037975-54db-4705-b239-28ef18f95eb8?type=wall&layout=grid&max=all&theme=light&ratings=true&radius=pill&badge=false";

export default function WallOfLove() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement("script");
    script.src = "https://www.blovi.space/widget.js";
    script.setAttribute("data-user", "6e037975-54db-4705-b239-28ef18f95eb8");
    script.setAttribute("data-type", "carousel");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-ratings", "true");
    script.setAttribute("data-badge", "true");
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Toggle pointer-events during scroll to completely eliminate trackpad latency/momentum glitches
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const disablePointerEvents = () => {
      if (containerRef.current) {
        containerRef.current.style.pointerEvents = "none";
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.pointerEvents = "auto";
        }
      }, 200); // Restore pointer events 200ms after user stops scrolling
    };

    window.addEventListener("scroll", disablePointerEvents, { passive: true });
    window.addEventListener("wheel", disablePointerEvents, { passive: true });
    window.addEventListener("touchmove", disablePointerEvents, { passive: true });

    return () => {
      window.removeEventListener("scroll", disablePointerEvents);
      window.removeEventListener("wheel", disablePointerEvents);
      window.removeEventListener("touchmove", disablePointerEvents);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <section className="w-full bg-[#FAF8F5] py-24 px-5 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#E8743B] mb-4">
            Wall of Love
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loved by founders &{" "}
            <span
              className="italic text-[#E8743B]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              makers
            </span>
          </h2>
          <p className="mt-4 text-base text-[#6B6B6B] max-w-lg mx-auto">
            Real feedback from real customers — collected, polished, and embedded
            with Blovi.
          </p>
        </div>

        {/* Widget Container — excluded from Lenis smooth scroll */}
        <div ref={containerRef} className="w-full" data-lenis-prevent />
      </div>
    </section>
  );
}
