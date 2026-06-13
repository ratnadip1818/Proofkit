import puppeteer from "puppeteer-core";

async function runTest() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  
  // Listen to console log messages and page errors
  page.on("console", msg => console.log("PAGE LOG:", msg.text()));
  page.on("pageerror", err => console.error("PAGE EXCEPTION:", err.message));
  page.on("requestfailed", req => console.error(`PAGE REQUEST FAILED: ${req.url()} (${req.failure().errorText})`));

  try {
    console.log("Navigating to http://localhost:3000/test.html...");
    await page.goto("http://localhost:3000/test.html", { waitUntil: "networkidle0" });

    // Wait 3 seconds for postMessage and schema rendering
    console.log("Waiting for schema injection...");
    await new Promise(r => setTimeout(r, 3000));

    // Retrieve the injected schema tag content
    console.log("Evaluating page DOM...");
    const schemaData = await page.evaluate(() => {
      const scriptEl = document.getElementById("blovi-schema");
      if (!scriptEl) return null;
      return scriptEl.textContent;
    });

    if (!schemaData) {
      throw new Error("FAIL: Schema tag with ID 'blovi-schema' was not found in page head.");
    }

    console.log("\nFOUND SCHEMA TAG:");
    console.log(schemaData);

    const parsed = JSON.parse(schemaData);
    
    // Check key fields
    if (parsed["@context"] !== "https://schema.org") {
      throw new Error(`FAIL: Unexpected context: ${parsed["@context"]}`);
    }
    if (parsed["@type"] !== "Product") {
      throw new Error(`FAIL: Unexpected type: ${parsed["@type"]}`);
    }
    if (!parsed.name || parsed.name === "Product") {
      throw new Error(`FAIL: Missing or generic product name: ${parsed.name}`);
    }
    if (!parsed.aggregateRating) {
      throw new Error("FAIL: Missing aggregateRating section");
    }
    if (!parsed.review || !parsed.review.length) {
      throw new Error("FAIL: Missing reviews list");
    }

    console.log("\n✅ ALL SCHEMA CHECKS PASSED!");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message || err);
    process.exit(1);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

runTest();
