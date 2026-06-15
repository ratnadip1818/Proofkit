import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
];

export default function LandingFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#000000]" role="contentinfo">
      <div className="mx-auto w-full max-w-[1200px] px-5 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Blovi home" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8743B]">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z" fill="white"/>
                  <path d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z" fill="white"/>
                </svg>
              </span>
              <span
                className="text-xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Blovi
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#9CA3AF]">
              Collect and showcase text testimonials. Pay once, own it forever.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Product
            </p>
            <nav className="flex flex-col gap-3.5 text-sm" aria-label="Product">
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#9CA3AF] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Company
            </p>
            <nav className="flex flex-col gap-3.5 text-sm" aria-label="Company">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#9CA3AF] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Legal
            </p>
            <nav className="flex flex-col gap-3.5 text-sm" aria-label="Legal">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#9CA3AF] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-2 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#6B6B6B]">
            Made by a solo founder ·{" "}
            <a href="mailto:hello@blovi.space" className="transition-colors hover:text-white">
              hello@blovi.space
            </a>
          </p>
          <p className="text-xs text-[#6B6B6B]">
            © {new Date().getFullYear()} Blovi. All rights reserved.
          </p>
        </div>
      </div>

      {/* Giant clipped wordmark */}
      <div
        className="pointer-events-none mt-4 flex select-none justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="-mb-[0.32em] bg-gradient-to-b from-white/[0.13] to-white/[0.02] bg-clip-text text-[34vw] font-extrabold leading-none tracking-tight text-transparent md:text-[26vw] lg:text-[20rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Blovi
        </span>
      </div>
    </footer>
  );
}
