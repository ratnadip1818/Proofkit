import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/#wall-of-love", { waitUntil: "networkidle2" });

await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => {
  document.querySelector("iframe")?.scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 2500));

const iframeCount = await page.evaluate(() => document.querySelectorAll("iframe").length);
const iframeText = await page.evaluate(() => {
  const f = document.querySelector("iframe");
  if (!f) return null;
  try {
    return f.contentDocument?.body?.innerText?.slice(0, 300) ?? "no-content-doc";
  } catch (e) {
    return "cross-origin: " + e.message;
  }
});

await page.screenshot({ path: "scripts/shots/live-widget.png" });
console.log("iframes found:", iframeCount);
console.log("iframe text snippet:", iframeText);
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "No errors.");
await browser.close();
