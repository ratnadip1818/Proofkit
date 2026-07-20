import type { ThemeColors } from "../theme/types";

export function EmptyState({ colors }: { colors: ThemeColors }) {
  return (
    <p style={{ textAlign: "center", color: colors.emptyText, fontSize: "14px" }}>
      No testimonials yet.
    </p>
  );
}
