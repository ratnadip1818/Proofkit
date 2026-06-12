import { Sparkles } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";

export default function FreePlanBanner({ email }: { email?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ECE7E0] bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/10 text-[#E8743B]">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">
            You&apos;re on the free plan — up to 3 testimonials.
          </p>
          <p className="text-xs text-[#6B6B6B]">
            Upgrade to unlock unlimited testimonials, all widget types, and AI
            improvement.
          </p>
        </div>
      </div>
      <PaddleCheckout
        email={email}
        className="shrink-0 rounded-full bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#CF5F2C] hover:scale-105 active:scale-95"
      >
        Upgrade — $49
      </PaddleCheckout>
    </div>
  );
}
