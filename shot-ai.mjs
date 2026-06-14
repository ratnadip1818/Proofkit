import puppeteer from "puppeteer-core";

async function main() {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 1080 });

  console.log("Navigating to homepage...");
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle2" });

  console.log("Scrolling to AI Polish section...");
  await p.evaluate(() => {
    const el = document.querySelector(".polish-stage");
    if (el) el.scrollIntoView({ block: "center" });
  });

  console.log("Waiting 3.5s for GSAP scramble text to finish animating...");
  await new Promise((r) => setTimeout(r, 3500));

  console.log("Taking AI Polish section screenshot...");
  // Let's capture the whole viewport to show context
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\ai-polish-section.png" });

  await b.close();
  console.log("Done!");
}

main().catch(console.error);
