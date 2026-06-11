import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing — Blovi",
};

const FEATURES = [
  "Unlimited text testimonials",
  "AI-powered improvement button",
  "Wall of Love embed widget",
  "Carousel, Marquee & Single Quote widgets",
  "Shareable collection form",
  "Form customization (colors, headline, prompt)",
  "CSV import",
  "Email notifications",
  "Lifetime access — pay once",
  "All future updates included",
];

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] px-5 md:px-10 py-16">
        <div className="max-w-2xl">
          <p className="text-sm text-[#6B6B6B] mb-2">Last updated: June 2026</p>
          <h1
            className="text-4xl font-bold text-[#1A1A1A] mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pricing
          </h1>

          <div className="space-y-8 text-[#1A1A1A]">
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                1. The Price
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Blovi costs <strong className="text-[#1A1A1A]">$49</strong>, billed once. There are no subscriptions, no tiers, no per-seat fees, and no recurring charges of any kind. You pay once and use Blovi for as long as the product exists.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                2. What&apos;s Included
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                Every Blovi account includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                {FEATURES.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                3. How Billing Works
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Payments are processed by <strong className="text-[#1A1A1A]">Paddle</strong>, our merchant of record, which handles your card details, receipts, and any applicable sales tax or VAT. Your card is charged once at checkout — Blovi does not store payment information and will never charge you again for the same product.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                4. Future Updates
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                New features released after your purchase are included automatically at no extra cost, for as long as Blovi is actively maintained.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                5. Refunds
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Not the right fit? We offer a full refund within 30 days of purchase, no questions asked. See our{" "}
                <Link href="/refund" className="text-[#E8743B] hover:underline">
                  Refund Policy
                </Link>{" "}
                for how to request one.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                6. Questions
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Have a question before you buy?{" "}
                <a
                  href="mailto:hello@blovi.space"
                  className="text-[#E8743B] hover:underline"
                >
                  hello@blovi.space
                </a>
              </p>
            </section>

            <section>
              {/* TODO: replace with Paddle checkout URL */}
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#E8743B] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C]"
              >
                Get Blovi — $49
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
