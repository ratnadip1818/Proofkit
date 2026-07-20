import { BRAND_COLORS } from "../theme/brand";

export function VerifiedBadge({ id }: { id: string }) {
  if (id.startsWith("sample-")) return null;
  return (
    <a
      href={`/verify/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Verified by Blovi"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: BRAND_COLORS.verified,
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ display: "block" }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    </a>
  );
}
