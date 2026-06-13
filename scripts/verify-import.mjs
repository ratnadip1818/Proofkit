async function testApi() {
  const tweetUrl = "https://x.com/jack/status/20";
  const apiEndpoint = `http://localhost:3000/api/import/twitter?url=${encodeURIComponent(tweetUrl)}`;

  console.log(`Sending GET request to ${apiEndpoint}...`);
  try {
    const res = await fetch(apiEndpoint);
    const data = await res.json();

    if (!res.ok) {
      console.error("FAIL: API returned an error:", data.error || data);
      process.exit(1);
    }

    console.log("SUCCESS: Received tweet data:");
    console.log(JSON.stringify(data, null, 2));

    // Verify fields
    if (!data.author_name) {
      console.error("FAIL: Missing author_name");
      process.exit(1);
    }
    if (!data.author_role || !data.author_role.startsWith("@")) {
      console.error("FAIL: Missing or invalid author_role:", data.author_role);
      process.exit(1);
    }
    if (!data.body) {
      console.error("FAIL: Missing body");
      process.exit(1);
    }
    if (!data.avatar_url || !data.avatar_url.includes("unavatar.io")) {
      console.error("FAIL: Missing or invalid avatar_url:", data.avatar_url);
      process.exit(1);
    }

    console.log("\n✅ ALL BACKEND TWEET PARSING CHECKS PASSED!");
  } catch (err) {
    console.error("FAIL: Request failed with error:", err.message || err);
    process.exit(1);
  }
}

testApi();
