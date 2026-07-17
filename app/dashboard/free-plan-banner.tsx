import { Sparkles } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";

export default function FreePlanBanner({ email }: { email?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-gradient-to-r from-[#16161D] via-[#22222A] to-[#16161D] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/15 text-[#E8743B]">
          <Sparkles size={18} />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-white">
              You&apos;re on the free plan — up to 3 testimonials.
            </p>
            <span className="inline-flex items-center rounded-full bg-[#E8743B]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E8743B]">
              Standard Tier
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">
            Upgrade to unlock unlimited testimonials, custom branding removals, and all widget layouts.
          </p>
        </div>
      </div>
      <PaddleCheckout
        email={email}
        priceId={process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID!}
        className="shrink-0 rounded-full bg-[#E8743B] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(232,116,59,0.3)] transition-all hover:bg-[#CF5F2C] hover:scale-[1.04] active:scale-95 cursor-pointer"
      >
        Upgrade — $49/yr
      </PaddleCheckout>
    </div>
  );
}
