import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund Policy — Blovi",
};

export default function RefundPage() {
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
            Refund Policy
          </h1>

          <div className="space-y-8 text-[#1A1A1A]">
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                30-Day Money-Back Guarantee
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We offer a <strong className="text-[#1A1A1A]">full refund within 30 days</strong> of purchase, no questions asked. If Blovi isn&apos;t the right fit for you, we don&apos;t want to keep your money.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                How to Request a Refund
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>
                  Email{" "}
                  <a
                    href="mailto:hello@blovi.space"
                    className="text-[#E8743B] hover:underline"
                  >
                    hello@blovi.space
                  </a>{" "}
                  with the subject line &quot;Refund Request&quot;
                </li>
                <li>Include the email address associated with your Blovi account</li>
                <li>Include your payment receipt or order ID if you have it</li>
              </ol>
              <p className="text-[#6B6B6B] leading-relaxed mt-3">
                We&apos;ll confirm your refund request within 1–2 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Processing Time
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Approved refunds are processed within <strong className="text-[#1A1A1A]">5–7 business days</strong> via Paddle, our payment processor. The time for the refund to appear on your statement depends on your payment provider and bank.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                After 30 Days
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Refund requests made after the 30-day window are reviewed on a case-by-case basis. We&apos;re a small indie product and we genuinely want every customer to be happy — reach out and we&apos;ll do our best to find a fair resolution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Contact
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Any questions?{" "}
                <a
                  href="mailto:hello@blovi.space"
                  className="text-[#E8743B] hover:underline"
                >
                  hello@blovi.space
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
