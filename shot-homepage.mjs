import puppeteer from "puppeteer-core";

async function main() {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 960 });

  console.log("Navigating to homepage...");
  await p.goto("http://localhost:3000/", { waitUntil: "networkidle2" });

  console.log("Waiting 3s for cards to fade in...");
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Scrolling page to trigger animations...");
  await p.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 120;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 40);
    });
  });

  console.log("Waiting 2s for animations to settle...");
  await new Promise((r) => setTimeout(r, 2000));

  console.log("Taking homepage hero screenshot...");
  await p.screenshot({ path: "C:\\Users\\userp\\.gemini\\antigravity\\brain\\e38401a4-c7e7-40a7-991b-f7804a7b94f7\\homepage-hero.png", fullPage: true });

  await b.close();
  console.log("Done!");
}

main().catch(console.error);
