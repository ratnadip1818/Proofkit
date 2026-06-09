import { Link2, CheckSquare, Code2 } from "lucide-react";
import FadeIn from "./FadeIn";

const STEPS = [
  {
    num: "01",
    icon: Link2,
    title: "Collect",
    desc: "Share your unique ProofKit link with customers. They fill out a short form — name, role, rating, and their testimonial. No login needed on their end.",
  },
  {
    num: "02",
    icon: CheckSquare,
    title: "Curate",
    desc: "Every submission lands in your inbox. Review, approve, or hide testimonials with a single click. Full control over what goes live.",
  },
  {
    num: "03",
    icon: Code2,
    title: "Embed",
    desc: "Paste one script tag anywhere — your site, Notion, Framer, Webflow, or any no-code tool. Your Wall of Love appears instantly and auto-resizes.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-[#FAF8F5] py-24 px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            How it works
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three steps to social proof.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#6B6B6B]">
            From zero to embedded testimonials in under 10 minutes.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm h-full">
                {/* Step connector line (hidden on last) */}
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute top-12 -right-3 hidden md:block h-px w-6 bg-[#ECE7E0]"
                    aria-hidden="true"
                  />
                )}

                {/* Number badge */}
                <span
                  className="text-5xl font-extrabold text-[#ECE7E0] leading-none select-none"
                  aria-hidden="true"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.num}
                </span>

                {/* Icon */}
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8743B]/10">
                  <step.icon size={22} className="text-[#E8743B]" strokeWidth={2} />
                </div>

                <h3
                  className="mt-4 text-xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
