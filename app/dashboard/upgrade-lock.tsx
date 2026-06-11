import { Lock } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";

export default function UpgradeLock({
  children,
  message = "Unlock with Pro",
  email,
}: {
  children: React.ReactNode;
  message?: string;
  email?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[3px]" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60">
        <PaddleCheckout
          email={email}
          className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#E8743B] hover:scale-105 active:scale-95"
        >
          <Lock size={14} />
          {message} — $49 once
        </PaddleCheckout>
      </div>
    </div>
  );
}
