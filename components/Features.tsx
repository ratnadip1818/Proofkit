import {
  MessageSquare,
  Video,
  LayoutGrid,
  Download,
  Palette,
  Zap,
} from "lucide-react";
import FadeIn from "./FadeIn";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Text Testimonials",
    desc: "Collect written reviews with star ratings, author name, role, and consent. Customise the form with your own thank-you message.",
  },
  {
    icon: Video,
    title: "Video Testimonials",
    desc: "Let customers record short video testimonials directly from the collection form. No third-party recorder needed.",
  },
  {
    icon: LayoutGrid,
    title: "Wall of Love",
    desc: "A beautiful masonry-style widget that auto-updates as you approve new testimonials. Embed it anywhere with one script tag.",
  },
  {
    icon: Download,
    title: "Import from 30+ Platforms",
    desc: "Pull in existing reviews from Twitter/X, LinkedIn, Google, Product Hunt, Gumroad, and more. Centralise everything.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    desc: "Remove ProofKit branding, match your colors, and customise the collection form to feel native to your product.",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Embed",
    desc: "Under 10 KB script. Lazy-loads in an iframe with auto-resize. Zero layout shift. Works on any stack — even plain HTML.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            Features
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#6B6B6B]">
            No usage limits, no per-domain fees, no seat add-ons. One price.
            All features. Forever.
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
