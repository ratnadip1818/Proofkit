import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Privacy Policy — Blovi",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <div className="space-y-8 text-[#1A1A1A]">
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                1. What We Collect
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                We collect the minimum data necessary to provide the Blovi service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li><strong className="text-[#1A1A1A]">Email address</strong> — used to create and manage your account</li>
                <li><strong className="text-[#1A1A1A]">Testimonial content</strong> — text, ratings, and author details submitted through your collection forms</li>
                <li><strong className="text-[#1A1A1A]">Payment information</strong> — handled entirely by Paddle; we never see or store your card details</li>
                <li><strong className="text-[#1A1A1A]">Usage data</strong> — basic analytics to improve the product (no third-party tracking scripts)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                2. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>To authenticate you and provide access to your dashboard</li>
                <li>To store and display testimonials you&apos;ve collected</li>
                <li>To generate AI-improved versions of testimonials when you request it</li>
                <li>To send transactional emails (account confirmation, new testimonial notifications, password reset)</li>
                <li>To process your one-time payment and verify your purchase</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-3">
                We do <strong className="text-[#1A1A1A]">not</strong> sell, rent, or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                3. Third-Party Services
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                Blovi relies on a small number of trusted third-party services to operate. Each only receives the data it needs to perform its function:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>
                  <strong className="text-[#1A1A1A]">Supabase</strong> — database and authentication.{" "}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#E8743B] hover:underline">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <strong className="text-[#1A1A1A]">Vercel</strong> — application hosting.{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#E8743B] hover:underline">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <strong className="text-[#1A1A1A]">Resend</strong> — transactional email delivery.{" "}
                  <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#E8743B] hover:underline">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <strong className="text-[#1A1A1A]">Anthropic</strong> — powers the optional AI testimonial improvement feature.{" "}
                  <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#E8743B] hover:underline">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <strong className="text-[#1A1A1A]">Paddle</strong> — payment processing and billing (Paddle acts as the merchant of record).{" "}
                  <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#E8743B] hover:underline">
                    Privacy policy
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                4. Data Storage
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Your data is stored securely using <strong className="text-[#1A1A1A]">Supabase</strong>, a GDPR-compliant database platform hosted on AWS infrastructure. Data is encrypted at rest and in transit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                5. Your Rights (GDPR)
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                If you&apos;re located in the European Economic Area or UK, you have rights under the GDPR. Regardless of location, we extend the same rights to all Blovi users:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your account and all associated data</li>
                <li>Export your testimonial data at any time from your dashboard</li>
                <li>Object to or restrict certain processing of your data</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-3">
                To exercise any of these rights, email us using the contact details below. We respond within 5 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                6. Cookies
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Blovi uses only essential session cookies to keep you logged in. We do not use advertising cookies or third-party tracking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                7. Contact
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                For any privacy-related questions or data deletion requests, email us at{" "}
                <a
                  href="mailto:hello@blovi.space"
                  className="text-[#E8743B] hover:underline"
                >
                  hello@blovi.space
                </a>
                . We respond within 5 business days.
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
