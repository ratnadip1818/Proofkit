import FadeIn from "./FadeIn";

// TODO: Replace with real customer/partner logos
const LOGOS = [
  "Indie Hackers",
  "Product Hunt",
  "Gumroad",
  "Lemon Squeezy",
  "Paddle",
  "Stripe",
];

export default function LogoStrip() {
  return (
    <section className="border-y border-[#ECE7E0] bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Loved by founders, freelancers &amp; agencies
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {LOGOS.map((name) => (
              <div
                key={name}
                className="text-sm font-semibold text-[#ECE7E0] grayscale opacity-50 hover:opacity-80 transition-opacity"
                style={{ color: "#B0A89E", fontFamily: "var(--font-display)" }}
                aria-label={name}
              >
                {/* TODO: Replace text with <Image> of actual logo */}
                {name}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
