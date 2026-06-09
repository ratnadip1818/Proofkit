export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="7" fill="#E8743B" />
        <text
          x="14"
          y="14"
          dominantBaseline="central"
          textAnchor="middle"
          fill="white"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="16"
        >
          B
        </text>
      </svg>
      <span
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em", color: "#1A1A1A" }}
      >
        Blovi
      </span>
    </span>
  );
}
