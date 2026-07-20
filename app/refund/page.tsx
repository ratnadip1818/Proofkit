import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Refund Policy — Blovi",
  description: "Blovi lifetime licenses are backed by AppSumo's 60-day money-back guarantee.",
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
                  1. 60-Day Money-Back Guarantee (via AppSumo)
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  All Blovi lifetime licenses purchased or redeemed through AppSumo are backed by AppSumo's standard <strong className="text-[#1A1A1A]">60-day money-back guarantee</strong>. If Blovi isn't the right fit for your website, you can request a hassle-free refund directly through your AppSumo customer dashboard.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  2. How to Request a Refund
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">
                  To request your refund:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li>Log in to your account at AppSumo.com.</li>
                  <li>Navigate to your Purchases section.</li>
                  <li>Find your Blovi license key purchase and click "Refund".</li>
                </ol>
                <p className="text-[#6B6B6B] leading-relaxed mt-3">
                  Your refund will be automatically verified and credited back to your original payment method.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  3. Processing Time
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Approved refunds are processed by AppSumo in accordance with their standard processing times. Typically, refunds reflect on your statement within 5–10 business days depending on your bank and payment provider.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  4. After 60 Days
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Refund requests made after the 60-day window cannot be processed as AppSumo holds payment processing limits. If you have any technical questions or need support to get full value out of your license, please reach out to us at <a href="mailto:hello@blovi.space" className="text-[#2563EB] font-semibold hover:underline">hello@blovi.space</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  5. Need Help or Have Questions?
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  If you encounter any setup issues, custom domain questions, or feature requests, feel free to email me directly at{" "}
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
