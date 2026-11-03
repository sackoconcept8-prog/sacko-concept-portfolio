/* SACKO CONCEPT – statistiques de visite (anonymes) */
(function () {
  try {
    if (navigator.webdriver || location.hostname === "localhost") return;
    var url = window.SACKO_SCRIPT_URL; if (!url || url.indexOf("COLLER") === 0) return;
    var vid; try { vid = localStorage.getItem("sc_vid"); if (!vid) { vid = Math.random().toString(36).slice(2, 12); localStorage.setItem("sc_vid", vid); } } catch (e) { vid = "anonyme"; }
    var q = new URLSearchParams(location.search);
    var src = q.get("utm_source") || q.get("src") || "";
    if (!src && document.referrer) { try { var h = new URL(document.referrer).hostname.replace(/^www\./, ""); if (h && h.indexOf("sackoconcept.com") < 0) src = h; } catch (e) {} }
    if (src) { try { sessionStorage.setItem("sc_src", src); } catch (e) {} } else { try { src = sessionStorage.getItem("sc_src") || "direct"; } catch (e) { src = "direct"; } }
    var page = location.pathname.replace(/index\.html$/, "") || "/";
    var u = new URL(url); u.searchParams.set("action", "visite"); u.searchParams.set("page", page); u.searchParams.set("source", src); u.searchParams.set("vid", vid);
    fetch(u.toString(), { mode: "no-cors", keepalive: true }).catch(function () {});
  } catch (e) {}
})();
