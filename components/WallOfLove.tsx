import FadeIn from "./FadeIn";

// TODO: Replace with real ProofKit customer testimonials (dogfood your own widget)
const TESTIMONIALS = [
  {
    name: "Marcus Wren",
    role: "Founder, Launchpad.so",
    avatar: "MW",
    avatarBg: "#E8743B",
    rating: 5,
    body: "Switched from Senja last month and already saved $348 in the first year. The embed is faster and the collection form is cleaner. Zero regrets.",
  },
  {
    name: "Priya Nair",
    role: "Freelance Brand Designer",
    avatar: "PN",
    avatarBg: "#2E9E6B",
    rating: 5,
    body: "I was skeptical about lifetime deals but this one's legit. My clients' testimonials look gorgeous on my portfolio and I paid less than one month of Testimonial.to.",
  },
  {
    name: "Tom Bellamy",
    role: "Bootstrapped SaaS founder",
    avatar: "TB",
    avatarBg: "#16161D",
    rating: 5,
    body: "The single $49 price is the whole pitch and it delivers. No hidden fees, no 'per domain' nonsense. Works exactly as advertised.",
  },
  {
    name: "Sophie Laurent",
    role: "Agency owner, 12 clients",
    avatar: "SL",
    avatarBg: "#6B6B6B",
    rating: 5,
    body: "Managing testimonials for all my clients from one dashboard is a dream. I'd have paid $80/mo for this if they asked. Glad they didn't.",
  },
  {
    name: "Arjun Mehta",
    role: "Indie Hacker & Maker",
    avatar: "AM",
    avatarBg: "#CF5F2C",
    rating: 5,
    body: "Setup took 8 minutes from signup to embedded wall. I've shipped products for years and this is the smoothest testimonial tool I've tried.",
  },
  {
    name: "Dana Kowalski",
    role: "Content Creator & Course Builder",
    avatar: "DK",
    avatarBg: "#E8743B",
    rating: 5,
    body: "My course sales page conversion went up noticeably after adding the Wall of Love. One script tag. No fuss. This thing just works.",
  },
  {
    name: "Luca Romano",
    role: "Full-stack developer / freelancer",
    avatar: "LR",
    avatarBg: "#2E9E6B",
    rating: 5,
    body: "I host on plain HTML, Framer, and Webflow for different clients. The embed script works on all three without a single tweak. Impressive.",
  },
  {
    name: "Naomi Park",
    role: "Product designer turned founder",
    avatar: "NP",
    avatarBg: "#16161D",
    rating: 5,
    body: "The design is minimal and clean — it doesn't clash with whatever site I put it on. Finally a widget that doesn't look like it's from 2015.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rating ? "text-[#E8743B]" : "text-[#ECE7E0]"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function WallOfLove() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B] mb-4">
            Wall of love
          </p>
          <h2
            className="text-center text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold tracking-tight text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Founders love ProofKit.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-[#6B6B6B]">
            Don&apos;t take our word for it.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* CSS columns masonry layout */}
          <div
            className="mt-12"
            style={{ columns: "280px", columnGap: "20px" }}
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ breakInside: "avoid", marginBottom: "20px" }}>
                <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-6">
                  <Stars rating={t.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-[#3f3f46]">
                    &ldquo;{t.body}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: t.avatarBg }}
                      aria-hidden="true"
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {t.name}
                      </p>
                      {t.role && (
                        <p className="text-xs text-[#6B6B6B]">{t.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
