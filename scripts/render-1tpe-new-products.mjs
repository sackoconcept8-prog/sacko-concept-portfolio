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
    id: 'pack-rh', name: 'HR & Business Documents Pack V3', short: 'HR & Business Documents Pack', type: 'rh',
    tag: 'Pack RH et documents professionnels · Fichiers en anglais',
    edition: 'Présentation en français · Contenu 100 % anglais · Version 3.0',
    cover: 'assets/pack-rh-v3-cover.webp', coverWidth: 1254, coverHeight: 1254,
    artClass: 'pack', coverCaption: 'Visuel du produit en anglais. Des extraits réels des fichiers figurent plus bas.',
    headline: 'Vos documents RH.<br><em>Mieux organisés.</em>',
    description: 'Pack de ressources RH en anglais : 33 modèles Word modifiables, 3 systèmes Excel en versions vierge et démonstration, guides PDF et vidéo. Licence pour une organisation.',
    lead: 'Organisez le suivi des documents RH, le recrutement, l’intégration et les évaluations dans un seul ensemble personnalisable. Cette page est en français, mais tous les fichiers livrés sont exclusivement en anglais.',
    checks: ['33 modèles Word modifiables et une fiche de personnalisation de l’entreprise', '3 systèmes Excel, chacun en version vierge et démonstration', 'Fichiers exclusivement en anglais · Licence interne pour une organisation'],
    facts: [['33 modèles', 'documents Word modifiables'], ['6 fichiers Excel', '3 systèmes · vierge + démo'], ['500 lignes', 'préparées par registre de saisie'], ['100 % anglais', 'langue de tous les fichiers livrés']],
    benefitTitle: 'Une seule bibliothèque de travail.<br>Trois domaines RH.',
    benefitIntro: 'Personnalisez les champs, renseignez vos informations et appuyez-vous sur les exemples fictifs pour comprendre chaque document avant utilisation.',
    benefits: [
      ['Contrôle des documents RH', 'Suivez les salariés, les documents, les dates de révision, les échéances, les politiques internes et les tâches administratives avec HR Document Control Center.'],
      ['Recrutement et intégration', 'Organisez les postes, les candidatures, les évaluations et les étapes d’intégration avec Recruitment and Onboarding.'],
      ['Évaluations et suivi du personnel', 'Préparez les évaluations, les objectifs, la formation et les actions de suivi avec Performance and People Operations et les modèles Word correspondants.']
    ],
    contentIntro: 'L’édition V3 contient les outils RH, la bibliothèque documentaire et les ressources d’accompagnement détaillés ci-dessous. Tous les fichiers sont rédigés en anglais ; il n’y a pas de traduction française.',
    contents: [
      ['3 systèmes Excel en deux versions', '6 fichiers XLSX · BLANK + DEMO', 'HR Document Control, Recruitment & Onboarding et Employee Performance. Chaque registre de saisie comprend 500 lignes préparées, avec formules, contrôles et sources de graphiques prévus pour cette capacité.'],
      ['33 modèles de documents Word', '33 fichiers DOCX modifiables', 'Recrutement, intégration, administration, évaluations et politiques internes. Neuf politiques et procédures détaillées comptent quatre pages chacune ; 24 modèles plus courts comportent des instructions et des exemples fictifs remplis.'],
      ['Ressources de personnalisation', '1 fichier DOCX supplémentaire · Guide PDF', 'Company_Profile est le 34e fichier Word du pack. Il aide à préparer les modifications manuelles : nom de l’entreprise, logo, coordonnées, responsables et adaptations nécessaires.'],
      ['Guides et documents de référence', '6 PDF, dont l’aperçu gratuit', 'Guide utilisateur, catalogue des documents, aperçu, guide de personnalisation, licence pour une organisation et foire aux questions de dépannage.'],
      ['Présentation vidéo', 'MP4 · 76 secondes · Sous-titres, sans audio', 'Présentation d’extraits réellement produits à partir des fichiers, accompagnée d’une transcription et de sous-titres SRT. Ce n’est pas une démonstration de manipulations en direct dans Excel.']
    ],
    preview: 'assets/pack-rh-apercu.pdf', previewName: 'Consulter l’aperçu gratuit', previewMeta: 'PDF · Aperçu de 15 pages · Sans inscription',
    previewIntro: 'Découvrez les tableaux de bord, les indications de personnalisation et des exemples de documents Word. Cet aperçu présente de vrais fichiers de la version 3.0, en anglais.',
    previewImages: [
      ['assets/pack-rh-dashboard.webp', 'Extrait réel du tableau de bord HR Document Control Center (anglais).'],
      ['assets/pack-rh-word.webp', 'Extrait réel d’une politique Word comprise dans le pack (anglais).']
    ],
    previewBullets: ['Captures réelles des fichiers avec données fictives.', 'Liste des 33 modèles et de leurs formats.', 'Prérequis, capacité et limites présentés avant achat.'],
    audiences: 'Pour les PME, assistants administratifs et professionnels RH travaillant en anglais. Un consultant peut accompagner une organisation couverte par sa licence ; toute entité supplémentaire requiert une licence distincte.',
    requirements: '<p>Microsoft Excel et Word pour ordinateur sont recommandés pour utiliser les fichiers XLSX et DOCX. Un lecteur PDF et un lecteur MP4 sont également nécessaires. Les logiciels Microsoft Office ne sont pas inclus.</p><p>Les essais d’ouverture, de modification et d’impression dans Microsoft Excel pour ordinateur n’ont pas été réalisés pendant la préparation de ce pack. Il faut vérifier la compatibilité avec votre version ; aucune compatibilité universelle n’est garantie.</p>',
    limits: '<ul><li><strong>Tous les fichiers sont en anglais : aucune édition française n’est incluse.</strong></li><li>Chaque registre de saisie contient 500 lignes préparées. Une extension nécessite de modifier et tester les plages dépendantes.</li><li>Pas de macros, segments Excel natifs, synchronisation entre classeurs, rappels automatiques, intégrations externes ou insertion automatique du logo.</li><li>Sept modèles sensibles sont regroupés pour révision locale. Employment Agreement Outline est une trame préparatoire, non un contrat prêt à signer.</li><li>Les documents de recrutement, de discipline et de rupture de contrat exigent une adaptation au pays et, si nécessaire, un contrôle par des professionnels qualifiés.</li></ul>',
    licence: '<p>Un achat autorise une organisation ou entité juridique identifiée à personnaliser les fichiers, conserver ses copies de travail privées et utiliser les documents finalisés dans ses activités internes. La version achetée ne comporte pas de date d’expiration d’utilisation.</p><p>La revente, la sous-licence et la redistribution publique des fichiers sources sont interdites. Les fichiers sources ne peuvent pas être transmis à une organisation non couverte par la licence. Pour d’autres clients ou entités, il faut obtenir des licences distinctes ou une autorisation écrite.</p>',
    support: 'contact@sackoconcept.com',
    supportText: 'Assistance technique pendant 30 jours calendaires après l’achat. Une première réponse de fond intervient sous trois jours ouvrés (du lundi au vendredi, heure UTC, hors jour de réception) ; il ne s’agit pas d’un délai garanti de résolution. L’assistance couvre l’accès, les explications et les défauts reproductibles des fichiers livrés. La personnalisation, la saisie de données, les intégrations et les conseils juridiques ne sont pas inclus.',
    faqs: [
      ['Dans quelle langue sont les fichiers ?', 'Tous les modèles Word, fichiers Excel, guides, sous-titres et instructions de ce pack sont exclusivement en anglais. La page de vente est en français pour présenter l’offre.'],
      ['Combien de systèmes Excel sont fournis ?', 'Trois systèmes distincts, chacun dans une version vierge et une version de démonstration, soit six fichiers Excel.'],
      ['Puis-je ajouter le logo de mon entreprise ?', 'Oui, manuellement. Renseignez le nom de votre entreprise dans Company Setup, puis insérez votre logo avec les fonctions du logiciel. Les modifications ne se synchronisent pas automatiquement entre fichiers.'],
      ['Puis-je utiliser ces documents dans tous les pays ?', 'Il s’agit de modèles de départ à personnaliser. Aucune conformité juridique universelle n’est promise. Les documents sensibles doivent être revus selon le pays et la situation.'],
      ['Puis-je utiliser le pack pour tous mes clients ?', 'La licence couvre une seule organisation. Toute utilisation des fichiers sources pour d’autres clients ou entités nécessite une licence distincte ou une autorisation écrite.'],
      ['Que couvre l’assistance ?', 'Les difficultés de téléchargement, la compréhension des instructions et les défauts reproductibles des fichiers d’origine. Les prestations sur mesure et les décisions RH individuelles ne sont pas comprises.']
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
  const hasCheckout = c.checkoutUrl !== null;
  const hasVerifiedPrice = c.priceTtcEur !== null && c.vatFrancePercent !== null;
  const ready = hasCheckout && hasVerifiedPrice && c.deliveryConfigured === true;
  return { ...c, hasCheckout, hasVerifiedPrice, ready };
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
  const price = c.hasVerifiedPrice ? `${money(c.priceTtcEur)} ${t('TTC', 'incl. VAT')}` : t('Tarif communiqué sur 1TPE', 'Price shown by 1TPE');
  const heroCommercial = c.ready
    ? `<p class="hero-price">${esc(price)}<small>${t(`France · TVA ${vat(c.vatFrancePercent)} % comprise · Paiement unique`, `France · Includes ${vat(c.vatFrancePercent)}% VAT · One-time payment`)}</small></p>`
    : c.hasCheckout ? `<p class="pending-chip">${t('Produit en attente de validation 1TPE · Le paiement sera possible après approbation · Pack fourni entièrement en anglais.', 'Pending 1TPE approval · English-language files')}</p>`
    : `<p class="pending-chip">${t('La commande sur 1TPE sera ouverte prochainement.', 'Ordering on 1TPE will open soon.')}</p>`;
  const orderCommercial = c.ready
    ? `<span class="price-label">${t('Paiement unique · France', 'One-time payment · France')}</span><strong class="price">${esc(price)}</strong><p class="small">${t(`TVA française de ${vat(c.vatFrancePercent)} % comprise. Le montant applicable à votre pays est présenté sur 1TPE avant paiement.`, `Includes French VAT at ${vat(c.vatFrancePercent)}%. The amount applicable to your country is displayed on 1TPE before payment.`)}</p>${checkout(t('Acheter sur 1TPE', 'Buy on 1TPE'))}<p class="small" style="margin-top:15px">${t('Le paiement s’ouvre directement sur le domaine 1TPE.', 'Checkout opens directly on the 1TPE domain.')}</p>`
    : c.hasCheckout ? `<span class="price-label">Lien de commande officiel 1TPE</span><strong class="price">${c.hasVerifiedPrice ? esc(price) : 'Vente en attente de validation'}</strong><p class="small" style="margin-top:15px">${c.hasVerifiedPrice ? `France : TVA ${vat(c.vatFrancePercent)} % comprise.` : 'Le prix TTC et la TVA applicables seront précisés dans le parcours de commande dès son activation.'} Le pack livré est entièrement en anglais.</p>${checkout('Commander sur 1TPE')}<p class="small" style="margin-top:15px">Le lien mène au produit officiel sur 1TPE. Jusqu’à l’approbation de la fiche par 1TPE, la plateforme peut afficher « Ce produit n’est pas en vente actuellement ».</p>`
    : `<span class="price-label">${t('Disponibilité', 'Availability')}</span><strong class="price">${t('Ouverture prochaine', 'Coming soon')}</strong><p class="small" style="margin-top:15px">${t('La commande de ce produit sur 1TPE est en préparation. Vous pouvez déjà consulter son contenu et son aperçu gratuit.', 'Ordering this product on 1TPE is being prepared. You can déjà consulter son contenu et son aperçu gratuit.')}</p>`;
  const delivery = c.ready
    ? t('Après validation du paiement, suivez le lien d’accès remis par 1TPE et téléchargez le fichier ZIP du pack. Décompressez-le pour retrouver les fichiers annoncés. Conservez une copie sur votre appareil : l’accès proposé par 1TPE est limité à 48 heures.', 'After payment is confirmed, follow the access link provided by 1TPE and download the pack as a ZIP file. Extract the ZIP to access the listed files. Keep a copy on your device: the access window provided by 1TPE is limited to 48 hours.')
    : t('Lors de l’ouverture de la vente sur 1TPE, le pack sera remis au format ZIP à télécharger après paiement validé. L’accès de téléchargement et ses instructions seront communiqués par 1TPE. La commande est actuellement en préparation.', 'When sales open on 1TPE, the pack will be delivered as a ZIP download after payment is confirmed. 1TPE will provide the download access and instructions. Ordering is currently being prepared.');
  const structured = {
    '@context':'https://schema.org', '@type':'Product', name:product.name, description:product.description,
    image:origin+product.cover, brand:{'@type':'Brand',name:'SACKO CONCEPT'}, url,
    ...(c.ready ? { offers:{'@type':'Offer',url:c.checkoutUrl,price:c.priceTtcEur.toFixed(2),priceCurrency:'EUR',availability:'https://schema.org/InStock'} } : {})
  };
  return `<!doctype html>
<html lang="${t('fr', 'en')}"${english ? ' translate="no" class="notranslate"' : ''}>
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
<section class="hero"><div class="wrap"><div class="breadcrumb"><a href="/catalogue-1tpe.html">${t('Collection SACKO CONCEPT', 'SACKO CONCEPT collection')}</a><span aria-hidden="true">/</span><span>${esc(product.short)}</span></div><div class="hero-grid"><div><p class="eyebrow">${esc(product.tag)}</p><span class="edition">${esc(product.edition)}</span><h1>${product.headline}</h1><p class="lead">${esc(product.lead)}</p><ul class="hero-checks">${product.checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${heroCommercial}<div class="buttons">${c.hasCheckout ? checkout(t('Commander sur 1TPE', 'Buy on 1TPE')) : ''}${previewButton}<a class="btn outline" href="#contenu">${t('Explorer le contenu ↓', 'Explore the contents ↓')}</a></div></div><figure class="hero-art ${product.artClass}"><img src="${product.cover}" alt="${esc(product.name)}" width="${product.coverWidth}" height="${product.coverHeight}" fetchpriority="high"><figcaption>${esc(product.coverCaption)}</figcaption></figure></div></div></section>
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
