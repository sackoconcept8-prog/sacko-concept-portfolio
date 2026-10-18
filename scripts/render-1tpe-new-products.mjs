import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = 'https://www.sackoconcept.com/';
const config = JSON.parse(await readFile(resolve(root, '1tpe-new-products.json'), 'utf8'));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const euro = value => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const number = value => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);

const products = [
  {
    id: 'ia-bureau', name: 'L’IA au bureau, c’est facile !', short: 'L’IA au bureau', type: 'ia', tag: 'Guide pratique en français',
    edition: 'Édition française · Octobre 2026', cover: 'assets/ia-bureau-guide-cover.webp', coverWidth: 1024, coverHeight: 1536,
    artClass: 'book', coverCaption: 'Couverture du guide · Les bonus sont livrés séparément.',
    headline: 'L’IA au bureau,<br><em>c’est facile !</em>',
    description: 'Un manuel de 80 pages, 100 prompts et des exercices corrigés pour utiliser l’IA dans vos tâches professionnelles, vérifier ses réponses et mieux protéger vos données.',
    lead: 'Préparez de meilleures demandes, rédigez vos documents et avancez avec des contrôles simples. Un parcours concret pour les professionnels francophones, même débutants.',
    checks: ['Un manuel de 80 pages, en français', '100 prompts classés par besoin professionnel', '10 missions corrigées et un programme de 14 jours'],
    facts: [['80 pages', 'dans le manuel principal'], ['100 prompts', 'dans un recueil séparé'], ['10 missions', 'avec leurs corrigés'], ['5 PDF', '165 pages au total']],
    benefitTitle: 'Des situations de bureau.<br>Des méthodes à réutiliser.',
    benefitIntro: 'Partez d’une tâche précise, personnalisez votre demande, puis contrôlez le résultat avant de l’utiliser.',
    benefits: [
      ['Mieux formuler vos demandes', 'Appliquez une trame en cinq éléments : contexte, objectif, informations, format et contrôle. Comparez un premier essai à une demande mieux préparée.'],
      ['Pratiquer sur vos tâches', 'Courriers, comptes rendus, formules Excel, organisation, RH et communication : adaptez les exemples à votre activité au lieu de partir d’une page blanche.'],
      ['Garder un regard critique', 'Apprenez à repérer les informations inventées, à vérifier les faits et les calculs, et à préparer uniquement les données que vous êtes autorisé à partager.']
    ],
    contentIntro: 'Le téléchargement regroupe cinq PDF distincts et un fichier LISEZ_MOI. Il s’agit de documents à lire et à pratiquer à votre rythme.',
    contents: [
      ['Le manuel principal', 'PDF · 80 pages · 12 chapitres', 'Bases, rédaction, Excel, RH, confidentialité, vérification et développement d’activité. Le parcours se termine par un programme pratique de 14 jours.'],
      ['Le recueil de 100 prompts', 'PDF · 53 pages · 7 familles', 'Administration, Excel et données, ressources humaines, entrepreneuriat, communication, productivité et contrôle qualité. Les champs à personnaliser sont indiqués.'],
      ['Le cahier de 10 missions corrigées', 'PDF · 23 pages', 'Des exercices à réaliser avant de consulter les corrigés, pour tester votre compréhension et comparer votre résultat aux critères proposés.'],
      ['Les checklists de contrôle', 'PDF · 8 pages', 'Une checklist de confidentialité et une revue de 20 erreurs fréquentes. Les cases sont destinées à l’impression ou à l’annotation dans votre lecteur PDF.'],
      ['La fiche universelle de prompt', 'PDF · 1 page', 'Une trame synthétique à conserver près de vous pour construire vos propres demandes. Le fichier LISEZ_MOI précise l’ordre de lecture et les droits d’usage.']
    ],
    preview: 'assets/ia-bureau-extrait.pdf', previewName: 'Lire l’extrait gratuit', previewMeta: 'PDF · Les 8 premières pages du manuel · Sans inscription',
    previewIntro: 'Découvrez le sommaire, le cadre d’utilisation et un premier exercice avant de choisir le pack complet.',
    previewImages: [['assets/ia-bureau-extrait-page.webp', 'Page 7 du manuel principal : comprendre ce que produit l’IA.']],
    previewBullets: ['Un extrait réel du manuel livré.', 'Du texte sélectionnable et des exemples de demandes.', 'Les 100 prompts bonus restent dans le pack complet.'],
    audiences: 'Assistants administratifs, responsables RH, entrepreneurs, salariés et indépendants qui veulent mieux utiliser un assistant d’IA au travail.',
    requirements: '<p>Un lecteur PDF à jour suffit pour lire les documents, sur ordinateur, tablette ou téléphone. Pour réaliser les exercices, utilisez un outil d’IA autorisé dans votre contexte professionnel et, pour les exemples Excel, un tableur adapté.</p><p>Aucun abonnement d’IA, logiciel, classeur Excel ni accompagnement individuel n’est inclus. Certains outils ou fonctions externes peuvent être payants ou indisponibles selon votre offre.</p>',
    limits: '<ul><li>Les réponses d’IA doivent être contrôlées ; aucun gain de temps chiffré ni résultat commercial n’est garanti.</li><li>Les exemples sont fictifs et les checklists ne sont pas des formulaires interactifs.</li><li>Respectez les règles de votre employeur et les autorisations de partage de données.</li><li>Les fonctions des outils externes évoluent ; le guide correspond à l’édition d’octobre 2026.</li></ul>',
    licence: '<p>L’achat autorise la lecture, l’impression et l’utilisation professionnelle des méthodes par l’acheteur. Les prompts peuvent être adaptés à ses propres tâches et livrables.</p><p>La revente, le partage public, la distribution collective des fichiers ou leur intégration dans un autre produit commercial nécessitent une autorisation de SACKO CONCEPT, sous réserve des droits impératifs applicables.</p>',
    support: 'sackoconcept8@gmail.com',
    supportText: 'Pour une question liée au téléchargement ou au contenu acheté, indiquez votre référence de commande et le fichier concerné. Aucun coaching individuel ou abonnement de support n’est inclus.',
    faqs: [
      ['Est-ce une formation vidéo ?', 'Le pack comprend cinq PDF et un fichier d’instructions. Il ne comprend pas de cours vidéo ni de séance en direct.'],
      ['Dois-je déjà maîtriser l’IA ?', 'Non. Le manuel commence par les bases et progresse vers des situations de travail, des contrôles et des exercices.'],
      ['Faut-il payer un abonnement d’IA ?', 'Les exercices textuels ne nécessitent pas tous une offre payante. L’accès aux fonctions de fichiers ou à certains outils dépend du service que vous utilisez ; aucun abonnement n’est fourni dans le pack.'],
      ['Puis-je copier les prompts ?', 'Oui. Le texte des PDF est sélectionnable. Remplacez les champs, utilisez des données autorisées et vérifiez toujours la réponse avant diffusion.'],
      ['Le guide est-il en français ?', 'Oui. Le manuel, les bonus, les exercices et les instructions de ce pack sont en français.']
    ]
  },
  {
    id: 'pack-rh', language: 'en', name: 'HR & Business Documents Pack V3', short: 'HR & Business Documents Pack', type: 'rh', tag: 'HR documents · English edition',
    edition: 'English files · Version 3.0', cover: 'assets/pack-rh-v3-cover.webp', coverWidth: 1254, coverHeight: 1254,
    artClass: 'pack', coverCaption: 'Product presentation visual. Actual file extracts are shown below.',
    headline: 'Your HR documents.<br><em>Better organised.</em>',
    description: 'An English-language HR pack with 33 Word templates, 3 Excel systems in blank and demo editions, PDF guides and a video walkthrough. Licensed for one organisation.',
    lead: 'Bring document control, recruitment, onboarding and performance reviews together in a customisable working library. The HR & Business Documents Pack is supplied entirely in English.',
    checks: ['33 Word templates and a company profile form', '3 Excel systems, each in blank and demo editions', 'Internal-use licence for one organisation'],
    facts: [['33 templates', 'for Word documents'], ['6 Excel files', '3 systems · blank + demo'], ['500 rows', 'prepared per input register'], ['English', 'language of all supplied files']],
    benefitTitle: 'One working library.<br>Three areas of HR.',
    benefitIntro: 'Customise the fields, enter your information and use the fictional examples to understand the documents before putting them into use.',
    benefits: [
      ['HR document control', 'Track employees, documents, review dates, deadlines, policies and administrative tasks in HR Document Control Center.'],
      ['Recruitment and onboarding', 'Organise vacancies, candidates, assessments and onboarding tasks with Recruitment and Onboarding and its tracking views.'],
      ['Performance reviews and follow-up', 'Prepare reviews, goals, training and follow-up actions with Performance and People Operations and the related Word templates.']
    ],
    contentIntro: 'Version 3.0 includes the three tracking systems, document library and supporting resources listed below. All supplied files are in English.',
    contents: [
      ['3 Excel systems in two editions', '6 XLSX files · BLANK + DEMO', 'HR Document Control, Recruitment & Onboarding and Employee Performance. Each input register has 500 prepared rows, with formulas, checks and chart sources set up for that capacity.'],
      ['33 document templates', '33 editable DOCX files', 'Recruitment, onboarding, administration, performance reviews and internal policies. Nine detailed policies and procedures span four pages each; 24 shorter templates include targeted instructions and a fictional completed example.'],
      ['Company customisation resources', '1 additional DOCX · PDF guide', 'Company_Profile is the 34th Word file in the pack. Use it to plan manual changes to your company name, logo, contacts, responsible people and documented adaptations.'],
      ['Guides and reference documents', '6 PDFs, including the free preview', 'User guide, document catalogue, preview, customisation guide, single-organisation licence and troubleshooting FAQ.'],
      ['Video walkthrough', 'MP4 · 76 seconds · Captioned, no audio', 'A presentation of rendered views from the actual files, with a transcript and SRT subtitles. It is not a recording of live work in Microsoft Excel.']
    ],
    preview: 'assets/pack-rh-apercu.pdf', previewName: 'Preview the files', previewMeta: 'PDF · 15-page preview · No sign-up required',
    previewIntro: 'Explore the dashboards, customisation guidance and sample Word documents. This preview uses files from version 3.0.',
    previewImages: [
      ['assets/pack-rh-dashboard.webp', 'Actual dashboard: HR Document Control Center.'],
      ['assets/pack-rh-word.webp', 'Actual extract from a Word policy included in the pack.']
    ],
    previewBullets: ['Screenshots of the supplied files, using fictional data.', 'A list of all 33 templates and their file formats.', 'Requirements, capacity and limitations explained before purchase.'],
    audiences: 'Small businesses, administrative assistants and HR professionals working in English. Consultants may support one organisation covered by its licence; each additional entity requires a separate licence.',
    requirements: '<p>Desktop Microsoft Excel and Word are recommended for the XLSX and DOCX files. You also need a PDF reader and an MP4 player. Microsoft Office software is not included.</p><p>Opening, editing and printing tests in desktop Microsoft Excel were not performed during preparation of the pack. Compatibility with your edition must be checked; compatibility with every software version or spreadsheet application is not guaranteed.</p>',
    limits: '<ul><li>All files are in English; a French edition is not included.</li><li>Each input register has 500 prepared rows. Expanding this capacity requires updating and testing the dependent ranges.</li><li>No macros, native slicers, cross-file synchronisation, automated reminders, external integrations or automatic logo insertion are included.</li><li>Seven sensitive templates are grouped for local review. The Employment Agreement Outline is a preparation brief, not a ready-to-sign contract.</li><li>Recruitment, disciplinary and termination documents must be adapted to the relevant country and reviewed by qualified people before use.</li></ul>',
    licence: '<p>One purchase covers one identified organisation or legal entity. It may customise the files, keep private working copies and use completed documents for its internal operations. There is no fixed expiry date for use of the purchased version.</p><p>Resale, sublicensing and public redistribution of source files are not permitted. Source files may not be supplied to an organisation outside the licence. Use for additional clients or entities requires separate licences or written permission.</p>',
    support: 'contact@sackoconcept.com',
    supportText: 'Technical support is available for 30 calendar days after purchase. The first substantive response is provided within three business days, Monday to Friday in UTC, excluding the day your request is received. This is not a guaranteed resolution time. Support covers access, instructions and reproducible defects in the original supplied files. Customisation, data entry, integrations and legal advice are excluded.',
    faqs: [
      ['What language are the files in?', 'All Word files, Excel workbooks, guides, captions and instructions in this edition are in English.'],
      ['How many Excel systems are included?', 'Three distinct systems. Each is supplied in a blank edition and a demonstration edition, giving you six Excel files in total.'],
      ['Can I add my logo?', 'Yes, manually. Enter your company name in Company Setup in each workbook. Insert your logo using the software commands; changes do not automatically synchronise between files.'],
      ['Can I use these documents in any country?', 'They provide a starting point for adaptation. Universal legal compliance is not promised. Sensitive templates require qualified review for the relevant country and circumstances.'],
      ['Can I reuse the pack for all my clients?', 'The licence covers one organisation. Using the source collection for other clients or entities requires separate licences or written permission.'],
      ['What does support cover?', 'Support covers download difficulties, clarification of the instructions and reproducible defects in the original files. Bespoke services and individual HR decisions are excluded.']
    ]
  }
];

function commercialState(product) {
  const c = config[product.id];
  if (!c || !/^vente-[a-z0-9-]+-1tpe\.html$/.test(c.page)) throw new Error(`Invalid page for ${product.id}`);
  if (c.priceTtcEur !== null && !(typeof c.priceTtcEur === 'number' && Number.isFinite(c.priceTtcEur) && c.priceTtcEur > 0)) throw new Error(`Invalid TTC price: ${product.id}`);
  if (c.vatFrancePercent !== null && !(typeof c.vatFrancePercent === 'number' && Number.isFinite(c.vatFrancePercent) && c.vatFrancePercent >= 0 && c.vatFrancePercent <= 100)) throw new Error(`Invalid VAT rate: ${product.id}`);
  if (c.checkoutUrl !== null) {
    const url = new URL(c.checkoutUrl);
    if (url.protocol !== 'https:' || !['www.1tpe.net','1tpe.net'].includes(url.hostname) || url.pathname !== '/commander.php' || url.searchParams.get('u') !== 'sackoconcept' || !/^[1-9][0-9]*$/.test(url.searchParams.get('p') || '') || url.username || url.password || url.hash) throw new Error(`Use the official product checkout URL: ${product.id}`);
  }
  const ready = c.priceTtcEur !== null && c.vatFrancePercent !== null && c.checkoutUrl !== null && c.deliveryConfigured === true;
  return { ...c, ready };
}

function row([title, meta, description]) {
  return `<div class="content-row"><div><h3>${esc(title)}</h3><span class="file-meta">${esc(meta)}</span></div><p>${esc(description)}</p></div>`;
}

function render(product) {
  const c = commercialState(product), url = origin + c.page;
  const english = product.language === 'en';
  const t = (fr, en) => english ? en : fr;
  const money = value => english ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(value) : euro(value);
  const vat = value => english ? new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(value) : number(value);
  const checkout = (text, className='btn gold') => `<a class="${className}" href="${esc(c.checkoutUrl)}" rel="nofollow" target="_top">${esc(text)} <span aria-hidden="true">↗</span></a>`;
  const previewButton = `<a class="btn ${c.ready ? 'outline' : 'gold'} pdf-link" href="${product.preview}" target="_blank" rel="noopener">${esc(product.previewName)}</a>`;
  const price = c.ready ? `${money(c.priceTtcEur)} ${t('TTC', 'incl. VAT')}` : t('Ouverture prochaine', 'Coming soon');
  const heroCommercial = c.ready
    ? `<p class="hero-price">${esc(price)}<small>${t(`France · TVA ${vat(c.vatFrancePercent)} % comprise · Paiement unique`, `France · Includes ${vat(c.vatFrancePercent)}% VAT · One-time payment`)}</small></p>`
    : `<p class="pending-chip">${t('La commande sur 1TPE sera ouverte prochainement.', 'Ordering on 1TPE will open soon.')}</p>`;
  const orderCommercial = c.ready
    ? `<span class="price-label">${t('Paiement unique · France', 'One-time payment · France')}</span><strong class="price">${esc(price)}</strong><p class="small">${t(`TVA française de ${vat(c.vatFrancePercent)} % comprise. Le montant applicable à votre pays est présenté sur 1TPE avant paiement.`, `Includes French VAT at ${vat(c.vatFrancePercent)}%. The amount applicable to your country is displayed on 1TPE before payment.`)}</p>${checkout(t('Acheter sur 1TPE', 'Buy on 1TPE'))}<p class="small" style="margin-top:15px">${t('Le paiement s’ouvre directement sur le domaine 1TPE.', 'Checkout opens directly on the 1TPE domain.')}</p>`
    : `<span class="price-label">${t('Disponibilité', 'Availability')}</span><strong class="price">${t('Ouverture prochaine', 'Coming soon')}</strong><p class="small" style="margin-top:15px">${t('La commande de ce produit sur 1TPE est en préparation. Vous pouvez déjà consulter son contenu et son aperçu gratuit.', 'Ordering this product on 1TPE is being prepared. You can already explore the contents and download the free preview.')}</p>`;
  const delivery = c.ready
    ? t('Après validation du paiement, suivez le lien d’accès remis par 1TPE et téléchargez le fichier ZIP du pack. Décompressez-le pour retrouver les fichiers annoncés. Conservez une copie sur votre appareil : l’accès proposé par 1TPE est limité à 48 heures.', 'After payment is confirmed, follow the access link provided by 1TPE and download the pack as a ZIP file. Extract the ZIP to access the listed files. Keep a copy on your device: the access window provided by 1TPE is limited to 48 hours.')
    : t('Lors de l’ouverture de la vente sur 1TPE, le pack sera remis au format ZIP à télécharger après paiement validé. L’accès de téléchargement et ses instructions seront communiqués par 1TPE. La commande est actuellement en préparation.', 'When sales open on 1TPE, the pack will be delivered as a ZIP download after payment is confirmed. 1TPE will provide the download access and instructions. Ordering is currently being prepared.');
  const structured = {
    '@context':'https://schema.org', '@type':'Product', name:product.name, description:product.description,
    image:origin+product.cover, brand:{'@type':'Brand',name:'SACKO CONCEPT'}, url,
    ...(c.ready ? { offers:{'@type':'Offer',url:c.checkoutUrl,price:c.priceTtcEur.toFixed(2),priceCurrency:'EUR',availability:'https://schema.org/InStock'} } : {})
  };
  return `<!doctype html>
<html lang="${t('fr', 'en')}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(product.name)} | SACKO CONCEPT</title>
<meta name="description" content="${esc(product.description)}">
<meta name="robots" content="${c.ready ? 'index,follow' : 'noindex,follow'}">
<meta name="theme-color" content="#081b13">
<link rel="canonical" href="${url}"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="1tpe-product-pages.css">
<meta property="og:type" content="product"><meta property="og:locale" content="${t('fr_FR', 'en_GB')}">
<meta property="og:title" content="${esc(product.name)} — SACKO CONCEPT"><meta property="og:description" content="${esc(product.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin+product.cover}">
<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>
</head>
<body>
<a class="skip" href="#main">${t('Aller au contenu', 'Skip to content')}</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="${t('SACKO CONCEPT, accueil', 'SACKO CONCEPT, home')}"><img src="assets/sacko-premium-logo.png" width="48" height="48" alt=""><span>SACKO<br><b>CONCEPT</b></span></a><nav class="nav" aria-label="${t('Navigation principale', 'Main navigation')}"><a class="optional" href="#contenu">${t('Contenu', 'Contents')}</a><a class="optional" href="#conditions">${t('Conditions', 'Terms')}</a><a href="/catalogue-1tpe.html">${t('Catalogue', 'Catalogue')}</a></nav></div></header>
<main id="main">
<section class="hero"><div class="wrap"><div class="breadcrumb"><a href="/catalogue-1tpe.html">${t('Collection SACKO CONCEPT', 'SACKO CONCEPT collection')}</a><span aria-hidden="true">/</span><span>${esc(product.short)}</span></div><div class="hero-grid"><div><p class="eyebrow">${esc(product.tag)}</p><span class="edition">${esc(product.edition)}</span><h1>${product.headline}</h1><p class="lead">${esc(product.lead)}</p><ul class="hero-checks">${product.checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${heroCommercial}<div class="buttons">${c.ready ? checkout(t('Acheter sur 1TPE', 'Buy on 1TPE')) : ''}${previewButton}<a class="btn outline" href="#contenu">${t('Explorer le contenu ↓', 'Explore the contents ↓')}</a></div></div><figure class="hero-art ${product.artClass}"><img src="${product.cover}" alt="${esc(product.name)}" width="${product.coverWidth}" height="${product.coverHeight}" fetchpriority="high"><figcaption>${esc(product.coverCaption)}</figcaption></figure></div></div></section>
<div class="facts"><div class="wrap facts-inner">${product.facts.map(([a,b])=>`<div class="fact"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('')}</div></div>
<section class="section"><div class="wrap"><div class="section-heading"><p class="eyebrow">${t('Ce que vous pouvez en faire', 'What you can do with it')}</p><h2>${product.benefitTitle}</h2><p>${esc(product.benefitIntro)}</p></div><div class="cards">${product.benefits.map(([a,b],i)=>`<article class="card"><span class="card-number">0${i+1}</span><h3>${esc(a)}</h3><p>${esc(b)}</p></article>`).join('')}</div></div></section>
<section class="section alt" id="contenu"><div class="wrap"><div class="section-heading"><p class="eyebrow">${t('Le contenu exact', 'The full contents')}</p><h2>${t('Voici ce que comprend<br>votre téléchargement.', 'Here is what comes<br>with your download.')}</h2><p>${esc(product.contentIntro)}</p></div><div class="content-table">${product.contents.map(row).join('')}</div><p class="included-note">${t('Produit numérique uniquement. Aucun article physique ne sera expédié.', 'Digital product only. No physical items will be shipped.')}</p></div></section>
<section class="section" id="apercu"><div class="wrap preview-grid"><div class="preview-images ${product.previewImages.length===1?'single':''}">${product.previewImages.map(([img,caption])=>`<figure class="preview-image"><a href="${img}" target="_blank" rel="noopener" aria-label="${t('Agrandir :', 'Enlarge:')} ${esc(caption)}"><img src="${img}" alt="${esc(caption)}" width="990" height="1400" loading="lazy"></a><figcaption>${esc(caption)}</figcaption></figure>`).join('')}</div><div class="description"><p class="eyebrow">${t('Avant de choisir', 'Before you choose')}</p><h2>${t('Regardez à l’intérieur.', 'Take a look inside.')}</h2><p>${esc(product.previewIntro)}</p><ul class="tick-list">${product.previewBullets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="buttons"><a class="btn pdf-link" href="${product.preview}" target="_blank" rel="noopener">${esc(product.previewName)}</a></div><p class="preview-note" style="margin-top:15px">${esc(product.previewMeta)}</p></div></div></section>
<section class="section alt"><div class="wrap"><div class="section-heading"><p class="eyebrow">${t('Démarrer simplement', 'Getting started')}</p><h2>${t('Un pack à votre rythme.', 'Work at your own pace.')}</h2><p>${esc(product.audiences)}</p></div><div class="steps"><article class="step"><h3>${t('Consultez l’aperçu', 'Browse the preview')}</h3><p>${t('Vérifiez le contenu, la langue, les formats et les prérequis avant de commander.', 'Check the contents, language, file formats and requirements before ordering.')}</p></article><article class="step"><h3>${t('Récupérez vos fichiers', 'Download your files')}</h3><p>${t('Téléchargez le ZIP remis après votre achat, décompressez-le et conservez votre copie.', 'Download the ZIP supplied after purchase, extract the files and keep your copy.')}</p></article><article class="step"><h3>${t('Personnalisez et pratiquez', 'Customise and explore')}</h3><p>${t('Lisez les instructions et travaillez d’abord sur les exemples fournis ou sur une copie de vos documents.', 'Read the instructions and start with the supplied examples or a working copy of your documents.')}</p></article></div></div></section>
<section class="section" id="conditions"><div class="wrap"><div class="section-heading"><p class="eyebrow">${t('Les informations essentielles', 'Essential information')}</p><h2>${t('Formats, usage et assistance.', 'Formats, usage and support.')}</h2></div><div class="terms-grid"><article class="terms-box"><h3>${t('Logiciels et prérequis', 'Software and requirements')}</h3>${product.requirements}</article><article class="terms-box"><h3>${t('Licence d’utilisation', 'Usage licence')}</h3>${product.licence}</article><article class="terms-box"><h3>${t('Livraison numérique', 'Digital delivery')}</h3><p>${esc(delivery)}</p><p>${t('Produit à télécharger ; aucun envoi postal.', 'Downloadable product; no postal delivery.')}</p></article><article class="terms-box"><h3>${t('Assistance SACKO CONCEPT', 'SACKO CONCEPT support')}</h3><p><a href="mailto:${product.support}">${product.support}</a></p><p>${esc(product.supportText)}</p></article></div><aside class="notice"><h3>${t('À savoir avant utilisation', 'Before using the pack')}</h3>${product.limits}</aside></div></section>
<section class="section alt"><div class="wrap"><div class="section-heading"><p class="eyebrow">${t('Vos questions', 'Your questions')}</p><h2>${t('Avant de commander.', 'Before you order.')}</h2></div><div class="faq">${product.faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<details><summary>${t('Quelles conditions s’appliquent à un achat sur 1TPE ?', 'Which terms apply to purchases on 1TPE?')}</summary><p>${t('Le paiement, la facture et les demandes de remboursement sont encadrés par les <a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">conditions de vente de 1TPE</a>, qui prévoient notamment une garantie contractuelle « satisfait ou remboursé » de 30 jours. Les droits d’utilisation du pack restent ceux précisés dans sa licence.', 'Payment, invoicing and refund requests are governed by the <a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">1TPE terms of sale</a>, which include a contractual 30-day money-back guarantee. Rights to use the pack remain subject to its licence.')}</p></details></div></div></section>
<section class="section"><div class="wrap"><div class="order-panel" id="commande"><div><p class="eyebrow">SACKO CONCEPT</p><h2>${esc(product.name)}</h2><p>${esc(product.description)}</p><p class="small">${t('Contenu vérifié sur l’archive livrée de l’édition indiquée.', 'Contents checked against the supplied archive for this edition.')}</p></div><div class="order-box">${orderCommercial}</div></div><a class="back-link" href="/catalogue-1tpe.html">${t('← Découvrir les autres ressources SACKO CONCEPT', '← Explore more SACKO CONCEPT resources')}</a></div></section>
</main>
<footer class="footer"><div class="wrap footer-inner"><span>© 2026 SACKO CONCEPT · Hawa Sacko</span><div class="footer-links"><a href="/catalogue-1tpe.html">${t('Catalogue', 'Catalogue')}</a><a href="/legal.html">${t('Mentions et confidentialité', 'Legal and privacy')}</a><a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">${t('Conditions 1TPE', '1TPE terms')}</a><a href="mailto:${product.support}">${t('Assistance', 'Support')}</a></div></div></footer>
</body></html>
`;
}

export async function renderNew1TpeProducts() {
  for (const product of products) await writeFile(resolve(root, config[product.id].page), render(product));
  const entries = products.map(product => {
    const c = commercialState(product);
    const english = product.language === 'en';
    const price = english ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(c.priceTtcEur) + ' incl. VAT' : euro(c.priceTtcEur) + ' TTC';
    return {
      type:product.type,tag:product.tag,name:product.name,desc:product.description,
      features:product.id==='ia-bureau' ? ['Manuel de 80 pages','100 prompts bonus','5 PDF en français'] : ['33 Word templates','3 Excel systems','English files'],
      price:c.ready?price:(english?'Coming soon':'Prochainement'),priceLabel:c.ready?(english?'Price incl. VAT · France':'Prix TTC France'):(english?'Availability':'Disponibilité'),img:product.cover,page:c.page,pay:c.ready?c.checkoutUrl:null,
      ...(english ? { lang:'en' } : {})
    };
  });
  const cataloguePath=resolve(root,'catalogue-1tpe.html');
  const catalogue=await readFile(cataloguePath,'utf8');
  const start='/* NOUVEAUTES_1TPE_START */',end='/* NOUVEAUTES_1TPE_END */';
  if(!catalogue.includes(start)||!catalogue.includes(end))throw new Error('Catalogue integration markers missing');
  const content=entries.map(entry=>JSON.stringify(entry)).join(',\n');
  await writeFile(cataloguePath,catalogue.replace(new RegExp(start.replaceAll('*','\\*')+'[\\s\\S]*?'+end.replaceAll('*','\\*')),start+'\n'+content+'\n'+end));
  console.log(`Rendered ${products.length} 1TPE product pages. Commercial activation: ${products.map(p=>p.id+'='+commercialState(p).ready).join(', ')}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await renderNew1TpeProducts();
