import FadeIn from "./FadeIn";

export default function LogoStrip() {
  return (
    <section className="w-full border-y border-[#ECE7E0] bg-white py-12">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <p
            className="text-center text-lg font-semibold text-[#6B6B6B]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for indie founders who are tired of paying monthly for simple
            tools.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
