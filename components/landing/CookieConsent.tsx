"use client";

import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent preference is already stored
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // If no preference, show banner after 1.5 seconds delay
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === "accepted") {
      // If already accepted, ensure GA consent is updated
      updateGAConsent(true);
    }
  }, []);

  const updateGAConsent = (granted: boolean) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied", // Blovi doesn't serve ads
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    updateGAConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    updateGAConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl border border-[#ECE7E0] bg-white p-5 shadow-[0_12px_36px_rgba(26,26,26,0.1)] md:max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF4EE] text-[#E8743B] border border-[#E8743B]/20">
          <ShieldCheck size={18} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#1A1A1A]">Cookie Preferences</p>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            We use anonymized cookies to measure traffic and improve your collection form dashboard experience. See our{" "}
            <a href="/privacy" className="font-semibold text-[#E8743B] hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-[#ECE7E0] pt-3.5">
        <button
          onClick={handleDecline}
          className="rounded-full px-4 py-2 text-xs font-semibold text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="rounded-full bg-[#1A1A1A] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#E8743B] active:scale-95 shadow-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
