import puppeteer from "puppeteer-core";

async function main() {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });

  console.log("Navigating to test.html...");
  await p.goto("http://localhost:3000/test.html", { waitUntil: "domcontentloaded" });

  await new Promise((r) => setTimeout(r, 500));

  console.log("Taking skeleton screenshot...");
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\skeleton-preview.png", fullPage: true });

  console.log("Scrolling page to trigger all IntersectionObservers...");
  await p.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  console.log("Waiting for iframe to load and render...");
  await new Promise((r) => setTimeout(r, 5000));

  console.log("Taking final widget screenshot...");
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\test-html-preview.png", fullPage: true });

  await b.close();
  console.log("Done!");
}

main().catch(console.error);
