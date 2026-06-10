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

  var params = [];
  ["type", "layout", "theme", "max", "ratings", "badge", "featured"].forEach(function (key) {
    var val = currentScript.getAttribute("data-" + key);
    if (val) params.push(key + "=" + encodeURIComponent(val));
  });

  var iframe = document.createElement("iframe");
  iframe.src =
    baseUrl + "/embed/" + userId + (params.length ? "?" + params.join("&") : "");
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("frameborder", "0");
  iframe.style.cssText =
    "width:100%;border:none;display:block;overflow:hidden;transition:height 0.2s ease;";
  iframe.height = "400"; // sensible fallback until resize message arrives

  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  // Auto-resize: embed page posts its scroll height via postMessage
  window.addEventListener("message", function (event) {
    if (
      event.data &&
      event.data.type === "proofkit-resize" &&
      typeof event.data.height === "number" &&
      event.data.height > 0
    ) {
      iframe.style.height = event.data.height + 16 + "px"; // +16 for bottom padding
    }
  });
})();
