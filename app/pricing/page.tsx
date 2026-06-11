import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Pricing — Blovi",
};

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="w-full overflow-x-hidden flex flex-col flex-1">
        <section className="w-full bg-[#FAF8F5] pt-20 pb-12 px-5 md:px-10 text-center">
          <div className="mx-auto w-full max-w-[1200px]">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8743B] mb-4">
                Pricing
              </p>
              <h1
                className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Simple pricing.
                <br />
                Pay once, own it forever.
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-lg text-[#6B6B6B]">
                No subscriptions, no per-seat fees, no surprise renewals. A
                single $49 payment gets you every Blovi feature — today and
                every update we ship after.
              </p>
            </FadeIn>
          </div>
        </section>

        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
