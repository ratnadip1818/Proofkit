"use client";

import { ArrowRight, BadgeCheck, Check, Mail, MessageCircle, Sparkles, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const rawSignals = [
  {
    source: "A customer email",
    icon: Mail,
    color: "text-[#b6613d] bg-[#fff1e9]",
    message: "We launched yesterday and three people mentioned the customer quotes.",
    author: "Ari, founder",
    rotate: "-rotate-[4deg]",
  },
  {
    source: "A community message",
    icon: MessageCircle,
    color: "text-[#4f65b4] bg-[#eef0ff]",
    message: "The setup was so easy. It feels like it was built into our site.",
    author: "Jess in #introductions",
    rotate: "rotate-[3deg]",
  },
  {
    source: "A five-star review",
    icon: Star,
    color: "text-[#9a7020] bg-[#fff8d9]",
    message: "Beautiful product, very quick to set up, and the widgets look great.",
    author: "Google review",
    rotate: "-rotate-[2deg]",
  },
];

export default function WhyBloviSection() {
  const shouldReduceMotion = useReducedMotion();
  const lift = shouldReduceMotion ? 0 : 24;

  return (
    <section id="why-blovi" className="relative overflow-hidden bg-[#f7f4eb] px-5 py-24 text-[#173b71] md:px-10 md:py-36">
      <div className="pointer-events-none absolute left-[-15%] top-12 h-[32rem] w-[32rem] rounded-full bg-[#d9f6cd] opacity-55 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#dbe7ff] opacity-70 blur-3xl" />

      <div className="relative mx-auto max-w-[1160px]">
        <motion.div
          initial={{ opacity: 0, y: lift }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[700px]"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">Your proof is already out there</p>
          <h2 className="mt-4 text-balance text-[clamp(2.65rem,5.2vw,5.1rem)] font-medium leading-[0.94] tracking-[-0.065em] text-[#16356a]" style={{ fontFamily: "var(--font-display)" }}>
            From kind words to
            <span className="font-serif-accent ml-2 font-normal italic text-[#2563EB]">undeniable proof.</span>
          </h2>
          <p className="mt-6 max-w-[510px] text-[15px] leading-relaxed text-[#587091] md:text-[17px]">
            The messages that make your day should also make your next customer feel safe choosing you.
          </p>
        </motion.div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-[1fr_86px_1.08fr] lg:gap-4">
          <motion.div
            initial={{ opacity: 0, y: lift }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[470px] overflow-hidden rounded-[30px] border border-[#d9d4c7] bg-[#eeeae0] p-5 md:p-7"
          >
            <div className="absolute inset-0 opacity-[0.32]" style={{ backgroundImage: "radial-gradient(#b9b3a5 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c8376]">Before Blovi</p>
                <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-[#45413b]">Good words, hiding everywhere.</h3>
              </div>
              <span className="rounded-full border border-[#d5cec0] bg-[#f8f5ef] px-2.5 py-1 text-[10px] font-semibold text-[#776e63]">Scattered</span>
            </div>

            <div className="relative mt-8 h-[330px]">
              {rawSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <motion.article
                    key={signal.source}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0, rotate: index === 0 ? -4 : index === 1 ? 3 : -2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.18 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute w-[min(85%,285px)] rounded-2xl border border-[#ded8cc] bg-[#fffdf9] p-4 shadow-[0_12px_28px_rgba(77,65,43,0.08)] ${signal.rotate} ${index === 0 ? "left-[2%] top-0" : index === 1 ? "right-[2%] top-[92px]" : "left-[10%] top-[202px]"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${signal.color}`}><Icon size={13} /></span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#82796d]">{signal.source}</span>
                    </div>
                    <p className="mt-3 text-[13px] font-medium leading-relaxed tracking-[-0.015em] text-[#4e4a43]">{signal.message}</p>
                    <p className="mt-3 text-[10px] font-semibold text-[#9a9083]">{signal.author}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>

          {/* Animated Hand-Drawn Loopy Arrow Connector */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-[90px] flex-col items-center justify-center lg:min-h-0 py-4"
          >
            {/* Animated Swirling Loopy Arrow */}
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <svg
                width="110"
                height="65"
                viewBox="0 0 110 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-14 text-[#2563EB] drop-shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
              >
                {/* Hand-drawn swirl path with loop */}
                <motion.path
                  d="M 6 42 C 22 14, 42 8, 46 28 C 49 44, 34 50, 32 34 C 30 16, 56 18, 72 30 C 82 37, 92 34, 101 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: "easeInOut", delay: 0.2 }}
                />
                {/* Arrowhead */}
                <motion.path
                  d="M 92 24 L 102 32 L 93 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: lift }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col justify-between min-h-[505px] overflow-hidden rounded-[30px] bg-[#2563EB] p-7 text-white shadow-[0_24px_55px_rgba(37,99,235,0.2)] md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_77%_20%,rgba(198,255,177,.24),transparent_25%),radial-gradient(circle_at_16%_92%,rgba(118,201,255,.28),transparent_31%)]" />
            
            {/* Top Title Bar */}
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">With Blovi</p>
                <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.04em]">A living library of trust.</h3>
              </div>
              <span className="rounded-full bg-[#c6ffb1] px-2.5 py-1 text-[10px] font-bold text-[#2563EB]">Curated</span>
            </div>

            {/* Inner Content Stack (Emotional Founder Copy - Option 8) */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="my-auto py-8 md:py-12 px-2 text-left flex flex-col justify-center gap-4 w-full"
            >
              <h3 className="text-[28px] sm:text-[34px] md:text-[38px] font-semibold leading-[1.1] tracking-[-0.04em] text-white">
                You earned their trust. <br className="hidden sm:inline" />
                Now let the world see it.
              </h3>
              <p className="text-[15px] md:text-[17px] font-normal leading-relaxed text-white/85 max-w-[460px]">
                Building trust takes years of hard work. Blovi makes that trust visible in seconds by showcasing your best customer reviews right on your homepage.
              </p>
            </motion.div>

            {/* Bottom Link */}
            <a href="#how-it-works" className="relative pt-1 inline-flex items-center gap-2 text-[12px] font-semibold text-[#c6ffb1] transition hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              See the full workflow <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
