import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = 'https://www.sackoconcept.com/';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const euro = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const plainNumber = value => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

function validate(data) {
  if (data.page !== 'vente-launchvault-500-prompts-1tpe.html' || data.previewPage !== 'apercu-launchvault-1tpe.html') throw new Error('Unexpected LaunchVault routes');
  if (!(Number.isFinite(data.priceHtEur) && data.priceHtEur > 0 && Number.isFinite(data.vatFrancePercent) && data.vatFrancePercent >= 0 && data.vatFrancePercent <= 100)) throw new Error('Invalid LaunchVault price or VAT');
  if (data.checkoutUrl !== 'https://www.1tpe.net/commander.php?u=sackoconcept&p=4') throw new Error('Use the verified official LaunchVault checkout URL');
  if (data.memberAreaUrl !== 'https://launchvault.sackoconcept.com/') throw new Error('Unexpected member-area URL');
  if (data.salesEnabled && !data.deliveryVerified) throw new Error('Verify delivery before enabling sales');
  if (data.kits.length !== 5 || data.kits.reduce((sum, kit) => sum + kit.count, 0) !== 500 || data.kits.some(kit => kit.count !== 100 || kit.categories !== 10 || !kit.sample.textFr || !kit.sample.textEn)) throw new Error('LaunchVault content differs from the verified product');
  if (data.paths.length !== 4) throw new Error('Unexpected guided-path count');
}

function head(data, title, description, route, preview = false) {
  const structured = preview
    ? { '@context':'https://schema.org', '@type':'WebPage', name:title, description, url:origin+route }
    : { '@context':'https://schema.org', '@type':'Product', name:data.name, description:data.description, image:origin+'assets/vault.webp', url:origin+route, brand:{ '@type':'Brand', name:'SACKO CONCEPT' } };
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | SACKO CONCEPT</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${data.salesEnabled ? 'index,follow' : 'noindex,follow'}">
<meta name="theme-color" content="#081b13">
<link rel="canonical" href="${origin+route}"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="1tpe-product-pages.css"><link rel="stylesheet" href="launchvault-1tpe.css">
<meta property="og:type" content="${preview ? 'website' : 'product'}"><meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${esc(title)} — SACKO CONCEPT"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin+route}"><meta property="og:image" content="${origin}assets/vault.webp">
<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>
</head><body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="SACKO CONCEPT, accueil"><img src="assets/sacko-premium-logo.png" width="48" height="48" alt=""><span>SACKO<br><b>CONCEPT</b></span></a><nav class="nav" aria-label="Navigation principale"><a class="optional" href="${preview ? data.page+'#contenu' : '#contenu'}">Contenu</a><a class="optional" href="${preview ? data.page+'#conditions' : '#conditions'}">Conditions</a><a href="catalogue-1tpe.html">Catalogue</a></nav></div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap footer-inner"><span>© 2026 SACKO CONCEPT · Hawa Sacko</span><div class="footer-links"><a href="catalogue-1tpe.html">Catalogue</a><a href="legal.html">Mentions et confidentialité</a><a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">Conditions 1TPE</a><a href="mailto:contact@sackoconcept.com">Assistance</a></div></div></footer></body></html>\n`;
}

function checkout(data, label = 'Accéder à la commande 1TPE') {
  return `<a class="btn gold" href="${esc(data.checkoutUrl)}" rel="nofollow" target="_top">${esc(label)} <span aria-hidden="true">↗</span></a>`;
}

function salesPage(data, ttc) {
  const status = data.salesEnabled ? '' : '<p class="pending-chip">Mise en vente en attente de validation sur 1TPE.</p>';
  const kitDescriptions = [
    'Clarifiez votre niche, votre positionnement, vos fiches produits, votre référencement et vos campagnes pour une boutique Shopify.',
    'Préparez vos briefs, la structure de vos pages, vos textes, vos choix UX et la remise d’un projet de site à un client.',
    'Structurez vos offres, vos plans de contenu, vos messages commerciaux, vos séquences email et vos opérations.',
    'Développez vos idées de publication, accroches, scripts, légendes, carrousels et méthodes de réutilisation du contenu.',
    'Préparez des demandes pour Excel, Word, présentations, emails, rapports, réunions et organisation du travail.'
  ];
  const sample = data.kits[4].sample;
  return head(data, data.name, data.description, data.page)+`
<main id="main">
<section class="hero"><div class="wrap"><div class="breadcrumb"><a href="catalogue-1tpe.html">Collection SACKO CONCEPT</a><span aria-hidden="true">/</span><span>LaunchVault</span></div><div class="hero-grid"><div><p class="eyebrow">Bibliothèque de prompts · Français + anglais</p><span class="edition">500 prompts · 5 kits · 4 parcours guidés</span><h1>Vos idées.<br><em>Un point de départ concret.</em></h1><p class="lead">Choisissez votre objectif, personnalisez un prompt et préparez votre prochain contenu, document ou projet avec votre assistant d’IA.</p><ul class="hero-checks"><li>100 prompts dans chacun des cinq kits</li><li>Interface et prompts disponibles en français et en anglais</li><li>Accès personnel en ligne et guide PDF d’accès</li></ul><p class="hero-price">${euro(ttc)} TTC<small>France · TVA ${plainNumber(data.vatFrancePercent)} % comprise · Paiement unique</small></p>${status}<div class="buttons">${checkout(data)}<a class="btn outline" href="${data.previewPage}">Essayer 5 prompts gratuits ↗</a></div></div><figure class="hero-art pack"><img src="assets/vault.webp" width="1080" height="1080" alt="SACKO LaunchVault : 500 prompts IA et 5 kits professionnels" fetchpriority="high"><figcaption>Visuel de présentation. Le produit est un accès numérique, sans boîte physique.</figcaption></figure></div></div></section>
<div class="facts"><div class="wrap facts-inner"><div class="fact"><strong>500 prompts</strong><span>répartis en cinq kits</span></div><div class="fact"><strong>50 catégories</strong><span>10 objectifs par kit</span></div><div class="fact"><strong>FR + EN</strong><span>interface et prompts bilingues</span></div><div class="fact"><strong>4 parcours</strong><span>pour avancer étape par étape</span></div></div></div>
<section class="section"><div class="wrap"><div class="section-heading"><p class="eyebrow">De l’idée au travail concret</p><h2>Moins de page blanche.<br>Plus de structure.</h2><p>LaunchVault fournit des consignes à utiliser dans votre outil d’IA. Vous gardez la main sur les informations saisies, les choix et la vérification du résultat.</p></div><div class="cards"><article class="card"><span class="card-number">01</span><h3>Choisir une tâche précise</h3><p>Partez du kit et de l’objectif qui correspondent à votre besoin : préparer une offre, organiser du contenu ou travailler sur un document.</p></article><article class="card"><span class="card-number">02</span><h3>Personnaliser la demande</h3><p>Remplacez les champs entre crochets par votre contexte, vos contraintes, votre public et le format que vous attendez.</p></article><article class="card"><span class="card-number">03</span><h3>Relire et améliorer</h3><p>Copiez le prompt dans votre assistant d’IA, contrôlez sa réponse et demandez les corrections utiles avant de l’utiliser.</p></article></div></div></section>
<section class="section alt" id="contenu"><div class="wrap"><div class="section-heading"><p class="eyebrow">Le contenu exact</p><h2>Cinq kits.<br>Cinquante objectifs de travail.</h2><p>La bibliothèque comprend 500 prompts distincts. Chaque prompt est proposé dans les deux langues : il ne s’agit pas de compter les traductions comme des prompts supplémentaires.</p></div><div class="content-table">${data.kits.map((kit, index)=>`<div class="content-row"><div><h3>${esc(kit.name)}</h3><span class="file-meta">${kit.count} prompts · ${kit.categories} catégories</span></div><p>${esc(kitDescriptions[index])}</p></div>`).join('')}<div class="content-row"><div><h3>Quatre parcours guidés</h3><span class="file-meta">Des étapes reliées aux prompts du Vault</span></div><p>${data.paths.map(path=>`${esc(path.name)} (${path.steps} étapes)`).join(' ; ')}. Les durées indiquées servent à organiser le parcours ; elles ne garantissent pas un résultat dans ce délai.</p></div><div class="content-row"><div><h3>Le guide PDF d’accès</h3><span class="file-meta">Lien de l’espace membre et instructions privées</span></div><p>Le guide explique comment ouvrir le Vault, saisir votre clé, choisir une langue, retrouver un prompt et le copier dans votre assistant d’IA. Il est remis après achat.</p></div></div><p class="included-note">Produit numérique : accès en ligne et guide PDF. Aucun article physique ne sera expédié.</p></div></section>
<section class="section" id="apercu"><div class="wrap preview-grid"><article class="lv-sample-card"><p class="eyebrow">Un exemple réel · Kit Productivité IA</p><h3>${esc(sample.titleFr)}</h3><pre class="lv-prompt">${esc(sample.textFr)}</pre><p class="preview-note">Exemple extrait de la bibliothèque. Vérifiez les formules proposées par votre outil d’IA avant de les utiliser.</p></article><div class="description"><p class="eyebrow">Avant de choisir</p><h2>Essayez la méthode.<br>Sans vous connecter.</h2><p>L’aperçu gratuit contient cinq prompts réels, un par kit, avec leurs versions française et anglaise. Consultez les consignes, remplacez les champs et testez-les dans votre propre outil d’IA.</p><ul class="tick-list"><li>Concept de boutique Shopify</li><li>Brief stratégique de site web</li><li>Plan de contenu sur 30 jours</li><li>Niche et positionnement d’un créateur</li><li>Construction d’une formule Excel ou Google Sheets</li></ul><div class="buttons"><a class="btn" href="${data.previewPage}">Ouvrir l’aperçu gratuit ↗</a></div><p class="preview-note" style="margin-top:15px">5 exemples parmi les 500 prompts · Aucun compte requis pour cet aperçu</p></div></div></section>
<section class="section alt"><div class="wrap"><div class="section-heading"><p class="eyebrow">Pour qui ?</p><h2>Des projets différents.<br>Une bibliothèque à adapter.</h2><p>Entrepreneurs, commerçants en ligne, créateurs de contenu, indépendants, assistants et professionnels qui veulent structurer leurs demandes à un outil d’IA.</p></div><div class="steps"><article class="step"><h3>Consultez l’aperçu</h3><p>Vérifiez la méthode, les langues, les catégories et les prérequis avant de commander.</p></article><article class="step"><h3>Conservez votre guide</h3><p>Après un achat validé, récupérez le guide PDF et gardez-le pour retrouver votre accès.</p></article><article class="step"><h3>Ouvrez votre espace</h3><p>Utilisez votre clé privée, choisissez FR ou EN et commencez avec un prompt adapté à votre tâche.</p></article></div></div></section>
<section class="section" id="conditions"><div class="wrap"><div class="section-heading"><p class="eyebrow">Les informations essentielles</p><h2>Accès, prix et conditions.</h2></div><div class="terms-grid"><article class="terms-box"><h3>Prix et règlement</h3><p><strong>${euro(ttc)} TTC pour la France</strong> : ${euro(data.priceHtEur)} HT + ${euro(ttc-data.priceHtEur)} de TVA (${plainNumber(data.vatFrancePercent)} %). Paiement unique, sans abonnement LaunchVault.</p><p>Le montant applicable à votre pays et la disponibilité sont indiqués par 1TPE avant tout paiement. La commande s’ouvre directement sur le domaine 1TPE.</p></article><article class="terms-box"><h3>Livraison numérique</h3><p>À l’ouverture de la vente, après confirmation du paiement par 1TPE, suivez les instructions d’accès pour récupérer votre guide PDF. Ouvrez le lien de l’espace membre indiqué dans ce guide et saisissez la clé privée fournie.</p><p>Conservez le PDF sur votre appareil : la fenêtre d’accès fournie par 1TPE est limitée à 48 heures. Le guide permet de retrouver ensuite le lien du Vault et votre clé.</p></article><article class="terms-box"><h3>Prérequis et fonctionnement</h3><p>Une connexion Internet, un navigateur récent avec JavaScript activé et un lecteur PDF sont nécessaires. L’espace est consultable sur ordinateur, tablette ou téléphone.</p><p>Pour générer une réponse, copiez le prompt dans un outil d’IA auquel vous avez accès. Aucun compte, abonnement ou crédit ChatGPT, Claude, Gemini ou autre service externe n’est inclus.</p></article><article class="terms-box"><h3>Licence et assistance</h3><p>Accès personnel à vie, sans abonnement. Adaptez les prompts à vos propres projets et tâches professionnelles. Le partage de la clé, la redistribution et la revente de la bibliothèque ou du guide d’accès ne sont pas autorisés.</p><p>Pour une difficulté d’accès ou une question sur l’utilisation : <a href="mailto:contact@sackoconcept.com">contact@sackoconcept.com</a>. Indiquez votre référence de commande et le problème rencontré. Aucune prestation sur mesure n’est incluse.</p></article></div><aside class="notice"><h3>À savoir avant utilisation</h3><ul><li>LaunchVault fournit des prompts et des parcours ; il ne génère pas lui-même les réponses de l’IA et ne connecte pas automatiquement vos outils.</li><li>Les résultats dépendent de votre contexte, de votre personnalisation et du service d’IA utilisé. Aucun chiffre d’affaires, revenu ou délai de résultat n’est garanti.</li><li>Vérifiez les faits, calculs, formulations et droits d’usage avant de publier ou de transmettre une réponse.</li><li>Ne partagez avec un outil d’IA que les données que vous êtes autorisé à lui communiquer.</li><li>Les fonctions des services externes évoluent. Certaines fonctions peuvent nécessiter une offre payante distincte.</li></ul></aside></div></section>
<section class="section alt"><div class="wrap"><div class="section-heading"><p class="eyebrow">Vos questions</p><h2>Avant de commander.</h2></div><div class="faq"><details><summary>LaunchVault est-il en français ?</summary><p>Oui. L’interface et les 500 prompts sont disponibles en français et en anglais. Utilisez le sélecteur FR / EN dans le Vault.</p></details><details><summary>Est-ce un livre de 500 pages ou un fichier Excel ?</summary><p>Non. Le produit principal est une bibliothèque de prompts consultable en ligne. Un guide PDF fournit vos instructions d’accès. Les prompts du kit Productivité peuvent vous aider à demander des formules ou documents à votre outil d’IA.</p></details><details><summary>Les traductions sont-elles comptées deux fois ?</summary><p>Non. Il y a 500 prompts distincts, répartis en cinq kits de 100 prompts. Chaque prompt possède une version française et une version anglaise.</p></details><details><summary>Dois-je savoir coder ?</summary><p>Il n’est pas nécessaire de coder pour consulter et copier les prompts. Certains projets abordés, comme la création de sites ou l’automatisation, peuvent demander des compétences et outils supplémentaires.</p></details><details><summary>Les parcours garantissent-ils des ventes ?</summary><p>Non. Ils structurent des étapes de travail et renvoient vers des prompts utiles. Vos résultats dépendent notamment de votre offre, de votre marché, de votre exécution et de vos vérifications.</p></details><details><summary>Quelles conditions s’appliquent à un achat sur 1TPE ?</summary><p>Le paiement, la facture et les remboursements sont encadrés par les <a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">conditions de vente de 1TPE</a>, qui prévoient une garantie contractuelle satisfait ou remboursé de 30 jours. Les droits d’utilisation restent ceux de la licence du produit.</p></details></div></div></section>
<section class="section"><div class="wrap"><div class="order-panel" id="commande"><div><p class="eyebrow">SACKO CONCEPT · LaunchVault</p><h2>Votre prochain projet<br>commence avec une demande claire.</h2><p>${esc(data.description)}</p><a class="lv-light-link" href="${data.previewPage}">Consulter les cinq exemples gratuits →</a></div><div class="order-box"><span class="price-label">Paiement unique · France</span><strong class="price">${euro(ttc)} TTC</strong><p class="small">${euro(data.priceHtEur)} HT · TVA ${plainNumber(data.vatFrancePercent)} % incluse</p>${checkout(data)}${data.salesEnabled ? '' : '<p class="small" style="margin-top:15px">Vente en attente de validation. La page 1TPE indique la disponibilité actuelle du produit.</p>'}</div></div><a class="back-link" href="catalogue-1tpe.html">← Découvrir les autres ressources SACKO CONCEPT</a></div></section>
</main>`+footer();
}

function previewPage(data) {
  return head(data, 'LaunchVault : 5 prompts à essayer', 'Découvrez cinq prompts réels de SACKO LaunchVault, un par kit, en français et en anglais. Aperçu gratuit consultable sans connexion.', data.previewPage, true)+`
<main id="main"><section class="hero lv-preview-hero"><div class="wrap"><p class="eyebrow">Aperçu gratuit · SACKO LaunchVault</p><h1>Cinq exemples réels.<br><em>À essayer maintenant.</em></h1><p class="lead">Un prompt par kit, parmi les 500 de la bibliothèque. Personnalisez les champs entre crochets, utilisez des données autorisées et contrôlez la réponse de votre outil d’IA.</p><p class="lv-preview-note">Les versions française et anglaise de chaque exemple sont disponibles ci-dessous. Aucun accès au Vault complet n’est nécessaire pour cet aperçu.</p><a class="btn outline" href="${data.page}">← Voir la fiche complète</a></div></section><section class="section"><div class="wrap lv-prompt-list">${data.kits.map((kit,index)=>`<article class="lv-sample-card"><p class="eyebrow">0${index+1} · ${esc(kit.name)}</p><h2>${esc(kit.sample.titleFr)}</h2><div lang="fr"><span class="file-meta">Version française</span><pre class="lv-prompt" id="prompt-fr-${index}">${esc(kit.sample.textFr)}</pre><button class="btn outline lv-copy" type="button" data-copy="prompt-fr-${index}">Copier le prompt français</button></div><details class="lv-english" lang="en"><summary>Read the English version: ${esc(kit.sample.titleEn)}</summary><pre class="lv-prompt" id="prompt-en-${index}">${esc(kit.sample.textEn)}</pre><button class="btn outline lv-copy" type="button" data-copy="prompt-en-${index}">Copy the English prompt</button></details></article>`).join('')}<p class="lv-copy-status" role="status" aria-live="polite"></p><aside class="notice"><h3>Pour tester cet aperçu</h3><p>Copiez un exemple dans votre propre assistant d’IA. Remplacez les champs, ajoutez le contexte utile et vérifiez la réponse. Aucun abonnement d’IA n’est fourni. Les indications de durée ou de performance contenues dans un prompt décrivent la demande à l’IA, sans garantir le résultat.</p></aside><div class="buttons"><a class="btn" href="${data.page}">Découvrir les 500 prompts et les conditions →</a></div></div></section></main>
<script>
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const prompt = document.getElementById(button.dataset.copy);
    const english = button.closest('[lang="en"]');
    const status = document.querySelector('.lv-copy-status');
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      status.textContent = english ? 'Prompt copied. Replace the bracketed fields before using it.' : 'Prompt copié. Remplacez les champs entre crochets avant de l’utiliser.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(prompt);
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = english ? 'Select the text and copy it using your browser’s copy command.' : 'Le texte est sélectionné. Utilisez la commande Copier de votre navigateur.';
    }
    status.lang = english ? 'en' : 'fr';
  });
});
</script>`+footer();
}

export async function renderLaunchVault1Tpe() {
  const data = JSON.parse(await readFile(resolve(root, 'launchvault-1tpe.json'), 'utf8'));
  validate(data);
  const ttc = Math.round(data.priceHtEur * (1 + data.vatFrancePercent / 100) * 100) / 100;
  await writeFile(resolve(root, data.page), salesPage(data, ttc));
  await writeFile(resolve(root, data.previewPage), previewPage(data));
  const legacy = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${data.page}"><link rel="canonical" href="${origin+data.page}"><title>Nouvelle fiche LaunchVault | SACKO CONCEPT</title></head><body><p>La nouvelle fiche LaunchVault est disponible ici : <a href="${data.page}">SACKO LaunchVault – 500 prompts IA</a>.</p></body></html>\n`;
  await writeFile(resolve(root, 'vente-launchvault-1tpe.html'), legacy);
  const cataloguePath = resolve(root, 'catalogue-1tpe.html');
  const catalogue = await readFile(cataloguePath, 'utf8');
  const start = '/* LAUNCHVAULT_1TPE_START */', end = '/* LAUNCHVAULT_1TPE_END */';
  if (!catalogue.includes(start) || !catalogue.includes(end)) throw new Error('LaunchVault catalogue markers missing');
  const card = { type:'ia', tag:'Bibliothèque IA · FR + EN', name:data.name, desc:data.description, features:['500 prompts bilingues','5 kits · 4 parcours','Guide PDF d’accès'], price:euro(ttc)+' TTC', priceLabel:data.salesEnabled?'Prix TTC France':'Prix TTC France · Vente en préparation', img:'assets/vault.webp', page:data.page, pay:data.salesEnabled?data.checkoutUrl:null };
  const first = catalogue.indexOf(start), last = catalogue.indexOf(end, first);
  await writeFile(cataloguePath, catalogue.slice(0, first)+start+'\n'+JSON.stringify(card)+',\n'+end+catalogue.slice(last+end.length));
  console.log(`Rendered LaunchVault sales page and five-prompt preview. France: ${euro(ttc)} incl. VAT. Sales enabled: ${data.salesEnabled}; delivery verified: ${data.deliveryVerified}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await renderLaunchVault1Tpe();
