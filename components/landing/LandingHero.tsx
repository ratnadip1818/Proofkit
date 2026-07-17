"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function LandingHero() {
  const shouldReduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || shouldReduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      stage.style.setProperty("--pointer-x", `${x * 10}px`);
      stage.style.setProperty("--pointer-y", `${y * 8}px`);
    };

    const resetPointer = () => {
      stage.style.setProperty("--pointer-x", "0px");
      stage.style.setProperty("--pointer-y", "0px");
    };

    stage.addEventListener("pointermove", handlePointerMove, { passive: true });
    stage.addEventListener("pointerleave", resetPointer, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", resetPointer);
    };
  }, [shouldReduceMotion]);

  return (
    <section className="hero-signal relative isolate min-h-[850px] overflow-hidden bg-[#0b54d8] px-5 pb-12 pt-28 text-white md:min-h-[920px] md:px-10 md:pt-32">
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-70" />
      <div className="hero-aurora pointer-events-none absolute inset-0" />
      <div className="hero-sun pointer-events-none absolute left-1/2 top-[43%] h-[36rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10 mx-auto flex max-w-[1160px] flex-col items-center text-center">
        <div
          className="hero-enter flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm"
          style={{ animationDelay: "80ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#a7ff8d] shadow-[0_0_12px_#a7ff8d]" />
          Proof, made personal
        </div>

        <h1
          className="hero-enter mt-7 max-w-[900px] text-balance text-[clamp(3.25rem,8.1vw,7.15rem)] font-medium leading-[0.88] tracking-[-0.075em]"
          style={{ fontFamily: "var(--font-display)", animationDelay: "150ms" }}
        >
          Make every good word
          <span className="block font-serif-accent font-normal italic tracking-[-0.04em] text-[#c6ffb1]">do more.</span>
        </h1>

        <p className="hero-enter mt-6 max-w-[510px] text-pretty text-[15px] leading-relaxed text-white/75 md:text-[17px]" style={{ animationDelay: "250ms" }}>
          Collect the moments customers already share. Curate them into proof that makes your next customer feel certain.
        </p>

        <div className="hero-enter mt-8 flex flex-col items-center gap-3 sm:flex-row" style={{ animationDelay: "350ms" }}>
          <Link href="/signup" className="group inline-flex items-center gap-3 rounded-full bg-[#c6ffb1] px-5 py-3 text-[15px] font-semibold text-[#0b3d9b] shadow-[0_12px_30px_rgba(5,29,93,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Start collecting proof
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b54d8] text-white transition-transform duration-200 group-hover:rotate-45">
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </span>
          </Link>
          <a href="#how-it-works" className="group inline-flex items-center gap-2 rounded-full px-4 py-3 text-[14px] font-medium text-white/90 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/35 transition group-hover:border-white group-hover:bg-white/10">
              <Play size={11} fill="currentColor" />
            </span>
            See how it works
          </a>
        </div>
      </div>

      <div
        ref={stageRef}
        className="proof-stage relative z-10 mx-auto mt-12 h-[380px] max-w-[1280px] md:mt-14 md:h-[440px]"
        aria-label="A preview of customer proof collected in Blovi"
      >
        <div className="horizon pointer-events-none absolute inset-x-[-10vw] bottom-0 h-[72%]" />
        <div className="proof-orbit pointer-events-none absolute left-1/2 top-[52%] h-[330px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/20" />
        <div className="proof-orbit proof-orbit-inner pointer-events-none absolute left-1/2 top-[52%] h-[210px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/20" />

        <div className="signal-dots pointer-events-none absolute inset-0" />

        {/* Central console card — kept */}
        <div className="proof-console absolute left-1/2 top-[49%] w-[min(88vw,345px)] -translate-x-1/2 -translate-y-1/2 rounded-[25px] border border-white/60 bg-[#fffdf8] p-3 text-[#173b71] shadow-[0_30px_90px_rgba(0,27,91,0.3)]">
          <div className="flex items-center justify-between border-b border-[#dfe8f3] px-1 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b54d8] text-sm font-bold text-white">b</span>
              <div>
                <p className="text-[11px] font-bold leading-none">Blovi</p>
                <p className="mt-1 text-[9px] text-[#7184a5]">Proof library</p>
              </div>
            </div>
            <span className="rounded-full bg-[#e5f7de] px-2 py-1 text-[9px] font-bold text-[#21794c]">12 new</span>
          </div>
          <div className="mt-3 rounded-2xl bg-[#eff7ec] p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#50806b]">Today's favorite</p>
            <p className="mt-2 text-[14px] font-semibold leading-snug tracking-[-0.025em]">"The proof widget made our launch page feel instantly credible."</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {["#f0a28d", "#8ac6dc", "#bc9ee1"].map((color) => <span key={color} className="h-5 w-5 rounded-full border-2 border-[#eff7ec]" style={{ backgroundColor: color }} />)}
              </div>
              <span className="text-[10px] font-semibold text-[#2670d9]">Add to wall +</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Collect", "Curate", "Publish"].map((step, index) => <div key={step} className="rounded-xl border border-[#e4ebf4] bg-white px-2 py-2"><span className="text-[9px] text-[#6c82a5]">0{index + 1}</span><p className="mt-1 text-[10px] font-bold">{step}</p></div>)}
          </div>
        </div>

        <div className="source-line absolute bottom-3 left-1/2 flex w-full -translate-x-1/2 items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65 md:gap-5">
          <span>Built for founder-led brands</span><i className="h-1 w-1 rounded-full bg-[#c6ffb1]" /><span>Collect · curate · convert</span>
        </div>
      </div>

      <style jsx>{`
        .hero-signal { background-image: linear-gradient(180deg, #0b54d8 0%, #0961df 56%, #1b78df 100%); }
        .hero-grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }
        .hero-aurora { background: radial-gradient(ellipse 70% 40% at 50% 88%, rgba(174,255,146,.22), transparent 70%), radial-gradient(circle at 87% 20%, rgba(137,220,255,.16), transparent 22%), radial-gradient(circle at 8% 74%, rgba(132,197,255,.13), transparent 24%); }
        .hero-sun { background: radial-gradient(ellipse, rgba(255,255,255,.14) 0%, rgba(255,255,255,.05) 35%, transparent 68%); filter: blur(8px); }
        .hero-enter { animation: hero-in 800ms cubic-bezier(.16,1,.3,1) both; }
        .proof-stage { --pointer-x: 0px; --pointer-y: 0px; perspective: 1000px; }
        .horizon { background: radial-gradient(ellipse 72% 45% at 50% 100%, rgba(179,255,142,.82) 0%, rgba(111,231,126,.45) 26%, rgba(90,190,186,.15) 48%, transparent 70%); filter: blur(4px); }
        .signal-dots { background-image: radial-gradient(rgba(255,255,255,.42) 1px, transparent 1px); background-size: 22px 22px; mask-image: radial-gradient(ellipse at 50% 55%, black 5%, transparent 68%); opacity: .4; }
        .proof-orbit { transform: translate(calc(-50% + var(--pointer-x)), calc(-50% + var(--pointer-y))) rotateX(67deg); transition: transform 600ms cubic-bezier(.16,1,.3,1); }
        .proof-orbit-inner { opacity: .52; transition-duration: 800ms; }
        .proof-console { transform: translate(calc(-50% + var(--pointer-x)), calc(-50% + var(--pointer-y))) translateZ(40px); transition: transform 600ms cubic-bezier(.16,1,.3,1); }
        .source-line { text-shadow: 0 1px 8px rgba(0,49,139,.3); }
        @keyframes hero-in { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .hero-enter { animation: none; } }
      `}</style>
    </section>
  );
}
