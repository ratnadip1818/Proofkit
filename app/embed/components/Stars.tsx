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
    strokeWidth="1.5"
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
  size = 16,
  marginBottom = 10,
}: {
  rating: number;
  colors: ThemeColors;
  size?: number;
  marginBottom?: number;
}) {
  const litFill = colors.starOn || "#FBBF24";
  const litStroke = colors.ratingBorder || colors.starOn || "#FBBF24";
  const unlitFill = colors.starOff || "#E5E7EB";
  const unlitStroke = colors.starOff || "#E5E7EB";

  return (
    <div style={{ display: "flex", gap: "2.5px", marginBottom, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const isLit = n <= rating;
        return (
          <div key={n} style={{ display: "flex" }}>
            <StarIcon
              size={size}
              fill={isLit ? litFill : unlitFill}
              color={isLit ? litStroke : unlitStroke}
            />
          </div>
        );
      })}
    </div>
  );
}
