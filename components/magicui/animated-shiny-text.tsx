import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedShinyText({ children, className }: AnimatedShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block animate-shiny-text bg-clip-text text-transparent",
        "[background-image:linear-gradient(110deg,#6B6B6B,45%,#1A1A1A,55%,#6B6B6B)]",
        "[background-size:200%_100%]",
        className,
      )}
    >
      {children}
    </span>
  );
}
