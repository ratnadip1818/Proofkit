import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parseGoogleMapsUrl(urlStr: string) {
  try {
    const url = new URL(urlStr);
    let businessName = "";

    // 1. Path format: /maps/place/Business+Name/...
    const placeMatch = url.pathname.match(/\/maps\/place\/([^/@?]+)/i);
    if (placeMatch) {
      businessName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }

    // 2. Query param 'q' (e.g. q=Starbucks+Coffee or q=place_name)
    if (!businessName && url.searchParams.has("q")) {
      const q = url.searchParams.get("q");
      if (q && !q.startsWith("loc:") && !q.match(/^-?\d+\.\d+,-?\d+\.\d+$/)) {
        businessName = q.replace(/\+/g, " ");
      }
    }

    const placeId =
      url.searchParams.get("placeid") ||
      url.searchParams.get("place_id") ||
      null;
    const cid = url.searchParams.get("cid") || null;

    return { businessName, placeId, cid };
  } catch {
    return { businessName: "", placeId: null, cid: null };
  }
}

async function fetchGooglePlacesReviews(
  apiKey: string,
  placeId?: string | null,
  query?: string | null
) {
  try {
    let resolvedPlaceId = placeId;
    if (!resolvedPlaceId && query) {
      const searchRes = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id,places.displayName",
          },
          body: JSON.stringify({ textQuery: query }),
        }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        resolvedPlaceId = searchData.places?.[0]?.id;
      }
    }
    if (!resolvedPlaceId) return null;

    const detailsRes = await fetch(
      `https://places.googleapis.com/v1/places/${resolvedPlaceId}?key=${apiKey}`,
      {
        headers: {
          "X-Goog-FieldMask": "displayName,reviews,rating,userRatingCount",
        },
      }
    );
    if (!detailsRes.ok) return null;
    return await detailsRes.json();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  const trimmedUrl = url.trim();

  try {
    // ---------------------------------------------------------
    // 1. TWITTER / X IMPORTER (Public oEmbed)
    // ---------------------------------------------------------
    if (trimmedUrl.includes("twitter.com") || trimmedUrl.includes("x.com")) {
      const match = trimmedUrl.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/i);
      const username = match ? match[1] : "user";

      const response = await fetch(
        `https://publish.twitter.com/oembed?url=${encodeURIComponent(trimmedUrl)}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const html = data.html || "";
        const pMatch = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/);
        let body = "";
        if (pMatch) {
          body = stripHtml(pMatch[1]);
        }

        return NextResponse.json({
          author_name: data.author_name || username,
          author_role: `@${username} on X`,
          body: body.trim() || "Great product!",
          avatar_url: `https://unavatar.io/twitter/${username}`,
          rating: 5,
          platform: "Twitter / X",
          source: "twitter",
        });
      }
    }

    // ---------------------------------------------------------
    // 2. PRODUCT HUNT IMPORTER (Real Schema.org JSON-LD & OG Parsing)
    // ---------------------------------------------------------
    if (trimmedUrl.includes("producthunt.com")) {
      // Use crawler User-Agent to bypass Cloudflare bot challenge
      const crawlerUa =
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)";
      const phRes = await fetch(trimmedUrl, {
        headers: {
          "User-Agent": crawlerUa,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 0 },
      });

      if (!phRes.ok) {
        return NextResponse.json(
          { error: `Product Hunt returned status ${phRes.status}. Please verify the URL.` },
          { status: phRes.status }
        );
      }

      const html = await phRes.text();

      // Check for specific review ID in URL (e.g. ?review=617540 or #review-617540)
      const reviewIdMatch = trimmedUrl.match(/[?&]review=([0-9a-zA-Z_-]+)/i);
      const targetReviewId = reviewIdMatch ? reviewIdMatch[1] : null;

      // Extract JSON-LD scripts
      const jsonLds = [
        ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi),
      ];

      const allReviews: any[] = [];
      let postProduct: any = null;

      for (const m of jsonLds) {
        try {
          const parsed = JSON.parse(m[1]);
          if (parsed.review) {
            if (Array.isArray(parsed.review)) {
              allReviews.push(...parsed.review);
            } else {
              allReviews.push(parsed.review);
            }
          }
          if (parsed["@type"] === "WebApplication" || parsed.name && parsed.description) {
            postProduct = parsed;
          }
        } catch {}
      }

      // Case A: A review was found (either matched by ID or from a reviews list page)
      let selectedReview = null;
      if (targetReviewId && allReviews.length > 0) {
        selectedReview = allReviews.find((r) =>
          String(r["@id"] || r.url || "").includes(targetReviewId)
        );
      }
      if (!selectedReview && allReviews.length > 0) {
        selectedReview = allReviews[0];
      }

      if (selectedReview) {
        const authorName = selectedReview.author?.name || "Product Hunt Reviewer";
        const authorHandle = selectedReview.author?.url
          ? `@${selectedReview.author.url.split("/@")[1] || ""}`
          : "";
        const role = authorHandle
          ? `${authorHandle} on Product Hunt`
          : "Verified Reviewer on Product Hunt";
        const avatarUrl = selectedReview.author?.image || null;
        const rating = selectedReview.reviewRating?.ratingValue
          ? Math.min(5, Math.max(1, Math.round(Number(selectedReview.reviewRating.ratingValue))))
          : 5;

        let body = stripHtml(selectedReview.reviewBody || "");
        if (selectedReview.positiveNotes?.itemListElement?.[0]?.name) {
          const note = stripHtml(selectedReview.positiveNotes.itemListElement[0].name);
          if (note && !body.includes(note)) {
            body = `${body}\n\n${note}`.trim();
          }
        }

        return NextResponse.json({
          author_name: authorName,
          author_role: role,
          body: body || "Great product!",
          avatar_url: avatarUrl,
          rating,
          platform: "Product Hunt",
          source: "producthunt",
        });
      }

      // Case B: Product Hunt Post page (e.g. /posts/blovi)
      if (postProduct || trimmedUrl.includes("/posts/")) {
        const ogTitle =
          html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1] ||
          postProduct?.name ||
          "";
        const ogDesc =
          html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1] ||
          postProduct?.description ||
          "";
        const ogImage =
          html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1] ||
          postProduct?.image ||
          null;

        // Try extracting author from comments or maker tag in post HTML
        let authorName = "";
        let authorRole = "Maker on Product Hunt";
        const authorLinkMatch = html.match(/href="\/@([a-zA-Z0-9_]+)"[^>]*>([^<]+)<\/a>/i);
        if (authorLinkMatch) {
          authorName = authorLinkMatch[2].trim();
          authorRole = `@${authorLinkMatch[1]} on Product Hunt`;
        }

        if (!authorName) {
          authorName = ogTitle.split(":")[0]?.split("|")[0]?.trim() || "Product Hunt Community";
        }

        return NextResponse.json({
          author_name: authorName,
          author_role: authorRole,
          body: stripHtml(ogDesc) || "Great launch on Product Hunt!",
          avatar_url: ogImage,
          rating: 5,
          platform: "Product Hunt",
          source: "producthunt",
        });
      }

      return NextResponse.json(
        { error: "Could not find review or launch content on this Product Hunt page." },
        { status: 404 }
      );
    }

    // ---------------------------------------------------------
    // 3. GOOGLE REVIEWS IMPORTER (Places API / Maps Resolver)
    // ---------------------------------------------------------
    if (
      trimmedUrl.includes("google.com/maps") ||
      trimmedUrl.includes("maps.app.goo.gl") ||
      trimmedUrl.includes("g.page") ||
      trimmedUrl.includes("search.google.com/local") ||
      trimmedUrl.includes("maps.google.com")
    ) {
      let resolvedUrl = trimmedUrl;

      // Expand shortened maps links (maps.app.goo.gl / g.page)
      try {
        const headRes = await fetch(trimmedUrl, {
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        resolvedUrl = headRes.url;
      } catch {}

      const { businessName, placeId } = parseGoogleMapsUrl(resolvedUrl);

      // Check if user has Google Places API configured
      const googleApiKey =
        process.env.GOOGLE_PLACES_API_KEY ||
        process.env.GOOGLE_MAPS_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

      if (googleApiKey) {
        const placesData = await fetchGooglePlacesReviews(
          googleApiKey,
          placeId,
          businessName
        );

        if (placesData?.reviews && placesData.reviews.length > 0) {
          const topReview = placesData.reviews[0];
          return NextResponse.json({
            author_name: topReview.authorAttribution?.displayName || "Google Reviewer",
            author_role: businessName
              ? `Review for ${businessName}`
              : "Google Verified Customer",
            body: topReview.text?.text || topReview.originalText?.text || "Great service!",
            avatar_url: topReview.authorAttribution?.photoUri || null,
            rating: topReview.rating || 5,
            platform: "Google Reviews",
            source: "google",
          });
        }
      }

      // If no API key or no reviews returned by API, return the detected business context
      const displayRole = businessName
        ? `Review for ${businessName}`
        : "Google Verified Customer";

      return NextResponse.json({
        author_name: "Google Reviewer",
        author_role: displayRole,
        body: "",
        avatar_url: null,
        rating: 5,
        platform: "Google Reviews",
        source: "google",
        business_name: businessName || "Google Listing",
        requires_paste: true,
      });
    }

    // ---------------------------------------------------------
    // 4. GENERAL OPENGRAPH SCRAPER (LinkedIn, Trustpilot, G2, etc.)
    // ---------------------------------------------------------
    const userAgent =
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)";

    let ogTitle = "";
    let ogDesc = "";
    let ogImage = "";
    let authorName = "";

    try {
      const res = await fetch(trimmedUrl, {
        headers: {
          "User-Agent": userAgent,
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 0 },
      });

      if (res.ok) {
        const htmlText = await res.text();

        const titleMatch =
          htmlText.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
          htmlText.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i) ||
          htmlText.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch) ogTitle = titleMatch[1].trim();

        const descMatch =
          htmlText.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
          htmlText.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (descMatch) ogDesc = descMatch[1].trim();

        const imageMatch = htmlText.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (imageMatch) ogImage = imageMatch[1].trim();

        const authorMatch = htmlText.match(/<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i);
        if (authorMatch) authorName = authorMatch[1].trim();
      }
    } catch {}

    // Fallback to Microlink if description is empty
    if (!ogDesc) {
      try {
        const microRes = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(trimmedUrl)}`
        );
        if (microRes.ok) {
          const microData = await microRes.json();
          const meta = microData.data;
          if (meta?.title) ogTitle = meta.title;
          if (meta?.description) ogDesc = meta.description;
          if (meta?.image?.url) ogImage = meta.image.url;
          if (meta?.author) authorName = meta.author;
        }
      } catch {}
    }

    let platform = "Web Import";
    let source = "manual";
    if (trimmedUrl.includes("linkedin.com")) {
      platform = "LinkedIn";
      source = "linkedin";
    } else if (trimmedUrl.includes("appsumo.com")) {
      platform = "AppSumo";
      source = "appsumo";
    } else if (trimmedUrl.includes("g2.com")) {
      platform = "G2 Review";
      source = "g2";
    } else if (trimmedUrl.includes("trustpilot.com")) {
      platform = "Trustpilot";
      source = "trustpilot";
    }

    const finalAuthor =
      authorName ||
      ogTitle.split("-")[0]?.split("|")[0]?.split(":")[0]?.trim() ||
      "Verified Customer";

    const finalRole = `${platform} Review`;
    const finalBody = stripHtml(ogDesc);

    if (!finalBody) {
      return NextResponse.json(
        {
          error:
            "Could not extract review text from this link. Please paste the quote directly using the DM / Email Clipper tab.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      author_name: finalAuthor,
      author_role: finalRole,
      body: finalBody,
      avatar_url: ogImage || null,
      rating: 5,
      platform,
      source,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to parse URL." },
      { status: 500 }
    );
  }
}
