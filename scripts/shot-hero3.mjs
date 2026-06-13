import puppeteer from "puppeteer-core";

const b = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
await p.setViewport({ width: 1440, height: 900 });
await p.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 2500));
await p.screenshot({ path: "scripts/shots/hero3.png" });
await new Promise((r) => setTimeout(r, 3500));
await p.screenshot({ path: "scripts/shots/hero3-polished.png" });
await p.setViewport({ width: 390, height: 844, isMobile: true });
await p.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 2000));
await p.screenshot({ path: "scripts/shots/hero3-mobile.png" });
console.log(errs.length ? "ERRORS: " + errs.join("; ") : "No errors.");
await b.close();
