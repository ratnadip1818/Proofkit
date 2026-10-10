"use client";

import React, { useState } from "react";
import Reveal from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "How does testimonial collection work?",
    a: "You get a dedicated collection form link that you can share with your customers directly, embed on your website, or send via email to gather verified customer reviews in seconds."
  },
  {
    q: "Can I import reviews from external platforms?",
    a: "Yes. Blovi supports 1-click importing from Twitter/X, Product Hunt, LinkedIn, and Google reviews, as well as CSV bulk imports."
  },
  {
    q: "How do I embed testimonials on my website?",
    a: "Once you approve testimonials in your dashboard, choose your widget style (Wall of Love, Carousel, Marquee, or Single Quote) and copy a single line of embed code into WordPress, Webflow, Framer, Shopify, or custom HTML."
  },
  {
    q: "How do custom domains work?",
    a: "You can point your custom domain (like feedback.yourbrand.com) directly to Blovi so visitors submit testimonials natively under your own brand."
  },
  {
    q: "Can I export my testimonials?",
    a: "Yes. You maintain complete ownership of your social proof. You can export all your reviews to CSV format at any time."
  },
  {
    q: "What happens if Blovi experiences downtime?",
    a: "Blovi runs on lightweight serverless architecture hosted on global edge CDNs. Your embedded widget scripts remain fast, cached, and reliable."
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
