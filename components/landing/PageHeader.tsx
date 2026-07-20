export default function PageHeader({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <section className="w-full bg-[#FAF8F5] px-5 pb-16 pt-36 text-center md:px-10 md:pt-44">
      <div className="mx-auto w-full max-w-[800px]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2563EB] md:text-xs">
          {eyebrow}
        </p>
        <h1
          className="text-[clamp(2.4rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}{" "}
          <span
            className="font-normal italic text-[#2563EB]"
            style={{ fontFamily: "var(--font-serif-accent)" }}
          >
            {accent}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#6B6B6B] md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
