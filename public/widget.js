(function () {
  var currentScript =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  var userId = currentScript.getAttribute("data-user");
  if (!userId) return;

  // Derive base URL from the script src so the widget works on any domain
  var baseUrl = currentScript.src.replace(/\/widget\.js(\?.*)?$/, "");

  // data-theme="auto": match the host page by sampling the effective
  // background color where the widget is embedded
  function resolveTheme(value) {
    if (value !== "auto") return value;
    try {
      var el = currentScript.parentElement || document.body;
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
      var bgLuminance =
        0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      return bgLuminance < 128 ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  var params = [];
  ["type", "layout", "theme", "max", "ratings", "badge", "featured", "demo", "accent", "radius"].forEach(
    function (key) {
      var val = currentScript.getAttribute("data-" + key);
      if (!val) return;
      if (key === "theme") val = resolveTheme(val);
      params.push(key + "=" + encodeURIComponent(val));
    }
  );

  var typeAttr = currentScript.getAttribute("data-type") || "wall";
  var isDark = resolveTheme(currentScript.getAttribute("data-theme")) === "dark";
  var skeletonBg = isDark ? "#1F1F28" : "#ffffff";
  var skeletonBorder = isDark ? "#2A2A35" : "#e4e4e7";
  var skeletonFill = isDark ? "#2A2A35" : "#f4f4f5";

  var radiusAttr = currentScript.getAttribute("data-radius") || "rounded";
  var skeletonRadius = "12px";
  if (radiusAttr === "sharp") skeletonRadius = "4px";
  else if (radiusAttr === "pill") skeletonRadius = "22px";

  var showBadgeAttr = currentScript.getAttribute("data-badge");
  var badgeVisible = showBadgeAttr !== "false";

  // Setup smart height placeholders for CLS reduction
  var initialHeight = "400";
  var containerMinHeight = "120px";
  if (typeAttr === "marquee") {
    if (badgeVisible) {
      initialHeight = "348";
      containerMinHeight = "348px";
    } else {
      initialHeight = "288";
      containerMinHeight = "288px";
    }
  } else if (typeAttr === "single") {
    if (badgeVisible) {
      initialHeight = "340";
      containerMinHeight = "340px";
    } else {
      initialHeight = "280";
      containerMinHeight = "280px";
    }
  } else if (typeAttr === "carousel") {
    if (badgeVisible) {
      initialHeight = "374";
      containerMinHeight = "374px";
    } else {
      initialHeight = "328";
      containerMinHeight = "328px";
    }
  } else if (typeAttr === "wall") {
    var maxAttr = currentScript.getAttribute("data-max");
    var extraHeight = badgeVisible ? 46 : 0;
    if (maxAttr === "3") {
      initialHeight = String(280 + extraHeight);
      containerMinHeight = (280 + extraHeight) + "px";
    } else {
      initialHeight = String(530 + extraHeight);
      containerMinHeight = (530 + extraHeight) + "px";
    }
  }

  var container = document.createElement("div");
  container.style.cssText = "width:100%;min-height:" + containerMinHeight + ";position:relative;";
  currentScript.parentNode.insertBefore(container, currentScript.nextSibling);

  // Add skeleton animation and styles
  var skeletonStyle = document.createElement("style");
  skeletonStyle.textContent =
    "@keyframes proofkit-skeleton-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.35; } } " +
    ".proofkit-skeleton-loader { " +
      "display: flex; flex-direction: column; gap: 12px; padding: 24px; width: 100%; " +
      "background: " + skeletonBg + "; border: 1px solid " + skeletonBorder + "; " +
      "border-radius: " + skeletonRadius + "; animation: proofkit-skeleton-pulse 1.5s ease-in-out infinite; " +
      "box-sizing: border-box; " +
    "} " +
    ".proofkit-skeleton-header { display: flex; align-items: center; gap: 12px; } " +
    ".proofkit-skeleton-circle { width: 40px; height: 40px; border-radius: 50%; background: " + skeletonFill + "; } " +
    ".proofkit-skeleton-line { height: 12px; background: " + skeletonFill + "; border-radius: 4px; } " +
    ".proofkit-skeleton-name { width: 100px; } " +
    ".proofkit-skeleton-role { width: 60px; height: 8px; margin-top: 4px; } " +
    ".proofkit-skeleton-body1 { width: 90%; height: 12px; margin-top: 8px; } " +
    ".proofkit-skeleton-body2 { width: 75%; height: 12px; }";
  document.head.appendChild(skeletonStyle);

  // Define reusable badge skeleton html
  var badgeSkeletonHtml = badgeVisible ?
    '<div style="display:flex;justify-content:center;margin-top:20px;width:100%;">' +
      '<div style="width:120px;height:24px;border-radius:999px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
    '</div>' : '';

  // Render type-aware skeleton loaders
  var skeleton = document.createElement("div");
  if (typeAttr === "marquee") {
    var marqueeCardHtml = 
      '<div style="display:flex;flex-direction:column;gap:12px;padding:20px;height:240px;width:280px;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;flex-shrink:0;position:relative;">' +
        '<div style="position:absolute;top:6px;right:14px;font-size:52px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.14;pointer-events:none;">”</div>' +
        '<div class="proofkit-skeleton-line" style="width:70px;height:12px;margin-bottom:4px;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:90%;height:10px;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:80%;height:10px;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:65%;height:10px;margin-bottom:12px;"></div>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-top:auto;">' +
          '<div class="proofkit-skeleton-circle" style="width:34px;height:34px;flex-shrink:0;"></div>' +
          '<div style="text-align:left;flex:1;">' +
            '<div class="proofkit-skeleton-line" style="width:80px;height:10px;"></div>' +
            '<div class="proofkit-skeleton-line" style="width:50px;height:8px;margin-top:4px;"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    skeleton.className = "proofkit-skeleton-loader";
    skeleton.style.cssText = "display:flex;flex-direction:column;padding:16px 0;height:" + (badgeVisible ? "348px" : "288px") + ";background:transparent;border:none;box-sizing:border-box;overflow:hidden;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var marqueeTrackHtml =
      '<div style="display:flex;gap:12px;width:max-content;flex-shrink:0;padding:8px 0;">' +
        marqueeCardHtml + marqueeCardHtml + marqueeCardHtml + marqueeCardHtml + marqueeCardHtml +
      '</div>';
    
    skeleton.innerHTML = marqueeTrackHtml + (badgeVisible ?
      '<div style="display:flex;justify-content:center;margin-top:12px;width:100%;">' +
        '<div style="margin-top:20px;width:120px;height:26px;border-radius:999px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
      '</div>' : '');
  } else if (typeAttr === "carousel") {
    skeleton.className = "proofkit-skeleton-loader";
    skeleton.style.cssText = "display:block;padding:24px 16px;width:100%;height:" + (badgeVisible ? "374px" : "328px") + ";background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var dotsSkeletonHtml = 
      '<div style="display:flex;justify-content:center;gap:6px;margin-top:16px;">' +
        '<div style="width:18px;height:8px;border-radius:4px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
        '<div style="width:8px;height:8px;border-radius:4px;background:' + skeletonFill + ';opacity:0.35;"></div>' +
        '<div style="width:8px;height:8px;border-radius:4px;background:' + skeletonFill + ';opacity:0.35;"></div>' +
      '</div>';

    skeleton.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:12px;padding:20px 32px;height:240px;max-width:480px;margin:0 auto;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;text-align:center;align-items:center;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;top:6px;right:18px;font-size:64px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.14;pointer-events:none;">”</div>' +
        '<div class="proofkit-skeleton-circle" style="margin: 0 auto;flex-shrink:0;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:80%;margin:8px auto 0;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:60%;margin:0 auto;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:100px;margin:auto auto 0;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:60px;height:8px;margin:4px auto 0;"></div>' +
      '</div>' + 
      dotsSkeletonHtml + 
      badgeSkeletonHtml;
  } else if (typeAttr === "single") {
    var layoutAttr = currentScript.getAttribute("data-layout") || "card";
    skeleton.className = "proofkit-skeleton-loader";
    skeleton.style.cssText = "display:block;padding:32px 24px;width:100%;height:" + (badgeVisible ? "340px" : "280px") + ";background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var singleInnerHtml = "";
    if (layoutAttr === "minimal") {
      singleInnerHtml =
        '<div style="display:flex;flex-direction:column;gap:12px;padding:36px 24px;max-width:560px;margin:0 auto;background:transparent;border:none;box-sizing:border-box;text-align:center;align-items:center;position:relative;overflow:hidden;">' +
          '<div style="font-size:64px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.2;margin-bottom:8px;">“</div>' +
          '<div class="proofkit-skeleton-line" style="width:85%;height:14px;margin:0 auto;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:70%;height:14px;margin:0 auto;"></div>' +
          '<div style="width:48px;height:1px;background:' + skeletonBorder + ';margin:12px auto 0;"></div>' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;margin-top:12px;">' +
            '<div class="proofkit-skeleton-circle" style="width:44px;height:44px;flex-shrink:0;"></div>' +
            '<div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;">' +
              '<div class="proofkit-skeleton-line" style="width:80px;height:12px;"></div>' +
              '<div class="proofkit-skeleton-line" style="width:50px;height:8px;"></div>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else {
      singleInnerHtml =
        '<div style="display:flex;flex-direction:column;gap:12px;padding:36px 32px;max-width:560px;margin:0 auto;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;text-align:center;align-items:center;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.02),0 1px 3px rgba(0,0,0,0.02);">' +
          '<div style="position:absolute;top:6px;left:16px;font-size:80px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.12;pointer-events:none;">“</div>' +
          '<div class="proofkit-skeleton-line" style="width:85%;height:14px;margin:8px auto 0;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:70%;height:14px;margin:0 auto;"></div>' +
          '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;width:100%;">' +
            '<div class="proofkit-skeleton-circle" style="flex-shrink:0;"></div>' +
            '<div style="text-align:left;">' +
              '<div class="proofkit-skeleton-line" style="width:80px;height:12px;"></div>' +
              '<div class="proofkit-skeleton-line" style="width:50px;height:8px;margin-top:4px;"></div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    
    skeleton.innerHTML = singleInnerHtml + (badgeVisible ?
      '<div style="display:flex;justify-content:center;margin-top:12px;width:100%;">' +
        '<div style="margin-top:8px;width:120px;height:26px;border-radius:999px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
      '</div>' : '');
  } else {
    var cardHtml = 
      '<div style="display:flex;flex-direction:column;gap:12px;padding:24px;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div class="proofkit-skeleton-circle"></div>' +
          '<div>' +
            '<div class="proofkit-skeleton-line proofkit-skeleton-name"></div>' +
            '<div class="proofkit-skeleton-line proofkit-skeleton-role"></div>' +
          '</div>' +
        '</div>' +
        '<div class="proofkit-skeleton-line proofkit-skeleton-body1"></div>' +
        '<div class="proofkit-skeleton-line proofkit-skeleton-body2"></div>' +
      '</div>';
    skeleton.className = "proofkit-skeleton-loader";
    skeleton.style.cssText = "display:flex;flex-direction:column;gap:16px;width:100%;padding:16px;background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var maxAttr = currentScript.getAttribute("data-max");
    var cardsToRender = 6;
    if (maxAttr === "3") {
      cardsToRender = 3;
    }
    var cardsGridHtml = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;width:100%;">';
    for (var i = 0; i < cardsToRender; i++) {
      cardsGridHtml += cardHtml;
    }
    cardsGridHtml += '</div>';
    
    skeleton.innerHTML = cardsGridHtml + (badgeVisible ?
      '<div style="display:flex;justify-content:center;margin-top:12px;width:100%;">' +
        '<div style="margin-top:8px;width:120px;height:26px;border-radius:999px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
      '</div>' : '');
  }
  container.appendChild(skeleton);

  function mount() {
    var iframe = document.createElement("iframe");
    iframe.src =
      baseUrl + "/embed/" + userId + (params.length ? "?" + params.join("&") : "");
    iframe.title = "Customer testimonials — powered by Blovi";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("loading", "lazy");
    iframe.style.cssText =
      "position:absolute;top:0;left:0;width:100%;border:none;display:block;overflow:hidden;opacity:0;transition:opacity 0.4s ease, height 0.2s ease;";
    iframe.height = initialHeight;

    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      iframe.style.opacity = "1";
      // Fade out skeleton smoothly before removing it from DOM
      if (skeleton) {
        skeleton.style.transition = "opacity 0.4s ease";
        skeleton.style.opacity = "0";
        setTimeout(function () {
          if (skeleton && skeleton.parentNode) {
            skeleton.parentNode.removeChild(skeleton);
          }
          iframe.style.position = "";
          iframe.style.top = "";
          iframe.style.left = "";
        }, 400);
      }
      container.style.minHeight = "0";
    }

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
          } catch (e) {
            // ignore malformed dates
          }
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
        iframe.style.height = event.data.height + 16 + "px"; // +16 for bottom padding
        reveal();
      }

      if (
        event.data.type === "proofkit-schema" &&
        Array.isArray(event.data.testimonials)
      ) {
        injectJsonLdSchema(event.data.testimonials);
      }
    });
    iframe.addEventListener("load", function () {
      // Fallback if the resize message is missed
      setTimeout(reveal, 600);
    });

    container.appendChild(iframe);
  }

  // Lazy-mount: don't cost the host page anything until the widget is
  // close to entering the viewport
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0] && entries[0].isIntersecting) {
          observer.disconnect();
          mount();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(container);
  } else {
    mount();
  }
})();
