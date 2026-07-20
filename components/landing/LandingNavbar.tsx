"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

// Global Easing and Timing Tokens
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const; // cubic-bezier(0.16, 1, 0.3, 1)

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const lightNav = pathname === "/" && !scrolled;

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

  // Mobile menu panel animation variants
  const panelVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -12,
      transition: {
        duration: 0.28,
        ease: EASE_PREMIUM,
        when: "afterChildren",
        staggerChildren: 0.04,
        staggerDirection: -1 as const,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        ease: EASE_PREMIUM,
        when: "beforeChildren",
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: EASE_PREMIUM },
    },
  };

  return (
    <>
      {/* 1. NAVBAR SCROLL CONTAINER */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-280"
        style={{
          backgroundColor: scrolled || pathname !== "/" ? "rgba(250, 248, 245, 0.88)" : "rgba(7, 84, 217, 0)",
          backdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.06)" : "1px solid rgba(0, 0, 0, 0)",
          transitionProperty: "background-color, backdrop-filter, border-color",
          transitionDuration: "280ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="px-3 py-3 md:px-6 md:py-4">
          <nav
            className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:px-6 w-full"
            aria-label="Main navigation"
          >
            {/* 6. LOGO (Static, never animates) */}
            <Link
              href="/"
              aria-label="Blovi home"
              className="flex shrink-0 items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none rounded-lg"
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${lightNav ? "bg-white" : "bg-[#2563EB]"}`}>
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z" fill={lightNav ? "#2563EB" : "white"}/>
                  <path d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z" fill={lightNav ? "#2563EB" : "white"}/>
                </svg>
              </span>
              <span
                className={`text-lg font-bold tracking-tight ${lightNav ? "text-white" : "text-[#1A1A1A]"}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                Blovi
              </span>
            </Link>

            {/* 2 & 3. NAV LINKS WITH SHARED PIL INDICATOR */}
            <div
              className="hidden items-center gap-1 md:flex relative"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredIndex(i)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-120 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none ${
                      isActive ? (lightNav ? "text-white font-semibold" : "text-[#1A1A1A] font-semibold") : (lightNav ? "text-white/75 hover:text-white" : "text-[#6B6B6B] hover:text-[#1A1A1A]")
                    }`}
                  >
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.div
                          layoutId="nav-hover-pill"
                          className="absolute inset-0 rounded-full bg-[#000000]/[0.045] -z-10"
                          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                          transition={{
                            opacity: { duration: 0.12, ease: "linear" },
                            scale: { duration: 0.12, ease: EASE_PREMIUM },
                            layout: { duration: 0.28, ease: EASE_PREMIUM },
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Active Line (slides independently) */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-line"
                        className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${lightNav ? "bg-[#c6ffb1]" : "bg-[#2563EB]"}`}
                        transition={{
                          layout: { duration: 0.28, ease: EASE_PREMIUM },
                        }}
                      />
                    )}

                    {/* Text never moves */}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`hidden rounded-full px-4 py-2 text-sm font-medium transition-colors duration-120 sm:inline-block focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none ${lightNav ? "text-white/80 hover:text-white" : "text-[#6B6B6B] hover:text-[#1A1A1A]"}`}
              >
                Sign in
              </Link>
              
              {/* 4. CTA BUTTON (Hover/Press state scaling and bright shadow transitions) */}
              <Link
                href="/signup"
                className={`group hidden items-center gap-1.5 rounded-full py-2.5 pl-5 pr-4 text-sm font-semibold shadow-sm transition-all duration-120 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none select-none ${lightNav ? "bg-white text-[#2563EB]" : "bg-[#1A1A1A] text-white"}`}
                style={{
                  transform: "translateZ(0)",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!shouldReduceMotion) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
                  }
                  e.currentTarget.style.backgroundColor = lightNav ? "#c6ffb1" : "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.backgroundColor = lightNav ? "#FFFFFF" : "#1A1A1A";
                }}
                onMouseDown={(e) => {
                  if (!shouldReduceMotion) {
                    e.currentTarget.style.transform = "scale(0.97)";
                  }
                }}
                onMouseUp={(e) => {
                  if (!shouldReduceMotion) {
                    e.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
              >
                Get Blovi — $49 one-time
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <button
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-120 md:hidden focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none ${lightNav ? "text-white hover:bg-white/10" : "text-[#1A1A1A] hover:bg-[#1A1A1A]/5"}`}
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
              >
                <Menu size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* 5. MOBILE MENU (Panel translation & staggered list entries) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-[#16161D] px-6 py-5 md:hidden"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex h-14 items-center justify-between">
              <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                Blovi
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors duration-120 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
              {LINKS.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-5 text-3xl font-bold text-white focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mt-auto flex flex-col gap-3 pb-6"
              variants={itemVariants}
            >
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#2563EB] py-4 text-base font-semibold text-white focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none active:scale-[0.97] transition-transform duration-120"
              >
                Get Blovi — $49 one-time
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-full border border-white/20 py-4 text-base font-semibold text-white focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none active:scale-[0.97] transition-transform duration-120"
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
