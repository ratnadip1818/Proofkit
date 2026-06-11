"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemData {
  q: string;
  a: string;
}

function FAQItem({ q, a }: FAQItemData) {
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

export default function PricingFAQ({ items }: { items: FAQItemData[] }) {
  return (
    <div className="rounded-2xl border border-[#ECE7E0] bg-white px-8 shadow-sm">
      {items.map((faq) => (
        <FAQItem key={faq.q} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
}
