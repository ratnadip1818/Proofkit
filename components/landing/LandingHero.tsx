"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "./gsap";
import { useIsoLayoutEffect } from "./use-iso-layout-effect";

/* ═══════════════════════════════════════════════════════════
   Harvey-style floating document cards
   ═══════════════════════════════════════════════════════════ */
type CardSize = "lg" | "md" | "sm";

interface FloatingCard {
  id: string;
  source: "twitter" | "producthunt" | "linkedin" | "g2";
  category: string;
  messy: string;
  clean: string;
  author: string;
  x: number;
  y: number;
  rotation: number;
  size: CardSize;
  layer: number; // 0 = behind center, 1 = edge, 2 = mid ring, 3 = prominent
}

const SIZES: Record<CardSize, { w: number; h: number; fs: number; clamp: number; pad: number }> = {
  lg: { w: 210, h: 155, fs: 12, clamp: 5, pad: 16 },
  md: { w: 175, h: 130, fs: 11, clamp: 4, pad: 14 },
  sm: { w: 145, h: 108, fs: 10, clamp: 3, pad: 12 },
};

const LAYER_OPACITY = [0.08, 0.35, 0.55, 0.70];

const CARDS: FloatingCard[] = [
  // ── Edge: Far Left (partially cropped) ────────────────────────────
  { id: "c1", source: "twitter", category: "Twitter Review", messy: "blovi is literally magic... imported 20 tweets in 3 clicks", clean: "Blovi is literally magic! Imported 20 tweets in 3 clicks.", author: "Alex R.", x: -740, y: -270, rotation: 35, size: "sm", layer: 1 },
  { id: "c2", source: "linkedin", category: "LinkedIn Post", messy: "setup was suuuper quick and the wall looks amazing on site", clean: "Setup was super quick and the wall looks amazing on our site.", author: "Devon R.", x: -750, y: 60, rotation: -48, size: "sm", layer: 1 },
  { id: "c3", source: "g2", category: "G2 Review", messy: "finally a testimonial tool that doesnt charge monthly", clean: "Finally a testimonial tool that doesn't charge monthly.", author: "Marc G.", x: -710, y: 360, rotation: 62, size: "sm", layer: 1 },

  // ── Edge: Far Right (partially cropped) ───────────────────────────
  { id: "c4", source: "producthunt", category: "Product Hunt", messy: "cleanest widget builder i have used lifetime pricing steal", clean: "Cleanest widget builder I've used. Lifetime pricing is a steal.", author: "Sarah L.", x: 750, y: -240, rotation: -32, size: "sm", layer: 1 },
  { id: "c5", source: "twitter", category: "Twitter Review", messy: "our conversion rate jumped 14% after the marquee widget", clean: "Our conversion rate jumped 14% after adding the marquee widget.", author: "Elena R.", x: 770, y: 110, rotation: 42, size: "sm", layer: 1 },
  { id: "c6", source: "g2", category: "G2 Review", messy: "honestly didnt think id use it this much its so easy", clean: "Honestly didn't think I'd use it this much. It's so easy.", author: "Chloe M.", x: 730, y: 390, rotation: -58, size: "sm", layer: 1 },

  // ── Edge: Top (partially cropped) ─────────────────────────────────
  { id: "c7", source: "linkedin", category: "LinkedIn Post", messy: "imported all my twitter feedback in under a minute wow", clean: "Imported all my Twitter feedback in under a minute.", author: "Alex G.", x: -280, y: -430, rotation: 14, size: "sm", layer: 1 },
  { id: "c8", source: "g2", category: "G2 Review", messy: "dashboard analytics clean and widgets look super premium", clean: "Dashboard analytics are clean and widgets look super premium.", author: "Rachel S.", x: 30, y: -460, rotation: -4, size: "sm", layer: 0 },
  { id: "c9", source: "producthunt", category: "Product Hunt", messy: "widgets load faster than any provider i ever tested before", clean: "Widgets load faster than any other provider I ever tested.", author: "Devon R.", x: 250, y: -440, rotation: -10, size: "sm", layer: 1 },

  // ── Edge: Bottom (partially cropped) ──────────────────────────────
  { id: "c10", source: "twitter", category: "Twitter Review", messy: "beautiful walls of love easy edits pricing unbeatable", clean: "Beautiful walls of love, easy edits, pricing unbeatable.", author: "Emma G.", x: -320, y: 430, rotation: -16, size: "sm", layer: 1 },
  { id: "c11", source: "g2", category: "G2 Review", messy: "setup was quick widget options let us match styles perfectly", clean: "Setup was quick, widget options match styles perfectly.", author: "Nina J.", x: 280, y: 440, rotation: 20, size: "sm", layer: 1 },

  // ── Outer Ring: Primary visible cards ─────────────────────────────
  { id: "c12", source: "producthunt", category: "Product Hunt", messy: "zero layout shift edge cached cdn loads instantly major win", clean: "Zero layout shift, edge cached CDN. Loads instantly — major win!", author: "James K.", x: -550, y: -270, rotation: -18, size: "lg", layer: 3 },
  { id: "c13", source: "twitter", category: "Twitter Review", messy: "simple lightweight pricing is $49 once what is not to love", clean: "Simple, lightweight, and $49 once. What's not to love?", author: "Tom W.", x: -580, y: 20, rotation: 14, size: "md", layer: 2 },
  { id: "c14", source: "linkedin", category: "LinkedIn Post", messy: "lifetime pricing model is exactly what indie makers need", clean: "Lifetime pricing model is exactly what indie makers need.", author: "Sophie K.", x: -510, y: 260, rotation: -20, size: "lg", layer: 3 },
  { id: "c15", source: "g2", category: "G2 Review", messy: "luv this app saved me so much time best $49 i spent this year", clean: "I love this app — saved me so much time. Best $49 this year.", author: "Maria K.", x: 560, y: -250, rotation: 22, size: "lg", layer: 3 },
  { id: "c16", source: "twitter", category: "Twitter Review", messy: "setup was suuuper quick and the wall of love looks amazing", clean: "Setup was super quick and the Wall of Love looks amazing!", author: "David B.", x: 600, y: 40, rotation: -16, size: "md", layer: 2 },
  { id: "c17", source: "producthunt", category: "Product Hunt", messy: "customers love sending reviews now ui polished conversion up", clean: "Customers love sending reviews now. UI polished, conversion up!", author: "Aria P.", x: 530, y: 280, rotation: 18, size: "lg", layer: 3 },

  // ── Outer Ring: Diagonals ─────────────────────────────────────────
  { id: "c18", source: "linkedin", category: "LinkedIn Post", messy: "superb lightweight scripts fast renders on vercel edge caching", clean: "Superb lightweight scripts, fast renders on Vercel Edge caching!", author: "Chris T.", x: -400, y: -340, rotation: -24, size: "md", layer: 2 },
  { id: "c19", source: "g2", category: "G2 Review", messy: "clean dashboard beautiful templates lifetime pricing worth it", clean: "Clean dashboard, beautiful templates, lifetime pricing worth it.", author: "Li W.", x: 420, y: -330, rotation: 20, size: "md", layer: 2 },
  { id: "c20", source: "twitter", category: "Twitter Review", messy: "clean dashboard interface imports instant setup looks nice", clean: "Clean dashboard, instant imports, setup looks super nice.", author: "Marcus V.", x: -430, y: 310, rotation: 16, size: "md", layer: 2 },
  { id: "c21", source: "producthunt", category: "Product Hunt", messy: "integrated blovi in under five mins zero bugs fast responses", clean: "Integrated Blovi in under five minutes. Zero bugs, fast responses.", author: "Luke D.", x: 440, y: 330, rotation: -18, size: "md", layer: 2 },

  // ── Inner Ring (outside center exclusion zone) ────────────────────
  { id: "c22", source: "g2", category: "G2 Review", messy: "highly customizable widget pricing is an absolute steal", clean: "Highly customizable widget. Pricing is an absolute steal.", author: "Mia T.", x: -460, y: -210, rotation: -8, size: "md", layer: 2 },
  { id: "c23", source: "twitter", category: "Twitter Review", messy: "imported and embedded in seconds dashboard ui very intuitive", clean: "Imported and embedded in seconds. Dashboard UI is very intuitive.", author: "Ryan B.", x: -480, y: 170, rotation: 10, size: "md", layer: 2 },
  { id: "c24", source: "linkedin", category: "LinkedIn Post", messy: "setup simple layout loads fast custom styling fits our brand", clean: "Setup was simple, layout loads fast, custom styling fits our brand.", author: "Leo H.", x: 470, y: -200, rotation: 12, size: "md", layer: 2 },
  { id: "c25", source: "producthunt", category: "Product Hunt", messy: "best testimonial system online fast loads clean styles no bloat", clean: "Best testimonial system online. Fast loads, clean styles, no bloat.", author: "Dan S.", x: 490, y: 160, rotation: -10, size: "md", layer: 2 },

  // ── Inner Ring: Top & Bottom ──────────────────────────────────────
  { id: "c26", source: "twitter", category: "Twitter Review", messy: "finally a widgets library that looks premium and loads fast", clean: "Finally a widgets library that looks premium and loads fast!", author: "Rachel S.", x: -220, y: -330, rotation: 6, size: "sm", layer: 2 },
  { id: "c27", source: "g2", category: "G2 Review", messy: "widgets load faster than any provider i tested clean design", clean: "Widgets load faster than any provider I tested. Clean design.", author: "Devon R.", x: 200, y: -340, rotation: -8, size: "sm", layer: 2 },
  { id: "c28", source: "linkedin", category: "LinkedIn Post", messy: "clean dashboard imports instant setup looks super nice", clean: "Clean dashboard, instant imports, setup looks super nice.", author: "Marcus V.", x: -250, y: 340, rotation: -6, size: "sm", layer: 2 },
  { id: "c29", source: "producthunt", category: "Product Hunt", messy: "setup quick widget options match our styles perfectly!!", clean: "Setup was quick, widget options match our styles perfectly.", author: "Nina J.", x: 230, y: 330, rotation: 10, size: "sm", layer: 2 },

  // ── Behind Center (extremely faint, depth effect) ─────────────────
  { id: "c30", source: "twitter", category: "Twitter Review", messy: "zero layout shift edge cached cdn loads instantly on site", clean: "Zero layout shift, edge cached CDN. Loads instantly!", author: "James K.", x: -220, y: -250, rotation: 4, size: "sm", layer: 0 },
  { id: "c31", source: "linkedin", category: "LinkedIn Post", messy: "simple lightweight pricing $49 once what is not to love", clean: "Simple, lightweight, $49 once. What's not to love?", author: "Tom W.", x: 230, y: -260, rotation: -5, size: "sm", layer: 0 },
  { id: "c32", source: "g2", category: "G2 Review", messy: "lifetime pricing exactly what indie makers need recommend", clean: "Lifetime pricing — exactly what indie makers need!", author: "Sophie K.", x: -210, y: 290, rotation: -3, size: "sm", layer: 0 },
  { id: "c33", source: "producthunt", category: "Product Hunt", messy: "superb lightweight scripts fast renders edge caching wow", clean: "Superb lightweight scripts, fast renders on edge caching.", author: "Chris T.", x: 220, y: 300, rotation: 6, size: "sm", layer: 0 },

  // ── Extra Edge Fillers ────────────────────────────────────────────
  { id: "c34", source: "linkedin", category: "LinkedIn Post", messy: "landing page conversion jumped after adding blovi widgets", clean: "Our landing page conversion jumped after adding Blovi widgets.", author: "Elena R.", x: -650, y: -140, rotation: 10, size: "sm", layer: 1 },
  { id: "c35", source: "twitter", category: "Twitter Review", messy: "best $49 spent this year for our saas testimonials page", clean: "Best $49 spent this year for our SaaS testimonials page.", author: "Maria K.", x: 660, y: -90, rotation: -14, size: "sm", layer: 1 },
];

/* ═══════════════════════════════════════════════════════════
   Main Hero Component
   ═══════════════════════════════════════════════════════════ */
export default function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardsVisible, setCardsVisible] = useState(false);

  // Fade cards in after initial render
  useEffect(() => {
    const t = setTimeout(() => setCardsVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Track mouse coordinates for desktop parallax
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePos({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Entrance: hero text fade-in only (cards use CSS fade)
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero-fade", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.1);
    }, section);
    return () => ctx.revert();
  }, []);

  /* ── Render ── */
  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] w-full flex-col items-center justify-center bg-[#FAF8F5] px-5 pb-20 pt-32 md:px-10 overflow-hidden select-none"
      style={{
        maskImage: "radial-gradient(ellipse 120% 110% at 50% 47%, black 20%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse 120% 110% at 50% 47%, black 20%, transparent 90%)",
      }}
    >
      {/* ── Harvey-style scattered cards (desktop only) ── */}
      {CARDS.map((card, index) => {
        const baseOpacity = LAYER_OPACITY[card.layer] ?? 0.5;

        // Mouse-driven parallax
        const pStr = 0.012 + card.layer * 0.003;
        const dx = mousePos.x * card.x * pStr;
        const dy = mousePos.y * card.y * pStr;

        // Slow float parameters
        const floatDur = 22 + (index % 7) * 4;
        const floatDelay = -index * 2.1;

        return (
          <div
            key={card.id}
            className="absolute hidden md:block pointer-events-none select-none"
            style={{
              left: `calc(50% + ${card.x}px)`,
              top: `calc(47% + ${card.y}px)`,
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
              zIndex: card.layer + 1,
              opacity: cardsVisible ? baseOpacity : 0,
              transition: `opacity 0.8s ease ${index * 0.03}s, transform 0.25s cubic-bezier(0.16,1,0.3,1)`,
            }}
          >
            <div
              style={{
                animation: prefersReducedMotion()
                  ? "none"
                  : `harveyFloat ${floatDur}s ease-in-out ${floatDelay}s infinite alternate`,
              }}
            >
              <HarveyStyleCard card={card} />
            </div>
          </div>
        );
      })}

      {/* Slow CSS drift animation */}
      <style jsx global>{`
        @keyframes harveyFloat {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          50%  { transform: translate(6px, -10px) rotate(0.4deg); }
          100% { transform: translate(-8px, 8px) rotate(-0.4deg); }
        }
      `}</style>

      {/* ── Main hero typography & CTAs ── */}
      <div className="relative z-20 mx-auto flex w-full max-w-[680px] flex-col items-center text-center pointer-events-none">
        <div className="hero-fade pointer-events-auto">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A8A8A] md:text-[10.5px]">
            Pay once · Own it forever
          </span>
        </div>

        <h1
          className="hero-fade mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-[#1A1A1A] pointer-events-auto"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Customer praise,<br />
          <span
            className="font-normal italic text-[#E8743B]"
            style={{ fontFamily: "var(--font-serif-accent)" }}
          >
            beautifully
          </span>{" "}
          presented.
        </h1>

        <p className="hero-fade mx-auto mt-4 max-w-[420px] text-[12.5px] leading-relaxed text-[#6B6B6B] pointer-events-auto">
          Collect testimonials, polish with AI,<br className="hidden sm:inline" /> and embed a Wall of Love in minutes.
        </p>

        <div className="hero-fade mt-7 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row pointer-events-auto">
          <Link
            href="/signup"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#E8743B] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(232,116,59,0.3)] transition-all hover:scale-[1.02] hover:bg-[#CF5F2C] active:scale-95 sm:w-auto"
          >
            Get Blovi for $49
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/signup"
            className="flex w-full items-center justify-center rounded-full border border-[#1A1A1A]/15 px-7 py-3.5 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A]/35 hover:bg-white sm:w-auto"
          >
            Start free
          </Link>
        </div>


      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Harvey-style minimal document card
   ═══════════════════════════════════════════════════════════ */
function HarveyStyleCard({ card }: { card: FloatingCard }) {
  const s = SIZES[card.size];

  return (
    <div
      className="pointer-events-none select-none"
      style={{
        width: s.w,
        height: s.h,
        padding: s.pad,
        borderRadius: 12,
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        transform: `rotate(${card.rotation}deg)`,
        display: "flex",
        flexDirection: "column" as const,
        cursor: "default",
        userSelect: "none" as const,
        overflow: "hidden",
      }}
    >
      {/* 5-Star Rating */}
      <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: "#E8743B", fontSize: card.size === "sm" ? 10 : 12 }}>
            ★
          </span>
        ))}
      </div>

      {/* Testimonial text */}
      <p
        style={{
          marginTop: 4,
          fontSize: s.fs,
          fontWeight: 700,
          lineHeight: 1.42,
          color: "#1A1A1A",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: s.clamp,
          WebkitBoxOrient: "vertical" as const,
          textOverflow: "ellipsis",
        }}
      >
        {`\u201c${card.messy}\u201d`}
      </p>

      {/* Author profile (avatar + name) */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: card.size === "sm" ? 14 : 18,
            height: card.size === "sm" ? 14 : 18,
            borderRadius: "50%",
            backgroundColor: "#FFF4EE",
            color: "#E8743B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: card.size === "sm" ? 7 : 9,
            fontWeight: 700,
            flexShrink: 0,
            border: "1px solid rgba(232,116,59,0.15)",
          }}
        >
          {card.author.charAt(0).toUpperCase()}
        </div>
        <p
          style={{
            fontSize: card.size === "sm" ? 8 : 9,
            fontWeight: 600,
            color: "#555",
            margin: 0,
          }}
        >
          {card.author}
        </p>
      </div>
    </div>
  );
}
