import type { ThemeColors } from "../theme/types";
import { BRAND_COLORS } from "../theme/brand";

function getInitials(name: string) {
  const parts = (name || "Anonymous").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (name || "A").slice(0, 2).toUpperCase();
}

export function Avatar({
  name,
  avatarUrl,
  colors,
  size = 40,
  source,
  showPhotos = true,
  fallbackAvatar = "Initials",
}: {
  name: string;
  avatarUrl?: string | null;
  colors: ThemeColors;
  size?: number;
  source?: string | null;
  showPhotos?: boolean;
  fallbackAvatar?: string;
}) {
  if (!showPhotos) return null;

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

    if (fallbackAvatar === "None") return null;

    if (fallbackAvatar === "Initials" || fallbackAvatar === "Placeholder") {
      const isDark = colors.cardBg === "#1F1F28" || colors.cardBg === "#141419" || colors.cardBg === "#121212" || colors.pageBg === "#0E0E12";
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: isDark ? "rgba(255, 255, 255, 0.08)" : "#F3F4F6",
            color: isDark ? "#E5E7EB" : "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: 700,
            fontSize: `${Math.round(size * 0.4)}px`,
            border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #E5E7EB",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          {getInitials(name)}
        </div>
      );
    }

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
          flexShrink: 0,
          border: `1px solid ${colors.cardBorder}`,
          overflow: "hidden",
        }}
      >
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="22" cy="22" r="22" fill="#E2E8F0" />
          <circle cx="22" cy="16" r="7" fill="#94A3B8" />
          <path d="M9 36C9 28.8203 14.8203 23 22 23C29.1797 23 35 28.8203 35 36V40H9V36Z" fill="#94A3B8" />
        </svg>
      </div>
    );
  };

  const isTwitter = source === "twitter" || avatarUrl?.includes("twimg.com");
  const isProductHunt = source === "producthunt" || avatarUrl?.includes("unavatar.io/producthunt") || avatarUrl?.includes("ph-avatars.imgix.net");
  const isGoogle = source === "google" || avatarUrl?.includes("googleusercontent.com");
  const isLinkedIn = source === "linkedin" || avatarUrl?.includes("licdn.com");

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
      {isGoogle && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: "#ffffff",
            borderRadius: "50%",
            width: Math.max(14, size * 0.38),
            height: Math.max(14, size * 0.38),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <svg width={Math.max(8, size * 0.22)} height={Math.max(8, size * 0.22)} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        </div>
      )}
      {isLinkedIn && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: BRAND_COLORS.linkedin,
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
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </div>
      )}
    </div>
  );
}
