import { ArrowRight } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import Reveal from "./Reveal";

function SkeletonCard({ seed }: { seed: number }) {
  return (
    <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-5">
      <div className="flex gap-0.5 text-xs text-[#E8743B]/60">★★★★★</div>
      <div className="mt-3 space-y-1.5">
        <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${70 + ((seed * 9) % 25)}%` }} />
        <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${50 + ((seed * 13) % 35)}%` }} />
        <div className="h-2 rounded bg-[#ECE7E0]" style={{ width: `${60 + ((seed * 7) % 28)}%` }} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-[#ECE7E0]" />
        <div className="h-2 w-20 rounded bg-[#ECE7E0]" />
      </div>
    </div>
  );
}

function Column({
  seeds,
  duration,
  reverse = false,
  className = "",
}: {
  seeds: number[];
  duration: string;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`h-full overflow-hidden ${className}`}>
      <div
        className={`animate-marquee-y flex flex-col gap-4 ${reverse ? "marquee-reverse" : ""}`}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {/* duplicated for a seamless loop */}
        <div className="flex flex-col gap-4 pb-4">
          {seeds.map((s) => (
            <SkeletonCard key={s} seed={s} />
          ))}
        </div>
        <div className="flex flex-col gap-4 pb-4" aria-hidden="true">
          {seeds.map((s) => (
            <SkeletonCard key={s} seed={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WallOfLoveMarquee() {
  return (
    <section className="w-full overflow-hidden bg-white px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B] md:text-xs">
            Wall of love
          </p>
          <h2
            className="text-center text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Be one of our{" "}
            <span
              className="font-normal italic text-[#E8743B]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              first customers.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base text-[#6B6B6B] md:text-lg">
            Blovi is freshly launched. Early customers get the $49 lifetime deal
            — and their testimonial featured right here.
          </p>
          <div className="mt-9 text-center">
            <PaddleCheckout className="group inline-flex items-center gap-2 rounded-full bg-[#E8743B] px-8 py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(232,116,59,0.35)] transition-all hover:scale-[1.03] hover:bg-[#CF5F2C] active:scale-95">
              Get early access — $49
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </PaddleCheckout>
          </div>
        </Reveal>

        {/* Scrolling placeholder columns */}
        <Reveal delay={0.12}>
          <div
            className="relative mt-16 grid h-[380px] grid-cols-2 gap-4 opacity-60 md:h-[440px] md:grid-cols-3"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            }}
            aria-hidden="true"
          >
            <Column seeds={[1, 2, 3, 4]} duration="34s" />
            <Column seeds={[5, 6, 7, 8]} duration="28s" reverse />
            <Column seeds={[9, 10, 11, 12]} duration="38s" className="hidden md:block" />
          </div>
          <p className="mt-6 text-center text-xs text-[#6B6B6B]">
            Your testimonial could be here.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
