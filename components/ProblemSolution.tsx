import { X, Check } from "lucide-react";
import FadeIn from "./FadeIn";

const BEFORE = [
  "Testimonials buried in DMs and email threads",
  "Screenshots in a random folder you'll never find",
  "Copy-pasting quotes manually onto your site",
  "No idea which testimonials are actually converting",
  "Customers ask where to leave a review — you have no link",
];

const AFTER = [
  "One inbox — every testimonial, organized and approved",
  "A beautiful Wall of Love embedded in minutes",
  "A shareable collection link for new customers",
  "Star ratings, names, roles — all formatted for you",
  "One snippet, works on any site or no-code tool",
];

export default function ProblemSolution() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            Before &amp; after
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From scattered chaos to one clean wall.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Before */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                  <X size={18} className="text-red-500" strokeWidth={2.5} />
                </div>
                <h3
                  className="text-lg font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Without ProofKit
                </h3>
              </div>
              <ul className="space-y-3">
                {BEFORE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                    <X
                      size={14}
                      className="mt-0.5 shrink-0 text-red-400"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* After */}
          <FadeIn delay={0.18}>
            <div className="rounded-2xl border-2 border-[#2E9E6B]/30 bg-[#2E9E6B]/4 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2E9E6B]/15">
                  <Check
                    size={18}
                    className="text-[#2E9E6B]"
                    strokeWidth={2.5}
                  />
                </div>
                <h3
                  className="text-lg font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  With ProofKit
                </h3>
              </div>
              <ul className="space-y-3">
                {AFTER.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#1A1A1A]">
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-[#2E9E6B]"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
