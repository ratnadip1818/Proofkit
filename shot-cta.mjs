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

  console.log("Scrolling to the bottom of the page...");
  await p.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  console.log("Waiting 3s for GSAP animations and parallax to render...");
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Taking final CTA section screenshot...");
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\final-cta-section.png" });

  await b.close();
  console.log("Done!");
}

main().catch(console.error);
