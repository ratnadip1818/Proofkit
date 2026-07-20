import type { ThemeColors } from "../theme/types";

export const StarIcon = ({
  fill,
  color,
  size,
}: {
  fill: string;
  color: string;
  size: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export function Stars({
  rating,
  colors,
  size = 14,
  marginBottom = 12,
}: {
  rating: number;
  colors: ThemeColors;
  size?: number;
  marginBottom?: number;
}) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const isLit = n <= rating;
        return (
          <div key={n}>
            <StarIcon
              size={size}
              fill={isLit ? colors.starOn : "transparent"}
              color={isLit ? colors.starOn : colors.starOff}
            />
          </div>
        );
      })}
    </div>
  );
}
