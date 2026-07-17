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

const RESOURCES_LINKS = [
  { href: "/blog", label: "Blog" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
];

export default function LandingFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#12110F] select-none border-t border-white/5" role="contentinfo">
      <div className="mx-auto w-full max-w-[1100px] px-5 py-20 md:px-10">
        
        {/* Understated Closing CTA */}
        <div className="border-b border-white/5 pb-12 mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Ready to start building trust?
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1.5">
              Help your next customer trust your business.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-[#0b54d8] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-product duration-button ease-product hover:bg-[#0945b3] hover:translate-y-[-1px] shrink-0 self-start sm:self-center"
          >
            Start Free
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" aria-label="Blovi home" className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b54d8]">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z" fill="white"/>
                  <path d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z" fill="white"/>
                </svg>
              </span>
              <span
                className="text-base font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Blovi
              </span>
            </Link>
            
            <p className="max-w-xs text-xs leading-relaxed text-[#9CA3AF]">
              Help your next customer trust your business with clean, verified customer proof.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 text-[#9CA3AF] pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label="X (formerly Twitter)"
              >
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.producthunt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label="Product Hunt"
              >
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                  <path d="M13.5 12.2V9.8h-3v2.4h3zm0-3.9v-2.3h-3v2.3h3zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1.5 14h-1.5v-2.3h-3V17H7.5V7.5h6c1.9 0 3.4 1.5 3.4 3.4v1.7c0 1.9-1.5 3.4-3.4 3.4z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Product
            </p>
            <nav className="flex flex-col gap-3.5 text-xs font-bold" aria-label="Product">
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
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Company
            </p>
            <nav className="flex flex-col gap-3.5 text-xs font-bold" aria-label="Company">
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
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Resources
            </p>
            <nav className="flex flex-col gap-3.5 text-xs font-bold" aria-label="Resources">
              {RESOURCES_LINKS.map((link) => (
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
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6B6B6B]">
              Legal
            </p>
            <nav className="flex flex-col gap-3.5 text-xs font-bold" aria-label="Legal">
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

        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Blovi. All rights reserved.</p>
          <p>Built for founders, by founders.</p>
        </div>

      </div>
    </footer>
  );
}
