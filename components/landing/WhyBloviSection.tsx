"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Inbox, Send, LayoutTemplate, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Inbox,
    title: "All in one place",
    description:
      "No more digging through emails, DMs, or old screenshots. Every kind word lands cleanly in one organized space.",
  },
  {
    icon: Send,
    title: "Frictionless to share",
    description:
      "Send a simple, lightweight link whenever someone says something nice. They can leave praise in under 30 seconds.",
  },
  {
    icon: LayoutTemplate,
    title: "Designed to fit in",
    description:
      "Minimal walls of love and clean quote badges that blend naturally with your site's typography and color palette.",
  },
  {
    icon: ShieldCheck,
    title: "Quietly builds trust",
    description:
      "Real words from real people placed right where hesitation happens, making it easy for your next customer to decide.",
  },
];

export default function WhyBloviSection() {
  const shouldReduceMotion = useReducedMotion();
  const lift = shouldReduceMotion ? 0 : 20;

  return (
    <section
      id="why-blovi"
      className="relative bg-[#FAF8F5] px-6 py-24 text-[#141413] md:px-12 md:py-36 border-t border-[#EAE6DF]"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: lift }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[760px]"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#63724E]">
            Your proof is already out there
          </p>
          <h2
            className="mt-4 text-balance text-[clamp(2.5rem,5.2vw,4.85rem)] font-normal leading-[1.02] tracking-[-0.04em] text-[#141413]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From kind words to{" "}
            <span
              className="font-serif-accent font-normal italic text-[#2563EB]"
              style={{ fontFamily: "var(--font-serif-accent)" }}
            >
              undeniable proof.
            </span>
          </h2>
          <p className="mt-5 max-w-[560px] text-[16px] md:text-[18px] leading-relaxed text-[#6E6C68]">
            The messages that make your day should also make your next customer feel safe choosing you.
          </p>
        </motion.div>

        {/* Minimal 4-Column Grid with Hairline Divider */}
        <div className="mt-16 md:mt-24 border-t border-[#E5E0D8] pt-10 md:pt-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: lift }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: shouldReduceMotion ? 0 : 0.08 * index,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-start"
                >
                  <div className="text-[#141413]">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3
                    className="mt-5 text-[17px] md:text-[18px] font-semibold tracking-[-0.02em] text-[#141413]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] md:text-[15px] leading-relaxed text-[#6E6C68]">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
