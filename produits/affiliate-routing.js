/* SACKO CONCEPT — routage des achats affiliés.
   Ne renseigner ici que des liens de paiement affiliés officiels, obtenus
   auprès de Chariow et vérifiés pour le BON produit. Aucun lien n'est
   préconfiguré pour Nettoyage à la date de cette livraison.
   Le paramètre ?partner= n'est PAS une preuve d'attribution de commission.
*/
(() => {
  "use strict";
  const APPROVED_LINKS = Object.freeze({
    nettoyage: Object.freeze({
      // Exemple APRÈS validation (à ne pas activer tel quel) :
      // "partenaire-001": "https://chariow.ly/LIEN_AFFILIE_VERIFIE",
    }),
  });
  const product = document.body && document.body.dataset.affiliateProduct;
  if (!product || !Object.prototype.hasOwnProperty.call(APPROVED_LINKS, product)) return;
  const partner = new URLSearchParams(window.location.search).get("partner");
  if (!partner || !/^[a-z0-9_-]{3,64}$/i.test(partner)) return;
  const links = APPROVED_LINKS[product];
  const checkout = Object.prototype.hasOwnProperty.call(links, partner) ? links[partner] : null;
  if (!checkout) return;
  let target;
  try { target = new URL(checkout); } catch (_) { return; }
  const allowedHosts = new Set(["chariow.ly", "shop.sackoconcept.com"]);
  if (target.protocol !== "https:" || !allowedHosts.has(target.hostname)) return;
  if (!target.pathname || target.pathname === "/") return;
  document.querySelectorAll("a[data-affiliate-checkout]").forEach(a => {
    a.href = target.href;
    a.rel = "noopener noreferrer sponsored";
  });
  document.querySelectorAll("a[data-affiliate-language]").forEach(a => {
    const url = new URL(a.getAttribute("href"), window.location.href);
    if (url.origin !== window.location.origin) return;
    url.searchParams.set("partner", partner);
    a.href = url.pathname + url.search + url.hash;
  });
  document.querySelectorAll("[data-affiliate-confirmed]").forEach(el => { el.hidden = false; });
})();
