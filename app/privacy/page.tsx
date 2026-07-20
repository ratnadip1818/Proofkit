import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Privacy Policy — Blovi",
  description: "Learn how Blovi collects, protects, and handles your data with strict privacy standards.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>

            <div className="space-y-8 text-[#1A1A1A]">
              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  1. What We Collect
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">
                  We collect only the minimum data necessary to provide Blovi's testimonial collection and widget rendering service:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li><strong className="text-[#1A1A1A]">Account Information</strong> — your email address and name used to create and manage your account.</li>
                  <li><strong className="text-[#1A1A1A]">Testimonial Content</strong> — text, star ratings, author names, roles, and avatar images submitted through your collection forms or imported by you.</li>
                  <li><strong className="text-[#1A1A1A]">Imported Social Proof</strong> — public tweet data or Product Hunt reviews when you import testimonials via URL.</li>
                  <li><strong className="text-[#1A1A1A]">Payment &amp; License Redemption Details</strong> — processed securely by authorized payment partners (e.g., AppSumo); we never see or store your credit card or bank details.</li>
                  <li><strong className="text-[#1A1A1A]">Technical &amp; Widget Logs</strong> — anonymized HTTP header information for widget embedding, CDN performance, and error logging.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  2. How We Use Your Data
                </h2>
                <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li>To authenticate your login and provide access to your dashboard.</li>
                  <li>To store, manage, and render your customer testimonials on your website.</li>
                  <li>To deliver transactional emails (account creation, new testimonial submission alerts, password resets).</li>
                  <li>To manage license activation and support your lifetime account.</li>
                </ul>
                <p className="text-[#6B6B6B] leading-relaxed mt-3">
                  We <strong className="text-[#1A1A1A]">never</strong> sell, rent, trade, or share your data or your customers' testimonials with third-party advertisers or data brokers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  3. Infrastructure &amp; Third-Party Processors
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">
                  Blovi runs on lightweight, modern cloud infrastructure. We partner with a small set of trusted service providers:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li>
                    <strong className="text-[#1A1A1A]">Supabase</strong> — database, authentication, and secure media storage (PostgreSQL hosted on AWS with Row-Level Security).{" "}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <strong className="text-[#1A1A1A]">Vercel</strong> — global Edge network application hosting and CDN delivery for embedded widgets (<code className="text-xs bg-[#ECE7E0]/60 px-1 py-0.5 rounded text-[#1A1A1A]">widget.js</code>).{" "}
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <strong className="text-[#1A1A1A]">Resend</strong> — transactional email delivery service.{" "}
                    <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <strong className="text-[#1A1A1A]">Unavatar.io</strong> — avatar fetching proxy for public social proof imports.{" "}
                    <a href="https://unavatar.io" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                      Service details
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  4. Data Security &amp; Ownership
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  All data in transit is encrypted using HTTPS/TLS 1.3, and database records are encrypted at rest. Row-Level Security (RLS) policies ensure your testimonials and collection forms are strictly isolated to your account.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed mt-2">
                  <strong className="text-[#1A1A1A]">You own your testimonials.</strong> Blovi does not claim ownership over the customer feedback you collect or display.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  5. Your Rights &amp; Data Control (GDPR)
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-3">
                  We extend full data rights to all Blovi users worldwide:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                  <li><strong className="text-[#1A1A1A]">Access &amp; Export:</strong> Export all your testimonials in CSV format directly from your dashboard at any time.</li>
                  <li><strong className="text-[#1A1A1A]">Correction &amp; Moderation:</strong> Edit, approve, hide, or delete individual testimonials inside your dashboard.</li>
                  <li><strong className="text-[#1A1A1A]">Account Erasure:</strong> Request full account and data deletion by emailing support.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  6. Contact
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed">
                  For privacy inquiries, data requests, or account deletion, email the founder directly at{" "}
                  <a
                    href="mailto:hello@blovi.space"
                    className="text-[#2563EB] font-semibold hover:underline"
                  >
                    hello@blovi.space
                  </a>
                  . We respond personally within 24 hours.
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
