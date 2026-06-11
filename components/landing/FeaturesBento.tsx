"use client";

import { Sparkles, Star, Mail, ClipboardList } from "lucide-react";
import Reveal from "./Reveal";

const WALL_CARDS = [
  { name: "Maria K.", body: "Saved me so much time. Highly recommend to any founder!" },
  { name: "Devon R.", body: "Set up in five minutes. Looks great on my portfolio." },
  { name: "Priya S.", body: "Our agency clients love seeing the wall on their sites." },
  { name: "Tom W.", body: "The AI polish button is genuinely magic." },
  { name: "Ana L.", body: "Exactly what my course site needed." },
  { name: "Sam B.", body: "Pay once and forget about it. Perfect." },
];

const WIDGET_STYLES = ["Wall of Love", "Carousel", "Marquee", "Single Quote"];

function MiniCard({ name, body }: { name: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#ECE7E0] bg-white p-3.5">
      <div className="flex gap-0.5 text-[9px] text-[#E8743B]">★★★★★</div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-[#6B6B6B]">{body}</p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF4EE] text-[8px] font-bold text-[#E8743B]">
          {name.charAt(0)}
        </span>
        <span className="text-[10px] font-semibold text-[#1A1A1A]">{name}</span>
      </div>
    </div>
  );
}

const CARD_BASE =
  "group relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-[#FAF8F5] transition-all duration-300 hover:-translate-y-1 hover:border-[#E8743B]/40 hover:shadow-[0_24px_56px_rgba(232,116,59,0.14)]";

export default function FeaturesBento() {
  return (
    <section id="features" className="w-full bg-white px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B] md:text-xs">
            Features
          </p>
          <h2
            className="text-center text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need,{" "}
            <span
              className="font-normal italic text-[#E8743B]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              built in.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base text-[#6B6B6B] md:text-lg">
            No fluff. Just the core tools to collect, polish and display
            testimonials — working today.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {/* Wall of Love — large card */}
          <Reveal className="md:col-span-2" y={48}>
            <div className={`${CARD_BASE} h-full p-7 md:p-9`}>
              <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                Wall of Love widget
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6B6B6B]">
                Embed a beautiful masonry grid on any website with one script
                tag. It auto-resizes and matches your brand.
              </p>
              <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {WALL_CARDS.map((card) => (
                  <MiniCard key={card.name} {...card} />
                ))}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF8F5] to-transparent transition-opacity duration-300 group-hover:opacity-0" />
              </div>
            </div>
          </Reveal>

          {/* AI improvement */}
          <Reveal delay={0.08} y={48}>
            <div className={`${CARD_BASE} flex h-full flex-col p-7 md:p-9`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8743B]/10">
                <Sparkles size={22} className="text-[#E8743B]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                AI improvement button
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                One click polishes grammar and clarity. The original is always
                preserved.
              </p>
              <div className="mt-auto space-y-2 pt-6">
                <div className="rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 text-[11px] text-[#6B6B6B] line-through decoration-[#E8743B]/40">
                  luv this app tbh!!
                </div>
                <div className="rounded-lg border border-[#E8743B]/40 bg-white px-3 py-2 text-[11px] font-medium text-[#1A1A1A]">
                  ✦ I love this app — highly recommend!
                </div>
              </div>
            </div>
          </Reveal>

          {/* Widget styles */}
          <Reveal delay={0.05} y={48}>
            <div className={`${CARD_BASE} flex h-full flex-col p-7 md:p-9`}>
              <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                Four widget styles
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                All included. Switch any time without touching your site.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {WIDGET_STYLES.map((style, i) => (
                  <span
                    key={style}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                      i === 0
                        ? "bg-[#E8743B] text-white"
                        : "border border-[#ECE7E0] bg-white text-[#6B6B6B]"
                    }`}
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Collection form */}
          <Reveal delay={0.1} y={48}>
            <div className={`${CARD_BASE} flex h-full flex-col p-7 md:p-9`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8743B]/10">
                <ClipboardList size={22} className="text-[#E8743B]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                Shareable collection form
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                Custom headline, colors and prompts. Mobile friendly. CSV import
                for testimonials you already have.
              </p>
              <div className="mt-auto pt-6">
                <div className="truncate rounded-full border border-[#ECE7E0] bg-white px-4 py-2 text-[11px] text-[#6B6B6B]">
                  blovi.space/c/<span className="font-semibold text-[#E8743B]">your-brand</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Ratings + notifications */}
          <Reveal delay={0.15} y={48}>
            <div className={`${CARD_BASE} flex h-full flex-col p-7 md:p-9`}>
              <div className="flex gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8743B]/10">
                  <Star size={22} className="text-[#E8743B]" strokeWidth={1.75} />
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8743B]/10">
                  <Mail size={22} className="text-[#E8743B]" strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                Ratings, photos &amp; alerts
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                Collect star ratings and photos, and get an email the moment a
                new testimonial lands.
              </p>
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-2.5 rounded-xl border border-[#ECE7E0] bg-white p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2E9E6B]/10 text-xs">
                    ✉️
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold text-[#1A1A1A]">
                      New testimonial from Maria K.
                    </p>
                    <p className="text-[10px] text-[#6B6B6B]">just now · ★★★★★</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
