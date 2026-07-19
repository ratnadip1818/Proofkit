export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="var(--color-accent)" />
        {/* Bold thumbs-up icon */}
        <path
          d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z"
          fill="white"
        />
        <path
          d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z"
          fill="white"
        />
      </svg>
      <span
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em", color: "var(--color-ink)" }}
      >
        Blovi
      </span>
    </span>
  );
}
