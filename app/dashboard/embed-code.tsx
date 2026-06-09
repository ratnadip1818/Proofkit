"use client";

import { useState } from "react";

const APP_URL = "https://proofkit-three.vercel.app";

export default function EmbedCode({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="${APP_URL}/widget.js" data-user="${userId}"></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h2 className="text-base font-medium text-zinc-900">Embed widget</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Paste this snippet anywhere on your site to show your testimonials.
      </p>
      <div className="mt-3 flex items-start gap-2">
        <code className="flex-1 overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700 whitespace-nowrap">
          {snippet}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
