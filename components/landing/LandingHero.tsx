"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import { BorderBeam } from "@/components/magicui/border-beam";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

const HEADLINE: { text: string; serif?: boolean }[] = [
  { text: "The" },
  { text: "testimonial" },
  { text: "tool" },
  { text: "that" },
  { text: "polishes", serif: true },
  { text: "itself", serif: true },
];

const FLOAT_CARDS = [
  {
    name: "Maria K.",
    role: "Founder, Lume",
    body: "Saved me so much time. Highly recommend!",
    improved: true,
    className: "left-[1%] top-[20%] rotate-[-7deg]",
    depth: 1,
  },
  {
    name: "Devon R.",
    role: "Freelance designer",
    body: "Set up the wall on my site in five minutes.",
    improved: false,
    className: "right-[1%] top-[16%] rotate-[6deg]",
    depth: 0.6,
  },
  {
    name: "Priya S.",
    role: "Agency owner",
    body: "Finally a tool I don't pay monthly for.",
    improved: false,
    className: "left-[4%] top-[58%] rotate-[4deg]",
    depth: 0.7,
  },
  {
    name: "Tom W.",
    role: "Indie hacker",
    body: "The AI polish button is genuinely magic.",
    improved: true,
    className: "right-[3%] top-[60%] rotate-[-5deg]",
    depth: 1.1,
  },
];

const SIDEBAR_LINKS = ["Dashboard", "Testimonials", "Forms", "Widgets", "Import"];

const STATS = [
  { label: "Total", value: "12" },
  { label: "Pending", value: "1" },
  { label: "Approved", value: "10" },
  { label: "Hidden", value: "1" },
];

const ROWS = [
  {
    name: "Maria K.",
    role: "Founder, Lume",
    body: "I love this app — it saved me so much time. Highly recommend!",
    improved: true,
  },
  {
    name: "Devon R.",
    role: "Freelance designer",
    body: "Set up the wall on my site in five minutes. Looks great.",
    improved: false,
  },
  {
    name: "Priya S.",
    role: "Agency owner",
    body: "Finally a testimonial tool I don't have to pay for every month.",
    improved: false,
  },
];

export default function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Entrance choreography
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hero-word",
        { yPercent: 115, rotate: 5 },
        { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.07 },
        0.15,
      )
        .fromTo(
          ".hero-fade",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
          0.55,
        )
        .fromTo(
          ".hero-float",
          { autoAlpha: 0, scale: 0.8, y: 30 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1, stagger: 0.08, ease: "back.out(1.6)" },
          0.8,
        )
        .fromTo(
          mockupRef.current,
          { autoAlpha: 0, y: 80 },
          { autoAlpha: 1, y: 0, duration: 1.2 },
          0.9,
        );

      // 3D mockup straightens as it scrolls into view
      gsap.fromTo(
        ".hero-mockup-inner",
        { rotateX: 24, scale: 0.94 },
        {
          rotateX: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: mockupRef.current,
            start: "top 90%",
            end: "top 35%",
            scrub: 0.6,
          },
        },
      );

      // Idle float on the cards (inner element so it never fights the pointer parallax)
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

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain relative w-full overflow-hidden bg-[#FAF8F5] px-5 pb-20 pt-36 md:px-10 md:pt-44"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,116,59,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Faint dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(26,26,26,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 30%, black, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Floating testimonial cards (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        {FLOAT_CARDS.map((card) => (
          <div
            key={card.name}
            data-depth={card.depth}
            className={`hero-float absolute w-[230px] ${card.className}`}
          >
            <div className="hero-float-inner rounded-2xl border border-[#ECE7E0] bg-white/90 p-4 shadow-[0_16px_40px_rgba(26,26,26,0.08)] backdrop-blur-sm">
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

      <div className="relative mx-auto w-full max-w-[1200px] text-center">
        {/* Eyebrow */}
        <div className="hero-fade">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8743B]/30 bg-[#E8743B]/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8743B] md:text-xs">
            <span aria-hidden="true">✦</span>
            Lifetime deal — pay once, own it forever
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mx-auto mt-7 max-w-5xl text-[clamp(2.9rem,8.5vw,7rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {HEADLINE.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <span
                className={`hero-word inline-block will-change-transform ${
                  word.serif ? "pr-[0.06em] font-normal italic text-[#E8743B]" : ""
                }`}
                style={word.serif ? { fontFamily: "var(--font-serif-accent)" } : undefined}
              >
                {word.text}
                {i < HEADLINE.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>

        {/* Subhead */}
        <p className="hero-fade mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#6B6B6B] md:text-xl">
          Collect text testimonials, improve them with AI in one click, and embed
          a beautiful Wall of Love on your site — for a{" "}
          <strong className="font-semibold text-[#1A1A1A]">single $49 payment</strong>.
          Not $29 every month, forever.
        </p>

        {/* CTAs */}
        <div className="hero-fade mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <PaddleCheckout className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#E8743B] px-9 py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(232,116,59,0.4)] transition-all hover:scale-[1.03] hover:bg-[#CF5F2C] hover:shadow-[0_16px_44px_rgba(232,116,59,0.5)] active:scale-95 sm:w-auto">
            Get Blovi for $49
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </PaddleCheckout>
          <Link
            href="#how-it-works"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#1A1A1A]/15 bg-white/70 px-9 py-4 text-base font-semibold text-[#1A1A1A] backdrop-blur-sm transition-all hover:border-[#1A1A1A]/30 hover:scale-[1.03] sm:w-auto"
          >
            See how it works
          </Link>
        </div>

        {/* Trust line */}
        <p className="hero-fade mt-6 text-sm text-[#6B6B6B]">
          No subscription · No per-seat fees · 30-day money-back guarantee
        </p>

        {/* Dashboard mockup in 3D perspective */}
        <div
          ref={mockupRef}
          className="mx-auto mt-20 w-full max-w-[960px]"
          style={{ perspective: "1400px" }}
        >
          <div className="hero-mockup-inner relative overflow-hidden rounded-2xl border border-[#ECE7E0] bg-white text-left shadow-[0_48px_120px_-24px_rgba(232,116,59,0.28),0_24px_60px_-24px_rgba(26,26,26,0.18)] [transform-style:preserve-3d]">
            <BorderBeam duration={8} />

            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-[#ECE7E0] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="h-3 w-3 rounded-full bg-[#ECE7E0]" />
              <div className="ml-2 truncate rounded-full bg-[#FAF8F5] px-3 py-1 text-[11px] text-[#6B6B6B]">
                blovi.space/dashboard
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="hidden w-40 shrink-0 flex-col gap-1 border-r border-[#ECE7E0] p-4 sm:flex">
                {SIDEBAR_LINKS.map((link, i) => (
                  <div
                    key={link}
                    className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      i === 0 ? "bg-[#E8743B]/10 text-[#E8743B]" : "text-[#6B6B6B]"
                    }`}
                  >
                    {link}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="flex-1 p-4 sm:p-5">
                <div className="grid grid-cols-4 gap-2">
                  {STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] px-2 py-2.5 text-center sm:px-3"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#6B6B6B] sm:text-xs">
                        {s.label}
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[#E8743B] sm:text-xl">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-2">
                  {ROWS.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-start gap-3 rounded-xl border border-[#ECE7E0] p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4EE] text-xs font-bold text-[#E8743B]">
                        {row.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[#1A1A1A]">{row.name}</span>
                          <span className="text-[11px] text-[#6B6B6B]">{row.role}</span>
                          <span className="text-[10px] text-[#E8743B]">★★★★★</span>
                          {row.improved && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8743B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#E8743B]">
                              <Sparkles size={10} />
                              AI improved
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-[#6B6B6B]">{row.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
