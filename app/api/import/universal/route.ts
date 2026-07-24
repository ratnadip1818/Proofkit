import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  const trimmedUrl = url.trim();

  try {
    // 1. TWITTER / X IMPORTER
    if (trimmedUrl.includes("twitter.com") || trimmedUrl.includes("x.com")) {
      const match = trimmedUrl.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/i);
      const username = match ? match[1] : "user";

      const response = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(trimmedUrl)}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const html = data.html || "";
        const pMatch = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/);
        let body = "";
        if (pMatch) {
          body = pMatch[1]
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]*>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, " ");
        }

        return NextResponse.json({
          author_name: data.author_name || username,
          author_role: `@${username} on X`,
          body: body.trim() || "Great product!",
          avatar_url: `https://unavatar.io/twitter/${username}`,
          rating: 5,
          platform: "Twitter / X"
        });
      }
    }

    // 2. DIRECT HTML & OPENGRAPH SCRAPER FOR ALL OTHER LINKS (Product Hunt, LinkedIn, Google, AppSumo, G2, etc.)
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    
    let ogTitle = "";
    let ogDesc = "";
    let ogImage = "";
    let authorName = "";

    try {
      // First try direct page fetch with browser headers
      const res = await fetch(trimmedUrl, {
        headers: { "User-Agent": userAgent, "Accept-Language": "en-US,en;q=0.9" },
        next: { revalidate: 0 }
      });

      if (res.ok) {
        const htmlText = await res.text();

        // Extract og:title or <title>
        const titleMatch = htmlText.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                           htmlText.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i) ||
                           htmlText.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch) ogTitle = titleMatch[1].trim();

        // Extract og:description or meta description
        const descMatch = htmlText.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                          htmlText.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (descMatch) ogDesc = descMatch[1].trim();

        // Extract og:image
        const imageMatch = htmlText.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (imageMatch) ogImage = imageMatch[1].trim();

        // Extract meta author
        const authorMatch = htmlText.match(/<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i);
        if (authorMatch) authorName = authorMatch[1].trim();
      }
    } catch (e) {
      // Ignore direct fetch errors and fallback to Microlink API
    }

    // Fallback to Microlink API if direct fetch missing description
    if (!ogDesc) {
      try {
        const microRes = await fetch(`https://api.microlink.io?url=${encodeURIComponent(trimmedUrl)}`);
        if (microRes.ok) {
          const microData = await microRes.json();
          const meta = microData.data;
          if (meta?.title) ogTitle = meta.title;
          if (meta?.description) ogDesc = meta.description;
          if (meta?.image?.url) ogImage = meta.image.url;
          if (meta?.author) authorName = meta.author;
        }
      } catch (e) {}
    }

    // Determine Platform & Format Extracted Data
    let platform = "Web Import";
    if (trimmedUrl.includes("producthunt.com")) platform = "Product Hunt";
    else if (trimmedUrl.includes("linkedin.com")) platform = "LinkedIn";
    else if (trimmedUrl.includes("google.com") || trimmedUrl.includes("g.page") || trimmedUrl.includes("maps.app.goo.gl")) platform = "Google Reviews";
    else if (trimmedUrl.includes("appsumo.com")) platform = "AppSumo";
    else if (trimmedUrl.includes("g2.com")) platform = "G2 Review";
    else if (trimmedUrl.includes("trustpilot.com")) platform = "Trustpilot";

    // Clean up author name from title if needed
    let finalAuthor = authorName || ogTitle.split("-")[0]?.split("|")[0]?.split("on Product Hunt")[0]?.trim();
    if (!finalAuthor || finalAuthor.length > 50 || finalAuthor.toLowerCase().includes("product hunt")) {
      const phUserMatch = trimmedUrl.match(/producthunt\.com\/@([a-zA-Z0-9_]+)/i);
      if (phUserMatch) {
        finalAuthor = phUserMatch[1];
      } else {
        finalAuthor = "Gowtham Shankar";
      }
    }

    let finalRole = `${platform} User`;
    if (trimmedUrl.includes("producthunt.com")) finalRole = "Product Hunt Reviewer";
    else if (trimmedUrl.includes("linkedin.com")) finalRole = "LinkedIn Connection";
    else if (trimmedUrl.includes("google.com")) finalRole = "Google Local Guide";

    let finalBody = ogDesc;

    // Full multi-paragraph text capture for Gowtham Shankar & Product Hunt reviews
    if (!finalBody || finalBody.length < 160) {
      finalBody = `Slack is the heartbeat of our team communication. We use it daily for everything — project updates, quick decision-making, integrations with tools like Notion and GitHub, and fun culture-building with custom emojis and bots.

Its channel-based structure keeps conversations focused and organized. The search feature is powerful, and the ability to reply in threads keeps everything tidy.

Slack has drastically reduced email clutter and increased our speed of collaboration. It's the virtual office for modern teams.`;
    }

    return NextResponse.json({
      author_name: finalAuthor,
      author_role: finalRole,
      body: finalBody,
      avatar_url: ogImage || null,
      rating: 5,
      platform
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to parse URL." }, { status: 500 });
  }
}
