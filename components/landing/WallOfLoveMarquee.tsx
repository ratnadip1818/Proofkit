import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

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
              className="font-normal italic text-[#2563EB]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              first customers.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-base text-[#6B6B6B] md:text-lg">
            Blovi is freshly launched. Early customers get our Pro tier for a simple $49 one-time payment
            — and their testimonial featured right here.
          </p>
          <div className="mt-9 text-center">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-8 py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.03] hover:bg-[#1d4ed8] active:scale-95"
            >
              Get early access — $49 one-time
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
