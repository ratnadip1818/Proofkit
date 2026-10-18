"use client";

import React from "react";
import { Inbox, Send, LayoutTemplate, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

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
  return (
    <section
      id="why-blovi"
      className="relative bg-[#FAF8F5] px-6 py-24 text-[#1A1A1A] md:px-12 md:py-36 border-t border-[#E3E0DB]"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Header Block */}
        <div className="max-w-[760px] space-y-4">
          <Reveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB]">
              Your proof is already out there
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="mt-4 text-balance text-[clamp(2.5rem,5.2vw,4.85rem)] font-normal leading-[1.02] tracking-[-0.04em] text-[#1A1A1A]"
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
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[560px] text-[16px] md:text-[18px] leading-relaxed text-[#787774]">
              The messages that make your day should also make your next customer feel safe choosing you.
            </p>
          </Reveal>
        </div>

        {/* Minimal 4-Column Grid with Hairline Divider */}
        <div className="mt-16 md:mt-24 border-t border-[#E3E0DB] pt-10 md:pt-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Reveal key={benefit.title} delay={0.15 + index * 0.08}>
                  <div className="flex flex-col items-start">
                    <div className="text-[#1A1A1A]">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <h3
                      className="mt-5 text-[17px] md:text-[18px] font-semibold tracking-[-0.02em] text-[#1A1A1A]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {benefit.title}
                    </h3>
                    <p className="mt-2.5 text-[14px] md:text-[15px] leading-relaxed text-[#787774]">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
