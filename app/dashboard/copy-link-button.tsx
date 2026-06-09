"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy collection link"
      className="flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 text-xs font-medium text-[#6B6B6B] transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] shrink-0"
    >
      {copied ? (
        <>
          <Check size={13} className="text-[#2E9E6B]" strokeWidth={2.5} />
          <span className="text-[#2E9E6B]">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          Copy link
        </>
      )}
    </button>
  );
}
