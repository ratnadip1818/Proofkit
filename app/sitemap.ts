import type { MetadataRoute } from "next";

const BASE = "https://www.blovi.space";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/signup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/refund`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
