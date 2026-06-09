"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#ECE7E0] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto h-full max-w-[1200px] flex items-center justify-between px-5 md:px-10"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-lg font-700 tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          ProofKit
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/signup"
          className="rounded-full bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-105 active:scale-95 shadow-sm"
        >
          Get the $49 deal
        </Link>
      </nav>
    </header>
  );
}
