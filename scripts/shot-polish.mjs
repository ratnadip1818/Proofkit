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
await p.evaluate(() => document.querySelector(".polish-stage")?.scrollIntoView({ block: "center" }));
await new Promise((r) => setTimeout(r, 600));
await p.screenshot({ path: "scripts/shots/polish-mid.png" });
await new Promise((r) => setTimeout(r, 3500));
await p.screenshot({ path: "scripts/shots/polish-end.png" });
console.log(errs.length ? "ERRORS: " + errs.join("; ") : "No errors.");
await b.close();
