import { Rocket, Wrench, Building2, Briefcase } from "lucide-react";
import FadeIn from "./FadeIn";

const PERSONAS = [
  {
    icon: Rocket,
    title: "Indie Founders",
    desc: "Launch with credibility. Turn early-user love into social proof that converts skeptics.",
  },
  {
    icon: Wrench,
    title: "Bootstrappers",
    desc: "One tool, one payment. No subscription eating into your margins month after month.",
  },
  {
    icon: Building2,
    title: "Agencies",
    desc: "Manage testimonials for all your clients without per-seat or per-domain fees.",
  },
  {
    icon: Briefcase,
    title: "Freelancers",
    desc: "Build a portfolio of client praise and embed it on your site in minutes.",
  },
];

export default function Personas() {
  return (
    <section className="w-full bg-[#FAF8F5] py-24">
      <div className="max-w-screen-xl mx-auto px-8 w-full">
        <FadeIn>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for you.
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-[#ECE7E0] bg-white p-7 text-center h-full shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#16161D]">
                  <p.icon size={22} className="text-[#E8743B]" strokeWidth={1.75} />
                </div>
                <h3
                  className="text-base font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                  {p.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
