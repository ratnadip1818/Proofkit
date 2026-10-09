"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 font-sans">
      <div className="bg-white border border-[#E3E0DB] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#1A1A1A] tracking-tight">
              Unable to load dashboard data
            </h3>
            <p className="text-xs text-[#787774] mt-0.5">
              An unexpected network or database issue occurred while loading your workspace.
            </p>
          </div>
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
}
