"use client";

import { useEffect, useRef } from "react";

export default function WallOfLove() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    // Target container
    const widgetTarget = document.createElement("div");
    widgetTarget.id = "proofkit-widget";
    widgetTarget.setAttribute("data-widget-id", "6e037975-54db-4705-b239-28ef18f95eb8");
    containerRef.current.appendChild(widgetTarget);

    // Script tag
    const script = document.createElement("script");
    script.src = "https://www.blovi.space/widget.js";
    script.async = true;
    script.setAttribute("data-user", "6e037975-54db-4705-b239-28ef18f95eb8");
    script.setAttribute("data-type", "orbit");
    script.setAttribute("data-preset", "base");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-accent", "#2564EB");
    script.setAttribute("data-text-color", "#374151");
    script.setAttribute("data-rating-color", "#FBBF24");
    script.setAttribute("data-rating-border-color", "#4E46E5");
    script.setAttribute("data-highlight-color", "#FFCD3640");
    script.setAttribute("data-show-photos", "true");
    script.setAttribute("data-use-gravatar", "true");
    script.setAttribute("data-fallback-avatar", "Placeholder");
    script.setAttribute("data-chat-customer-prompt", "");
    script.setAttribute("data-chat-founder-reply", "");
    script.setAttribute("data-show-branding", "true");

    containerRef.current.appendChild(script);

    return () => {
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
      }, 200);
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#2563EB] mb-4">
            Wall of Love
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loved by founders &{" "}
            <span
              className="italic text-[#2563EB]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              makers
            </span>
          </h2>
          <p className="mt-4 text-base text-[#6B6B6B] max-w-lg mx-auto">
            Real feedback from real customers — collected, approved, and embedded
            with Blovi.
          </p>
        </div>

        {/* Widget Container — excluded from Lenis smooth scroll */}
        <div ref={containerRef} className="w-full" data-lenis-prevent />
      </div>
    </section>
  );
}

