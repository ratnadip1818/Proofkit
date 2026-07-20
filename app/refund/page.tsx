import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Refund Policy — Blovi",
  description: "Blovi's 14-day direct refund guarantee and AppSumo 60-day guarantee guidelines.",
};

export default function RefundPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />
        <main className="mx-auto w-full max-w-[1200px] px-5 md:px-10 pb-16 pt-36 md:pt-44 flex-1">
          <div className="max-w-2xl">
            <p className="text-sm text-[#6B6B6B] mb-2 font-medium">Last updated: July 2026</p>
            <h1
              className="text-4xl font-extrabold text-[#1A1A1A] mb-8 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Refund Policy
            </h1>

            <div className="space-y-8 text-[#1A1A1A]">
              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  1. Our Honest Founder Guarantee
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  I want you to be 100% confident when using Blovi. If Blovi doesn't save you time or help you display customer proof easily on your site, you shouldn't have to pay for it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  2. Direct Purchases — 14-Day Money-Back Guarantee
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">
                  For licenses purchased directly from Blovi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li>You have a <strong className="text-[#1A1A1A]">14-day no-questions-asked money-back guarantee</strong> from your date of purchase.</li>
                  <li>To request a refund, simply email <a href="mailto:hello@blovi.space" className="text-[#2563EB] font-semibold hover:underline">hello@blovi.space</a> with your purchase email or license code.</li>
                  <li>I will process your full refund promptly within 24 hours. No hidden forms, calls, or hurdles required.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  3. AppSumo Purchases — 60-Day Guarantee
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">
                  If you bought or redeemed a Blovi Pro license key through AppSumo:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li>Your license is backed by AppSumo's standard <strong className="text-[#1A1A1A]">60-day money-back guarantee</strong>.</li>
                  <li>Log in to your account at AppSumo.com and visit your Purchases section.</li>
                  <li>Click "Refund" on your Blovi purchase key for automatic processing.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  4. Processing Times
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Once a refund is issued, your bank or payment provider typically credits your original payment method within 3–5 business days for direct purchases, or 5–10 business days for AppSumo refunds.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  5. Need Help or Have Questions?
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  If you encounter any setup issue, custom domain questions, or feature requests, feel free to email me directly at{" "}
                  <a
                    href="mailto:hello@blovi.space"
                    className="text-[#2563EB] font-semibold hover:underline"
                  >
                    hello@blovi.space
                  </a>
                  . I read and reply to every message personally.
                </p>
              </section>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
