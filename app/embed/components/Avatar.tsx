import { useState, useEffect } from "react";
import type { ThemeColors } from "../theme/types";
import { BRAND_COLORS } from "../theme/brand";
import { getGravatarUrl } from "../utils/gravatar";

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
  email,
  colors,
  size = 40,
  source,
  tags,
  showPhotos = true,
  useGravatar = true,
  fallbackAvatar = "Initials",
}: {
  name: string;
  avatarUrl?: string | null;
  email?: string | null;
  colors: ThemeColors;
  size?: number;
  source?: string | null;
  tags?: string[] | null;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const [gravatarLoadedUrl, setGravatarLoadedUrl] = useState<string | null>(null);

  useEffect(() => {
    setImgError(false);
    setGravatarLoadedUrl(null);

    // If direct avatar is provided, no need for Gravatar
    if (avatarUrl) return;

    // Only query Gravatar if explicitly enabled and an email exists
    if (!useGravatar) return;

    const gravatarTarget = email ? email.trim() : null;
    if (!gravatarTarget) return;

    if (typeof window === "undefined") return;

    let isMounted = true;
    const testImg = new window.Image();
    testImg.onload = () => {
      if (isMounted) setGravatarLoadedUrl(testImg.src);
    };
    testImg.onerror = () => {
      if (isMounted) setGravatarLoadedUrl(null);
    };
    testImg.src = getGravatarUrl(gravatarTarget, size * 2);

    return () => {
      isMounted = false;
    };
  }, [avatarUrl, email, useGravatar, size]);

  if (!showPhotos) return null;

  const isDark =
    colors.cardBg === "#1F1F28" ||
    colors.cardBg === "#141419" ||
    colors.cardBg === "#121212" ||
    colors.cardBg === "#111827" ||
    colors.pageBg === "#0E0E12";

  const renderAvatarContent = () => {
    // 1. Direct author photo if provided
    if (avatarUrl && !imgError) {
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
          onError={() => setImgError(true)}
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

    // 2. Verified Gravatar photo if resolved
    if (gravatarLoadedUrl) {
      return (
        <img
          src={gravatarLoadedUrl}
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

    // 3. Fallbacks
    if (fallbackAvatar === "None") return null;

    if (fallbackAvatar === "Placeholder") {
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: isDark ? "rgba(255, 255, 255, 0.08)" : "#F3F4F6",
            color: isDark ? "#9CA3AF" : "#6B7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #E5E7EB",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          <svg
            width={Math.round(size * 0.58)}
            height={Math.round(size * 0.58)}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      );
    }

    // Default: "Initials"
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
  };

  const isTwitter = source === "twitter" || tags?.includes("twitter") || avatarUrl?.includes("twimg.com");
  const isProductHunt = source === "producthunt" || tags?.includes("producthunt") || avatarUrl?.includes("unavatar.io/producthunt") || avatarUrl?.includes("ph-avatars.imgix.net");
  const isGoogle = source === "google" || tags?.includes("google") || avatarUrl?.includes("googleusercontent.com");
  const isLinkedIn = source === "linkedin" || tags?.includes("linkedin") || avatarUrl?.includes("licdn.com");
  const isAppStore = source === "appstore" || tags?.includes("appstore");
  const isGooglePlay = source === "googleplay" || tags?.includes("googleplay");
  const isReddit = source === "reddit" || tags?.includes("reddit");
  const isTrustpilot = source === "trustpilot" || tags?.includes("trustpilot");

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
      {isAppStore && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: "#0071E3",
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
            <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z" />
          </svg>
        </div>
      )}
      {isGooglePlay && (
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
            <path d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z" fill="#0086F4" />
            <path d="M13.544 10.989l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z" fill="#00E676" />
            <path d="M13.544 13.056l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" fill="#FF334B" />
            <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z" fill="#FFD400" />
          </svg>
        </div>
      )}
      {isReddit && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: "#FF4500",
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
            <path d="M16.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z" />
          </svg>
        </div>
      )}
      {isTrustpilot && (
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            background: "#00B67A",
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
            <path d="M24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z" />
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
