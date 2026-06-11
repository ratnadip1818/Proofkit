"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

const QUOTES = [
  {
    messy: "luv this app, saved me so much time tbh, def recommend!!",
    clean: "I love this app — it saved me so much time. Highly recommend!",
    name: "Maria K.",
    role: "Founder, Lume",
  },
  {
    messy: "honestly didnt think id use it this much lol. its so good",
    clean: "Honestly, I didn't expect to use it this much — it's that good.",
    name: "Tom W.",
    role: "Indie hacker",
  },
  {
    messy: "setup was suuuper quick and the wall looks amazing on my site",
    clean: "Setup was super quick, and the wall looks amazing on my site.",
    name: "Devon R.",
    role: "Freelance designer",
  },
];

const FLOAT_CARDS = [
  {
    name: "Priya S.",
    role: "Agency owner",
    body: "Finally a tool I don't pay monthly for.",
    improved: false,
    className: "left-[2%] top-[24%] rotate-[-7deg]",
    depth: 1,
  },
  {
    name: "Devon R.",
    role: "Freelance designer",
    body: "Set up the wall on my site in five minutes.",
    improved: false,
    className: "right-[2%] top-[20%] rotate-[6deg]",
    depth: 0.6,
  },
  {
    name: "Ana L.",
    role: "Course creator",
    body: "Exactly what my course site needed.",
    improved: true,
    className: "left-[5%] top-[62%] rotate-[4deg]",
    depth: 0.7,
  },
  {
    name: "Tom W.",
    role: "Indie hacker",
    body: "The AI polish button is genuinely magic.",
    improved: true,
    className: "right-[4%] top-[64%] rotate-[-5deg]",
    depth: 1.1,
  },
];

type Phase = "messy" | "polishing" | "polished" | "swapping";

export default function LandingHero() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = QUOTES[quoteIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const phaseRef = useRef<Phase>("messy");
  const indexRef = useRef(0);
  const mountedRef = useRef(false);
  const timersRef = useRef<{ auto?: ReturnType<typeof setTimeout>; next?: ReturnType<typeof setTimeout> }>({});

  indexRef.current = quoteIndex;

  const swapNext = () => {
    phaseRef.current = "swapping";
    const advance = () => setQuoteIndex((i) => (i + 1) % QUOTES.length);
    if (prefersReducedMotion()) {
      advance();
      return;
    }
    gsap.to(blockRef.current, {
      autoAlpha: 0,
      y: -28,
      duration: 0.45,
      ease: "power2.in",
      onComplete: advance,
    });
  };

  const polish = () => {
    if (phaseRef.current !== "messy") return;
    phaseRef.current = "polishing";
    clearTimeout(timersRef.current.auto);

    const section = sectionRef.current;
    const q = QUOTES[indexRef.current];
    if (!section || !quoteRef.current) return;

    if (prefersReducedMotion()) {
      quoteRef.current.textContent = `“${q.clean}”`;
      gsap.set(section.querySelector(".hero-stamp"), { autoAlpha: 1 });
      gsap.set(section.querySelector(".hero-label-before"), { autoAlpha: 0 });
      gsap.set(section.querySelector(".hero-label-after"), { autoAlpha: 1 });
      gsap.set(section.querySelector(".hero-hint"), { autoAlpha: 0 });
      phaseRef.current = "polished";
      return; // no auto-loop for reduced motion
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        phaseRef.current = "polished";
        timersRef.current.next = setTimeout(swapNext, 3400);
      },
    });

    tl.to(section.querySelector(".hero-polish-btn"), {
      scale: 0.85,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })
      .to(section.querySelector(".hero-hint"), { autoAlpha: 0, duration: 0.25 }, 0)
      .to(
        section.querySelector(".hero-label-before"),
        { autoAlpha: 0, y: -10, duration: 0.3 },
        0.1,
      )
      .fromTo(
        section.querySelector(".hero-label-after"),
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        0.35,
      )
      .to(
        quoteRef.current,
        {
          duration: 1.5,
          scrambleText: {
            text: `“${q.clean}”`,
            chars: "lowerCase",
            speed: 0.6,
          },
        },
        0.15,
      )
      .fromTo(
        section.querySelector(".hero-stamp"),
        { autoAlpha: 0, scale: 0, rotate: -16 },
        { autoAlpha: 1, scale: 1, rotate: -4, duration: 0.5, ease: "back.out(2.2)" },
        "-=0.45",
      );
  };

  // Reset + re-arm after each quote swap (not on first mount)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const section = sectionRef.current;
    if (!section) return;

    gsap.set(section.querySelector(".hero-stamp"), { autoAlpha: 0 });
    gsap.set(section.querySelector(".hero-label-before"), { autoAlpha: 1, y: 0 });
    gsap.set(section.querySelector(".hero-label-after"), { autoAlpha: 0 });
    gsap.set(section.querySelector(".hero-hint"), { autoAlpha: 1 });
    phaseRef.current = "messy";

    if (prefersReducedMotion()) return;

    gsap.fromTo(
      blockRef.current,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
    );
    timersRef.current.auto = setTimeout(polish, 2800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteIndex]);

  // Entrance choreography + ambient loops
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const timers = timersRef.current;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hero-fade-1",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        0.1,
      )
        .fromTo(
          blockRef.current,
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, duration: 1 },
          0.3,
        )
        .fromTo(
          ".hero-polish-wrap",
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.8)" },
          0.7,
        )
        .fromTo(
          ".hero-fade-2",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
          0.9,
        )
        .fromTo(
          ".hero-float",
          { autoAlpha: 0, scale: 0.8, y: 30 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1, stagger: 0.08, ease: "back.out(1.6)" },
          1.0,
        );

      // Pulsing ring + glow on the polish button
      gsap.to(".hero-polish-ring", {
        scale: 1.55,
        autoAlpha: 0,
        duration: 1.6,
        repeat: -1,
        ease: "power1.out",
      });
      gsap.to(".hero-polish-glow", {
        scale: 1.35,
        opacity: 0.55,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Idle float on the cards
      gsap.utils.toArray<HTMLElement>(".hero-float-inner").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? 14 : -14,
          duration: 2.6 + i * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Pointer parallax (fine pointers only)
      mm.add("(min-width: 1024px) and (pointer: fine)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".hero-float");
        const setters = cards.map((card) => ({
          x: gsap.quickTo(card, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(card, "y", { duration: 0.8, ease: "power3.out" }),
          depth: Number(card.dataset.depth ?? 1),
        }));

        const onMove = (e: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          setters.forEach((s) => {
            s.x(nx * 26 * s.depth);
            s.y(ny * 18 * s.depth);
          });
        };

        section.addEventListener("pointermove", onMove);
        return () => section.removeEventListener("pointermove", onMove);
      });
    }, section);

    // First auto-polish, a beat after the entrance settles
    timers.auto = setTimeout(polish, 3200);

    return () => {
      clearTimeout(timers.auto);
      clearTimeout(timers.next);
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#16161D] px-5 pb-16 pt-28 md:px-10"
    >
      {/* SEO headline (the visible one is a live demo) */}
      <h1 className="sr-only">
        Blovi — the testimonial tool that polishes itself. Collect testimonials,
        improve them with AI, and embed a Wall of Love for a single $49 payment.
      </h1>

      {/* Spotlight + ambient glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% -8%, rgba(232,116,59,0.22) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 50% 55%, rgba(232,116,59,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Faint dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 40%, black, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Floating testimonial cards (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        {FLOAT_CARDS.map((card) => (
          <div
            key={card.name}
            data-depth={card.depth}
            className={`hero-float absolute w-[225px] ${card.className}`}
          >
            <div className="hero-float-inner rounded-2xl border border-white/10 bg-white/[0.97] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4EE] text-xs font-bold text-[#E8743B]">
                  {card.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#1A1A1A]">{card.name}</p>
                  <p className="truncate text-[10px] text-[#6B6B6B]">{card.role}</p>
                </div>
                {card.improved && (
                  <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-[#E8743B]/10 px-2 py-0.5 text-[9px] font-bold text-[#E8743B]">
                    <Sparkles size={9} />
                    AI
                  </span>
                )}
              </div>
              <div className="mt-2 flex gap-0.5 text-[10px] text-[#E8743B]">★★★★★</div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#6B6B6B]">{card.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex w-full max-w-[1000px] flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="hero-fade-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8743B]/40 bg-[#E8743B]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8743B] md:text-xs">
            <span aria-hidden="true">✦</span>
            Lifetime deal — pay once, own it forever
          </span>
        </div>

        {/* The live polish demo */}
        <div ref={blockRef} className="relative mt-10 w-full md:mt-12" aria-live="polite">
          {/* Stage labels (stacked, crossfaded) */}
          <div className="relative mx-auto mb-5 h-5 w-full">
            <p className="hero-label-before absolute inset-x-0 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/40 md:text-xs">
              Your customer wrote
            </p>
            <p className="hero-label-after absolute inset-x-0 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#E8743B] opacity-0 md:text-xs">
              ✦ Blovi polished it
            </p>
          </div>

          {/* The quote (giant type, scrambles in place) */}
          <div className="relative mx-auto max-w-[900px]">
            <span
              className="hero-stamp absolute -top-5 right-0 z-10 rounded-full bg-[#E8743B] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white opacity-0 shadow-[0_8px_24px_rgba(232,116,59,0.5)] md:-top-7 md:right-6 md:text-[11px]"
              aria-hidden="true"
            >
              ✦ Edited for clarity
            </span>
            <p
              ref={quoteRef}
              className="min-h-[3.2em] text-[clamp(1.85rem,5.4vw,4.25rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {`“${quote.messy}”`}
            </p>
          </div>

          {/* Attribution */}
          <p className="mt-5 text-sm text-white/50 md:text-base">
            <span className="text-[#E8743B]">★★★★★</span>
            {"  "}— {quote.name}, {quote.role}
          </p>
        </div>

        {/* The polish button */}
        <div className="hero-polish-wrap relative mt-9 flex flex-col items-center">
          <div
            className="hero-polish-glow absolute top-0 h-16 w-16 rounded-full bg-[#E8743B]/40 blur-2xl"
            aria-hidden="true"
          />
          <span
            className="hero-polish-ring absolute top-0 h-16 w-16 rounded-full border-2 border-[#E8743B]/60"
            aria-hidden="true"
          />
          <button
            onClick={polish}
            className="hero-polish-btn relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#E8743B] shadow-[0_12px_40px_rgba(232,116,59,0.55)] transition-colors hover:bg-[#CF5F2C]"
            aria-label="Polish this testimonial with AI"
          >
            <Sparkles size={26} className="text-white" strokeWidth={2} />
          </button>
          <span className="hero-hint mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            Tap to polish
          </span>
        </div>

        {/* Subhead */}
        <p className="hero-fade-2 mx-auto mt-10 max-w-xl text-base leading-relaxed text-[#9CA3AF] md:text-lg">
          Collect testimonials, polish them with AI in one click, and embed a
          beautiful Wall of Love —{" "}
          <strong className="font-semibold text-white">$49 once</strong>, never
          monthly.
        </p>

        {/* CTAs */}
        <div className="hero-fade-2 mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
          <PaddleCheckout className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#E8743B] px-9 py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(232,116,59,0.4)] transition-all hover:scale-[1.03] hover:bg-[#CF5F2C] hover:shadow-[0_16px_44px_rgba(232,116,59,0.5)] active:scale-95 sm:w-auto">
            Get Blovi for $49
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </PaddleCheckout>
          <Link
            href="#how-it-works"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-4 text-base font-semibold text-white transition-all hover:scale-[1.03] hover:border-white/40 hover:bg-white/5 sm:w-auto"
          >
            See how it works
          </Link>
        </div>

        {/* Trust line */}
        <p className="hero-fade-2 mt-6 text-sm text-white/40">
          No subscription · No per-seat fees · 30-day money-back guarantee
        </p>
      </div>
    </section>
  );
}
