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

type Phase = "messy" | "polishing" | "polished" | "swapping";

export default function LandingHero() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = QUOTES[quoteIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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
    gsap.to(cardRef.current, {
      autoAlpha: 0,
      y: -14,
      duration: 0.4,
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
      gsap.set(section.querySelector(".hero-label-before"), { autoAlpha: 0 });
      gsap.set(section.querySelector(".hero-label-after"), { autoAlpha: 1 });
      phaseRef.current = "polished";
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        phaseRef.current = "polished";
        timersRef.current.next = setTimeout(swapNext, 3200);
      },
    });

    tl.to(section.querySelector(".hero-polish-btn"), {
      scale: 0.92,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })
      .to(section.querySelector(".hero-label-before"), { autoAlpha: 0, y: -8, duration: 0.3 }, 0.1)
      .fromTo(
        section.querySelector(".hero-label-after"),
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        0.3
      )
      .to(
        quoteRef.current,
        {
          duration: 1.3,
          scrambleText: { text: `“${q.clean}”`, chars: "lowerCase", speed: 0.6 },
        },
        0.15
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

    gsap.set(section.querySelector(".hero-label-before"), { autoAlpha: 1, y: 0 });
    gsap.set(section.querySelector(".hero-label-after"), { autoAlpha: 0 });
    phaseRef.current = "messy";

    if (prefersReducedMotion()) return;

    gsap.fromTo(
      cardRef.current,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
    timersRef.current.auto = setTimeout(polish, 2600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteIndex]);

  // Entrance
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const timers = timersRef.current;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-fade", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.1)
        .fromTo(cardRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.45);
    }, section);

    timers.auto = setTimeout(polish, 3000);

    return () => {
      clearTimeout(timers.auto);
      clearTimeout(timers.next);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92svh] w-full flex-col items-center justify-center bg-[#FAF8F5] px-5 pb-20 pt-32 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-[880px] flex-col items-center text-center">
        <div className="hero-fade">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8743B]/30 bg-[#E8743B]/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8743B] md:text-xs">
            Pay once · Own it forever
          </span>
        </div>

        <h1
          className="hero-fade mt-7 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Customer praise,{" "}
          <span
            className="font-normal italic text-[#E8743B]"
            style={{ fontFamily: "var(--font-serif-accent)" }}
          >
            beautifully
          </span>{" "}
          presented.
        </h1>

        <p className="hero-fade mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#6B6B6B] md:text-lg">
          Collect testimonials, polish them with AI in one click, and embed a
          Wall of Love on your site —{" "}
          <strong className="font-semibold text-[#1A1A1A]">$49 once</strong>,
          never monthly.
        </p>

        <div className="hero-fade mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <PaddleCheckout className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#E8743B] px-8 py-4 text-base font-semibold text-white shadow-[0_10px_28px_rgba(232,116,59,0.3)] transition-all hover:scale-[1.02] hover:bg-[#CF5F2C] active:scale-95 sm:w-auto">
            Get Blovi for $49
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </PaddleCheckout>
          <Link
            href="/signup"
            className="flex w-full items-center justify-center rounded-full border border-[#1A1A1A]/15 px-8 py-4 text-base font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A]/35 hover:bg-white sm:w-auto"
          >
            Start free
          </Link>
        </div>

        <p className="hero-fade mt-5 text-sm text-[#6B6B6B]/80">
          Free plan available · No credit card · 30-day money-back guarantee
        </p>

        {/* Live polish demo — quiet, product-like */}
        <div
          ref={cardRef}
          aria-live="polite"
          className="mt-14 w-full max-w-[640px] rounded-2xl border border-[#ECE7E0] bg-white p-7 text-left shadow-[0_18px_50px_rgba(26,26,26,0.07)] md:p-9"
        >
          <div className="relative mb-4 h-5">
            <p className="hero-label-before absolute inset-x-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B]">
              Your customer wrote
            </p>
            <p className="hero-label-after absolute inset-x-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8743B] opacity-0">
              Blovi polished it
            </p>
          </div>

          <p
            ref={quoteRef}
            className="min-h-[3.4em] text-xl font-semibold leading-snug tracking-[-0.01em] text-[#1A1A1A] md:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {`“${quote.messy}”`}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#ECE7E0] pt-5">
            <p className="text-sm text-[#6B6B6B]">
              <span className="text-[#E8743B]">★★★★★</span>
              {"  "}— {quote.name}, {quote.role}
            </p>
            <button
              onClick={polish}
              aria-label="Polish this testimonial with AI"
              className="hero-polish-btn flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#16161D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#E8743B]"
            >
              <Sparkles size={13} />
              Polish with AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
