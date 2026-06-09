import Link from "next/link";
import { Check, Shield } from "lucide-react";
import FadeIn from "./FadeIn";

const FEATURES = [
  "Unlimited testimonials",
  "Text & video testimonials",
  "Wall of Love embed widget",
  "Custom collection form",
  "Import from 30+ platforms",
  "Custom branding (remove ProofKit logo)",
  "Unlimited projects & domains",
  "No per-seat or per-domain fees",
  "Lightning-fast embed script",
  "Star ratings & author profiles",
  "One-click approve / hide",
  "All future updates included",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-28 px-6"
      style={{ backgroundColor: "#16161D" }}
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#E8743B] mb-4">
            Pricing
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One price. Everything included.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#9CA3AF]">
            No tiers, no asterisks, no usage caps. Pay once — own it forever.
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mx-auto mt-12 max-w-lg rounded-2xl bg-white p-10 shadow-2xl">
            {/* Price */}
            <div className="text-center">
              <div className="mb-3 inline-block rounded-full bg-[#E8743B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
                Lifetime deal
              </div>
              <div className="flex items-start justify-center gap-1">
                <span
                  className="mt-3 text-2xl font-bold text-[#6B6B6B]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  $
                </span>
                <span
                  className="text-[5rem] font-extrabold leading-none text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  49
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-[#6B6B6B]">
                one time payment
              </p>
              <p className="mt-1 text-sm text-[#2E9E6B] font-medium">
                vs $108–$960/yr with competitors
              </p>
            </div>

            {/* Feature list */}
            <ul className="mt-8 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                  <Check
                    size={16}
                    className="shrink-0 text-[#2E9E6B]"
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>

            {/* Guarantee */}
            <div className="mt-8 flex items-center gap-3 rounded-xl bg-[#FAF8F5] px-4 py-3">
              <Shield size={20} className="shrink-0 text-[#2E9E6B]" strokeWidth={2} />
              <p className="text-xs text-[#6B6B6B]">
                <strong className="text-[#1A1A1A]">30-day money-back guarantee.</strong>{" "}
                No questions asked.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/signup"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#E8743B] py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#CF5F2C] hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Get ProofKit — $49 once
            </Link>

            <p className="mt-3 text-center text-xs text-[#6B6B6B]">
              No subscription · No per-seat fees · Pay once, use forever
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
