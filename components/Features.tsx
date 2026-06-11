import {
  Star,
  Sparkles,
  LayoutGrid,
  Layers,
  ClipboardList,
  Mail,
} from "lucide-react";
import FadeIn from "./FadeIn";

const FEATURES = [
  {
    icon: Star,
    title: "Text testimonials with star ratings",
    desc: "Collect name, role, photo, rating and written feedback.",
  },
  {
    icon: Sparkles,
    title: "AI improvement button",
    desc: "One click polishes grammar and clarity. Original always preserved.",
  },
  {
    icon: LayoutGrid,
    title: "Wall of Love widget",
    desc: "Embed a beautiful masonry grid on any website with one script tag.",
  },
  {
    icon: Layers,
    title: "Multiple widget styles",
    desc: "Wall of Love, Carousel, Marquee, Single Quote — all included.",
  },
  {
    icon: ClipboardList,
    title: "Shareable collection form",
    desc: "Custom headline, colors and prompts. Mobile friendly.",
  },
  {
    icon: Mail,
    title: "Email notifications",
    desc: "Get notified instantly when a new testimonial is submitted.",
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full bg-white py-24 px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            Features
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need, built in.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#6B6B6B]">
            No fluff. Just the core tools to collect, polish, and display
            testimonials — working today.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.07}>
              <div className="group rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-7 h-full transition-all hover:border-[#E8743B]/40 hover:bg-white hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8743B]/10 transition-colors group-hover:bg-[#E8743B]/15">
                  <f.icon size={22} className="text-[#E8743B]" strokeWidth={1.75} />
                </div>
                <h3
                  className="text-base font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                  {f.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
