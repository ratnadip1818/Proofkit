import Link from "next/link";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "About — Founder Manifesto — Blovi",
  description:
    "Software should stay simple, honest, and affordable. Learn why Blovi is intentionally built small by a solo founder.",
};

const BELIEFS = [
  {
    title: "Software should stay simple.",
    body: "No cluttered dashboards, no feature bloat, and no steep learning curves. Software should get out of your way and let you focus on your work.",
  },
  {
    title: "Software should stay honest.",
    body: "No dark patterns, no surprise renewals, and no artificial feature locks. Transparent tools build lasting relationships.",
  },
  {
    title: "Software should stay affordable.",
    body: "Essential utilities shouldn't demand an expensive monthly tax. Great tools should remain accessible to independent creators and small businesses.",
  },
  {
    title: "Customer trust belongs to customers.",
    body: "You earned every kind word, review, and testimonial from your customers. You shouldn't have to pay a monthly lease to keep displaying them.",
  },
];

export default function AboutPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-[#FAF8F5] text-[#1A1A1A]">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          
          {/* 1. HERO */}
          <section className="w-full px-5 pt-36 pb-16 md:px-10 md:pt-44 text-center">
            <div className="mx-auto w-full max-w-[720px]">
              <FadeIn>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
                  About Blovi
                </p>
                <h1
                  className="text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold tracking-[-0.035em] text-[#1A1A1A] leading-[1.08]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Small,{" "}
                  <span
                    className="font-normal italic text-[#2563EB]"
                    style={{ fontFamily: "var(--font-serif-accent)" }}
                  >
                    on purpose.
                  </span>
                </h1>
                <p className="mx-auto mt-6 text-lg md:text-xl text-[#525252] leading-relaxed font-medium">
                  Software should stay simple, honest, and affordable.
                </p>
              </FadeIn>
            </div>
          </section>

          {/* 2. FOUNDER LETTER */}
          <section className="w-full px-5 pb-20 md:px-10">
            <div className="mx-auto w-full max-w-[720px]">
              <FadeIn delay={0.05}>
                <div className="space-y-6 text-base md:text-lg text-[#333333] leading-relaxed">
                  <p className="font-semibold text-[#1A1A1A] text-lg md:text-xl">
                    Most software companies follow the same path.
                  </p>
                  
                  <p>
                    They start with a focused product that solves a real problem. Then come the investor milestones, aggressive growth targets, and mandatory team expansions. Before long, the clean software you loved turns into a bloated platform with endless menus, rising prices, and mandatory monthly subscriptions.
                  </p>

                  <p>
                    Blovi is built to take the opposite approach.
                  </p>

                  <p>
                    I design the interface, write the code, fix bugs, and answer every support email myself. Staying a solo company isn't a temporary stepping stone—it is a deliberate choice to keep software calm, high-quality, and independent.
                  </p>
                </div>
              </FadeIn>

              {/* 3. WHAT I BELIEVE */}
              <FadeIn delay={0.1}>
                <div className="mt-20 border-t border-[#ECE7E0] pt-16">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB] mb-3">
                    Philosophy
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-10"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    What I Believe
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {BELIEFS.map((belief) => (
                      <div
                        key={belief.title}
                        className="rounded-2xl border border-[#ECE7E0] bg-white p-7 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <h3
                            className="text-base font-bold text-[#1A1A1A] mb-2"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {belief.title}
                          </h3>
                          <p className="text-sm text-[#6B6B6B] leading-relaxed">
                            {belief.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* 4. WHY AVOID SUBSCRIPTIONS */}
              <FadeIn delay={0.12}>
                <div className="mt-20 border-t border-[#ECE7E0] pt-16">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB] mb-3">
                    Pricing Philosophy
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Why Blovi avoids recurring subscriptions.
                  </h2>

                  <div className="space-y-6 text-base md:text-lg text-[#333333] leading-relaxed">
                    <p>
                      Testimonials aren't heavy cloud infrastructure. Once a customer leaves a kind review and you embed it on your website, serving those words shouldn't become an expensive recurring bill.
                    </p>

                    <p>
                      Instead of renting your reputation back to you every month, Blovi is structured around lifetime ownership. You pay once when the software proves its value, and you keep your social proof forever.
                    </p>

                    <p>
                      This aligns my incentives directly with yours: my focus stays on speed, reliability, and polish—not on finding clever ways to lock you into endless subscription tiers.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* 5. DIRECT FOUNDER SUPPORT */}
              <FadeIn delay={0.14}>
                <div className="mt-20 border-t border-[#ECE7E0] pt-16">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB] mb-3">
                    Personal Support
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A1A1A] mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Support isn't a department.
                  </h2>

                  <div className="space-y-6 text-base md:text-lg text-[#333333] leading-relaxed">
                    <p>
                      When you email Blovi, there is no support ticket system, no automated AI chatbot, and no outsourced support team reading from a script.
                    </p>

                    <p>
                      Every email goes straight to my personal inbox. The same person who wrote the code reads your message and replies to your question. If you report a bug or suggest a feature, it goes directly to the person who can actually fix or build it.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* 6. CLOSING MANIFESTO */}
              <FadeIn delay={0.16}>
                <div className="mt-20 border-t border-[#ECE7E0] pt-16 pb-12">
                  <div className="rounded-3xl border border-[#ECE7E0] bg-white p-8 md:p-12 shadow-xs space-y-6 text-base md:text-lg text-[#1A1A1A]">
                    <p className="font-serif-accent italic text-lg md:text-xl text-[#1A1A1A]">
                      Blovi will probably never be the biggest testimonial platform.
                    </p>

                    <p className="font-serif-accent italic text-lg md:text-xl text-[#1A1A1A]">
                      I'd rather build one founders genuinely enjoy using.
                    </p>

                    <p className="font-extrabold text-xl md:text-2xl text-[#2563EB]" style={{ fontFamily: "var(--font-display)" }}>
                      Small, on purpose.
                    </p>

                    <div className="mt-8 border-t border-[#ECE7E0] pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#1A1A1A]">Ratnadip Ubale</p>
                        <p className="text-xs text-[#6B6B6B]">Founder &amp; Creator of Blovi</p>
                        <a
                          href="https://www.linkedin.com/in/ratnadip-ubale-27273b417/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                        >
                          <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                          Connect on LinkedIn
                        </a>
                      </div>
                      <a
                        href="mailto:hello@blovi.space"
                        className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-3 text-xs font-bold text-white transition-all hover:bg-[#2563EB] hover:scale-[1.02] shrink-0 self-start sm:self-center"
                      >
                        hello@blovi.space
                      </a>
                    </div>
                  </div>

                  <div className="mt-10 text-center">
                    <p className="text-sm text-[#6B6B6B]">
                      Curious how it works in practice?{" "}
                      <Link
                        href="/how-it-works"
                        className="font-semibold text-[#2563EB] hover:underline"
                      >
                        See the product workflow
                      </Link>
                    </p>
                  </div>
                </div>
              </FadeIn>

            </div>
          </section>

          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
