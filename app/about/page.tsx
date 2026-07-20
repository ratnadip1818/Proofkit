import Link from "next/link";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import PageHeader from "@/components/landing/PageHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "About — Blovi",
  description:
    "Blovi is a one-person company built with one opinion: collecting and displaying your customer testimonials shouldn't require a monthly subscription.",
};

const PROMISES = [
  {
    title: "Simple, one-time lifetime payment",
    body: "Blovi Pro is $49 once. No recurring subscriptions, no monthly rent. Pay once and own your social proof forever.",
  },
  {
    title: "You talk directly to the creator",
    body: "Support isn't outsourced to a queue. When you write to hello@blovi.space, the person who designed and coded Blovi reads and replies.",
  },
  {
    title: "Honest, predictable software",
    body: "Start free, test it on your site, and upgrade only when Blovi proves its value. Backed by AppSumo's 60-day money-back guarantee.",
  },
];

export default function AboutPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5]">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          <PageHeader
            eyebrow="About Blovi"
            title="Small,"
            accent="on purpose."
            description="No corporate fluff. No sales team. Just one person building calm software for founders."
          />

          <section className="w-full bg-[#FAF8F5] px-5 pb-28 md:px-10">
            <div className="mx-auto w-full max-w-[680px]">
              <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 md:p-10 shadow-xs">
                <p className="text-base leading-relaxed text-[#1A1A1A] md:text-lg font-medium">
                  Blovi is an independent, one-person business. I design the interface, write the code, fix bugs, and answer every support email myself.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[#6B6B6B] md:text-lg">
                  Today, Blovi helps founders, agencies, and creators collect customer testimonials, manage them in one organized dashboard, and publish clean Wall of Love widgets on their websites so they can own their reputation instead of renting it.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[#6B6B6B] md:text-lg">
                  I built Blovi because I didn't want founders paying every month for testimonials they already earned. The kind words your customers leave are some of the most valuable assets your business owns—you shouldn't have to rent them back every month.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[#6B6B6B] md:text-lg">
                  That's why Blovi stays small on purpose. No aggressive VC growth targets, no forced subscription upgrades. Just simple, reliable software that helps you showcase trust forever.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-1">
                {PROMISES.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-xs"
                  >
                    <p
                      className="text-base font-bold text-[#1A1A1A]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#6B6B6B]">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-[#6B6B6B]">
                  Have a question, feedback, or need help setting up?
                </p>
                <a
                  href="mailto:hello@blovi.space"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#2563EB] hover:scale-[1.02]"
                >
                  hello@blovi.space
                </a>
                <p className="mt-6 text-xs text-[#9CA3AF]">
                  — Founder & Creator of Blovi
                </p>
                <p className="mt-8 text-sm text-[#6B6B6B]">
                  Curious how it works?{" "}
                  <Link
                    href="/how-it-works"
                    className="font-semibold text-[#2563EB] hover:underline"
                  >
                    See the workflow
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
