import Link from "next/link";
import { Mail, CreditCard, ShieldCheck } from "lucide-react";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Contact — Blovi",
  description:
    "When you email Blovi, you're emailing the person who wrote the code. Reach out directly for support, questions, or ideas.",
};

const CARDS = [
  {
    icon: Mail,
    title: "General & Questions",
    desc: "Questions, bug reports, feature ideas, or just saying hello. Every message goes directly to my personal inbox.",
    email: "hello@blovi.space",
  },
  {
    icon: CreditCard,
    title: "Billing & Refunds",
    desc: "Receipts, account questions, or requesting a refund within 14 days. Quick and hassle-free.",
    email: "hello@blovi.space",
    link: { href: "/refund", label: "View refund policy" },
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Ownership",
    desc: "Questions about your testimonial data, data export requests, or how we protect your reputation.",
    email: "hello@blovi.space",
    link: { href: "/privacy", label: "View privacy policy" },
  },
];

export default function ContactPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          <section className="w-full pt-36 pb-16 px-5 md:px-10 text-center md:pt-44">
            <div className="mx-auto w-full max-w-[800px]">
              <FadeIn>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] mb-4">
                  Contact
                </p>
                <h1
                  className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Talk directly with the creator.
                </h1>
                <p className="mx-auto mt-5 max-w-lg text-base md:text-lg text-[#6B6B6B] leading-relaxed">
                  When you email Blovi, you're emailing the person who wrote the code. Support isn't outsourced to a ticket queue—every email is read and answered personally by the founder.
                </p>
              </FadeIn>
            </div>
          </section>

          <section className="w-full pb-24 px-5 md:px-10">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="grid gap-6 md:grid-cols-3">
                {CARDS.map((card, i) => (
                  <FadeIn key={card.title} delay={i * 0.08}>
                    <div className="h-full rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF6FF] border border-[#2563EB]/20">
                          <card.icon size={20} className="text-[#2563EB]" />
                        </div>
                        <h2
                          className="text-lg font-bold text-[#1A1A1A] mb-2"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {card.title}
                        </h2>
                        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
                          {card.desc}
                        </p>
                      </div>

                      <div>
                        <a
                          href={`mailto:${card.email}`}
                          className="block text-sm font-semibold text-[#2563EB] hover:underline"
                        >
                          {card.email}
                        </a>
                        {card.link && (
                          <Link
                            href={card.link.href}
                            className="mt-2 block text-xs text-[#6B6B6B] underline transition-colors hover:text-[#1A1A1A]"
                          >
                            {card.link.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <FadeIn delay={0.24}>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
                  <Link
                    href="/privacy"
                    className="text-[#6B6B6B] underline transition-colors hover:text-[#1A1A1A]"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-[#6B6B6B] underline transition-colors hover:text-[#1A1A1A]"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/refund"
                    className="text-[#6B6B6B] underline transition-colors hover:text-[#1A1A1A]"
                  >
                    Refund Policy
                  </Link>
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
