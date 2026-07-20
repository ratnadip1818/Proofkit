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
    var val = currentScript.getAttribute("data-" + key);
    if (val) return val;
    if (targetContainer) {
      val = targetContainer.getAttribute("data-" + key);
      if (val) return val;
    }
    return null;
  }

  var userId = getAttr("user") || getAttr("widget-id");
  if (!userId) return;

  // Derive base URL from the script src so the widget works on any domain
  var baseUrl = currentScript.src.replace(/\/widget\.js(\?.*)?$/, "");

  // data-theme="auto": match the host page by sampling the effective
  // background color where the widget is embedded
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
      var bgLuminance =
        0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      return bgLuminance < 128 ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  var params = [];
  ["type", "layout", "preset", "theme", "max", "ratings", "badge", "featured", "demo", "accent", "radius"].forEach(
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

  var typeAttr = getAttr("type") || getAttr("layout") || "wall";
  var isDark = resolveTheme(getAttr("theme")) === "dark";
  var skeletonBg = isDark ? "#1F1F28" : "#ffffff";
  var skeletonBorder = isDark ? "#2A2A35" : "#e4e4e7";
  var skeletonFill = isDark ? "#2A2A35" : "#f4f4f5";

  var radiusAttr = getAttr("radius") || "rounded";
  var skeletonRadius = "12px";
  if (radiusAttr === "sharp") skeletonRadius = "4px";
  else if (radiusAttr === "pill") skeletonRadius = "22px";

  var showBadgeAttr = getAttr("badge");
  var badgeVisible = showBadgeAttr !== "false";
  var isLandingUser = userId === "6e037975-54db-4705-b239-28ef18f95eb8";
  var showTagsSkeleton = getAttr("tags-skeleton") === "true" || isLandingUser;
  var showShowMoreSkeleton = getAttr("show-more-skeleton") === "true" || (isLandingUser && typeAttr === "wall");

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
      initialHeight = "394";
      containerMinHeight = "394px";
    } else {
      initialHeight = "348";
      containerMinHeight = "348px";
    }
  } else if (typeAttr === "wall") {
    var maxAttr = getAttr("max");
    var extraHeight = (badgeVisible ? 46 : 0) + (showTagsSkeleton ? 52 : 0) + (showShowMoreSkeleton ? 70 : 0);
    if (maxAttr === "3") {
      initialHeight = String(280 + extraHeight);
      containerMinHeight = (280 + extraHeight) + "px";
    } else {
      initialHeight = String(530 + extraHeight);
      containerMinHeight = (530 + extraHeight) + "px";
    }
  }

  var container = targetContainer || document.createElement("div");
  container.style.cssText = "width:100%;min-height:" + containerMinHeight + ";position:relative;";
  if (!targetContainer) {
    currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  }

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
    ".proofkit-skeleton-circle { width: 40px; height: 40px; border-radius: 50%; background: " + skeletonFill + "; } " +
    ".proofkit-skeleton-line { height: 12px; background: " + skeletonFill + "; border-radius: 4px; } " +
    ".proofkit-skeleton-star { width: 14px; height: 14px; border-radius: 50%; background: " + skeletonFill + "; } " +
    ".proofkit-skeleton-flex-grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; max-width: 880px; margin: 0 auto; width: 100%; box-sizing: border-box; } " +
    ".proofkit-skeleton-flex-card-wrapper { flex: 0 0 280px; max-width: 280px; width: 280px; box-sizing: border-box; } " +
    "@media (max-width: 900px) { .proofkit-skeleton-flex-grid { max-width: 580px; } } " +
    "@media (max-width: 600px) { .proofkit-skeleton-flex-grid { max-width: 100%; } .proofkit-skeleton-flex-card-wrapper { flex: 1 1 100%; max-width: 100%; width: 100%; } }";
  document.head.appendChild(skeletonStyle);

  // Define reusable badge skeleton html
  var badgeSkeletonHtml = badgeVisible ?
    '<div style="display:flex;justify-content:center;margin-top:20px;width:100%;">' +
      '<div style="width:120px;height:24px;border-radius:999px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
    '</div>' : '';

  // Render type-aware skeleton loaders
  var skeleton = document.createElement("div");
  var showRatings = currentScript.getAttribute("data-ratings") !== "false";

  if (typeAttr === "marquee") {
    var starsMarqueeHtml = showRatings ?
      '<div style="display:flex;gap:3px;margin-bottom:12px;">' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
      '</div>' : '';

    var marqueeCardHtml = 
      '<div style="display:flex;flex-direction:column;padding:20px;height:240px;width:280px;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;flex-shrink:0;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;top:6px;right:14px;font-size:52px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.14;pointer-events:none;">”</div>' +
        starsMarqueeHtml +
        '<div style="flex-grow:1;display:flex;flex-direction:column;gap:8px;">' +
          '<div class="proofkit-skeleton-line" style="width:90%;height:12px;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:75%;height:12px;"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-top:auto;">' +
          '<div class="proofkit-skeleton-circle" style="width:34px;height:34px;flex-shrink:0;"></div>' +
          '<div style="display:flex;flex-direction:column;gap:4px;">' +
            '<div class="proofkit-skeleton-line" style="width:80px;height:10px;"></div>' +
            '<div class="proofkit-skeleton-line" style="width:50px;height:8px;"></div>' +
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
    skeleton.style.cssText = "display:block;padding:24px 16px;width:100%;height:" + (badgeVisible ? "394px" : "348px") + ";background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var dotsSkeletonHtml = 
      '<div style="display:flex;justify-content:center;gap:6px;margin-top:16px;">' +
        '<div style="width:18px;height:8px;border-radius:4px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
        '<div style="width:8px;height:8px;border-radius:4px;background:' + skeletonFill + ';opacity:0.35;"></div>' +
        '<div style="width:8px;height:8px;border-radius:4px;background:' + skeletonFill + ';opacity:0.35;"></div>' +
      '</div>';

    var starsCarouselHtml = showRatings ?
      '<div style="display:flex;justify-content:center;gap:3px;margin-bottom:4px;">' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
      '</div>' : '';

    skeleton.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:12px;padding:20px 32px;height:260px;max-width:480px;margin:0 auto;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;text-align:center;align-items:center;position:relative;overflow:hidden;">' +
        '<div style="position:absolute;top:6px;right:18px;font-size:64px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.14;pointer-events:none;">”</div>' +
        '<div class="proofkit-skeleton-circle" style="margin: 0 auto;flex-shrink:0;width:36px;height:36px;"></div>' +
        starsCarouselHtml +
        '<div style="flex-grow:1;display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;">' +
          '<div class="proofkit-skeleton-line" style="width:80%;margin:4px auto;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:60%;margin:4px auto;"></div>' +
        '</div>' +
        '<div style="margin-top:auto;width:100%;">' +
          '<div class="proofkit-skeleton-line" style="width:100px;margin:0 auto;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:60px;height:8px;margin:6px auto 0;"></div>' +
        '</div>' +
      '</div>' + 
      dotsSkeletonHtml + 
      badgeSkeletonHtml;
  } else if (typeAttr === "single") {
    var layoutAttr = currentScript.getAttribute("data-layout") || "card";
    skeleton.className = "proofkit-skeleton-loader";
    skeleton.style.cssText = "display:block;padding:32px 24px;width:100%;height:" + (badgeVisible ? "340px" : "280px") + ";background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var starsSingleHtml = showRatings ?
      '<div style="display:flex;justify-content:center;gap:3px;margin-bottom:16px;">' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
      '</div>' : '';

    var singleInnerHtml = "";
    if (layoutAttr === "minimal") {
      skeleton.style.cssText = "display:block;padding:36px 24px;width:100%;height:" + (badgeVisible ? "340px" : "280px") + ";background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
      singleInnerHtml =
        '<div style="display:flex;flex-direction:column;gap:12px;max-width:560px;margin:0 auto;background:transparent;border:none;box-sizing:border-box;text-align:center;align-items:center;position:relative;overflow:hidden;">' +
          '<div style="font-size:64px;line-height:1;font-family:Georgia,serif;color:' + skeletonFill + ';opacity:0.2;margin-bottom:8px;height:24px;">“</div>' +
          '<div class="proofkit-skeleton-line" style="width:85%;height:14px;margin:0 auto;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:70%;height:14px;margin:0 auto;"></div>' +
          starsSingleHtml +
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
          starsSingleHtml +
          '<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;width:100%;">' +
            '<div class="proofkit-skeleton-circle" style="flex-shrink:0;width:38px;height:38px;"></div>' +
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
    var starsWallHtml = showRatings ?
      '<div style="display:flex;gap:3px;margin-bottom:12px;">' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
        '<div class="proofkit-skeleton-star"></div>' +
      '</div>' : '';

    var cardHtml = 
      '<div style="display:flex;flex-direction:column;padding:20px;height:240px;background:' + skeletonBg + ';border:1px solid ' + skeletonBorder + ';border-radius:' + skeletonRadius + ';box-sizing:border-box;position:relative;overflow:hidden;">' +
        starsWallHtml +
        '<div style="flex-grow:1;display:flex;flex-direction:column;gap:8px;">' +
          '<div class="proofkit-skeleton-line" style="width:90%;height:12px;"></div>' +
          '<div class="proofkit-skeleton-line" style="width:75%;height:12px;"></div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-top:auto;">' +
          '<div class="proofkit-skeleton-circle" style="width:34px;height:34px;flex-shrink:0;"></div>' +
          '<div style="display:flex;flex-direction:column;gap:4px;">' +
            '<div class="proofkit-skeleton-line" style="width:80px;height:10px;"></div>' +
            '<div class="proofkit-skeleton-line" style="width:50px;height:8px;"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    skeleton.className = "proofkit-skeleton-loader";
    skeleton.style.cssText = "display:block;width:100%;padding:16px;background:transparent;border:none;box-sizing:border-box;animation:proofkit-skeleton-pulse 1.5s ease-in-out infinite;";
    
    var maxAttr = currentScript.getAttribute("data-max");
    var cardsToRender = 6;
    if (maxAttr === "3") {
      cardsToRender = 3;
    }
    
    var tagsSkeletonHtml = showTagsSkeleton ?
      '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px;">' +
        '<div class="proofkit-skeleton-line" style="width:50px;height:28px;border-radius:9999px;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:80px;height:28px;border-radius:9999px;"></div>' +
        '<div class="proofkit-skeleton-line" style="width:70px;height:28px;border-radius:9999px;"></div>' +
      '</div>' : '';

    var showMoreSkeletonHtml = showShowMoreSkeleton ?
      '<div style="display:flex;justify-content:center;margin-top:24px;margin-bottom:8px;">' +
        '<div class="proofkit-skeleton-line" style="width:110px;height:38px;border-radius:9999px;"></div>' +
      '</div>' : '';

    var cardsGridHtml = '<div class="proofkit-skeleton-flex-grid">';
    for (var i = 0; i < cardsToRender; i++) {
      cardsGridHtml += '<div class="proofkit-skeleton-flex-card-wrapper">' + cardHtml + '</div>';
    }
    cardsGridHtml += '</div>';
    
    skeleton.innerHTML = tagsSkeletonHtml + cardsGridHtml + showMoreSkeletonHtml + (badgeVisible ?
      '<div style="display:flex;justify-content:center;margin-top:12px;width:100%;">' +
        '<div style="margin-top:8px;width:120px;height:26px;border-radius:9999px;background:' + skeletonFill + ';opacity:0.6;"></div>' +
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
