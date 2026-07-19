"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function FinalCTASection() {
  return (
    <section className="w-full bg-[#FAF8F5] border-t border-[#1A1A1A]/5 px-5 py-36 md:px-10 md:py-48 select-none relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto w-full max-w-[720px] text-center relative z-10">
        <Reveal>
          <h2
            className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start showing the trust you've{" "}
            <span
              className="font-normal italic text-[#2563EB] block sm:inline"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              already earned
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#6B6B6B]">
            Help future customers see why your current ones trust you. Set up in less than three minutes.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-full bg-[#2563EB] px-8 py-4 text-sm font-bold text-white shadow-xs transition-product duration-button ease-product hover:bg-[#1d4ed8] hover:translate-y-[-1px] hover:shadow-md"
            >
              Start Free
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#playground"
              className="flex items-center rounded-full border border-[#ECE7E0] bg-white px-8 py-4 text-sm font-bold text-[#1A1A1A] transition-product duration-button ease-product hover:translate-y-[-1px] hover:shadow-md"
            >
              View Live Demo
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-6 text-[10px] text-[#8A8A8A] font-semibold uppercase tracking-wider">
            No credit card required to get started.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
