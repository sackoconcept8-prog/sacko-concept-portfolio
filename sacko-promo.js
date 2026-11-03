/* SACKO CONCEPT – fenêtre « offre de fin d'année » quand le visiteur s'apprête à partir */
(function () {
  var END = new Date("2027-01-01T00:00:00");
  if (new Date() >= END) return;
  var KEY = "sc_promo_vu";
  try { var last = +localStorage.getItem(KEY) || 0; if (Date.now() - last < 3 * 864e5) return; } catch (e) {}
  var WA = "https://wa.me/15054642331?text=" + encodeURIComponent("Bonjour Hawa, je souhaite profiter de l'offre de fin d'année (−15 %) avec un paiement via Contra.");
  var shown = false;

  var css = '' +
  '.scp-scrim{position:fixed;inset:0;z-index:9998;background:rgba(20,20,30,.32);display:grid;place-items:center;padding:20px max(16px,env(safe-area-inset-right,0px)) 20px max(16px,env(safe-area-inset-left,0px));animation:scpFade .25s ease}' +
  '.scp{position:relative;width:min(440px,100%);background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 30px 90px rgba(20,20,40,.25);font-family:inherit;color:#0D0D12;animation:scpUp .35s cubic-bezier(.2,.8,.2,1)}' +
  '.scp-top{position:relative;height:150px;background:radial-gradient(circle at 15% 20%,rgba(236,88,98,.30),transparent 55%),radial-gradient(circle at 85% 30%,rgba(61,123,255,.28),transparent 55%),#FBF7F4;overflow:hidden}' +
  '.scp-top svg.scene{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:300px;height:140px}' +
  '.scp-snow{position:absolute;top:-10px;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 4px rgba(61,123,255,.35);animation:scpSnow linear infinite}' +
  '.scp-body{padding:22px 24px 24px;text-align:center}' +
  '.scp-eyebrow{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#C8323A}' +
  '.scp h2{font-size:24px;line-height:1.15;letter-spacing:-.02em;margin:8px 0 8px}' +
  '.scp h2 em{font-style:normal;background:linear-gradient(90deg,#E5484D,#3D7BFF);-webkit-background-clip:text;background-clip:text;color:transparent}' +
  '.scp p{margin:0 auto;color:#55555F;font-size:14.5px;line-height:1.55;max-width:34ch}' +
  '.scp-acts{display:flex;flex-direction:column;gap:8px;margin-top:18px}' +
  '.scp-acts a{display:block;text-decoration:none;border-radius:999px;padding:13px 18px;font-weight:700;font-size:15px}' +
  '.scp-main{background:linear-gradient(90deg,#E5484D,#3D7BFF);color:#fff}' +
  '.scp-sec{border:1px solid #E7E7EC;color:#0D0D12}' +
  '.scp-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.9);cursor:pointer;font-size:20px;line-height:1;color:#55555F;z-index:2}' +
  '.scp-x:focus-visible,.scp-acts a:focus-visible{outline:2px solid #3D7BFF;outline-offset:2px}' +
  '.scp small{display:block;margin-top:12px;color:#8A8A94;font-size:12px}' +
  '@keyframes scpFade{from{opacity:0}}@keyframes scpUp{from{opacity:0;transform:translateY(18px) scale(.98)}}' +
  '@keyframes scpSnow{to{transform:translateY(170px) translateX(12px)}}' +
  '@keyframes scpTwinkle{50%{opacity:.35}}' +
  '.scp .star{animation:scpTwinkle 1.6s ease-in-out infinite}' +
  '@media(prefers-reduced-motion:reduce){.scp-scrim,.scp,.scp-snow,.scp .star{animation:none}.scp-snow{display:none}}';

  var scene = '<svg class="scene" viewBox="0 0 300 140" aria-hidden="true">' +
    '<ellipse cx="150" cy="138" rx="140" ry="10" fill="#fff"/>' +
    // sapin
    '<rect x="143" y="112" width="14" height="18" rx="2" fill="#9A6B3F"/>' +
    '<path d="M150 18 L186 70 L170 70 L196 104 L104 104 L130 70 L114 70 Z" fill="#2F9E6E"/>' +
    '<path d="M150 18 L186 70 L170 70 L150 44 Z" fill="#3DB57F" opacity=".6"/>' +
    '<path d="M150 6 l3.2 6.6 7.2 1 -5.2 5 1.3 7.2 -6.5 -3.4 -6.5 3.4 1.3 -7.2 -5.2 -5 7.2 -1 z" fill="#F2B544" class="star"/>' +
    '<circle cx="138" cy="60" r="4" fill="#E5484D"/><circle cx="160" cy="78" r="4" fill="#3D7BFF"/><circle cx="128" cy="92" r="4" fill="#F2B544"/><circle cx="172" cy="96" r="4" fill="#E5484D"/><circle cx="150" cy="88" r="3.5" fill="#fff"/>' +
    // cadeaux
    '<rect x="60" y="100" width="40" height="32" rx="4" fill="#E5484D"/><rect x="76" y="100" width="8" height="32" fill="#fff"/><rect x="56" y="94" width="48" height="10" rx="3" fill="#EC5862"/><rect x="76" y="94" width="8" height="10" fill="#fff"/>' +
    '<path d="M80 94 c-10 -12 -20 -4 -12 0 M80 94 c10 -12 20 -4 12 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<rect x="206" y="108" width="34" height="24" rx="4" fill="#3D7BFF"/><rect x="219" y="108" width="7" height="24" fill="#fff"/><rect x="202" y="102" width="42" height="9" rx="3" fill="#5B8FFF"/><rect x="219" y="102" width="7" height="9" fill="#fff"/>' +
    '<rect x="244" y="116" width="26" height="16" rx="3" fill="#F2B544"/><rect x="254" y="116" width="6" height="16" fill="#fff"/>' +
    '</svg>';

  function show() {
    if (shown) return; shown = true;
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var snow = ""; for (var i = 0; i < 14; i++) snow += '<span class="scp-snow" style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-duration:' + (4 + Math.random() * 4).toFixed(1) + 's;animation-delay:-' + (Math.random() * 6).toFixed(1) + 's;opacity:' + (0.5 + Math.random() * 0.5).toFixed(2) + ';transform:scale(' + (0.5 + Math.random()).toFixed(2) + ')"></span>';
    var w = document.createElement("div");
    w.className = "scp-scrim";
    w.innerHTML = '<div class="scp" role="dialog" aria-modal="true" aria-labelledby="scpT">' +
      '<button class="scp-x" type="button" aria-label="Fermer">×</button>' +
      '<div class="scp-top">' + snow + scene + '</div>' +
      '<div class="scp-body"><div class="scp-eyebrow">Cadeau de fin d\'année</div>' +
      '<h2 id="scpT">Avant de partir : <em>−15 % sur votre application</em></h2>' +
      '<p>Commandez NettoPro, RH Pro, StockPro ou PhonePro avant le 31 décembre et profitez de −15 % avec un paiement sécurisé via Contra.</p>' +
      '<div class="scp-acts"><a class="scp-main" href="' + WA + '" target="_blank" rel="noopener">J\'en profite</a><a class="scp-sec" href="commencer.html">Tester une démo gratuite d\'abord</a></div>' +
      '<small>Offre valable jusqu\'au 31 décembre 2026.</small></div></div>';
    document.body.appendChild(w);
    var close = function () { w.remove(); document.removeEventListener("keydown", esc); };
    var esc = function (e) { if (e.key === "Escape") close(); };
    w.addEventListener("click", function (e) { if (e.target === w) close(); });
    w.querySelector(".scp-x").onclick = close;
    document.addEventListener("keydown", esc);
    w.querySelector(".scp-main").focus();
  }

  // Ordinateur : la souris quitte la page par le haut
  document.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget && e.clientY < 12 && (Date.now() - start) > 6000) show();
  });
  // Téléphone : remontée rapide après avoir lu la page, ou 40 secondes de visite
  var start = Date.now(), lastY = window.scrollY, lastT = Date.now(), maxY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY, t = Date.now(); maxY = Math.max(maxY, y);
    var speed = (lastY - y) / Math.max(1, t - lastT);
    if (window.innerWidth < 900 && maxY > 900 && speed > 1.6 && (t - start) > 10000) show();
    lastY = y; lastT = t;
  }, { passive: true });
  if (window.matchMedia("(pointer:coarse)").matches) setTimeout(show, 40000);
})();
