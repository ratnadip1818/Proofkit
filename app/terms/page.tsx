import Link from "next/link";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Terms of Service — Blovi",
  description: "Read the Terms of Service for Blovi lifetime plans, custom domain usage, and acceptable platform policies.",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>

            <div className="space-y-8 text-[#1A1A1A]">
              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  1. The Service
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Blovi is an independent social proof software platform that helps businesses collect customer testimonials, organize them in a dashboard, and publish clean Wall of Love, carousel, marquee, and single-quote widgets on their websites. By registering or using Blovi, you agree to these terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  2. Lifetime Licenses &amp; Pricing
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Blovi Pro is offered as a simple one-time lifetime license key redeemed through AppSumo. There are no mandatory monthly subscription fees or recurring rent. Redeeming a lifetime license grants you access to core widget features, custom branding, and future performance updates for as long as Blovi operates as a commercial service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  3. Acceptable Use
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">To maintain trust and platform integrity, you agree not to:</p>
                <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li>Use Blovi to generate, display, or promote fake, deceptive, or malicious reviews.</li>
                  <li>Attempt to reverse-engineer, exploit, or bypass platform limits and APIs.</li>
                  <li>Use collection forms or widgets for spam, phishing, harassment, or unlawful content.</li>
                  <li>Resell, rent, or unauthorizedly redistribute Blovi account credentials.</li>
                </ul>
                <p className="text-[#6B6B6B] leading-relaxed mt-3">
                  Accounts found in violation of these acceptable use policies may be suspended without refund.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  4. Data Ownership &amp; Customer Consent
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  <strong className="text-[#1A1A1A]">You own your testimonials.</strong> Blovi does not claim ownership or rights over customer content collected through your forms. You are responsible for ensuring appropriate customer consent to display testimonials publicly on your website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  5. Custom Domains
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Pro users configuring custom collection subdomains (e.g. <code className="text-xs bg-[#ECE7E0]/60 px-1 py-0.5 rounded text-[#1A1A1A]">feedback.yourbrand.com</code>) via CNAME records are responsible for maintaining their domain registration and DNS settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  6. Payments &amp; Refund Policy
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Blovi Pro lifetime licenses purchased or redeemed via AppSumo are backed by AppSumo's standard <strong className="text-[#1A1A1A]">60-day money-back guarantee</strong>. Please review our{" "}
                  <Link href="/refund" className="text-[#2563EB] font-semibold hover:underline">
                    Refund Policy
                  </Link>{" "}
                  for full instructions on managing your license or requesting a refund.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  7. Limitation of Liability
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Blovi is provided "as is" with high availability standards. We are not liable for indirect, incidental, or consequential damages resulting from platform downtime or third-party web hosting failures. Our total liability is limited to the amount paid for your license.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  8. Contact
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Questions about these terms? Email the founder directly at{" "}
                  <a
                    href="mailto:hello@blovi.space"
                    className="text-[#2563EB] font-semibold hover:underline"
                  >
                    hello@blovi.space
                  </a>
                  .
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
