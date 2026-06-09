import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "./FadeIn";

export default function WallOfLove() {
  return (
    <section className="w-full bg-white py-24 px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1200px] text-center">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            Wall of love
          </p>
          <h2
            className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Be one of our first customers.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-[#6B6B6B]">
            ProofKit is freshly launched. Early customers get the lifetime deal
            at $49 — and their testimonial featured right here.
          </p>

          <div className="mt-10">
            {/* TODO: wire up payment — currently links to free signup */}
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-[#E8743B] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Get early access — $49
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Placeholder grid to show what will go here */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 opacity-30 pointer-events-none select-none" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-5 text-left">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="text-xs text-[#E8743B]">★</span>
                  ))}
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${70 + (i * 9) % 25}%` }} />
                  <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${50 + (i * 13) % 35}%` }} />
                  <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${60 + (i * 7) % 28}%` }} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#ECE7E0]" />
                  <div className="h-2 w-20 rounded bg-[#ECE7E0]" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#6B6B6B]">
            Your testimonial could be here.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
