"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default function EmbedCode({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="${APP_URL}/widget.js" data-user="${userId}"></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.dispatchEvent(new Event("proofkit-copied-snippet"));
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
          Embed widget
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Paste this snippet anywhere on your HTML page to display your Wall of Love.
        </p>
      </div>

      <div className="mt-4">
        <div className="overflow-hidden rounded-xl border border-[#ECE7E0] bg-[#0A0A0B] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          {/* macOS Window Title Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] opacity-80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] opacity-80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F] opacity-80" />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              html-embed-code
            </span>
            <div className="w-10" />
          </div>

          {/* Editor Block */}
          <div className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <code className="block font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-nowrap px-1.5 py-1">
                <span className="text-zinc-500">&lt;</span>
                <span className="text-[#E8743B]">script</span>
                <span className="text-sky-300"> src</span>
                <span className="text-zinc-400">=</span>
                <span className="text-emerald-400">&quot;{APP_URL}/widget.js&quot;</span>
                <span className="text-sky-300"> data-user</span>
                <span className="text-zinc-400">=</span>
                <span className="text-emerald-400">&quot;{userId}&quot;</span>
                <span className="text-zinc-500">&gt;&lt;/</span>
                <span className="text-[#E8743B]">script</span>
                <span className="text-zinc-500">&gt;</span>
              </code>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
              aria-label="Copy embed snippet"
            >
              {copied ? (
                <Check size={14} className="text-green-400" strokeWidth={2.5} />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-[#6B6B6B] flex items-center gap-1.5 pl-1">
          <span className="h-1 w-1 rounded-full bg-[#E8743B] shrink-0" />
          <span>Using Framer, Webflow, or Shopify?</span>
          <Link href="/dashboard/guide" className="font-bold text-[#E8743B] hover:underline">
            Read our Setup Guide →
          </Link>
        </div>
      </div>
    </div>
  );
}
