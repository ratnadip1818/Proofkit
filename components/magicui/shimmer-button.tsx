"use client";

import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, shimmerColor = "rgba(232,116,59,0.35)", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("group relative isolate overflow-hidden", className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-slide bg-linear-to-r from-transparent via-[var(--shimmer-color)] to-transparent group-disabled:hidden"
          style={{ "--shimmer-color": shimmerColor } as CSSProperties}
        />
        <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
