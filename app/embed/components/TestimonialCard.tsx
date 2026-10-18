import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { Testimonial } from "../constants";
import type { ThemeColors } from "../theme/types";
import type { WallLayout } from "../types/widget";
import { Stars } from "./Stars";
import { Avatar } from "./Avatar";
import styles from "./testimonial-card.module.css";

export function TestimonialCard({
  t, showRatings, colors, radius, surface, showPhotos = true,
  useGravatar = true, fallbackAvatar = "Initials", onExpandChange,
  showDate = true, cardLayout = "top", expanded, lineClamp = 4,
}: {
  t: Testimonial;
  showRatings: boolean;
  colors: ThemeColors;
  radius: number;
  layout?: WallLayout;
  index?: number;
  onReadMore?: (t: Testimonial) => void;
  surface?: string;
  showPhotos?: boolean;
  useGravatar?: boolean;
  fallbackAvatar?: string;
  onExpandChange?: (expanded: boolean) => void;
  showDate?: boolean;
  cardLayout?: "top" | "bottom";
  expanded?: boolean;
  lineClamp?: number;
}) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const [isClipped, setIsClipped] = useState(false);
  const isExpanded = expanded ?? localExpanded;
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const bodyId = useId();
  const text = (t.display_body ?? t.body_original ?? "")
    .replace(/^["“']+|["”']+$/g, "").trim();
  const date = t.created_at ? new Date(t.created_at) : null;
  const formattedDate = date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    : "";

  // Measure actual overflow, including changes in width and loaded fonts.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || isExpanded) return;
    const measure = () => setIsClipped(body.scrollHeight > body.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [text, isExpanded, lineClamp]);

  const author = (
    <div className={styles.author}>
      <Avatar name={t.author_name} avatarUrl={t.avatar_url} email={t.author_email || t.email}
        colors={colors} size={40} source={t.source} tags={t.tags}
        showPhotos={showPhotos} useGravatar={useGravatar} fallbackAvatar={fallbackAvatar} />
      <div className={styles.identity}>
        <div className={styles.name} style={{ color: colors.name }}>{t.author_name}</div>
        {t.author_role && <div className={styles.role} style={{ color: colors.role }}>{t.author_role}</div>}
      </div>
    </div>
  );

  return (
    <article className={`blovi-card blovi-wall-card ${styles.card}`} style={{
      background: surface || colors.cardBg,
      borderColor: colors.cardBorder,
      borderRadius: radius,
      color: colors.text,
      "--card-accent": colors.accent,
    } as CSSProperties}>
      {cardLayout === "top" && author}
      {showRatings && t.rating != null && <Stars rating={t.rating} colors={colors} size={15} marginBottom={0} />}
      <div className={styles.quote}>
        <p ref={bodyRef} id={bodyId} className={styles.body} style={{
          display: isExpanded ? "block" : "-webkit-box",
          WebkitLineClamp: isExpanded ? undefined : lineClamp,
        }}>{text}</p>
        {(isClipped || isExpanded) && (
          <button type="button" className={styles.expand} aria-expanded={isExpanded} aria-controls={bodyId}
            onClick={(event) => {
              event.stopPropagation();
              if (expanded === undefined) setLocalExpanded(!isExpanded);
              onExpandChange?.(!isExpanded);
            }}>
            {isExpanded ? "Show less" : "Read full review"}
            <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
          </button>
        )}
      </div>
      {cardLayout === "bottom" && <div className={styles.footer} style={{ borderColor: colors.cardBorder }}>{author}</div>}
      {showDate && formattedDate && <time dateTime={date!.toISOString()} className={styles.date} style={{ color: colors.role }}>{formattedDate}</time>}
    </article>
  );
}
