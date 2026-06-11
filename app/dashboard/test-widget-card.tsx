"use client";

import { useState } from "react";
import { Copy, Check, FlaskConical } from "lucide-react";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

const STEPS = [
  "Copy the test snippet below.",
  "Paste it into your website's HTML, where you want the widget to appear.",
  "Reload your site — you'll see 9 sample testimonials so you can preview the look and feel.",
  "When you upgrade, swap this for your live embed snippet to show your real testimonials.",
];

export default function TestWidgetCard({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-demo="1"></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/10 text-[#E8743B]">
          <FlaskConical size={14} />
        </span>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
          Test your widget
        </h2>
      </div>
      <p className="mt-2 text-sm text-[#6B6B6B]">
        Try the widget on your own site with 9 sample testimonials — no
        upgrade needed.
      </p>

      <div className="mt-4 flex items-start gap-2">
        <code className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs text-[#1A1A1A] whitespace-nowrap block">
          {snippet}
        </code>
        <button
          onClick={handleCopy}
          aria-label="Copy test embed snippet"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-3 py-2.5 text-xs font-medium text-[#6B6B6B] transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#2E9E6B]" strokeWidth={2.5} />
              <span className="text-[#2E9E6B]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
      </div>

      <ol className="mt-4 space-y-2">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-start gap-2.5 text-sm text-[#1A1A1A]">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] text-[11px] font-bold text-[#E8743B]">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
