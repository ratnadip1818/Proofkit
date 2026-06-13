import { readFileSync } from "node:fs";

const file = process.argv[2] ?? ".env.vercel.pull";
for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (!m) continue;
  const [, key, raw] = m;
  if (!key.includes("PADDLE")) continue;
  const v = raw.trim().replace(/^"|"$/g, "");
  console.log(key, "len:", v.length, "prefix:", JSON.stringify(v.slice(0, 6)));
}
