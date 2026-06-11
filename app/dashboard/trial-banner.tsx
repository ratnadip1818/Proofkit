import { Sparkles } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import type { PlanStatus } from "@/lib/plan";

export default function TrialBanner({
  status,
  daysLeft,
}: {
  status: PlanStatus;
  daysLeft: number;
}) {
  if (status === "pro") return null;

  const isExpired = status === "expired";

  return (
    <div
      className={`mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${
        isExpired
          ? "border-[#E8743B]/30 bg-[#E8743B]/5"
          : "border-[#ECE7E0] bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/10 text-[#E8743B]">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">
            {isExpired
              ? "Your free preview has ended"
              : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your free preview`}
          </p>
          <p className="text-xs text-[#6B6B6B]">
            {isExpired
              ? "Upgrade to unlock testimonial collection and your live embed."
              : "Preview your widget below. Collection and embed unlock with Pro."}
          </p>
        </div>
      </div>
      <PaddleCheckout className="shrink-0 rounded-full bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#CF5F2C] hover:scale-105 active:scale-95">
        Unlock Pro — $49 once
      </PaddleCheckout>
    </div>
  );
}
