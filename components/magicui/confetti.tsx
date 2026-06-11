"use client";

import { motion } from "framer-motion";

const COLORS = ["#E8743B", "#2E9E6B", "#FFD9C2", "#1A1A1A", "#FFFFFF"];

export function Confetti({ count = 36 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    return {
      id: i,
      x: ((seed * 3.7) % 480) - 240,
      rotate: (seed * 2.3) % 360,
      delay: (i % 8) * 0.05,
      color: COLORS[i % COLORS.length],
      width: 5 + (i % 5),
      height: 8 + ((i * 3) % 6),
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/3 rounded-sm"
          style={{ width: p.width, height: p.height, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, -60, 220], opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
