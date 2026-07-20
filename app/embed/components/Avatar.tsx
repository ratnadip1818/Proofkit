import type { ThemeColors } from "../theme/types";
import { BRAND_COLORS } from "../theme/brand";

export function Avatar({
  name,
  avatarUrl,
  colors,
  size = 40,
  source,
}: {
  name: string;
  avatarUrl?: string | null;
  colors: ThemeColors;
  size?: number;
  source?: string | null;
}) {
  const renderAvatarContent = () => {
    if (avatarUrl) {
      let optimizedUrl = avatarUrl;
      if (avatarUrl.includes("/storage/v1/object/public/avatars/")) {
        const doubleSize = size * 2;
        optimizedUrl = `${avatarUrl}?width=${doubleSize}&height=${doubleSize}&resize=contain`;
      }

      return (
        <img
          src={optimizedUrl}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            border: `1px solid ${colors.cardBorder}`,
          }}
        />
      );
    }
    const initial = name.trim().charAt(0).toUpperCase() || "?";
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: colors.avatarBg,
          color: colors.avatarText,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.4,
          fontWeight: 700,
          flexShrink: 0,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        {initial}
      </div>
    );
  };

  const isTwitter = source === "twitter" || avatarUrl?.includes("twimg.com");
  const isProductHunt = source === "producthunt" || avatarUrl?.includes("unavatar.io/producthunt");

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {renderAvatarContent()}
      {isTwitter && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: BRAND_COLORS.twitter,
            color: "#ffffff",
            borderRadius: "50%",
            width: Math.max(14, size * 0.38),
            height: Math.max(14, size * 0.38),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <svg width={Math.max(8, size * 0.22)} height={Math.max(8, size * 0.22)} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      )}
      {isProductHunt && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: BRAND_COLORS.productHunt,
            color: "#ffffff",
            borderRadius: "50%",
            width: Math.max(14, size * 0.38),
            height: Math.max(14, size * 0.38),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #ffffff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <svg width={Math.max(8, size * 0.22)} height={Math.max(8, size * 0.22)} viewBox="0 0 40 40" fill="currentColor">
            <circle cx="20" cy="20" r="20" fill={BRAND_COLORS.productHunt} />
            <path d="M19 13H15v14h4v-5h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 6h-4v-3h4c1.1 0 2 .9 2 2s-.9 2-2 2z" fill="white" />
          </svg>
        </div>
      )}
    </div>
  );
}
