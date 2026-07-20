"use client";

import React, { useState } from "react";
import Reveal from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "Why lifetime?",
    a: "I don't believe your customer testimonials should become another monthly bill. You earned every review—you should own them forever."
  },
  {
    q: "Can I start free?",
    a: "Yes. You can collect your first customer stories and publish your first Wall of Love completely free, with no credit card required."
  },
  {
    q: "Can I upgrade later?",
    a: "Absolutely. Start with the free tier to test Blovi on your site. When you're ready for unlimited testimonials, custom branding, and extra layouts, upgrade to Lifetime."
  },
  {
    q: "Do I receive future updates?",
    a: "Yes. Every lifetime license includes future core widget improvements, performance optimizations, and CDN speed enhancements."
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. We offer a 14-day no-questions-asked refund policy. If Blovi doesn't fit your needs, email us and we'll refund you immediately."
  },
  {
    q: "What happens if Blovi shuts down?",
    a: "Blovi runs on lightweight serverless architecture with virtually zero overhead. Your widgets and embed scripts will remain active and hosted."
  },
  {
    q: "How do custom domains work?",
    a: "You can point your custom domain (like feedback.yourbrand.com) directly to Blovi so visitors submit testimonials natively on your site."
  }
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index
}: {
  item: (typeof FAQ_ITEMS)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.04}>
      <div className="border-b border-[#ECE7E0] last:border-b-0">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between py-5 text-left transition-product duration-hover ease-product hover:text-[#2563EB] group"
          aria-expanded={isOpen}
        >
          <span className="text-sm font-bold text-[#1A1A1A] pr-8 group-hover:text-[#2563EB] transition-colors">
            {item.q}
          </span>
          <span
            className={`shrink-0 text-[#8A8A8A] transition-transform duration-hover ease-product ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="9" y1="3" x2="9" y2="15" />
              <line x1="3" y1="9" x2="15" y2="9" />
            </svg>
          </span>
        </button>
        <div
          className="overflow-hidden transition-all duration-hover ease-product"
          style={{
            maxHeight: isOpen ? "150px" : "0px",
            opacity: isOpen ? 1 : 0
          }}
        >
          <p className="pb-5 text-xs leading-relaxed text-[#6B6B6B] pr-12">
            {item.a}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function FAQSection({
  titleAs: TitleTag = "h2",
}: {
  titleAs?: "h1" | "h2";
} = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full bg-white px-5 py-28 md:px-10 md:py-36 border-t border-[#1A1A1A]/5 select-none"
    >
      <div className="mx-auto w-full max-w-[760px]">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <Reveal>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8A8A8A] md:text-[10.5px]">
              FAQ
            </p>
            <TitleTag
              className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Questions before you{" "}
              <span
                className="font-normal italic text-[#2563EB]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                get started?
              </span>
            </TitleTag>
            <p className="mt-5 text-[14px] leading-relaxed text-[#6B6B6B]">
              Everything you need to know before collecting your first testimonial.
            </p>
          </Reveal>
        </div>

        {/* Accordion */}
        <div className="border-t border-[#ECE7E0]">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
