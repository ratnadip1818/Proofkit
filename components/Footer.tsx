import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-[#ECE7E0] bg-white py-12 px-5 md:px-10"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Blovi home">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#6B6B6B]">
              Collect and showcase text testimonials. Pay once, own it forever.
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Product
            </p>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Product">
              <Link
                href="#features"
                className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
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
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Legal
            </p>
            <nav className="flex flex-col gap-3 text-sm" aria-label="Legal">
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
          </div>
        </div>

        <div className="mt-10 border-t border-[#ECE7E0] pt-6 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
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
