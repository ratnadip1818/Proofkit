/**
 * Helper utilities for widget DOM and iframe communication.
 */

export function sendWidgetHeight(): void {
  if (typeof window === "undefined") return;
  const el = document.getElementById("proofkit-widget-wrapper");
  const height = el ? el.offsetHeight : document.body.scrollHeight;
  window.parent.postMessage({ type: "proofkit-resize", height }, "*");
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}
