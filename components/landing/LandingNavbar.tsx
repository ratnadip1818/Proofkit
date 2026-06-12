"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <nav
          className={`mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full px-4 transition-all duration-500 md:px-6 ${
            scrolled
              ? "border border-[#ECE7E0] bg-[#FAF8F5]/85 shadow-[0_8px_32px_rgba(26,26,26,0.08)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
          aria-label="Main navigation"
        >
          <Link
            href="/"
            aria-label="Blovi home"
            className="flex shrink-0 items-center gap-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8743B] text-sm font-extrabold text-white">
              B
            </span>
            <span
              className="text-lg font-bold tracking-tight text-[#1A1A1A] transition-colors duration-500"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blovi
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:text-[#1A1A1A] sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="group hidden items-center gap-1.5 rounded-full bg-[#1A1A1A] py-2.5 pl-5 pr-4 text-sm font-semibold text-white transition-all hover:bg-[#E8743B] sm:flex"
            >
              Get Blovi — $49
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A]/5 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-[#16161D] px-6 py-5 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-14 items-center justify-between">
              <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                Blovi
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-5 text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-auto flex flex-col gap-3 pb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#E8743B] py-4 text-base font-semibold text-white"
              >
                Get Blovi — $49
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-full border border-white/20 py-4 text-base font-semibold text-white"
              >
                Sign in
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
