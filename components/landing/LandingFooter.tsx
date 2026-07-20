import Link from "next/link";

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
            className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-product duration-button ease-product hover:bg-[#1d4ed8] hover:translate-y-[-1px] shrink-0 self-start sm:self-center"
          >
            Start Free
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" aria-label="Blovi home" className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB]">
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
                href="https://x.com/RatnadipUbale"
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
                href="https://www.linkedin.com/in/ratnadip-ubale-27273b417/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
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
