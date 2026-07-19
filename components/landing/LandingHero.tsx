"use client";

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="hero-signal relative isolate overflow-hidden bg-[#2563EB] px-5 py-24 text-white md:py-32 md:px-10">
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-70" />
      <div className="hero-aurora pointer-events-none absolute inset-0" />
      <div className="hero-sun pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10 mx-auto flex max-w-[1160px] flex-col items-center text-center">
        <div
          className="hero-enter flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#a7ff8d] shadow-[0_0_12px_#a7ff8d]" />
          Proof, made personal
        </div>

        <h1
          className="hero-enter mt-7 max-w-[900px] text-balance text-[clamp(3.25rem,8.1vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.075em]"
          style={{ fontFamily: "var(--font-display)", animationDelay: "150ms" }}
        >
          Make every good word
          <span className="block font-serif-accent font-normal italic tracking-[-0.04em] text-[#c6ffb1]">do more.</span>
        </h1>

        <p className="hero-enter mt-6 max-w-[540px] text-pretty text-[16px] leading-relaxed text-white/85 md:text-[18px]" style={{ animationDelay: "250ms" }}>
          Collect the moments customers already share. Curate them into proof that makes your next customer feel certain.
        </p>

        <div className="hero-enter mt-9 flex flex-col items-center gap-3.5 sm:flex-row justify-center" style={{ animationDelay: "350ms" }}>
          <Link href="/signup" className="group inline-flex items-center gap-3 rounded-full bg-[#c6ffb1] px-6 py-3.5 text-[15px] font-semibold text-[#1e40af] shadow-[0_12px_30px_rgba(5,29,93,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Start collecting proof
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-white transition-transform duration-200 group-hover:rotate-45">
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </span>
          </Link>
          <a href="#how-it-works" className="group inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[14px] font-medium text-white/90 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/35 transition group-hover:border-white group-hover:bg-white/10">
              <Play size={11} fill="currentColor" />
            </span>
            See how it works
          </a>
        </div>

        <div className="source-line mt-12 flex w-full items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 md:gap-5">
          <span>Built for founder-led brands</span>
          <i className="h-1 w-1 rounded-full bg-[#c6ffb1]" />
          <span>Collect · curate · convert</span>
        </div>
      </div>

      <style jsx>{`
        .hero-signal { background-image: linear-gradient(180deg, #1d4ed8 0%, #2563eb 56%, #3b82f6 100%); }
        .hero-grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }
        .hero-aurora { background: radial-gradient(ellipse 70% 40% at 50% 88%, rgba(174,255,146,.22), transparent 70%), radial-gradient(circle at 87% 20%, rgba(137,220,255,.16), transparent 22%), radial-gradient(circle at 8% 74%, rgba(132,197,255,.13), transparent 24%); }
        .hero-sun { background: radial-gradient(ellipse, rgba(255,255,255,.14) 0%, rgba(255,255,255,.05) 35%, transparent 68%); filter: blur(8px); }
        .hero-enter { animation: hero-in 800ms cubic-bezier(.16,1,.3,1) both; }
        .source-line { text-shadow: 0 1px 8px rgba(0,49,139,.3); }
        @keyframes hero-in { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .hero-enter { animation: none; } }
      `}</style>
    </section>
  );
}
