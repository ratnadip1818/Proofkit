"use client";

import Link from "next/link";

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] px-5 text-center">
      <p
        className="text-8xl font-extrabold text-[#2563EB]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        500
      </p>
      <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">
        Something went wrong
      </h1>
      <p className="mt-2 text-[#6B6B6B]">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={unstable_retry}
          className="rounded-lg border border-[#ECE7E0] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#1A1A1A]/20 hover:bg-[#FAF8F5]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] hover:scale-[1.02]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
