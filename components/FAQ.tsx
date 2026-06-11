"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "./FadeIn";

const FAQS = [
  {
    q: "Is this really a one-time payment?",
    a: "Yes. Pay $49 once and use Blovi forever. No hidden fees, no renewal.",
  },
  {
    q: "What does ‘lifetime’ mean?",
    a: "You get access for the lifetime of Blovi. If we ever shut down (unlikely), we'll give you 6 months notice.",
  },
  {
    q: "Is there a free trial?",
    a: "No free trial, but we offer a 30-day money-back guarantee. Not happy? Full refund, no questions.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major credit/debit cards via Paddle.",
  },
  {
    q: "Can I use this for multiple websites?",
    a: "Yes. One account works on unlimited websites.",
  },
  {
    q: "Do you have video testimonials?",
    a: "Not yet. Text testimonials with photos are supported now. Video is on the roadmap.",
  },
  {
    q: "What makes Blovi different from Senja?",
    a: "Blovi has an AI improvement button Senja doesn't have. And Blovi is $49 once vs $29/month forever.",
  },
  {
    q: "How do I get support?",
    a: "Email hello@blovi.space. We reply within 24 hours.",
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
    <section id="faq" className="w-full bg-[#FAF8F5] py-24 px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1200px]">
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
