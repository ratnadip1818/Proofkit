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
    // 1. TWITTER / X IMPORTER (FxTwitter Open API + oEmbed Fallback)
    // ---------------------------------------------------------
    if (trimmedUrl.includes("twitter.com") || trimmedUrl.includes("x.com")) {
      const match = trimmedUrl.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/i);
      const username = match ? match[1] : "user";
      const tweetId = match ? match[2] : null;

      // Method A: FxTwitter Open API (Returns full text, author, and avatar with 0 auth)
      if (tweetId) {
        try {
          const fxRes = await fetch(`https://api.fxtwitter.com/${username}/status/${tweetId}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(6000),
          });
          if (fxRes.ok) {
            const fxData = await fxRes.json();
            const tweet = fxData.tweet;
            if (tweet && tweet.text) {
              return NextResponse.json({
                author_name: tweet.author?.name || username,
                author_role: `@${tweet.author?.screen_name || username} on X`,
                body: tweet.text.trim(),
                avatar_url: tweet.author?.avatar_url || `https://unavatar.io/twitter/${username}`,
                rating: 5,
                platform: "Twitter / X",
                source: "twitter",
              });
            }
          }
        } catch {}
      }

      // Method B: Official Twitter oEmbed Fallback
      try {
        const response = await fetch(
          `https://publish.twitter.com/oembed?url=${encodeURIComponent(trimmedUrl)}`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            signal: AbortSignal.timeout(5000),
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
      } catch {}

      return NextResponse.json({ error: "Could not fetch tweet. Make sure the tweet is public." }, { status: 404 });
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
        // If Cloudflare blocks datacenter IP (403), gracefully extract product/user from URL
        let productName = "";
        const postMatch = trimmedUrl.match(/producthunt\.com\/posts\/([^/?#]+)/i);
        const prodMatch = trimmedUrl.match(/producthunt\.com\/products\/([^/?#]+)/i);
        const userMatch = trimmedUrl.match(/producthunt\.com\/@([^/?#]+)/i);

        if (postMatch) productName = postMatch[1].replace(/[-_]/g, " ");
        else if (prodMatch) productName = prodMatch[1].replace(/[-_]/g, " ");
        else if (userMatch) productName = `@${userMatch[1]}`;

        const formattedName = productName
          ? productName.charAt(0).toUpperCase() + productName.slice(1)
          : "";

        return NextResponse.json({
          author_name: userMatch ? `@${userMatch[1]}` : "Product Hunt Reviewer",
          author_role: formattedName
            ? `Review for ${formattedName} on Product Hunt`
            : "Product Hunt Community",
          body: "",
          avatar_url: null,
          rating: 5,
          platform: "Product Hunt",
          source: "producthunt",
          business_name: formattedName || "Product Hunt",
          requires_paste: true,
        });
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
    // 3. APPLE APP STORE REVIEWS IMPORTER (Official RSS JSON)
    // ---------------------------------------------------------
    if (trimmedUrl.includes("apps.apple.com") || trimmedUrl.includes("itunes.apple.com")) {
      const countryMatch = trimmedUrl.match(/apps\.apple\.com\/([a-z]{2})\/app\//i);
      const idMatch = trimmedUrl.match(/\/id(\d+)/i) || trimmedUrl.match(/id=(\d+)/i);
      const country = countryMatch ? countryMatch[1] : "us";
      const appId = idMatch ? idMatch[1] : null;

      if (!appId) {
        return NextResponse.json(
          { error: "Could not find App Store ID. Format should be: https://apps.apple.com/us/app/app-name/id12345" },
          { status: 400 }
        );
      }

      try {
        const feedRes = await fetch(
          `https://itunes.apple.com/${country}/rss/customerreviews/id=${appId}/json`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(6000),
          }
        );

        if (feedRes.ok) {
          const feedData = await feedRes.json();
          const reviews = feedData.feed?.entry?.slice(1) || [];

          if (reviews.length > 0) {
            const topReview = reviews[0];
            const reviewerName = topReview.author?.name?.label || "App Store Customer";
            const reviewTitle = topReview.title?.label || "";
            const reviewText = topReview.content?.label || "";
            const ratingVal = Number(topReview["im:rating"]?.label) || 5;

            const combinedBody = reviewTitle
              ? `${reviewTitle}\n\n${reviewText}`.trim()
              : reviewText.trim();

            return NextResponse.json({
              author_name: reviewerName,
              author_role: `Verified App Store Review (${country.toUpperCase()})`,
              body: combinedBody,
              avatar_url: null,
              rating: Math.min(5, Math.max(1, ratingVal)),
              platform: "Apple App Store",
              source: "appstore",
              all_reviews: reviews.slice(0, 10).map((r: any) => ({
                author_name: r.author?.name?.label || "App Store Customer",
                rating: Number(r["im:rating"]?.label) || 5,
                title: r.title?.label || "",
                body: r.content?.label || "",
              })),
            });
          }
        }
      } catch (err: any) {
        return NextResponse.json({ error: "Failed to connect to Apple App Store." }, { status: 502 });
      }

      return NextResponse.json({ error: "No customer reviews found for this app yet." }, { status: 404 });
    }

    // ---------------------------------------------------------
    // 4. REDDIT POST & COMMENT IMPORTER
    // ---------------------------------------------------------
    if (trimmedUrl.includes("reddit.com") || trimmedUrl.includes("redd.it")) {
      try {
        const cleanUrl = trimmedUrl.split("?")[0].replace(/\/+$/, "");

        // Method A: User-specified .json endpoint
        try {
          const jsonUrl = cleanUrl.endsWith(".json") ? cleanUrl : `${cleanUrl}.json`;
          const redditRes = await fetch(jsonUrl, {
            headers: {
              "User-Agent": "web:proofkit-review-importer:v1.0 (by /u/proofkit_app)",
              "Accept": "application/json",
            },
            signal: AbortSignal.timeout(5000),
          });

          if (redditRes.ok) {
            const data = await redditRes.json();
            if (Array.isArray(data) && data[0]?.data?.children?.[0]?.data) {
              const post = data[0].data.children[0].data;
              const postTitle = post.title || "";
              const postText = post.selftext ? stripHtml(post.selftext) : "";
              const fullBody = postText ? `${postTitle}\n\n${postText}`.trim() : postTitle.trim();
              const author = post.author && post.author !== "[deleted]" ? `u/${post.author}` : "Reddit User";
              const subreddit = post.subreddit ? `r/${post.subreddit}` : "Reddit";

              const comments = data[1]?.data?.children || [];
              const commentReviews = comments
                .filter((c: any) => c.data?.body && c.data.author !== "AutoModerator" && c.data.author !== "[deleted]")
                .slice(0, 10)
                .map((c: any) => ({
                  author_name: `u/${c.data.author || "Redditor"}`,
                  author_role: `${subreddit} on Reddit`,
                  body: stripHtml(c.data.body),
                  avatar_url: null,
                  rating: 5,
                  timeAgo: "Recent",
                }));

              return NextResponse.json({
                author_name: author,
                author_role: `${subreddit} on Reddit`,
                body: fullBody || "Praise on Reddit",
                avatar_url: null,
                rating: 5,
                platform: "Reddit",
                source: "reddit",
                all_reviews: commentReviews.length > 0 ? [
                  {
                    author_name: author,
                    author_role: `${subreddit} Post`,
                    body: fullBody || "Praise on Reddit",
                    avatar_url: null,
                    rating: 5,
                    timeAgo: "Original Post",
                  },
                  ...commentReviews
                ] : undefined,
              });
            }
          }
        } catch {}

        // Method B: Official Reddit oEmbed Fallback
        try {
          const oembedRes = await fetch(
            `https://www.reddit.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
            { signal: AbortSignal.timeout(5000) }
          );

          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            const author = oembedData.author_name ? `u/${oembedData.author_name}` : "Reddit User";
            const title = oembedData.title || "";
            const subMatch = cleanUrl.match(/\/r\/([a-zA-Z0-9_]+)/i);
            const subreddit = subMatch ? `r/${subMatch[1]}` : "Reddit";

            return NextResponse.json({
              author_name: author,
              author_role: `${subreddit} on Reddit`,
              body: title || "Praise on Reddit",
              avatar_url: null,
              rating: 5,
              platform: "Reddit",
              source: "reddit",
            });
          }
        } catch {}

        // Method C: PullPush Archive Fallback
        const postIdMatch = cleanUrl.match(/comments\/([a-z0-9]+)/i);
        if (postIdMatch) {
          const postId = postIdMatch[1];
          const ppRes = await fetch(
            `https://api.pullpush.io/reddit/search/submission/?ids=${postId}`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (ppRes.ok) {
            const ppData = await ppRes.json();
            const post = ppData.data?.[0];
            if (post) {
              const fullBody = post.selftext ? `${post.title}\n\n${post.selftext}`.trim() : post.title;
              return NextResponse.json({
                author_name: `u/${post.author || "Redditor"}`,
                author_role: `r/${post.subreddit || "community"} on Reddit`,
                body: stripHtml(fullBody),
                avatar_url: null,
                rating: 5,
                platform: "Reddit",
                source: "reddit",
              });
            }
          }
        }
      } catch (err: any) {
        return NextResponse.json({ error: "Failed to fetch Reddit post." }, { status: 502 });
      }

      return NextResponse.json({ error: "Could not fetch Reddit post. Ensure the link is public." }, { status: 404 });
    }

    // ---------------------------------------------------------
    // 5. GOOGLE PLAY STORE REVIEWS IMPORTER (google-play-scraper)
    // ---------------------------------------------------------
    if (trimmedUrl.includes("play.google.com") || (trimmedUrl.startsWith("com.") && !trimmedUrl.includes("/"))) {
      try {
        let appId: string | null = null;
        try {
          const parsed = new URL(trimmedUrl);
          appId = parsed.searchParams.get("id");
        } catch {
          if (/^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/.test(trimmedUrl)) {
            appId = trimmedUrl;
          }
        }

        if (!appId) {
          return NextResponse.json(
            { error: "Could not find Google Play app package ID. Format: https://play.google.com/store/apps/details?id=com.spotify.music" },
            { status: 400 }
          );
        }

        const gp = await import("google-play-scraper");
        const gplay = (gp as any).default || gp;

        const reviewsRes = await gplay.reviews({
          appId,
          num: 20,
          lang: "en",
        });

        const reviews = reviewsRes?.data || [];
        if (reviews.length > 0) {
          const topReview = reviews[0];
          const topBody = topReview.title
            ? `${topReview.title}\n\n${topReview.text}`.trim()
            : topReview.text?.trim() || "";

          return NextResponse.json({
            author_name: topReview.userName || "Google Play User",
            author_role: "Verified Google Play Review",
            body: topBody,
            avatar_url: topReview.userImage || null,
            rating: topReview.score || 5,
            platform: "Google Play",
            source: "googleplay",
            all_reviews: reviews.map((r: any) => ({
              author_name: r.userName || "Google Play User",
              author_role: "Verified Google Play Review",
              title: r.title || "",
              body: r.text || "",
              avatar_url: r.userImage || null,
              rating: r.score || 5,
              timeAgo: r.date ? new Date(r.date).toLocaleDateString() : "Recent",
            })),
          });
        }

        return NextResponse.json({ error: "No reviews found for this Google Play app yet." }, { status: 404 });
      } catch (err: any) {
        return NextResponse.json(
          { error: `Google Play error: ${err.message || "Failed to fetch reviews"}` },
          { status: 502 }
        );
      }
    }

    // ---------------------------------------------------------
    // 6. TRUSTPILOT REVIEWS IMPORTER (Structured Data & __NEXT_DATA__)
    // ---------------------------------------------------------
    if (trimmedUrl.includes("trustpilot.com")) {
      try {
        const tpRes = await fetch(trimmedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
          signal: AbortSignal.timeout(7000),
        });

        if (tpRes.ok) {
          const html = await tpRes.text();

          // Strategy 1: Schema.org JSON-LD parser
          const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
          const foundReviews: any[] = [];

          if (jsonLdMatches) {
            for (const scriptTag of jsonLdMatches) {
              const content = scriptTag.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
              try {
                const parsed = JSON.parse(content);
                const items = Array.isArray(parsed) ? parsed : [parsed];
                for (const item of items) {
                  if (item["@type"] === "Review") {
                    foundReviews.push(item);
                  } else if (Array.isArray(item.review)) {
                    foundReviews.push(...item.review);
                  }
                }
              } catch {}
            }
          }

          // Strategy 2: __NEXT_DATA__ parser
          if (foundReviews.length === 0) {
            const nextDataMatch = html.match(/<script\s+id=["']__NEXT_DATA__["']\s+type=["']application\/json["']>([\s\S]*?)<\/script>/i);
            if (nextDataMatch) {
              try {
                const nextJson = JSON.parse(nextDataMatch[1]);
                const nextReviews = nextJson?.props?.pageProps?.reviews || [];
                for (const nr of nextReviews) {
                  foundReviews.push({
                    author: { name: nr.consumer?.displayName },
                    reviewBody: nr.text,
                    reviewRating: { ratingValue: nr.rating },
                    datePublished: nr.dates?.publishedDate,
                  });
                }
              } catch {}
            }
          }

          if (foundReviews.length > 0) {
            const topReview = foundReviews[0];
            const author = topReview.author?.name || "Trustpilot Customer";
            const body = stripHtml(topReview.reviewBody || topReview.headline || "");
            const rating = Number(topReview.reviewRating?.ratingValue) || 5;

            return NextResponse.json({
              author_name: author,
              author_role: "Verified Trustpilot Review",
              body: body || "Great company and service!",
              avatar_url: null,
              rating: Math.min(5, Math.max(1, rating)),
              platform: "Trustpilot",
              source: "trustpilot",
              all_reviews: foundReviews.slice(0, 15).map((r: any) => ({
                author_name: r.author?.name || "Trustpilot Customer",
                author_role: "Verified Trustpilot Review",
                body: stripHtml(r.reviewBody || r.headline || ""),
                avatar_url: null,
                rating: Number(r.reviewRating?.ratingValue) || 5,
                timeAgo: r.datePublished ? new Date(r.datePublished).toLocaleDateString() : "Verified",
              })),
            });
          }
        }
      } catch {}

      return NextResponse.json(
        {
          error:
            "Trustpilot requires human browser verification for this URL. You can paste the review directly via Manual Import or CSV upload.",
        },
        { status: 422 }
      );
    }

    // ---------------------------------------------------------
    // 5. GOOGLE REVIEWS IMPORTER (Places API / Maps Resolver)
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
