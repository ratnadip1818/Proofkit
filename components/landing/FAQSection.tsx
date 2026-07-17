"use client";

import React, { useState } from "react";
import Reveal from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "Can I use Blovi for free?",
    a: "Yes. You can start collecting reviews for free. Upgrade to lifetime access only when you need custom domains, zero branding, and premium widgets."
  },
  {
    q: "Do I need to write code to embed widgets?",
    a: "No. You only copy and paste a single script tag into your landing page or framework container. It works with HTML, React, Next.js, Framer, and Webflow."
  },
  {
    q: "Can I import reviews from external platforms?",
    a: "Yes. You can import your reviews instantly via CSV format or manually verify specific external reviews."
  },
  {
    q: "How does the custom domain verification work?",
    a: "Once you connect your own domain (e.g. reviews.yourbrand.com), Blovi automatically configures Vercel edge routes so visitors submit reviews natively on your brand subdomain."
  },
  {
    q: "Is there a recurring subscription?",
    a: "No. The Lifetime plan is a one-time purchase. You receive ongoing widget updates and server caching without monthly recurring costs."
  },
  {
    q: "Will the review widget slow down my website?",
    a: "No. Blovi testimonial widgets compile statically and serve via CDN edge servers in under 50ms, maintaining a perfect Google Lighthouse SEO rank."
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
          className="flex w-full items-center justify-between py-5 text-left transition-product duration-hover ease-product hover:text-[#0b54d8] group"
          aria-expanded={isOpen}
        >
          <span className="text-sm font-bold text-[#1A1A1A] pr-8 group-hover:text-[#0b54d8] transition-colors">
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
                className="font-normal italic text-[#0b54d8]"
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
