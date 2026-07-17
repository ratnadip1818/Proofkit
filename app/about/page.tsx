import Link from "next/link";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import PageHeader from "@/components/landing/PageHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "About — Blovi",
  description:
    "Blovi is a one-person company with one opinion: collecting kind words from your customers shouldn't cost a monthly fee, forever.",
};

const PROMISES = [
  {
    title: "Simple, one-time lifetime payment",
    body: "Blovi Pro is a simple one-time payment of $49 for lifetime access — no subscriptions, no monthly renting. Pay once, own it forever.",
  },
  {
    title: "A human answers the email",
    body: "Support isn't a department. When you write to hello@blovi.space, the person who built the product reads it — and replies within 24 hours.",
  },
  {
    title: "No surprises, ever",
    body: "30-day money-back guarantee, no questions asked. And if Blovi ever shuts down, you get 6 months' notice. That's in writing, in the FAQ.",
  },
];

export default function AboutPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          <PageHeader
            eyebrow="About"
            title="Small,"
            accent="on purpose."
            description="No team page. No office photos. Just one person and one opinion."
          />

          <section className="w-full bg-[#FAF8F5] px-5 pb-28 md:px-10">
            <div className="mx-auto w-full max-w-[680px]">
              <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 md:p-10">
                <p className="text-base leading-relaxed text-[#1A1A1A] md:text-lg">
                  Blovi is a one-person company. I design it, code it, fix it
                  when it breaks, and answer every email myself.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[#6B6B6B] md:text-lg">
                  I won&apos;t pretend there&apos;s a dramatic origin story —
                  there isn&apos;t one. There&apos;s just an opinion I hold
                  strongly: showing kind words from your customers shouldn&apos;t
                  cost $29 a month, forever. Testimonials are some of the most
                  valuable words a small business owns. You shouldn&apos;t have
                  to rent them back every month.
                </p>
                <p className="mt-5 text-base leading-relaxed text-[#6B6B6B] md:text-lg">
                  So Blovi works the way I wish more software did: start free,
                  upgrade if it earns it, cancel anytime. That&apos;s the whole
                  pitch.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-1">
                {PROMISES.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-[#ECE7E0] bg-white p-6"
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
                  Questions, ideas, or just want to say hi?
                </p>
                <a
                  href="mailto:hello@blovi.space"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#E8743B] hover:scale-[1.02]"
                >
                  hello@blovi.space
                </a>
                <p className="mt-6 text-xs text-[#9CA3AF]">
                  — the solo founder behind Blovi
                </p>
                <p className="mt-8 text-sm text-[#6B6B6B]">
                  Curious how it works?{" "}
                  <Link
                    href="/how-it-works"
                    className="font-semibold text-[#E8743B] hover:underline"
                  >
                    Start here
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
