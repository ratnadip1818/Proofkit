import Link from "next/link";
import { Check } from "lucide-react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";
import FaqAccordion from "@/components/landing/FaqAccordion";

export const metadata = {
  title: "Pricing — Blovi",
  description:
    "Pay once. Own your social proof forever. No subscriptions, no monthly rent. Just one $49 lifetime payment after Blovi proves its value.",
};

const PHILOSOPHY_ROWS = [
  { feature: "Pricing Model", blovi: "One-time ($49)", saas: "Monthly subscription" },
  { feature: "Own your testimonials", blovi: "Yes, forever", saas: "Yes, while paying" },
  { feature: "Monthly payments", blovi: "Never", saas: "Required ($29+/mo)" },
  { feature: "Future updates", blovi: "Included", saas: "Depends on tier" },
  { feature: "Support", blovi: "Direct founder support", saas: "Support ticket queue" },
];

const FAQ_OBJECTIONS = [
  {
    q: "Why lifetime?",
    a: "I don't believe your customer testimonials should become another monthly bill. You earned every review—you should own them forever.",
  },
  {
    q: "Can I start free?",
    a: "Yes. You can collect your first 10 customer stories and publish your first Wall of Love or Marquee completely free, with no credit card required.",
  },
  {
    q: "Can I upgrade later?",
    a: "Absolutely. Start with the free tier to test Blovi on your site. When you're ready for unlimited testimonials, custom branding, and extra layouts, upgrade to Lifetime.",
  },
  {
    q: "Do I receive future updates?",
    a: "Yes. Every lifetime license includes future core widget improvements, performance optimizations, and CDN speed enhancements.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. All Blovi lifetime licenses purchased or redeemed through AppSumo are backed by AppSumo's 60-day money-back guarantee.",
  },
  {
    q: "What happens if Blovi shuts down?",
    a: "Blovi runs on lightweight serverless architecture hosted on global CDNs. Because serving cached widgets costs virtually $0, your embedded scripts will remain active and hosted on your website indefinitely. Plus, you can export all your testimonials to CSV anytime with 1 click.",
  },
  {
    q: "How do custom domains work?",
    a: "You can point your custom domain (like feedback.yourbrand.com) directly to Blovi so visitors submit testimonials natively on your site.",
  },
];

export default function PricingPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5] text-[#1A1A1A] select-none">
        <LandingNavbar />

        <main className="flex w-full flex-1 flex-col">
          
          {/* 2. SENJA-INSPIRED PRICING SECTION */}
          <section id="pricing-cards" className="w-full pt-32 md:pt-40 pb-24 px-5 md:px-10">
            <div className="mx-auto max-w-5xl space-y-20">

              {/* FREE TIER HERO & 3-COLUMN GRID */}
              <FadeIn>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span
                    className="text-lg md:text-xl font-normal italic text-[#2563EB]"
                    style={{ fontFamily: "var(--font-serif-accent)" }}
                  >
                    Plans &amp; Pricing
                  </span>
                  <h2
                    className="text-4xl md:text-6xl font-extrabold text-[#1A1A1A] tracking-tight mt-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    $0/forever
                  </h2>
                  <p className="mt-4 text-xs md:text-sm text-[#6B6B6B] leading-relaxed">
                    Free, forever. It's the most generous free tier of any social proof tool. Sign up and start collecting and sharing social proof from your happy customers.
                  </p>
                </div>

                {/* 3-Column Free Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl border border-[#ECE7E0] p-8 shadow-2xs">
                  {[
                    { title: "Collect up to 10 Testimonials", desc: "Store & publish up to 10 customer text testimonials" },
                    { title: "Testimonial Collection Form", desc: "Create a branded submission form in 60 seconds" },
                    { title: "Form Sharing", desc: "Share and embed your form link anywhere" },
                    { title: "1-Click Import System", desc: "Import from Twitter/X, Product Hunt, LinkedIn & Google" },
                    { title: "Wall of Love Widget", desc: "Embed a multi-column Wall of Love grid on any website" },
                    { title: "DM & Email Clipper", desc: "Clip feedback manually from Slack, DMs, or emails" },
                    { title: "Search and Filtering", desc: "Find the right testimonial every time with instant search" },
                    { title: "Non-removable Blovi Badge", desc: "Includes 'Powered by Blovi' badge on widgets" },
                    { title: "Instant Widget Publishing", desc: "Embed zero-latency widget scripts on any website" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <div>
                        <h3 className="text-xs md:text-sm font-bold text-[#1A1A1A]">{item.title}</h3>
                        <p className="text-[11px] text-[#787774] mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-8 py-3 text-xs font-bold text-white transition-all hover:bg-black hover:scale-105 shadow-sm"
                  >
                    Sign up for free
                  </Link>
                </div>
              </FadeIn>

              {/* PRO LIFETIME HORIZONTAL SPLIT CARD */}
              <FadeIn delay={0.08}>
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] border border-[#2563EB]/20">
                    Go Unlimited
                  </span>
                  <h3
                    className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Upgrade for Unlimited Social Proof
                  </h3>
                </div>

                <div className="rounded-3xl border-2 border-[#2563EB] bg-white overflow-hidden shadow-md flex flex-col lg:flex-row">
                  {/* Left Column: Solid Blue Pricing Block */}
                  <div className="w-full lg:w-72 bg-[#2563EB] p-8 text-white flex flex-col justify-between shrink-0">
                    <div>
                      <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                        Pro Tier
                      </span>
                      <div className="mt-6">
                        <span className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>$49</span>
                        <span className="text-xs opacity-90 font-medium block mt-1">/ one-time payment</span>
                      </div>
                      <p className="mt-4 text-xs opacity-90 leading-relaxed">
                        Pay once. Own your social proof forever with zero recurring subscriptions.
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                      <Link
                        href="/signup"
                        className="flex w-full items-center justify-center rounded-xl bg-white py-3.5 text-xs font-bold text-[#2563EB] shadow-xs transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Get Lifetime Access
                      </Link>
                      <span className="text-[10px] opacity-75 block text-center mt-2.5">
                        60-day money-back guarantee
                      </span>
                    </div>
                  </div>

                  {/* Right Column: 3-Column Feature Grid */}
                  <div className="flex-1 p-8 bg-white space-y-6">
                    {/* Header highlights bar */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#2563EB] pb-4 border-b border-[#ECE7E0]">
                      <span className="flex items-center gap-1"><Check size={13} /> Unlimited testimonials</span>
                      <span className="flex items-center gap-1"><Check size={13} /> Remove Blovi branding</span>
                      <span className="flex items-center gap-1"><Check size={13} /> Wall of Love Widget</span>
                      <span className="flex items-center gap-1"><Check size={13} /> Custom Domains</span>
                    </div>

                    {/* 3-Column Pro Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { title: "Unlimited Testimonials", desc: "Collect & showcase infinite reviews with zero caps" },
                        { title: "Remove Blovi Branding", desc: "100% white-label widgets with no 'Powered by Blovi' badge" },
                        { title: "Wall of Love Grid Layout", desc: "Responsive multi-column grid with live tag filtering" },
                        { title: "CSV Bulk Importer", desc: "Upload & import hundreds of testimonials from spreadsheets" },
                        { title: "Custom Accent Styling", desc: "Match your exact brand colors, themes, and radiuses" },
                        { title: "Custom Domains", desc: "Connect feedback.yourbrand.com directly to your form" },
                        { title: "Unlimited Websites", desc: "Embed widgets across all your websites & client projects" },
                        { title: "Email Alerts", desc: "Instant email notifications when customers submit feedback" },
                        { title: "Lifetime Ownership", desc: "Pay $49 once. Own your social proof forever with zero rent" },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-2.5">
                          <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200/40 text-[#2563EB] text-[10px] font-bold mt-0.5">
                            ✓
                          </span>
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-[#1A1A1A]">{item.title}</h4>
                            <p className="text-[11px] text-[#787774] mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

            </div>
          </section>



          {/* 5. PHILOSOPHY COMPARISON */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[760px]">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    Principles
                  </p>
                  <h2
                    className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Built on values, not recurring bills.
                  </h2>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="overflow-x-auto rounded-2xl border border-[#ECE7E0]">
                  <table className="w-full min-w-[480px] border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-[#ECE7E0] bg-[#FAF8F5]">
                        <th scope="col" className="p-4 text-left font-bold text-[#1A1A1A]">
                          Philosophy
                        </th>
                        <th
                          scope="col"
                          className="border-x border-[#ECE7E0] bg-[#EFF6FF]/60 p-4 text-center font-bold text-[#2563EB]"
                        >
                          Blovi
                        </th>
                        <th scope="col" className="p-4 text-center font-medium text-[#8A8A8A]">
                          Typical SaaS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PHILOSOPHY_ROWS.map((row) => (
                        <tr key={row.feature} className="border-b border-[#ECE7E0] last:border-0">
                          <th scope="row" className="p-4 text-left font-medium text-[#1A1A1A]">
                            {row.feature}
                          </th>
                          <td className="border-x border-[#ECE7E0] bg-[#EFF6FF]/30 p-4 text-center font-bold text-[#2563EB]">
                            {row.blovi}
                          </td>
                          <td className="p-4 text-center text-[#8A8A8A] font-medium">
                            {row.saas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* 7. FAQ */}
          <section className="w-full border-t border-[#ECE7E0] bg-white py-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[720px]">
              <FadeIn>
                <div className="text-center mb-14">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    Objections & Clarity
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="mt-8">
                  <FaqAccordion faqs={FAQ_OBJECTIONS} />
                </div>
              </FadeIn>
            </div>
          </section>



        </main>

        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
