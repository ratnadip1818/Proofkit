"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  yOffset = 8,
  inView = true,
}: BlurFadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const show = !inView || isInView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: "blur(6px)" }}
      animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
