export function sanitizeCss(css: string | null | undefined): string | null {
  if (!css) return null;
  // 1. Prevent breaking out of <style> tag by stripping </style> case-insensitively
  let clean = css.replace(/<\/style>/gi, "");
  // 2. Remove HTML tags in general
  clean = clean.replace(/<[^>]*>/g, "");
  // 3. Remove javascript: protocols and CSS expressions
  clean = clean.replace(/expression\s*\(|javascript\s*:/gi, "");
  return clean.trim();
}

export function sanitizeFontName(font: string | null | undefined): string {
  if (!font) return "Inter";
  // Only allow alphanumeric characters, spaces, hyphens, and underscores
  return font.replace(/[^a-zA-Z0-9\s\-_]/g, "").trim() || "Inter";
}
