import { MessageSquare, LayoutGrid, Code2, ClipboardList, CheckSquare, Zap } from "lucide-react";
import FadeIn from "./FadeIn";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Text Testimonials",
    desc: "Collect written reviews with star ratings, author name, and role. Customise the form with your own thank-you message and optional consent checkbox.",
  },
  {
    icon: LayoutGrid,
    title: "Wall of Love Widget",
    desc: "A clean masonry-style embed that auto-updates as you approve new testimonials. One script tag, works anywhere.",
  },
  {
    icon: ClipboardList,
    title: "Shareable Collection Form",
    desc: "Share a unique link with customers. They submit directly — no account needed on their end. You stay in control of what goes live.",
  },
  {
    icon: CheckSquare,
    title: "Approve / Hide / Delete",
    desc: "Every submission lands in your dashboard. Review each one and approve, hide, or delete with a single click before it shows on your site.",
  },
  {
    icon: Code2,
    title: "One-Line Embed",
    desc: "Paste one script tag anywhere — plain HTML, Framer, Webflow, or any no-code tool. Your Wall of Love appears instantly and auto-resizes.",
  },
  {
    icon: Zap,
    title: "Lightweight & Fast",
    desc: "The embed script is tiny and loads in an iframe with no layout shift. Built to stay out of the way of your site's performance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full bg-white py-28">
      <div className="max-w-screen-xl mx-auto px-8 w-full">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            Features
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need for v1.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#6B6B6B]">
            No fluff. Just the core tools to collect, curate, and display
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
