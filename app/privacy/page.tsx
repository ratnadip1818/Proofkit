import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Blovi",
};

export default function PrivacyPage() {
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
                <li><strong className="text-[#1A1A1A]">Usage data</strong> — basic analytics to improve the product (no third-party tracking scripts)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                2. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>To authenticate you and provide access to your dashboard</li>
                <li>To store and display testimonials you've collected</li>
                <li>To send transactional emails (account confirmation, password reset)</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-3">
                We do <strong className="text-[#1A1A1A]">not</strong> sell, rent, or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                3. Data Storage
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Your data is stored securely using{" "}
                <strong className="text-[#1A1A1A]">Supabase</strong>, a GDPR-compliant database platform hosted on AWS infrastructure. Data is encrypted at rest and in transit. You can read Supabase's privacy policy at supabase.com/privacy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                4. Your Rights
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>Access the personal data we hold about you</li>
                <li>Request deletion of your account and all associated data</li>
                <li>Export your testimonial data at any time from your dashboard</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                5. Cookies
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Blovi uses only essential session cookies to keep you logged in. We do not use advertising cookies or third-party tracking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                6. Contact
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                For any privacy-related questions or data deletion requests, email us at{" "}
                <a
                  href="mailto:ratnadipubale01@gmail.com"
                  className="text-[#E8743B] hover:underline"
                >
                  ratnadipubale01@gmail.com
                </a>
                . We respond within 5 business days.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
