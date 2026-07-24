"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3.5">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            onClick={() => toggle(idx)}
            className={`rounded-2xl border transition-colors duration-200 overflow-hidden cursor-pointer select-none ${
              isOpen
                ? "border-[#2563EB]/40 bg-white shadow-xs"
                : "border-[#ECE7E0] bg-white hover:border-[#2563EB]/25 hover:bg-[#FAF8F5]/60"
            }`}
          >
            {/* Header Question */}
            <div className="flex items-center justify-between p-5 text-left">
              <span className="text-sm md:text-base font-bold text-[#1A1A1A] flex items-center gap-2.5">
                <HelpCircle size={16} className={`shrink-0 transition-colors ${isOpen ? "text-[#2563EB]" : "text-[#787774]"}`} />
                {faq.q}
              </span>
              <div
                className={`text-[#787774] shrink-0 ml-3 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#2563EB]" : "rotate-0"
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>

            {/* Ultra-Smooth CSS Grid Expand/Collapse Container */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-xs md:text-sm text-[#6B6B6B] leading-relaxed border-t border-[#ECE7E0]/50 pt-3">
                  {faq.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
