import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  // Extract username and status ID from url
  const match = url.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/i);
  if (!match) {
    return NextResponse.json({ error: "Invalid Twitter/X tweet URL format." }, { status: 400 });
  }

  const username = match[1];

  try {
    // Call Twitter's public OEmbed API with a standard browser User-Agent
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch tweet details from Twitter/X." }, { status: response.status });
    }

    const data = await response.json();
    const html = data.html || "";

    // Parse tweet text inside <p> tag
    const pMatch = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/);
    let body = "";
    if (pMatch) {
      body = pMatch[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "");
      
      // Decode HTML entities
      body = body
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
    }

    // Parse handle
    const handleMatch = html.match(/&mdash;\s*.*?\s*\((@[a-zA-Z0-9_]+)\)/);
    const handle = handleMatch ? handleMatch[1] : `@${username}`;

    const author_name = data.author_name || username;
    const avatar_url = `https://unavatar.io/twitter/${username}`;

    return NextResponse.json({
      author_name,
      author_role: handle,
      body: body.trim(),
      avatar_url,
      source: "twitter"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred while importing the tweet." }, { status: 500 });
  }
}
