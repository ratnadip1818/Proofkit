"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "./FadeIn";

const FAQS = [
  {
    q: "Is it really a one-time payment?",
    a: "Yes. You pay $49 once and ProofKit is yours for life — no renewals, no annual billing, no surprise charges. That's the whole deal.",
  },
  {
    q: "What does 'lifetime' mean exactly?",
    a: "Lifetime means as long as ProofKit exists as a product, you have full access. You'll receive all feature updates and improvements at no extra cost.",
  },
  {
    q: "How do I migrate from Senja or Testimonial.to?",
    a: "Currently you can paste existing testimonials manually into ProofKit using the collection form. CSV import and direct platform imports are on the roadmap.",
  },
  {
    q: "Are there any limits or hidden fees?",
    a: "V1 supports text testimonials — no limit on how many you collect. Video testimonials are on the roadmap. No per-domain fees, no per-seat charges, no usage caps.",
  },
  {
    q: "What happens to my testimonials if I cancel?",
    a: "You don't cancel — there's nothing to cancel. Your one-time payment means you own access permanently. Your data is yours.",
  },
  {
    q: "Does the embed work on my platform?",
    a: "Yes. The embed is a lightweight script tag that works on any HTML page, Framer, Webflow, WordPress, Ghost, Notion (embed block), and more. If it can run JavaScript, it runs ProofKit.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#ECE7E0] last:border-0">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span
          className="text-base font-semibold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-[#6B6B6B] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
        role="region"
      >
        <p className="text-sm leading-relaxed text-[#6B6B6B]">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="w-full bg-[#FAF8F5] py-28 px-8 lg:px-16">
      <div className="w-full max-w-screen-xl mx-auto px-8 lg:px-16">
        <FadeIn>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A] mb-12"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Common questions.
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="rounded-2xl border border-[#ECE7E0] bg-white px-8 shadow-sm">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
