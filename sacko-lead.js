/* SACKO CONCEPT – bouton WhatsApp + capture de contact dans les démos (sans inscription préalable) */
(function () {
  var WA = "15054642331";
  var path = location.pathname;
  var APPS = { nettopro: "NettoPro", rhpro: "RH Pro", stockpro: "StockPro", phonepro: "PhonePro" };
  var app = "";
  for (var k in APPS) if (path.indexOf("/" + k + "/") >= 0) app = APPS[k];
  var inDemo = /\/demo\/?/.test(path) && app;

  var css = document.createElement("style");
  css.textContent =
    ".sc-wa{position:fixed;right:14px;bottom:" + (inDemo ? "88px" : "18px") + ";z-index:2147483000;width:54px;height:54px;border-radius:50%;background:#25D366;box-shadow:0 6px 18px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;text-decoration:none}" +
    ".sc-wa svg{width:30px;height:30px;fill:#fff}" +
    ".sc-lead{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483001;max-width:420px;margin:0 auto;background:#fff;color:#1a1a1a;border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.2);padding:18px 18px 16px;font:15px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #f0e2e2;transform:translateY(140%);transition:transform .35s ease}" +
    ".sc-lead.on{transform:none}" +
    ".sc-lead b{display:block;font-size:17px;margin:0 26px 4px 0}" +
    ".sc-lead p{margin:0 0 12px;color:#555;font-size:14px}" +
    ".sc-lead input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ddd;border-radius:10px;font:inherit;margin-bottom:8px;background:#fafafa;color:#1a1a1a}" +
    ".sc-lead button.go{width:100%;padding:13px;border:0;border-radius:10px;background:linear-gradient(90deg,#e04848,#3d6fd8);color:#fff;font:600 15px system-ui,sans-serif;cursor:pointer}" +
    ".sc-lead .x{position:absolute;top:10px;right:12px;border:0;background:none;font-size:22px;color:#999;cursor:pointer;line-height:1}" +
    ".sc-lead .ok{color:#15803d;font-weight:600;margin:6px 0 0}";
  document.head.appendChild(css);

  function waLink(txt) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(txt); }

  /* Bouton WhatsApp flottant */
  var wa = document.createElement("a");
  wa.className = "sc-wa"; wa.target = "_blank"; wa.rel = "noopener";
  wa.setAttribute("aria-label", "Écrire sur WhatsApp");
  wa.href = waLink(app ? "Bonjour, je viens de voir la démo " + app + " et j'ai une question." : "Bonjour, je suis intéressé(e) par une application pour mon entreprise.");
  wa.innerHTML = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3.2 29l7.3-1.9c1.8 1 3.9 1.5 6 1.5 7 0 12.7-5.7 12.7-12.6S23 3 16 3zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.2 9.8 10 5.1 16 5.1s10.8 4.7 10.8 10.5S21.9 26.1 16 26.1zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.8.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z"/></svg>';
  document.body.appendChild(wa);
  if (!inDemo) return;

  /* Fenêtre de contact dans la démo : apparaît après 45 s d'essai, une fois par visite */
  try { if (sessionStorage.getItem("sc_lead_" + app) || localStorage.getItem("sc_lead_done")) return; } catch (e) {}
  var box = document.createElement("div");
  box.className = "sc-lead";
  box.innerHTML =
    '<button class="x" aria-label="Fermer">×</button>' +
    "<b>" + app + " vous plaît ?</b>" +
    "<p>Recevez le prix et une version à votre nom, directement sur WhatsApp.</p>" +
    '<form><input name="nom" placeholder="Votre prénom" autocomplete="given-name" required>' +
    '<input name="whatsapp" type="tel" placeholder="Votre WhatsApp (+229…)" autocomplete="tel" required>' +
    '<button class="go" type="submit">Recevoir mon prix</button></form>';
  document.body.appendChild(box);
  function close() { box.classList.remove("on"); try { sessionStorage.setItem("sc_lead_" + app, "1"); } catch (e) {} }
  box.querySelector(".x").onclick = close;
  box.querySelector("form").onsubmit = function (e) {
    e.preventDefault();
    var f = e.target, nom = f.nom.value.trim(), tel = f.whatsapp.value.trim();
    if (!nom || tel.replace(/\D/g, "").length < 8) { f.whatsapp.focus(); return; }
    var url = window.SACKO_SCRIPT_URL;
    var data = { type: "inscription", nom: nom, entreprise: "", email: "", whatsapp: tel, application: app, source: (function () { try { return sessionStorage.getItem("sc_src") || "direct"; } catch (e) { return "direct"; } })() };
    if (url && url.indexOf("COLLER") !== 0) {
      fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data), keepalive: true }).catch(function () {});
    }
    try { localStorage.setItem("sc_lead_done", "1"); } catch (e) {}
    f.outerHTML = '<p class="ok">Merci ' + nom.replace(/</g, "") + ' ! Hawa vous écrit sur WhatsApp très vite.</p>';
    setTimeout(close, 3500);
  };
  setTimeout(function () { box.classList.add("on"); }, 45000);
})();
