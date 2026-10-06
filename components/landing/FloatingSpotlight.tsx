"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function FloatingSpotlight() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [height, setHeight] = useState(150);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("blovi_floating_spotlight_dismissed") === "true") {
        setIsDismissed(true);
      }
    } catch (e) {}

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "proofkit-resize" && typeof e.data.height === "number" && e.data.height > 0) {
        setHeight(e.data.height + 4);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("blovi_floating_spotlight_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Customer Testimonial Spotlight"
      className="fixed bottom-6 left-6 z-40 hidden md:block w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-300"
    >
      <div className="relative group">
        {/* Subtle Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss spotlight"
          aria-label="Dismiss spotlight"
          className="absolute -top-2.5 -right-2.5 z-50 p-1 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <X size={12} strokeWidth={2.5} />
        </button>

        <iframe
          src="/embed/6e037975-54db-4705-b239-28ef18f95eb8?type=stack&preset=base&theme=light&badge=false&showBranding=false"
          scrolling="no"
          className="w-full border-none block bg-transparent overflow-hidden"
          style={{ height: `${height}px`, transition: "height 0.2s ease", overflow: "hidden" }}
          title="Customer spotlight testimonial"
          loading="lazy"
        />
      </div>
    </aside>
  );
}
