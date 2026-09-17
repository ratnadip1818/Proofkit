(function () {
  var currentScript =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  // Look for target container element if present (supports both modern blovi and legacy proofkit IDs)
  var targetContainer =
    document.getElementById("blovi-widget") ||
    document.getElementById("proofkit-widget");

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

  // Baseline height estimation to eliminate layout shift before iframe renders
  function getEstimatedHeight(type) {
    switch (type) {
      case "ribbon": return 140;
      case "single": return 200;
      case "marquee": return 160;
      case "carousel": return 320;
      case "stack": return 380;
      case "conversation": return 420;
      case "spotlight": return 460;
      case "orbit": return 540;
      case "bento": return 520;
      case "wall":
      default: return 520;
    }
  }

  // Derive base URL from the script src so the widget works on any domain
  var baseUrl = currentScript.src.replace(/\/widget\.js(\?.*)?$/, "");

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

  var params = [];
  ["type", "layout", "preset", "theme", "max", "ratings", "badge", "featured", "demo", "accent", "radius", "textColor", "ratingColor", "ratingBorderColor", "highlightColor", "showPhotos", "useGravatar", "fallbackAvatar", "showBranding"].forEach(
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

  var skeleton = createSkeleton(resolvedTheme === "dark", widgetType === "single" || widgetType === "ribbon" ? 1 : 2);
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
      if (!testimonials || !testimonials.length) return;
      if (document.getElementById("blovi-schema")) return;

      var productName = "Product";
      if (document.title) {
        var parts = document.title.split(/ - | \| | \u2013 | \u2014 /);
        if (parts[0]) productName = parts[0].trim();
      } else {
        productName = window.location.hostname || "Product";
      }

      var reviews = [];
      var ratingsSum = 0;
      var ratingsCount = 0;

      for (var i = 0; i < testimonials.length; i++) {
        var t = testimonials[i];
        var ratingVal = Number(t.rating);
        var hasRating = !isNaN(ratingVal) && t.rating !== null && t.rating !== undefined;

        var reviewObj = {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": t.author_name || "Anonymous"
          },
          "reviewBody": t.body || ""
        };

        if (t.created_at) {
          try {
            reviewObj.datePublished = new Date(t.created_at).toISOString().split("T")[0];
          } catch (e) {}
        }

        if (hasRating) {
          reviewObj.reviewRating = {
            "@type": "Rating",
            "ratingValue": ratingVal,
            "bestRating": 5,
            "worstRating": 1
          };
          ratingsSum += ratingVal;
          ratingsCount++;
        }

        reviews.push(reviewObj);
      }

      var schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productName,
        "description": "Reviews and testimonials for " + productName + "."
      };

      if (ratingsCount > 0) {
        schema.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": (ratingsSum / ratingsCount).toFixed(1),
          "reviewCount": ratingsCount,
          "bestRating": 5,
          "worstRating": 1
        };
      }

      if (reviews.length > 0) {
        schema.review = reviews;
      }

      var script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "blovi-schema";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    // Handle incoming messages from iframe
    window.addEventListener("message", function (event) {
      if (!event.data || event.source !== iframe.contentWindow) return;

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
        var dx = event.data.deltaX;
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
