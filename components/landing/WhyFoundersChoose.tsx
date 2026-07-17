"use client";

import { ArrowUpRight, BadgeCheck, Layers3, Palette, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const outcomes = [
  {
    number: "01",
    icon: BadgeCheck,
    title: "Earn trust at the moment it matters.",
    body: "Put the right customer story beside the decision you want a visitor to make.",
    tone: "bg-[#c6ffb1] text-[#0a4ebf]",
  },
  {
    number: "02",
    icon: Palette,
    title: "Make proof feel native to your brand.",
    body: "Every collection form and widget can carry your own visual language—not someone else’s badge.",
    tone: "bg-[#9bd8ff] text-[#0a4ebf]",
  },
  {
    number: "03",
    icon: Send,
    title: "Keep good words in motion.",
    body: "Collect feedback once, then turn it into a wall, carousel, quote, or launch asset whenever you need it.",
    tone: "bg-[#f9c2a9] text-[#914727]",
  },
];

export default function WhyFoundersChoose() {
  const shouldReduceMotion = useReducedMotion();
  const rise = shouldReduceMotion ? 0 : 28;

  return (
    <section id="why-founders-choose" className="relative overflow-hidden bg-[#12366f] px-5 py-24 text-white md:px-10 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.17) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "radial-gradient(ellipse at 50% 45%, black, transparent 70%)" }} />
      <div className="pointer-events-none absolute -left-36 bottom-[-18rem] h-[39rem] w-[39rem] rounded-full bg-[#0b61d9] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[-15rem] h-[34rem] w-[34rem] rounded-full bg-[#c6ffb1] opacity-[0.11] blur-3xl" />

      <div className="relative mx-auto max-w-[1160px]">
        <div className="grid gap-12 lg:grid-cols-[0.83fr_1.17fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: rise }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c6ffb1]">Built for founder-led brands</p>
            <h2 className="mt-4 max-w-[520px] text-balance text-[clamp(2.7rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em]" style={{ fontFamily: "var(--font-display)" }}>
              Let your customers
              <span className="font-serif-accent block font-normal italic text-[#c6ffb1]">make the case.</span>
            </h2>
            <p className="mt-6 max-w-[410px] text-[15px] leading-relaxed text-white/67 md:text-[17px]">Blovi gives your best customer stories a system—and gives your next customer a reason to believe.</p>

            <div className="mt-9 flex items-center gap-3 text-[11px] font-semibold text-white/65">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10"><Layers3 size={14} /></span>
              One source of truth for every good word.
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3">
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon;
              return (
                <motion.article
                  key={outcome.number}
                  initial={{ opacity: 0, y: rise }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.28 }}
                  transition={{ duration: 0.65, delay: 0.12 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group min-h-[310px] rounded-[26px] border border-white/13 bg-white/[0.075] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/28 hover:bg-white/[0.11] md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${outcome.tone}`}><Icon size={17} /></span>
                    <span className="text-[10px] font-bold tracking-[0.14em] text-white/42">{outcome.number}</span>
                  </div>
                  <h3 className="mt-16 text-[19px] font-semibold leading-[1.08] tracking-[-0.04em] text-white">{outcome.title}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-white/62">{outcome.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#c6ffb1] opacity-0 transition duration-200 group-hover:opacity-100">Built into Blovi <ArrowUpRight size={13} /></span>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
