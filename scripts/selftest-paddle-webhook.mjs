/**
 * Paddle webhook + checkout config self-test (no real payment).
 *
 * Local (dev server must run with PADDLE_WEBHOOK_SECRET=selftest_secret):
 *   1. unsigned request          -> 400 "Missing signature"
 *   2. forged signature          -> 400 "Invalid signature"
 *   3. valid sig, ignored event  -> 200  (proves HMAC matches SDK verification)
 *   4. valid sig, txn.completed  -> reaches paddle.customers.get (placeholder
 *      key locally, so a 500 here proves the unlock path was entered)
 *
 * Production (https://www.blovi.space):
 *   5. unsigned request          -> 400 "Missing signature" (route deployed)
 *   6. forged signature          -> 400 "Invalid signature"
 *   7. homepage JS bundle contains a non-empty Paddle client token (live_*)
 *      and price id (pri_*) — i.e. the checkout button can actually open
 */
import { createHmac, randomUUID } from "node:crypto";

const SECRET = process.env.SELFTEST_SECRET ?? "selftest_secret";
const LOCAL = "http://localhost:3000/api/paddle/webhook";
const PROD = "https://www.blovi.space/api/paddle/webhook";

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

function payload(eventType) {
  return JSON.stringify({
    event_id: `evt_${randomUUID().replace(/-/g, "").slice(0, 22)}`,
    event_type: eventType,
    occurred_at: new Date().toISOString(),
    notification_id: `ntf_${randomUUID().replace(/-/g, "").slice(0, 22)}`,
    data: {
      id: `txn_${randomUUID().replace(/-/g, "").slice(0, 22)}`,
      status: "completed",
      customer_id: "ctm_01selftestnonexistent00",
      currency_code: "USD",
      origin: "web",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [],
      payments: [],
    },
  });
}

function sign(body, secret) {
  const ts = Math.floor(Date.now() / 1000);
  const h1 = createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex");
  return `ts=${ts};h1=${h1}`;
}

async function post(url, body, signature) {
  const headers = { "Content-Type": "application/json" };
  if (signature) headers["Paddle-Signature"] = signature;
  const res = await fetch(url, { method: "POST", headers, body });
  let json = {};
  try { json = await res.json(); } catch {}
  return { status: res.status, body: json };
}

// ---- local handler logic ---------------------------------------------------
console.log("— local handler (signed with shared test secret) —");
{
  const body = payload("transaction.updated");

  const r1 = await post(LOCAL, body, null);
  check("unsigned rejected", r1.status === 400 && r1.body.error === "Missing signature", `${r1.status} ${JSON.stringify(r1.body)}`);

  const r2 = await post(LOCAL, body, "ts=1;h1=deadbeef");
  check("forged signature rejected", r2.status === 400 && r2.body.error === "Invalid signature", `${r2.status} ${JSON.stringify(r2.body)}`);

  const r3 = await post(LOCAL, body, sign(body, SECRET));
  check("valid signature accepted (ignored event type)", r3.status === 200 && r3.body.received === true, `${r3.status} ${JSON.stringify(r3.body)}`);

  const completed = payload("transaction.completed");
  const r4 = await post(LOCAL, completed, sign(completed, SECRET));
  // Local Paddle API key is a placeholder, so reaching customers.get -> 500.
  check("txn.completed enters unlock path (500 from placeholder API key)", r4.status === 500, `status ${r4.status}`);
}

// ---- production endpoint ----------------------------------------------------
console.log("— production endpoint —");
{
  const body = payload("transaction.updated");

  const r5 = await post(PROD, body, null);
  check("prod: unsigned rejected (route live)", r5.status === 400 && r5.body.error === "Missing signature", `${r5.status} ${JSON.stringify(r5.body)}`);

  const r6 = await post(PROD, body, "ts=1;h1=deadbeef");
  check("prod: forged signature rejected", r6.status === 400 && r6.body.error === "Invalid signature", `${r6.status} ${JSON.stringify(r6.body)}`);
}

// ---- production checkout config ---------------------------------------------
console.log("— production checkout config (client bundle) —");
{
  const html = await (await fetch("https://www.blovi.space/")).text();
  const chunkPaths = [...new Set(html.match(/\/_next\/static\/chunks\/[^"]+\.js/g) ?? [])];
  let token = null;
  let priceId = null;
  for (const path of chunkPaths) {
    const js = await (await fetch(`https://www.blovi.space${path}`)).text();
    token ??= js.match(/\b(live_[a-z0-9]{20,})\b/)?.[1] ?? null;
    priceId ??= js.match(/\b(pri_[a-z0-9]{20,})\b/)?.[1] ?? null;
    if (token && priceId) break;
  }
  check("prod bundle has Paddle client token", !!token, token ? `${token.slice(0, 10)}…` : `searched ${chunkPaths.length} chunks`);
  check("prod bundle has Paddle price id", !!priceId, priceId ? `${priceId.slice(0, 10)}…` : "not found");
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
