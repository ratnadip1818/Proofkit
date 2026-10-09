(function () {
  // Whitelist-only, length-capped, strictly validated JSON-LD schema builder
  function buildSafeJsonLd(testimonials, productName) {
    if (!Array.isArray(testimonials) || testimonials.length === 0) return null;

    var safeName = "Product";
    if (typeof productName === "string" && productName.trim().length > 0) {
      safeName = productName.trim().slice(0, 200);
    }

    var reviews = [];
    var ratingsSum = 0;
    var ratingsCount = 0;
    var maxReviews = Math.min(testimonials.length, 20);

    for (var i = 0; i < maxReviews; i++) {
      var t = testimonials[i];
      if (!t || typeof t !== "object") continue;

      var authorName = "Anonymous";
      if (typeof t.author_name === "string" && t.author_name.trim().length > 0) {
        authorName = t.author_name.trim().slice(0, 200);
      }

      var bodyText = "";
      if (typeof t.body === "string") {
        bodyText = t.body.slice(0, 2000);
      } else if (typeof t.display_body === "string") {
        bodyText = t.display_body.slice(0, 2000);
      } else if (typeof t.body_original === "string") {
        bodyText = t.body_original.slice(0, 2000);
      }

      var reviewObj = {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": authorName
        },
        "reviewBody": bodyText
      };

      if (t.created_at && typeof t.created_at === "string") {
        try {
          var d = new Date(t.created_at);
          if (!isNaN(d.getTime())) {
            reviewObj.datePublished = d.toISOString().split("T")[0];
          }
        } catch (e) {}
      }

      if (t.rating !== null && t.rating !== undefined) {
        var ratingVal = Number(t.rating);
        if (typeof ratingVal === "number" && isFinite(ratingVal) && ratingVal >= 0 && ratingVal <= 5) {
          reviewObj.reviewRating = {
            "@type": "Rating",
            "ratingValue": ratingVal
          };
          ratingsSum += ratingVal;
          ratingsCount++;
        }
      }

      reviews.push(reviewObj);
    }

    if (reviews.length === 0) return null;

    var schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": safeName
    };

    if (ratingsCount > 0) {
      var avgVal = Number((ratingsSum / ratingsCount).toFixed(1));
      if (isFinite(avgVal) && avgVal >= 0 && avgVal <= 5) {
        schema.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": avgVal,
          "reviewCount": ratingsCount,
          "bestRating": 5,
          "worstRating": 1
        };
      }
    }

    schema.review = reviews;
    return schema;
  }

  function escapeJsonLd(schema) {
    if (!schema || typeof schema !== "object") return "";
    return JSON.stringify(schema)
      .replace(/</g, "\\u003c")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  }

  var currentScript =
    (typeof document !== "undefined" && document.currentScript) ||
    (typeof document !== "undefined" &&
      (function () {
        var s = document.getElementsByTagName("script");
        return s && s.length ? s[s.length - 1] : null;
      })()) ||
    null;

  // Baseline height estimation to eliminate layout shift before iframe renders
  function getEstimatedHeight(type) {
    switch (type) {
      case "single": return 200;
      case "marquee": return 160;
      case "carousel": return 320;
      case "stack": return 190;
      case "conversation": return 420;
      case "spotlight": return 460;
      case "orbit": return 540;
      case "bento": return 520;
      case "wall":
      default: return 520;
    }
  }

  // data-theme="auto": match the host page by sampling the effective background color
  function resolveTheme(value) {
    if (value !== "auto") return value;
    try {
      var el = (targetContainer || currentScript).parentElement || document.body;
      var bg = null;
      while (el) {
        var c = getComputedStyle(el).backgroundColor;
        if (c && c !== "transparent" && c !== "rgba(0, 0, 0, 0)") {
          bg = c;
          break;
        }
        el = el.parentElement;
      }
      if (!bg) return "light";
      var rgb = bg.match(/\d+(\.\d+)?/g);
      if (!rgb) return "light";
      var bgLuminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      return bgLuminance < 128 ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function isTrustedMessage(event, iframeWindow, expectedOrigin) {
    if (!event || !event.data || typeof event.data !== "object") return false;
    if (typeof event.data.type !== "string" || event.data.type.indexOf("proofkit-") !== 0) return false;
    if (event.source !== iframeWindow) return false;
    if (event.origin !== expectedOrigin) return false;
    return true;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      buildSafeJsonLd: buildSafeJsonLd,
      escapeJsonLd: escapeJsonLd,
      getEstimatedHeight: getEstimatedHeight,
      resolveTheme: resolveTheme,
      isTrustedMessage: isTrustedMessage,
    };
    if (!currentScript) return;
  }

  if (!currentScript) return;

  // Look for target container element if present (check adjacent sibling first to support multiple widgets per page)
  var prevEl = currentScript.previousElementSibling;
  var targetContainer =
    (prevEl && (prevEl.id === "blovi-widget" || prevEl.id === "proofkit-widget" || prevEl.getAttribute("data-widget-id")))
      ? prevEl
      : (document.getElementById("blovi-widget") || document.getElementById("proofkit-widget"));

  // Helper to get attribute from script tag or container element
  function getAttr(key) {
    var kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    var val = currentScript.getAttribute("data-" + key) || currentScript.getAttribute("data-" + kebabKey);
    if (val) return val;
    if (targetContainer) {
      val = targetContainer.getAttribute("data-" + key) || targetContainer.getAttribute("data-" + kebabKey);
      if (val) return val;
    }
    return null;
  }

  var userId = getAttr("user") || getAttr("widget-id");
  if (!userId) return;

  // Derive base URL and expected embed origin from the script src
  var baseUrl = currentScript.src.replace(/\/widget\.js(\?.*)?$/, "");
  var embedOrigin = (function () {
    try {
      return new URL(currentScript.src, window.location.href).origin;
    } catch (e) {
      return window.location.origin;
    }
  })();

  // Lightweight privacy-friendly view tracking
  try {
    var ref = document.referrer || window.location.href;
    var trackPayload = JSON.stringify({
      type: "widget_view",
      userId: userId,
      widgetType: getAttr("type") || getAttr("layout") || "wall",
      referrer: ref
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(baseUrl + "/api/track", trackPayload);
    } else if (window.fetch) {
      fetch(baseUrl + "/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: trackPayload,
        keepalive: true
      }).catch(function () {});
    }
  } catch (e) {}


  var params = [];
  ["type", "layout", "preset", "theme", "max", "ratings", "badge", "featured", "demo", "accent", "radius", "backgroundColor", "textColor", "ratingColor", "ratingBorderColor", "highlightColor", "font", "fontFamily", "showPhotos", "useGravatar", "fallbackAvatar", "showBranding", "selectMode", "selectedIds", "autoRating"].forEach(
    function (key) {
      var val = getAttr(key);
      if (!val) return;
      if (key === "theme") val = resolveTheme(val);
      params.push(key + "=" + encodeURIComponent(val));
    }
  );

  // Fallback: if data-layout was passed instead of data-type, ensure type parameter is set
  if (!getAttr("type") && getAttr("layout")) {
    params.push("type=" + encodeURIComponent(getAttr("layout")));
  }

  var widgetType = getAttr("type") || getAttr("layout") || "wall";
  var estHeight = getEstimatedHeight(widgetType);
  var resolvedTheme = resolveTheme(getAttr("theme") || "light");

  var container = targetContainer || document.createElement("div");
  if (!targetContainer) {
    container.id = "blovi-widget";
    container.style.cssText = "width:100%;min-height:" + estHeight + "px;contain:layout style paint;position:relative;";
    currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  } else {
    // Preserve existing container styles while enforcing zero-CLS properties
    if (!container.style.minHeight || container.style.minHeight === "0px") {
      container.style.minHeight = estHeight + "px";
    }
    if (!container.style.contain) {
      container.style.contain = "layout style paint";
    }
    if (!container.style.position || container.style.position === "static") {
      container.style.position = "relative";
    }
  }

  // Inject lightweight skeleton shimmer styles once
  if (!document.getElementById("blovi-skeleton-style")) {
    var styleEl = document.createElement("style");
    styleEl.id = "blovi-skeleton-style";
    styleEl.textContent =
      "@keyframes blovi-shimmer{0%{transform:translateX(-100%);}100%{transform:translateX(100%);}}" +
      ".blovi-sk-wrap{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;gap:12px;padding:20px;box-sizing:border-box;overflow:hidden;pointer-events:none;z-index:1;transition:opacity 0.3s ease-out;}" +
      ".blovi-sk-card{width:100%;height:100px;border-radius:12px;position:relative;overflow:hidden;}";
    document.head.appendChild(styleEl);
  }

  // Create subtle shimmer skeleton placeholder
  function createSkeleton(isDark, cardCount) {
    var wrap = document.createElement("div");
    wrap.className = "blovi-sk-wrap";
    wrap.setAttribute("aria-hidden", "true");
    var bg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)";
    var border = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)";
    var shimmerGrad = isDark
      ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)"
      : "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)";

    var count = Math.min(Math.max(1, cardCount || 2), 3);
    for (var i = 0; i < count; i++) {
      var card = document.createElement("div");
      card.className = "blovi-sk-card";
      card.style.cssText = "background:" + bg + ";border:" + border + ";";
      var shim = document.createElement("div");
      shim.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;background:" + shimmerGrad + ";animation:blovi-shimmer 1.6s infinite;";
      card.appendChild(shim);
      wrap.appendChild(card);
    }
    return wrap;
  }

  var skeleton = createSkeleton(resolvedTheme === "dark", widgetType === "single" ? 1 : 2);
  container.appendChild(skeleton);

  function mount() {
    var iframe = document.createElement("iframe");
    iframe.src = baseUrl + "/embed/" + userId + (params.length ? "?" + params.join("&") : "");
    iframe.title = "Customer testimonials — powered by Blovi";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("loading", "lazy");
    iframe.style.cssText =
      "width:100% !important;border:none !important;display:block !important;overflow:hidden !important;" +
      "opacity:0;transition:opacity 0.3s ease-out, height 0.25s cubic-bezier(0.16, 1, 0.3, 1);" +
      "position:relative;z-index:2;margin:0 !important;padding:0 !important;";
    iframe.height = estHeight.toString();

    var revealed = false;
    function revealWidget() {
      if (revealed) return;
      revealed = true;
      iframe.style.opacity = "1";
      if (skeleton) {
        skeleton.style.opacity = "0";
        setTimeout(function () {
          if (skeleton && skeleton.parentNode) {
            skeleton.parentNode.removeChild(skeleton);
            skeleton = null;
          }
        }, 350);
      }
    }

    // Safety fallback: ensure iframe reveals after 3.5s in case of edge network or postMessage delay
    setTimeout(revealWidget, 3500);

    function injectJsonLdSchema(testimonials) {
      try {
        if (!Array.isArray(testimonials) || testimonials.length === 0) return;

        var productName = "Product";
        try {
          if (document.title) {
            var parts = document.title.split(/ - | \| | \u2013 | \u2014 /);
            if (parts[0] && parts[0].trim()) productName = parts[0].trim();
          } else if (window.location && window.location.hostname) {
            productName = window.location.hostname;
          }
        } catch (e) {}

        var schemaObj = buildSafeJsonLd(testimonials, productName);
        if (!schemaObj) return;

        var escapedJson = escapeJsonLd(schemaObj);
        if (!escapedJson) return;

        // Replace any previously injected schema for the same widget
        var existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (var i = 0; i < existingScripts.length; i++) {
          var s = existingScripts[i];
          if (
            s.getAttribute("data-blovi-widget") === userId ||
            (!s.getAttribute("data-blovi-widget") && s.id === "blovi-schema")
          ) {
            if (s.parentNode) {
              s.parentNode.removeChild(s);
            }
          }
        }

        var script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-blovi-widget", userId);
        script.textContent = escapedJson;
        document.head.appendChild(script);
      } catch (err) {
        // Skip injection silently (no throw, no console noise in production)
      }
    }

    // Handle incoming messages from iframe
    window.addEventListener("message", function (event) {
      if (!isTrustedMessage(event, iframe.contentWindow, embedOrigin)) return;

      if (
        event.data.type === "proofkit-ready" ||
        event.data.type === "proofkit-preview-ready"
      ) {
        revealWidget();
      }

      if (
        event.data.type === "proofkit-resize" &&
        typeof event.data.height === "number" &&
        event.data.height > 0
      ) {
        revealWidget();
        iframe.style.height = event.data.height + 16 + "px";
        container.style.minHeight = "0px";
      }

      if (
        event.data.type === "proofkit-schema" &&
        Array.isArray(event.data.testimonials)
      ) {
        injectJsonLdSchema(event.data.testimonials);
      }

      if (
        event.data.type === "proofkit-wheel" &&
        typeof event.data.deltaY === "number"
      ) {
        var dy = event.data.deltaY;
        var dx = typeof event.data.deltaX === "number" ? event.data.deltaX : 0;
        if (event.data.deltaMode === 1) {
          dy *= 16;
          dx *= 16;
        } else if (event.data.deltaMode === 2) {
          dy *= window.innerHeight;
          dx *= window.innerWidth;
        }
        var wheelEvent = new WheelEvent("wheel", {
          deltaX: dx,
          deltaY: dy,
          deltaMode: event.data.deltaMode || 0,
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(wheelEvent);
        if (!wheelEvent.defaultPrevented) {
          window.scrollBy(dx, dy);
        }
      }
    });

    container.appendChild(iframe);
  }

  // Lazy-mount with IntersectionObserver (250px viewport buffer)
  var mounted = false;
  function triggerMount() {
    if (mounted) return;
    mounted = true;
    mount();
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0] && entries[0].isIntersecting) {
          observer.disconnect();
          triggerMount();
        }
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(container);
  } else {
    triggerMount();
  }
})();
