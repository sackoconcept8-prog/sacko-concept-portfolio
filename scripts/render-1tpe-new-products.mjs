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
    edition: 'Édition française · Octobre 2026', cover: 'assets/ia-bureau-cover.webp', coverWidth: 1024, coverHeight: 1536,
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
    id: 'pack-rh', name: 'Pack RH & documents d’entreprise V3', short: 'Pack RH & documents d’entreprise', type: 'rh', tag: 'Documents RH · Édition anglaise',
    edition: 'Fichiers en anglais · Version 3.0', cover: 'assets/pack-rh-cover.webp', coverWidth: 990, coverHeight: 1400,
    artClass: 'pack', coverCaption: 'Couverture de l’aperçu gratuit du pack réel.',
    headline: 'Vos documents RH.<br><em>Mieux structurés.</em>',
    description: 'Pack RH en anglais : 33 modèles Word, 3 systèmes Excel en versions vierge et démonstration, guides PDF et vidéo de présentation. Licence pour une organisation.',
    lead: 'Réunissez le suivi documentaire, le recrutement, l’intégration et les évaluations dans une bibliothèque de travail personnalisable. Le pack « HR & Business Documents Pack » est livré en anglais.',
    checks: ['33 modèles Word et une fiche de configuration', '3 systèmes Excel, chacun en version vierge et démo', 'Licence d’usage interne pour une organisation'],
    facts: [['33 modèles', 'de documents Word'], ['6 fichiers Excel', '3 systèmes · vierge + démo'], ['500 lignes', 'préparées par registre de saisie'], ['Anglais', 'langue des fichiers livrés']],
    benefitTitle: 'Une base commune.<br>Trois suivis complémentaires.',
    benefitIntro: 'Personnalisez les champs, renseignez vos données et utilisez les exemples fictifs pour comprendre les documents avant leur mise en service.',
    benefits: [
      ['Suivi documentaire RH', 'Centralisez les salariés, documents, dates de révision, échéances, politiques et tâches administratives dans HR Document Control Center.'],
      ['Recrutement et intégration', 'Organisez les postes, candidats, évaluations et tâches d’accueil avec Recruitment and Onboarding, ses indicateurs et son suivi des personnes.'],
      ['Évaluations et actions', 'Préparez les revues, objectifs, formations et actions de suivi avec Performance and People Operations et les modèles Word associés.']
    ],
    contentIntro: 'La version 3.0 contient les trois systèmes de suivi, la bibliothèque de documents et les ressources d’utilisation ci-dessous. Tous les fichiers sont en anglais.',
    contents: [
      ['3 systèmes Excel en double édition', '6 fichiers XLSX · BLANK + DEMO', 'HR Document Control, Recruitment & Onboarding et Employee Performance. Chaque registre de saisie prévoit 500 lignes, avec formules, contrôles et sources de graphiques dans cette capacité.'],
      ['33 modèles de documents', '33 fichiers DOCX modifiables', 'Recrutement, intégration, administration, évaluation et politiques internes. Neuf politiques/procédures sont développées sur quatre pages ; 24 modèles courts comprennent des consignes ciblées et un exemple fictif rempli.'],
      ['La personnalisation de votre organisation', '1 DOCX supplémentaire · Guide PDF', 'Company_Profile est le 34e fichier Word du pack. Il accompagne la personnalisation manuelle : nom d’entreprise, logo, contacts, responsables et adaptations à documenter.'],
      ['Les guides et documents d’aide', '6 PDF, dont l’aperçu gratuit', 'Guide utilisateur, catalogue documentaire, aperçu, guide de personnalisation, licence pour une organisation et FAQ de dépannage.'],
      ['La démonstration du pack', 'MP4 · 76 secondes · Sous-titrée, sans audio', 'Une présentation de vues réellement rendues des fichiers, avec transcription et sous-titres SRT. Ce n’est pas un enregistrement de manipulation dans Microsoft Excel.']
    ],
    preview: 'assets/pack-rh-apercu.pdf', previewName: 'Voir les fichiers avant achat', previewMeta: 'PDF · Aperçu réel de 15 pages · Sans inscription',
    previewIntro: 'Examinez les tableaux de bord, la personnalisation et des exemples de documents Word. L’aperçu est issu des fichiers de la version 3.0.',
    previewImages: [
      ['assets/pack-rh-dashboard.webp', 'Tableau de bord réel : HR Document Control Center.'],
      ['assets/pack-rh-word.webp', 'Extrait réel d’une politique Word du pack.']
    ],
    previewBullets: ['Captures des fichiers livrés, avec données fictives.', 'Liste des 33 modèles et détail des formats.', 'Prérequis, capacité et limites présentés avant achat.'],
    audiences: 'Petites entreprises, assistants et responsables RH qui travaillent en anglais. Les consultants peuvent accompagner une organisation couverte par sa licence ; chaque autre entité nécessite une licence distincte.',
    requirements: '<p>Microsoft Excel et Word de bureau sont recommandés pour les fichiers XLSX et DOCX, ainsi qu’un lecteur PDF et un lecteur MP4. Les logiciels Office ne sont pas inclus.</p><p>Les tests d’ouverture, d’interaction et d’impression dans Microsoft Excel de bureau n’ont pas été exécutés dans la préparation du pack. La compatibilité avec votre édition doit être vérifiée ; aucune compatibilité universelle avec toutes les versions ou tous les tableurs n’est annoncée.</p>',
    limits: '<ul><li>Les fichiers sont en anglais ; aucune édition française n’est comprise.</li><li>La capacité est de 500 lignes préparées par registre. Toute extension nécessite de mettre à jour et tester les plages dépendantes.</li><li>Aucune macro, synchronisation entre fichiers, relance automatique, intégration externe ou insertion automatique du logo n’est incluse.</li><li>Sept modèles sensibles sont regroupés pour révision locale. L’Employment Agreement Outline est une trame de préparation, pas un contrat prêt à signer.</li><li>Les documents de recrutement, de discipline ou de rupture doivent être adaptés au pays et validés par les personnes compétentes avant usage.</li></ul>',
    licence: '<p>Une commande couvre une seule organisation ou entité juridique identifiée. Elle peut personnaliser les fichiers et utiliser les documents complétés pour ses opérations internes. L’usage de la version achetée n’a pas d’échéance fixe.</p><p>Les sources vierges ne peuvent pas être revendues, redistribuées publiquement ni remises à une organisation non couverte. Une utilisation pour plusieurs clients ou entités nécessite des licences distinctes ou une autorisation écrite.</p>',
    support: 'contact@sackoconcept.com',
    supportText: 'Assistance technique pendant les 30 jours calendaires suivant l’achat. Première réponse de fond sous trois jours ouvrés, du lundi au vendredi en UTC, hors jour de réception ; ce délai n’est pas un délai garanti de résolution. L’aide concerne l’accès, les instructions et les défauts reproductibles des fichiers fournis. Personnalisation, saisie, intégrations et conseil juridique sont exclus.',
    faqs: [
      ['Le pack est-il en français ?', 'Non. La page de présentation est en français, mais les fichiers Word, Excel, les guides et les sous-titres livrés dans cette version sont en anglais.'],
      ['Combien de systèmes Excel sont inclus ?', 'Trois systèmes distincts. Chacun est fourni en version vierge et en version de démonstration, soit six fichiers Excel au total.'],
      ['Puis-je insérer mon logo ?', 'Oui, manuellement. Le nom d’entreprise se renseigne dans Company Setup dans chaque classeur. Le logo s’insère avec les commandes du logiciel ; il n’existe pas de synchronisation automatique entre les fichiers.'],
      ['Puis-je utiliser les documents dans tous les pays ?', 'Ils constituent une base de travail à adapter. Aucune conformité juridique universelle n’est promise. Les modèles sensibles nécessitent une revue qualifiée pour le pays et la situation concernés.'],
      ['Puis-je réutiliser le pack pour tous mes clients ?', 'La licence couvre une organisation. L’utilisation de la collection source pour d’autres clients ou entités requiert des licences distinctes ou une autorisation écrite.'],
      ['Que couvre l’assistance ?', 'L’assistance couvre les difficultés de téléchargement, les explications sur les instructions et les défauts reproductibles des fichiers originaux. Les prestations sur mesure et les décisions RH individuelles sont exclues.']
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
  const checkout = (text, className='btn gold') => `<a class="${className}" href="${esc(c.checkoutUrl)}" rel="nofollow" target="_top">${esc(text)} <span aria-hidden="true">↗</span></a>`;
  const previewButton = `<a class="btn ${c.ready ? 'outline' : 'gold'} pdf-link" href="${product.preview}" target="_blank" rel="noopener">${esc(product.previewName)}</a>`;
  const price = c.ready ? `${euro(c.priceTtcEur)} TTC` : 'Ouverture prochaine';
  const heroCommercial = c.ready
    ? `<p class="hero-price">${esc(price)}<small>France · TVA ${number(c.vatFrancePercent)} % comprise · Paiement unique</small></p>`
    : '<p class="pending-chip">La commande sur 1TPE sera ouverte prochainement.</p>';
  const orderCommercial = c.ready
    ? `<span class="price-label">Paiement unique · France</span><strong class="price">${esc(price)}</strong><p class="small">TVA française de ${number(c.vatFrancePercent)} % comprise. Le montant applicable à votre pays est présenté sur 1TPE avant paiement.</p>${checkout('Acheter sur 1TPE')}<p class="small" style="margin-top:15px">Le paiement s’ouvre directement sur le domaine 1TPE.</p>`
    : '<span class="price-label">Disponibilité</span><strong class="price">Ouverture prochaine</strong><p class="small" style="margin-top:15px">La commande de ce produit sur 1TPE est en préparation. Vous pouvez déjà consulter son contenu et son aperçu gratuit.</p>';
  const delivery = c.ready
    ? 'Après validation du paiement, suivez le lien d’accès remis par 1TPE et téléchargez le fichier ZIP du pack. Décompressez-le pour retrouver les fichiers annoncés. Conservez une copie sur votre appareil : l’accès proposé par 1TPE est limité à 48 heures.'
    : 'Lors de l’ouverture de la vente sur 1TPE, le pack sera remis au format ZIP à télécharger après paiement validé. L’accès de téléchargement et ses instructions seront communiqués par 1TPE. La commande est actuellement en préparation.';
  const structured = {
    '@context':'https://schema.org', '@type':'Product', name:product.name, description:product.description,
    image:origin+product.cover, brand:{'@type':'Brand',name:'SACKO CONCEPT'}, url,
    ...(c.ready ? { offers:{'@type':'Offer',url:c.checkoutUrl,price:c.priceTtcEur.toFixed(2),priceCurrency:'EUR',availability:'https://schema.org/InStock'} } : {})
  };
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(product.name)} | SACKO CONCEPT</title>
<meta name="description" content="${esc(product.description)}">
<meta name="robots" content="${c.ready ? 'index,follow' : 'noindex,follow'}">
<meta name="theme-color" content="#081b13">
<link rel="canonical" href="${url}"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="1tpe-product-pages.css">
<meta property="og:type" content="product"><meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${esc(product.name)} — SACKO CONCEPT"><meta property="og:description" content="${esc(product.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin+product.cover}">
<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="SACKO CONCEPT, accueil"><img src="assets/sacko-premium-logo.png" width="48" height="48" alt=""><span>SACKO<br><b>CONCEPT</b></span></a><nav class="nav" aria-label="Navigation principale"><a class="optional" href="#contenu">Contenu</a><a class="optional" href="#conditions">Conditions</a><a href="/catalogue-1tpe.html">Catalogue</a></nav></div></header>
<main id="main">
<section class="hero"><div class="wrap"><div class="breadcrumb"><a href="/catalogue-1tpe.html">Collection SACKO CONCEPT</a><span aria-hidden="true">/</span><span>${esc(product.short)}</span></div><div class="hero-grid"><div><p class="eyebrow">${esc(product.tag)}</p><span class="edition">${esc(product.edition)}</span><h1>${product.headline}</h1><p class="lead">${esc(product.lead)}</p><ul class="hero-checks">${product.checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${heroCommercial}<div class="buttons">${c.ready ? checkout('Acheter sur 1TPE') : ''}${previewButton}<a class="btn outline" href="#contenu">Explorer le contenu ↓</a></div></div><figure class="hero-art ${product.artClass}"><img src="${product.cover}" alt="${esc(product.name)}" width="${product.coverWidth}" height="${product.coverHeight}" fetchpriority="high"><figcaption>${esc(product.coverCaption)}</figcaption></figure></div></div></section>
<div class="facts"><div class="wrap facts-inner">${product.facts.map(([a,b])=>`<div class="fact"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('')}</div></div>
<section class="section"><div class="wrap"><div class="section-heading"><p class="eyebrow">Ce que vous pouvez en faire</p><h2>${product.benefitTitle}</h2><p>${esc(product.benefitIntro)}</p></div><div class="cards">${product.benefits.map(([a,b],i)=>`<article class="card"><span class="card-number">0${i+1}</span><h3>${esc(a)}</h3><p>${esc(b)}</p></article>`).join('')}</div></div></section>
<section class="section alt" id="contenu"><div class="wrap"><div class="section-heading"><p class="eyebrow">Le contenu exact</p><h2>Voici ce que comprend<br>votre téléchargement.</h2><p>${esc(product.contentIntro)}</p></div><div class="content-table">${product.contents.map(row).join('')}</div><p class="included-note">Produit numérique uniquement. Aucun article physique ne sera expédié.</p></div></section>
<section class="section" id="apercu"><div class="wrap preview-grid"><div class="preview-images ${product.previewImages.length===1?'single':''}">${product.previewImages.map(([img,caption])=>`<figure class="preview-image"><a href="${img}" target="_blank" rel="noopener" aria-label="Agrandir : ${esc(caption)}"><img src="${img}" alt="${esc(caption)}" width="990" height="1400" loading="lazy"></a><figcaption>${esc(caption)}</figcaption></figure>`).join('')}</div><div class="description"><p class="eyebrow">Avant de choisir</p><h2>Regardez à l’intérieur.</h2><p>${esc(product.previewIntro)}</p><ul class="tick-list">${product.previewBullets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="buttons"><a class="btn pdf-link" href="${product.preview}" target="_blank" rel="noopener">${esc(product.previewName)}</a></div><p class="preview-note" style="margin-top:15px">${esc(product.previewMeta)}</p></div></div></section>
<section class="section alt"><div class="wrap"><div class="section-heading"><p class="eyebrow">Démarrer simplement</p><h2>Un pack à votre rythme.</h2><p>${esc(product.audiences)}</p></div><div class="steps"><article class="step"><h3>Consultez l’aperçu</h3><p>Vérifiez le contenu, la langue, les formats et les prérequis avant de commander.</p></article><article class="step"><h3>Récupérez vos fichiers</h3><p>Téléchargez le ZIP remis après votre achat, décompressez-le et conservez votre copie.</p></article><article class="step"><h3>Personnalisez et pratiquez</h3><p>Lisez les instructions et travaillez d’abord sur les exemples fournis ou sur une copie de vos documents.</p></article></div></div></section>
<section class="section" id="conditions"><div class="wrap"><div class="section-heading"><p class="eyebrow">Les informations essentielles</p><h2>Formats, usage et assistance.</h2></div><div class="terms-grid"><article class="terms-box"><h3>Logiciels et prérequis</h3>${product.requirements}</article><article class="terms-box"><h3>Licence d’utilisation</h3>${product.licence}</article><article class="terms-box"><h3>Livraison numérique</h3><p>${esc(delivery)}</p><p>Produit à télécharger ; aucun envoi postal.</p></article><article class="terms-box"><h3>Assistance SACKO CONCEPT</h3><p><a href="mailto:${product.support}">${product.support}</a></p><p>${esc(product.supportText)}</p></article></div><aside class="notice"><h3>À savoir avant utilisation</h3>${product.limits}</aside></div></section>
<section class="section alt"><div class="wrap"><div class="section-heading"><p class="eyebrow">Vos questions</p><h2>Avant de commander.</h2></div><div class="faq">${product.faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<details><summary>Quelles conditions s’appliquent à un achat sur 1TPE ?</summary><p>Le paiement, la facture et les demandes de remboursement sont encadrés par les <a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">conditions de vente de 1TPE</a>, qui prévoient notamment une garantie contractuelle « satisfait ou remboursé » de 30 jours. Les droits d’utilisation du pack restent ceux précisés dans sa licence.</p></details></div></div></section>
<section class="section"><div class="wrap"><div class="order-panel" id="commande"><div><p class="eyebrow">SACKO CONCEPT</p><h2>${esc(product.name)}</h2><p>${esc(product.description)}</p><p class="small">Contenu vérifié sur l’archive livrée de l’édition indiquée.</p></div><div class="order-box">${orderCommercial}</div></div><a class="back-link" href="/catalogue-1tpe.html">← Découvrir les autres ressources SACKO CONCEPT</a></div></section>
</main>
<footer class="footer"><div class="wrap footer-inner"><span>© 2026 SACKO CONCEPT · Hawa Sacko</span><div class="footer-links"><a href="/catalogue-1tpe.html">Catalogue</a><a href="/legal.html">Mentions et confidentialité</a><a href="https://www.1tpe.com/CGV.pdf" target="_blank" rel="noopener">Conditions 1TPE</a><a href="mailto:${product.support}">Assistance</a></div></div></footer>
</body></html>
`;
}

export async function renderNew1TpeProducts() {
  for (const product of products) await writeFile(resolve(root, config[product.id].page), render(product));
  const entries = products.map(product => {
    const c = commercialState(product);
    return {
      type:product.type,tag:product.tag,name:product.name,desc:product.description,
      features:product.id==='ia-bureau' ? ['Manuel de 80 pages','100 prompts bonus','5 PDF en français'] : ['33 modèles Word','3 systèmes Excel','Fichiers en anglais'],
      price:c.ready?euro(c.priceTtcEur)+' TTC':'Prochainement',priceLabel:c.ready?'Prix TTC France':'Disponibilité',img:product.cover,page:c.page,pay:c.ready?c.checkoutUrl:null
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
