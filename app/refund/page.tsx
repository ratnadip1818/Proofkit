import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Refund Policy — Blovi",
};

export default function RefundPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />
        <main className="mx-auto w-full max-w-[1200px] px-5 md:px-10 pb-16 pt-36 md:pt-44 flex-1">
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
                60-Day Money-Back Guarantee (via AppSumo)
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                All Blovi lifetime licenses purchased through AppSumo are backed by AppSumo&apos;s standard <strong className="text-[#1A1A1A]">60-day money-back guarantee</strong>. If Blovi isn&apos;t the right fit for your website, you can request a hassle-free refund directly through your AppSumo customer dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                How to Request a Refund
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                Since payments are processed by AppSumo:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>Log in to your account at AppSumo.com</li>
                <li>Navigate to your Purchases section</li>
                <li>Find your Blovi license key purchase and click &quot;Refund&quot;</li>
              </ol>
              <p className="text-[#6B6B6B] leading-relaxed mt-3">
                Your refund will be automatically verified and credited back to your original payment account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Processing Time
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Approved refunds are processed by AppSumo in accordance with their standard processing times. Typically, refunds reflect on your statement within 5–10 business days depending on your bank and payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                After 60 Days
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Refund requests made after the 60-day window cannot be processed, as AppSumo holds payment processing limits. If you have any technical issues or need support to get value out of your license, please reach out to us at hello@blovi.space.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Contact
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Any questions about setting up or using your lifetime plan? Email us at{" "}
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
        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
