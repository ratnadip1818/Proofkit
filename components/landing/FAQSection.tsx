"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "How does Blovi work?",
    a: "Share your collection form link with customers, approve the testimonials that come in, and paste one line of code on your site to show your Wall of Love. New approved testimonials appear automatically — no code changes needed.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes up to 3 testimonials, your own collection form, and the Wall of Love embed widget with a small \"Powered by Blovi\" badge. No credit card needed.",
  },
  {
    q: "Is this really a one-time payment?",
    a: "Yes. Pay $49 once and use Blovi forever — no hidden fees, no renewal. It unlocks unlimited testimonials, all four widget styles, AI polishing, and badge removal.",
  },
  {
    q: "What does ‘lifetime’ mean?",
    a: "You get access for the lifetime of Blovi. If we ever shut down (unlikely), we'll give you 6 months notice.",
  },
  {
    q: "What does the AI polish do?",
    a: "One click fixes grammar, clarity and typos in a testimonial — without changing your customer's meaning. The original is always kept side by side, and you choose to accept or revert. Available on the lifetime plan.",
  },
  {
    q: "Will the widget work on my website?",
    a: "Yes — any site where you can paste an embed snippet: WordPress, Webflow, Framer, Shopify, Carrd, plain HTML and more. It auto-fits its height, matches light or dark sites (even automatically), can use your brand color, and lazy-loads so it never slows your page. One account works on unlimited websites.",
  },
  {
    q: "Can my customers add photos?",
    a: "Yes. Your collection form has an optional photo upload, and photos appear next to testimonials in your widget. Video testimonials are on the roadmap.",
  },
  {
    q: "Can I import testimonials I already have?",
    a: "Yes — upload a CSV and your existing testimonials are imported, ready to approve and display.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major credit and debit cards, processed securely by Paddle. Every purchase is covered by a 30-day money-back guarantee — full refund, no questions.",
  },
  {
    q: "How do I get support?",
    a: "Email hello@blovi.space. We reply within 24 hours.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#ECE7E0] last:border-0">
      <button
        className="group flex w-full items-center justify-between gap-4 py-6 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-4">
          <span className="text-xs font-bold tabular-nums text-[#E8743B]" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="text-base font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#E8743B] md:text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {q}
          </span>
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open
              ? "rotate-45 border-[#E8743B] bg-[#E8743B] text-white"
              : "border-[#ECE7E0] text-[#6B6B6B] group-hover:border-[#E8743B]/50"
          }`}
          aria-hidden="true"
        >
          <Plus size={15} />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pl-9 pr-4 text-sm leading-relaxed text-[#6B6B6B] md:text-base">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="w-full bg-[#FAF8F5] px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid w-full max-w-[1100px] gap-12 lg:grid-cols-[380px_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B6B6B] md:text-xs">
              FAQ
            </p>
            <h2
              className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Common{" "}
              <span
                className="font-normal italic text-[#E8743B]"
                style={{ fontFamily: "var(--font-serif-accent)" }}
              >
                questions.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#6B6B6B]">
              Something else on your mind?{" "}
              <a
                href="mailto:hello@blovi.space"
                className="font-semibold text-[#E8743B] underline-offset-4 hover:underline"
              >
                Email us
              </a>{" "}
              — we reply within 24 hours.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="rounded-3xl border border-[#ECE7E0] bg-white px-6 md:px-9">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
