import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-[#ECE7E0] bg-white py-12 px-5 md:px-10"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Link href="/" aria-label="Blovi home">
            <Logo />
          </Link>

          {/* Nav links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-6 text-sm"
            aria-label="Footer navigation"
          >
            <Link
              href="#features"
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Legal links */}
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm md:justify-start"
          aria-label="Legal"
        >
          <Link
            href="/privacy"
            className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/refund"
            className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Refund Policy
          </Link>
        </nav>

        <div className="mt-8 border-t border-[#ECE7E0] pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">
          <p className="text-xs text-[#6B6B6B]">
            Made by a solo founder ·{" "}
            <a
              href="mailto:hello@blovi.space"
              className="hover:text-[#1A1A1A] transition-colors"
            >
              hello@blovi.space
            </a>
          </p>
          <p className="text-xs text-[#6B6B6B]">
            © {new Date().getFullYear()} Blovi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
