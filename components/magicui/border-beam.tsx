"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

export function BorderBeam({
  className,
  duration = 6,
  colorFrom = "#E8743B",
  colorTo = "#FFD9C2",
  borderWidth = 2,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] border-transparent",
        className,
      )}
      style={{
        borderWidth,
        borderStyle: "solid",
        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
      }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-[-150%]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 12%, ${colorTo} 22%, transparent 38%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
