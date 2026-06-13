/** Production infrastructure audit for blovi.space — read-only checks. */
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
}

const BASE = "https://www.blovi.space";
const results = [];
function log(area, status, detail) {
  results.push({ area, status, detail });
  console.log(`[${status}] ${area} — ${detail}`);
}

// 1. Paddle webhook endpoint live + rejecting unsigned requests
try {
  const r = await fetch(`${BASE}/api/paddle/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  const j = await r.json().catch(() => ({}));
  log(
    "paddle-webhook-endpoint",
    r.status === 400 && j.error === "Missing signature" ? "OK" : "WARN",
    `POST unsigned -> ${r.status} ${JSON.stringify(j)}`
  );
} catch (e) {
  log("paddle-webhook-endpoint", "FAIL", e.message);
}

// 2. Paddle client token + price id baked into the prod bundle
try {
  const html = await (await fetch(BASE)).text();
  const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[^"]+\.js/g) ?? [])];
  let token = null, price = null;
  for (const c of chunks) {
    const js = await (await fetch(`${BASE}${c}`)).text();
    token ??= js.match(/\b(live_[a-zA-Z0-9]{15,})\b/)?.[1] ?? null;
    price ??= js.match(/\b(pri_[a-z0-9]{15,})\b/)?.[1] ?? null;
    if (token && price) break;
  }
  log("paddle-checkout-config", token && price ? "OK" : "FAIL",
    `client token ${token ? "present (" + token.slice(0, 9) + "…)" : "MISSING"}, price id ${price ? "present" : "MISSING"} (scanned ${chunks.length} chunks)`);
} catch (e) {
  log("paddle-checkout-config", "FAIL", e.message);
}

// 3. SEO surface
for (const path of ["/robots.txt", "/sitemap.xml"]) {
  const r = await fetch(`${BASE}${path}`);
  log(`seo${path}`, r.status === 200 ? "OK" : "MISSING", `status ${r.status}`);
}
try {
  const html = await (await fetch(BASE)).text();
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "none";
  const desc = /<meta[^>]+name="description"/.test(html);
  const og = /<meta[^>]+property="og:/.test(html);
  const ogImage = /<meta[^>]+property="og:image"/.test(html);
  log("seo-meta", desc && og ? (ogImage ? "OK" : "WARN") : "WARN",
    `title="${title}", description=${desc}, og-tags=${og}, og:image=${ogImage}`);
} catch (e) {
  log("seo-meta", "FAIL", e.message);
}

// 4. apex -> www redirect
try {
  const r = await fetch("https://blovi.space", { redirect: "manual" });
  log("apex-redirect", [301, 302, 307, 308].includes(r.status) ? "OK" : "WARN",
    `https://blovi.space -> ${r.status} ${r.headers.get("location") ?? ""}`);
} catch (e) {
  log("apex-redirect", "FAIL", e.message);
}

// 5. embed must be iframable from other sites
try {
  const r = await fetch(`${BASE}/embed/00000000-0000-0000-0000-000000000000?demo=1`);
  const xfo = r.headers.get("x-frame-options");
  const csp = r.headers.get("content-security-policy") ?? "";
  const blocked = xfo || /frame-ancestors/.test(csp);
  log("embed-iframable", !blocked && r.status === 200 ? "OK" : "FAIL",
    `status ${r.status}, x-frame-options=${xfo ?? "none"}, frame-ancestors=${/frame-ancestors/.test(csp)}`);
} catch (e) {
  log("embed-iframable", "FAIL", e.message);
}

// 6. widget.js served + cacheable
try {
  const r = await fetch(`${BASE}/widget.js`);
  log("widget-js", r.status === 200 ? "OK" : "FAIL",
    `status ${r.status}, cache-control=${r.headers.get("cache-control")}`);
} catch (e) {
  log("widget-js", "FAIL", e.message);
}

// 7. 404 handling
try {
  const r = await fetch(`${BASE}/definitely-not-a-page-xyz`);
  log("not-found", r.status === 404 ? "OK" : "WARN", `status ${r.status}`);
} catch (e) {
  log("not-found", "FAIL", e.message);
}

// 8. Resend: API key valid + sending domain verification status
try {
  if (!env.RESEND_API_KEY || env.RESEND_API_KEY.startsWith("your_")) {
    log("resend", "UNKNOWN", "local key is a placeholder; cannot check");
  } else {
    const r = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
    });
    if (!r.ok) {
      log("resend", "FAIL", `API key rejected (${r.status})`);
    } else {
      const { data } = await r.json();
      if (!data?.length) {
        log("resend", "WARN", "key valid but NO sending domain configured (emails from hello@blovi.space will fail or land in spam)");
      } else {
        const summary = data.map((d) => `${d.name}: ${d.status}`).join(", ");
        log("resend", data.some((d) => d.status === "verified") ? "OK" : "WARN", summary);
      }
    }
  }
} catch (e) {
  log("resend", "FAIL", e.message);
}

// 9. Anthropic key (powers the AI improve button) — count-tokens ping, no cost
try {
  if (!env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY.startsWith("your_")) {
    log("anthropic", "UNKNOWN", "local key is a placeholder; cannot check");
  } else {
    const r = await fetch("https://api.anthropic.com/v1/messages/count_tokens", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    log("anthropic", r.ok ? "OK" : "FAIL", `key check -> ${r.status}${r.ok ? " (valid)" : ""}`);
  }
} catch (e) {
  log("anthropic", "FAIL", e.message);
}

// 10. security headers on the app
try {
  const r = await fetch(`${BASE}/login`);
  const hsts = r.headers.get("strict-transport-security");
  log("security-headers", hsts ? "OK" : "WARN", `hsts=${hsts ?? "none"}`);
} catch (e) {
  log("security-headers", "FAIL", e.message);
}

console.log("\n--- summary ---");
for (const { area, status } of results) console.log(`${status.padEnd(8)} ${area}`);
