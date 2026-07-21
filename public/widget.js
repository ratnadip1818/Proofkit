(function () {
  var currentScript =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  // Look for target container element if present
  var targetContainer =
    document.getElementById("proofkit-widget") ||
    document.getElementById("blovi-widget");

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
  ["type", "layout", "preset", "theme", "max", "ratings", "badge", "featured", "demo", "accent", "radius", "textColor", "ratingColor", "showPhotos", "fallbackAvatar"].forEach(
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

  var container = targetContainer || document.createElement("div");
  container.style.cssText = "width:100%;min-height:0;position:relative;";
  if (!targetContainer) {
    currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  }

  function mount() {
    var iframe = document.createElement("iframe");
    iframe.src = baseUrl + "/embed/" + userId + (params.length ? "?" + params.join("&") : "");
    iframe.title = "Customer testimonials — powered by Blovi";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("loading", "eager");
    iframe.style.cssText = "width:100%;border:none;display:block;overflow:hidden;opacity:1;";
    iframe.height = "550";

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
        event.data.type === "proofkit-resize" &&
        typeof event.data.height === "number" &&
        event.data.height > 0
      ) {
        iframe.style.height = event.data.height + 16 + "px";
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

  // Instant execution: Mount iframe immediately when script executes
  mount();
})();
