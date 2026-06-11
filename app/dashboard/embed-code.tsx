"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import UpgradeLock from "./upgrade-lock";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

export default function EmbedCode({
  userId,
  locked = false,
}: {
  userId: string;
  locked?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="${APP_URL}/widget.js" data-user="${userId}"></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const codeBlock = (
    <div className="mt-4 flex items-start gap-2">
      <code className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs text-[#1A1A1A] whitespace-nowrap block">
        {snippet}
      </code>
      <button
        onClick={handleCopy}
        disabled={locked}
        aria-label="Copy embed snippet"
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
  );

  return (
    <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
        Embed widget
      </h2>
      <p className="mt-2 text-sm text-[#6B6B6B]">
        Paste this snippet anywhere on your site to display your Wall of Love.
      </p>

      {locked ? <UpgradeLock>{codeBlock}</UpgradeLock> : codeBlock}
    </div>
  );
}
