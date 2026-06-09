import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service — Blovi",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="space-y-8 text-[#1A1A1A]">
            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                1. The Service
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Blovi is a SaaS product for collecting text testimonials and embedding them as a Wall of Love widget on your website. By creating an account you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                2. Lifetime Access
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                The "lifetime deal" means you have access to Blovi for as long as the product exists and is actively maintained. We will provide at least 90 days notice before any service shutdown, giving you time to export your data. All feature updates released during the product's lifetime are included at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                3. Acceptable Use
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-[#6B6B6B] leading-relaxed">
                <li>Use Blovi to collect or display fake, fabricated, or misleading testimonials</li>
                <li>Attempt to reverse-engineer, scrape, or abuse the platform's APIs</li>
                <li>Use Blovi for spam, phishing, or any illegal activity</li>
                <li>Share account credentials or resell access to the platform</li>
              </ul>
              <p className="text-[#6B6B6B] leading-relaxed mt-3">
                We reserve the right to terminate accounts that violate these terms without refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                4. Your Data
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                You own your testimonial data. We do not claim any rights over the content you collect through Blovi. You are responsible for obtaining appropriate consent from the people whose testimonials you collect and display.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                5. Limitation of Liability
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Blovi is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid for the product ($49).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                6. Changes to Terms
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                We may update these terms from time to time. Material changes will be communicated by email. Continued use of the service after notification constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                7. Contact
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Questions about these terms?{" "}
                <a
                  href="mailto:ratnadipubale01@gmail.com"
                  className="text-[#E8743B] hover:underline"
                >
                  ratnadipubale01@gmail.com
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
