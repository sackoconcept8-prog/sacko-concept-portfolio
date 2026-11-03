/* SACKO CONCEPT – rendu commun des devis et factures (site, espace client, application) */
(function () {
  const CUR = {
    EUR: { label: "Euro (€)", sym: "€", dec: 2, paypal: true },
    USD: { label: "Dollar ($)", sym: "$", dec: 2, paypal: true },
    XOF: { label: "Franc CFA", sym: "F CFA", dec: 0, paypal: false }
  };
  function curCode(v) {
    v = String(v || "").toUpperCase();
    if (v.indexOf("EUR") >= 0 || v.indexOf("€") >= 0) return "EUR";
    if (v.indexOf("USD") >= 0 || v.indexOf("DOLLAR") >= 0 || v.indexOf("$") >= 0) return "USD";
    if (v.indexOf("CFA") >= 0 || v.indexOf("XOF") >= 0) return "XOF";
    return "EUR";
  }
  function money(n, cur) {
    const c = CUR[curCode(cur)];
    const s = Number(n || 0).toLocaleString("fr-FR", { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec });
    return c.sym === "$" ? "$" + s : s + " " + c.sym;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function date(v) { if (!v) return ""; const d = new Date(v); return isNaN(d) ? String(v) : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
  function lines(doc) { let l = doc["Lignes"]; if (typeof l === "string") { try { l = JSON.parse(l || "[]"); } catch (e) { l = []; } } return Array.isArray(l) ? l : []; }
  function total(doc) { return lines(doc).reduce(function (a, x) { return a + (Number(x.qte) || 0) * (Number(x.prix) || 0); }, 0); }
  function deposit(doc) { const p = Number(doc["Acompte %"]) || 0; return p > 0 && p < 100 ? Math.round(total(doc) * p) / 100 : 0; }
  function paypalUrl(seller, doc, amount) {
    const c = curCode(doc["Devise"]);
    if (!CUR[c].paypal || !seller["PayPal"] || !(amount > 0)) return "";
    const u = new URL("https://www.paypal.com/cgi-bin/webscr");
    u.searchParams.set("cmd", "_xclick");
    u.searchParams.set("business", seller["PayPal"]);
    u.searchParams.set("item_name", (doc["Type"] || "Facture") + " " + (doc["Numéro"] || "") + " – SACKO CONCEPT");
    u.searchParams.set("amount", Number(amount).toFixed(2));
    u.searchParams.set("currency_code", c);
    u.searchParams.set("no_shipping", "1");
    return u.toString();
  }
  /* HTML of a quote / invoice sheet */
  function render(doc, seller, opts) {
    opts = opts || {};
    const logo = opts.logo || "https://www.sackoconcept.com/assets/sacko-logo-512.png";
    const L = lines(doc), cur = doc["Devise"], tot = total(doc), dep = deposit(doc);
    const isQuote = doc["Type"] === "Devis";
    return '<article class="sdoc">' +
      '<header class="sdoc-h"><div class="sdoc-brand"><img src="' + logo + '" alt="SACKO CONCEPT" width="64" height="64"><div><b>' + esc(seller["Nom légal"] || "SACKO CONCEPT LLC") + '</b><span>' + esc(seller["Adresse"] || "") + '</span>' +
        (seller["EIN"] ? '<span>EIN ' + esc(seller["EIN"]) + '</span>' : '') +
        '<span>' + esc([seller["E-mail"], seller["Téléphone / WhatsApp"], seller["Site"]].filter(Boolean).join(" · ")) + '</span></div></div>' +
        '<div class="sdoc-title"><h1>' + esc(doc["Type"] || "Document") + '</h1><span class="sdoc-num">' + esc(doc["Numéro"] || "Brouillon") + '</span>' +
        '<span>Date : ' + esc(date(doc["Date"]) || date(new Date())) + '</span>' +
        (doc["Échéance"] ? '<span>' + (isQuote ? "Valable jusqu'au" : "À payer avant le") + ' : ' + esc(date(doc["Échéance"])) + '</span>' : '') + '</div></header>' +
      '<section class="sdoc-to"><span class="sdoc-k">' + (isQuote ? "Devis pour" : "Facturé à") + '</span><b>' + esc(doc["Entreprise"] || "") + '</b><span>' + esc([doc["Contact"], doc["Pays"]].filter(Boolean).join(" · ")) + '</span><span>' + esc([doc["E-mail"], doc["WhatsApp"]].filter(Boolean).join(" · ")) + '</span></section>' +
      '<div class="sdoc-tablewrap"><table class="sdoc-t"><thead><tr><th>Description</th><th class="r">Qté</th><th class="r">Prix unitaire</th><th class="r">Montant</th></tr></thead><tbody>' +
        (L.length ? L.map(function (x) { return '<tr><td>' + esc(x.desc) + '</td><td class="r">' + esc(x.qte) + '</td><td class="r">' + money(x.prix, cur) + '</td><td class="r">' + money((Number(x.qte) || 0) * (Number(x.prix) || 0), cur) + '</td></tr>'; }).join("") : '<tr><td colspan="4" class="sdoc-empty">Aucune ligne</td></tr>') +
      '</tbody></table></div>' +
      '<div class="sdoc-tot"><div><span>Total</span><b>' + money(tot, cur) + '</b></div>' +
        (dep ? '<div><span>Acompte à la commande (' + esc(doc["Acompte %"]) + ' %)</span><b>' + money(dep, cur) + '</b></div><div><span>Solde à la livraison</span><b>' + money(tot - dep, cur) + '</b></div>' : '') +
        '<small>Montants nets, TVA non applicable.</small></div>' +
      ((doc["Notes"] || seller["Conditions"]) ? '<section class="sdoc-notes">' + (doc["Notes"] ? '<p>' + esc(doc["Notes"]) + '</p>' : '') + (seller["Conditions"] ? '<p><span class="sdoc-k">Conditions</span>' + esc(seller["Conditions"]) + '</p>' : '') + '</section>' : '') +
      '</article>';
  }
  const CSS = '.sdoc{background:#fff;border:1px solid #E7E7EC;border-radius:20px;padding:36px;color:#0D0D12;display:flex;flex-direction:column;gap:26px;font-size:14px}' +
    '.sdoc-h{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}.sdoc-brand{display:flex;gap:14px;align-items:flex-start;min-width:0}.sdoc-brand img{width:64px;height:64px;flex:none}' +
    '.sdoc-brand div,.sdoc-title,.sdoc-to{display:flex;flex-direction:column;gap:2px;min-width:0}.sdoc-brand b{font-size:16px}.sdoc-brand span,.sdoc-title span,.sdoc-to span{color:#62626C;font-size:13px}' +
    '.sdoc-title{text-align:right;align-items:flex-end}.sdoc-title h1{margin:0;font-size:30px;letter-spacing:-.03em}.sdoc-num{font-family:"Geist Mono",ui-monospace,monospace;color:#0D0D12!important;font-size:14px!important}' +
    '.sdoc-to{background:#F7F7F9;border-radius:14px;padding:16px}.sdoc-to b{font-size:16px}.sdoc-k{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#62626C;margin-bottom:4px}' +
    '.sdoc-tablewrap{overflow-x:auto}.sdoc-t{width:100%;border-collapse:collapse;min-width:460px}.sdoc-t th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#62626C;text-align:left;font-weight:500;border-bottom:1px solid #E7E7EC;padding:10px 8px}' +
    '.sdoc-t td{padding:12px 8px;border-bottom:1px solid #F0F0F3;vertical-align:top}.sdoc-t .r{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}.sdoc-empty{color:#8A8A94;text-align:center}' +
    '.sdoc-tot{align-self:flex-end;min-width:min(320px,100%);display:flex;flex-direction:column;gap:6px}.sdoc-tot div{display:flex;justify-content:space-between;gap:20px;font-variant-numeric:tabular-nums}.sdoc-tot div:first-child{border-top:2px solid #0D0D12;padding-top:10px;font-size:17px}.sdoc-tot small{color:#8A8A94;text-align:right}' +
    '.sdoc-notes{border-top:1px solid #E7E7EC;padding-top:16px;color:#33333B;display:flex;flex-direction:column;gap:10px}.sdoc-notes p{margin:0;white-space:pre-wrap}' +
    '@media(max-width:560px){.sdoc{padding:20px}.sdoc-title{text-align:left;align-items:flex-start}}' +
    '@media print{body *{visibility:hidden}.sdoc,.sdoc *{visibility:visible}.sdoc{position:absolute;left:0;top:0;width:100%;border:0;padding:0}}';
  window.SackoDocs = { CUR: CUR, curCode: curCode, money: money, esc: esc, date: date, lines: lines, total: total, deposit: deposit, paypalUrl: paypalUrl, render: render, CSS: CSS };
})();
