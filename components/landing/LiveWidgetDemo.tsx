"use client";

import { useEffect, useRef } from "react";

export default function LiveWidgetDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://www.blovi.space/widget.js";
    script.setAttribute("data-user", "6e037975-54db-4705-b239-28ef18f95eb8");
    script.setAttribute("data-demo", "1");
    script.setAttribute("data-type", "wall");
    script.setAttribute("data-layout", "grid");
    script.setAttribute("data-theme", "light");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="mt-12 rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-4 md:p-6">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">
        Live preview — powered by the Blovi widget
      </p>
      <div ref={containerRef} />
    </div>
  );
}
