import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  buildSafeJsonLd,
  escapeJsonLd,
  isTrustedMessage,
} = require("../public/widget.js");

import { applyTierLimits, isPlanPaid } from "../lib/widget-tier.ts";
import { FREE_WIDGET_TESTIMONIAL_LIMIT } from "../lib/limits.ts";

describe("Task 1: Origin and source checks in widget.js", () => {
  const trustedOrigin = "https://www.blovi.space";
  const mockIframeWindow = { id: "iframe-widget-1" };
  const mockOtherIframeWindow = { id: "iframe-widget-2" };

  test("accepts valid proofkit messages matching both origin and iframe window source", () => {
    const validEvent = {
      origin: trustedOrigin,
      source: mockIframeWindow,
      data: { type: "proofkit-ready" },
    };
    assert.equal(isTrustedMessage(validEvent, mockIframeWindow, trustedOrigin), true);

    const resizeEvent = {
      origin: trustedOrigin,
      source: mockIframeWindow,
      data: { type: "proofkit-resize", height: 450 },
    };
    assert.equal(isTrustedMessage(resizeEvent, mockIframeWindow, trustedOrigin), true);

    const schemaEvent = {
      origin: trustedOrigin,
      source: mockIframeWindow,
      data: { type: "proofkit-schema", testimonials: [] },
    };
    assert.equal(isTrustedMessage(schemaEvent, mockIframeWindow, trustedOrigin), true);
  });

  test("rejects message with wrong origin", () => {
    const maliciousOriginEvent = {
      origin: "https://evil-attacker.com",
      source: mockIframeWindow,
      data: { type: "proofkit-resize", height: 9999 },
    };
    assert.equal(isTrustedMessage(maliciousOriginEvent, mockIframeWindow, trustedOrigin), false);
  });

  test("rejects message with wrong source (foreign iframe window)", () => {
    const wrongSourceEvent = {
      origin: trustedOrigin,
      source: mockOtherIframeWindow,
      data: { type: "proofkit-ready" },
    };
    assert.equal(isTrustedMessage(wrongSourceEvent, mockIframeWindow, trustedOrigin), false);
  });

  test("rejects message with malformed or missing data", () => {
    assert.equal(isTrustedMessage(null, mockIframeWindow, trustedOrigin), false);
    assert.equal(isTrustedMessage({ origin: trustedOrigin, source: mockIframeWindow, data: null }, mockIframeWindow, trustedOrigin), false);
    assert.equal(isTrustedMessage({ origin: trustedOrigin, source: mockIframeWindow, data: "string-data" }, mockIframeWindow, trustedOrigin), false);
    assert.equal(isTrustedMessage({ origin: trustedOrigin, source: mockIframeWindow, data: 12345 }, mockIframeWindow, trustedOrigin), false);
    assert.equal(isTrustedMessage({ origin: trustedOrigin, source: mockIframeWindow, data: {} }, mockIframeWindow, trustedOrigin), false);
  });

  test("rejects non-proofkit message types", () => {
    const nonProofkitEvent = {
      origin: trustedOrigin,
      source: mockIframeWindow,
      data: { type: "other-postmessage-event" },
    };
    assert.equal(isTrustedMessage(nonProofkitEvent, mockIframeWindow, trustedOrigin), false);

    const maliciousPrefixEvent = {
      origin: trustedOrigin,
      source: mockIframeWindow,
      data: { type: "untrusted-proofkit-fake" },
    };
    assert.equal(isTrustedMessage(maliciousPrefixEvent, mockIframeWindow, trustedOrigin), false);
  });

  test("multi-widget page: each widget only reacts to messages from its own iframe", () => {
    const widget1Iframe = { name: "widget1" };
    const widget2Iframe = { name: "widget2" };

    const msgFromWidget1 = {
      origin: trustedOrigin,
      source: widget1Iframe,
      data: { type: "proofkit-resize", height: 300 },
    };

    const msgFromWidget2 = {
      origin: trustedOrigin,
      source: widget2Iframe,
      data: { type: "proofkit-resize", height: 500 },
    };

    // Widget 1 should accept msg 1 and reject msg 2
    assert.equal(isTrustedMessage(msgFromWidget1, widget1Iframe, trustedOrigin), true);
    assert.equal(isTrustedMessage(msgFromWidget2, widget1Iframe, trustedOrigin), false);

    // Widget 2 should reject msg 1 and accept msg 2
    assert.equal(isTrustedMessage(msgFromWidget1, widget2Iframe, trustedOrigin), false);
    assert.equal(isTrustedMessage(msgFromWidget2, widget2Iframe, trustedOrigin), true);
  });
});

describe("Task 2: Safe JSON-LD Sanitizer", () => {
  test("strips unknown and dangerous fields from schema output", () => {
    const rawTestimonials = [
      {
        id: "t-1",
        author_name: "Alice Smith",
        author_email: "alice@secret.com", // should be stripped
        rating: 5,
        display_body: "Wonderful product!",
        admin_notes: "Internal customer VIP", // should be stripped
        __proto__: { evil: true }, // stripped
        sql_injection: "DROP TABLE users;", // stripped
        created_at: "2026-05-01T12:00:00Z",
      },
    ];

    const schema = buildSafeJsonLd(rawTestimonials, "My Product");
    assert.ok(schema);
    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.name, "My Product");

    // Only whitelisted fields on root
    const rootKeys = Object.keys(schema);
    assert.deepEqual(rootKeys.sort(), ["@context", "@type", "aggregateRating", "name", "review"]);

    // Check review fields whitelist
    const review = schema.review[0];
    const reviewKeys = Object.keys(review);
    assert.deepEqual(reviewKeys.sort(), ["@type", "author", "datePublished", "reviewBody", "reviewRating"]);

    assert.equal(review.author.name, "Alice Smith");
    assert.equal(review.reviewBody, "Wonderful product!");
    assert.equal(review.reviewRating.ratingValue, 5);
    assert.equal(review.datePublished, "2026-05-01");

    // Unknown fields must NOT exist
    assert.equal(review.author_email, undefined);
    assert.equal(review.admin_notes, undefined);
    assert.equal(review.sql_injection, undefined);
  });

  test("escapes '<' as \\u003c, U+2028 and U+2029 to prevent script tag injection", () => {
    const xssTestimonial = [
      {
        author_name: "Attacker </script><script>alert('xss')</script>",
        rating: 5,
        display_body: "Breaking out <script src='evil.js'></script> \u2028 line break \u2029",
      },
    ];

    const schema = buildSafeJsonLd(xssTestimonial, "Product <marquee>");
    const escaped = escapeJsonLd(schema);

    // '<' MUST NOT be present in raw form in escaped string
    assert.equal(escaped.includes("<"), false);
    assert.equal(escaped.includes("\\u003c"), true);
    assert.equal(escaped.includes("\u2028"), false);
    assert.equal(escaped.includes("\u2029"), false);

    // Verify it parses back cleanly to original characters in JSON.parse
    const parsed = JSON.parse(escaped);
    assert.equal(parsed.name, "Product <marquee>");
    assert.equal(parsed.review[0].author.name, "Attacker </script><script>alert('xss')</script>");
    assert.ok(parsed.review[0].reviewBody.includes("<script src='evil.js'>"));
  });

  test("caps string lengths and array count", () => {
    const longName = "A".repeat(300);
    const longAuthor = "B".repeat(350);
    const longBody = "C".repeat(3000);

    // Create 30 testimonials (should be capped at 20)
    const thirtyItems = Array.from({ length: 30 }, (_, i) => ({
      author_name: `${longAuthor}-${i}`,
      rating: 5,
      display_body: `${longBody}-${i}`,
    }));

    const schema = buildSafeJsonLd(thirtyItems, longName);
    assert.ok(schema);

    // Product name capped at 200
    assert.equal(schema.name.length, 200);

    // Reviews array capped at 20
    assert.equal(schema.review.length, 20);

    // Author name capped at 200
    assert.equal(schema.review[0].author.name.length, 200);

    // Review body capped at 2000
    assert.equal(schema.review[0].reviewBody.length, 2000);
  });

  test("rejects bad types, invalid ratings, and handles empty input safely", () => {
    // Non-array input
    assert.equal(buildSafeJsonLd(null, "Test"), null);
    assert.equal(buildSafeJsonLd("not an array", "Test"), null);
    assert.equal(buildSafeJsonLd([], "Test"), null);

    // Invalid ratings: NaN, negative, out of 0-5 range
    const badRatings = [
      { author_name: "Tom", rating: 99, display_body: "Too high" },
      { author_name: "Jerry", rating: -2, display_body: "Negative" },
      { author_name: "Spike", rating: "invalid", display_body: "NaN" },
      { author_name: "Tyke", rating: 4, display_body: "Valid 4 stars" },
    ];

    const schema = buildSafeJsonLd(badRatings, "Valid Product");
    assert.ok(schema);
    // Only Spike and Tyke: 4 is valid rating, others should omit reviewRating
    assert.equal(schema.review[0].reviewRating, undefined);
    assert.equal(schema.review[1].reviewRating, undefined);
    assert.equal(schema.review[2].reviewRating, undefined);
    assert.equal(schema.review[3].reviewRating.ratingValue, 4);

    // Aggregate rating calculated only from the valid rating (4.0)
    assert.ok(schema.aggregateRating);
    assert.equal(schema.aggregateRating.ratingValue, 4);
    assert.equal(schema.aggregateRating.reviewCount, 1);
  });
});

describe("Task 3: Server-side tier enforcement (applyTierLimits)", () => {
  const dummyTestimonials = Array.from({ length: 25 }, (_, i) => ({
    id: `item-${i + 1}`,
    author_name: `User ${i + 1}`,
    display_body: `Review text ${i + 1}`,
    rating: 5,
  }));

  test("free plan: capped at FREE_WIDGET_TESTIMONIAL_LIMIT (10) and badge forced to true", () => {
    const freePlan = { plan_tier: "free", is_lifetime: false };

    // Attacker passes config trying to hide badge and raise limit to 25
    const maliciousConfig = {
      showBadge: false,
      max: 25,
      maxCount: 25,
      type: "wall",
    };

    const result = applyTierLimits({
      plan: freePlan,
      testimonials: dummyTestimonials,
      config: maliciousConfig,
    });

    assert.equal(result.isPaid, false);
    assert.equal(result.testimonials.length, FREE_WIDGET_TESTIMONIAL_LIMIT);
    assert.equal(result.testimonials.length, 10);
    assert.equal(result.config.showBadge, true, "Free plan must force showBadge to true");
    assert.equal(result.config.max, FREE_WIDGET_TESTIMONIAL_LIMIT, "max query param must be clamped");
    assert.equal(result.config.maxCount, FREE_WIDGET_TESTIMONIAL_LIMIT, "maxCount query param must be clamped");
  });

  test("null or undefined plan defaults to free plan security enforcement", () => {
    const resultNull = applyTierLimits({
      plan: null,
      testimonials: dummyTestimonials,
      config: { showBadge: false },
    });
    assert.equal(resultNull.isPaid, false);
    assert.equal(resultNull.testimonials.length, 10);
    assert.equal(resultNull.config.showBadge, true);

    const resultUndefined = applyTierLimits({
      plan: undefined,
      testimonials: dummyTestimonials,
      config: { showBadge: false },
    });
    assert.equal(resultUndefined.isPaid, false);
    assert.equal(resultUndefined.testimonials.length, 10);
    assert.equal(resultUndefined.config.showBadge, true);
  });

  test("paid plan (pro): unlimited testimonials and allowed to hide badge", () => {
    const proPlan = { plan_tier: "pro", is_lifetime: false };
    const paidConfig = { showBadge: false, type: "carousel" };

    const result = applyTierLimits({
      plan: proPlan,
      testimonials: dummyTestimonials,
      config: paidConfig,
    });

    assert.equal(result.isPaid, true);
    assert.equal(result.testimonials.length, 25, "Paid user gets all testimonials");
    assert.equal(result.config.showBadge, false, "Paid user is allowed to hide badge");
    assert.equal(result.config.type, "carousel");
  });

  test("paid plan (business): unlimited testimonials and badge toggle honored", () => {
    const businessPlan = { plan_tier: "business", is_lifetime: false };
    const result = applyTierLimits({
      plan: businessPlan,
      testimonials: dummyTestimonials,
      config: { showBadge: false },
    });

    assert.equal(result.isPaid, true);
    assert.equal(result.testimonials.length, 25);
    assert.equal(result.config.showBadge, false);
  });

  test("paid plan (grandfathered lifetime license): unlimited testimonials", () => {
    const lifetimePlan = { plan_tier: "free", is_lifetime: true };
    const result = applyTierLimits({
      plan: lifetimePlan,
      testimonials: dummyTestimonials,
      config: { showBadge: false },
    });

    assert.equal(result.isPaid, true);
    assert.equal(result.testimonials.length, 25);
    assert.equal(result.config.showBadge, false);
  });

  test("isPlanPaid helper correctly checks tier status", () => {
    assert.equal(isPlanPaid(null), false);
    assert.equal(isPlanPaid(undefined), false);
    assert.equal(isPlanPaid({ plan_tier: "free", is_lifetime: false }), false);
    assert.equal(isPlanPaid({ plan_tier: "free", is_lifetime: true }), true);
    assert.equal(isPlanPaid({ plan_tier: "pro", is_lifetime: false }), true);
    assert.equal(isPlanPaid({ plan_tier: "business", is_lifetime: false }), true);
  });
});

describe("Task 4: Lock the preview config update listener", () => {
  function canAcceptConfigUpdate({
    isPreviewRoute,
    eventOrigin,
    eventSource,
    parentWindow,
    currentWindow,
    dashboardOrigin,
  }) {
    if (!isPreviewRoute) return false;
    if (!eventSource || eventSource !== parentWindow || parentWindow === currentWindow) return false;
    if (eventOrigin !== dashboardOrigin) return false;
    return true;
  }

  const mockParent = { id: "dashboard-parent" };
  const mockCurrent = { id: "preview-window" };
  const dashboardOrigin = "https://www.blovi.space";

  test("rejects proofkit-config-update on production embed route", () => {
    const accepted = canAcceptConfigUpdate({
      isPreviewRoute: false, // Production embed route
      eventOrigin: dashboardOrigin,
      eventSource: mockParent,
      parentWindow: mockParent,
      currentWindow: mockCurrent,
      dashboardOrigin,
    });
    assert.equal(accepted, false, "Production embed must ignore proofkit-config-update entirely");
  });

  test("rejects when event.source is not window.parent", () => {
    const mockRogueWindow = { id: "rogue-window" };
    const accepted = canAcceptConfigUpdate({
      isPreviewRoute: true,
      eventOrigin: dashboardOrigin,
      eventSource: mockRogueWindow,
      parentWindow: mockParent,
      currentWindow: mockCurrent,
      dashboardOrigin,
    });
    assert.equal(accepted, false, "Must reject if source is not window.parent");
  });

  test("rejects when event.source is current window (not in iframe)", () => {
    const accepted = canAcceptConfigUpdate({
      isPreviewRoute: true,
      eventOrigin: dashboardOrigin,
      eventSource: mockCurrent,
      parentWindow: mockCurrent,
      currentWindow: mockCurrent,
      dashboardOrigin,
    });
    assert.equal(accepted, false, "Must reject if window.parent === window");
  });

  test("rejects when event.origin does not match dashboard origin", () => {
    const accepted = canAcceptConfigUpdate({
      isPreviewRoute: true,
      eventOrigin: "https://evil-dashboard.com",
      eventSource: mockParent,
      parentWindow: mockParent,
      currentWindow: mockCurrent,
      dashboardOrigin,
    });
    assert.equal(accepted, false, "Must reject mismatching origin");
  });

  test("accepts proofkit-config-update when on preview route, origin matches, and source is window.parent", () => {
    const accepted = canAcceptConfigUpdate({
      isPreviewRoute: true,
      eventOrigin: dashboardOrigin,
      eventSource: mockParent,
      parentWindow: mockParent,
      currentWindow: mockCurrent,
      dashboardOrigin,
    });
    assert.equal(accepted, true, "Studio preview must accept valid parent config update");
  });
});

