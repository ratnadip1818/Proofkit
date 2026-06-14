"use client";

import { Sparkles, Star, Mail, ClipboardList } from "lucide-react";
import Reveal from "./Reveal";

const WALL_CARDS = [
  { name: "Maria K.", body: "Saved me so much time. Highly recommend to any founder!" },
  { name: "Devon R.", body: "Set up in five minutes. Looks great on my portfolio." },
  { name: "Priya S.", body: "Our agency clients love seeing the wall on their sites." },
];

const WIDGET_STYLES = ["Wall of Love", "Carousel", "Marquee", "Single Quote"];

function MiniCard({ name, body }: { name: string; body: string }) {
  return (
    <div className="relative flex flex-col h-[220px] p-5 bg-white border border-[#e4e4e7] rounded-xl text-left overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02),_0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Decorative quote mark */}
      <span
        aria-hidden="true"
        className="absolute top-1 right-3 text-[52px] leading-none font-serif text-[#E8743B] opacity-10 pointer-events-none select-none"
      >
        ”
      </span>

      {/* Star rating */}
      <div className="flex gap-0.5 text-xs text-[#f59e0b] mb-3">
        ★★★★★
      </div>

      {/* Testimonial body */}
      <p className="flex-1 text-[13.5px] leading-[1.65] text-[#3f3f46] overflow-hidden line-clamp-4">
        {body}
      </p>

      {/* Author details */}
      <div className="mt-4 flex items-center gap-2.5">
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#FFF4EE] text-[13.6px] font-bold text-[#E8743B]">
          {name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[13px] font-bold text-[#18181b] truncate">
            {name}
            <span className="inline-flex items-center text-[#2E9E6B]" title="Verified customer">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="block"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
          </p>
          <p className="text-[11px] text-[#71717a] truncate">Verified customer</p>
        </div>
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
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                  Wall of Love widget
                </h3>
                <span className="rounded-full bg-[#E8743B]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#E8743B]">
                  Preview
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6B6B6B]">
                Embed a beautiful grid layout on any website with one script
                tag. It auto-resizes and matches your brand.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {WALL_CARDS.map((card) => (
                  <MiniCard key={card.name} {...card} />
                ))}
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
                Ratings, avatars &amp; alerts
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                Collect star ratings and customer avatars, and get an email the moment a
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
