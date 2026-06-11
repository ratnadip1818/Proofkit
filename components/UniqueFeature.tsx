import { Sparkles } from "lucide-react";
import FadeIn from "./FadeIn";

export default function UniqueFeature() {
  return (
    <section className="w-full py-24 px-5 md:px-10" style={{ backgroundColor: "#16161D" }}>
      <div className="mx-auto w-full max-w-[1200px]">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#E8743B] mb-4">
            AI-powered
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The feature Senja doesn&apos;t have.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-[#9CA3AF]">
            One click to polish any testimonial. AI fixes grammar, clarity and
            typos — without changing the customer&apos;s meaning. Always shows
            the original side by side. You decide what to keep.
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-12 grid max-w-4xl mx-auto items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            {/* Before */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Original
              </p>
              <p className="text-base leading-relaxed text-[#9CA3AF]">
                &ldquo;luv this app, saved me so much time tbh, def
                recommend!!&rdquo;
              </p>
            </div>

            {/* AI icon */}
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8743B] shadow-lg">
                <Sparkles size={20} className="text-white" strokeWidth={2} />
              </div>
            </div>

            {/* After */}
            <div className="relative rounded-2xl border border-[#E8743B]/40 bg-white p-6">
              <span className="absolute -top-3 right-4 rounded-full bg-[#E8743B] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Edited for clarity
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#E8743B]">
                AI-improved
              </p>
              <p className="text-base leading-relaxed text-[#1A1A1A]">
                &ldquo;I love this app — it saved me so much time. Highly
                recommend!&rdquo;
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
