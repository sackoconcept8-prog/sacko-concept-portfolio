import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const rep = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const LOGICIELS = ['ilano', 'stockpro', 'securipro', 'nettopro', 'rhpro', 'btppro', 'phonepro'];
const NOMS_LOGICIELS: Record<string, [string, string]> = {
  ilano: ['Ilano', 'Ilano'], stockpro: ['Stock & Ventes', 'Inventory & Sales'], rhpro: ['RH Pro', 'HR Pro'], securipro: ['SécuriPro', 'SecuriPro'],
  nettopro: ['NettoPro', 'NettoPro'], btppro: ['BTP Pro', 'Construction Pro'], phonepro: ['PhonePro', 'PhonePro'],
};
// Modèles par secteur : logiciel principal, modules inclus d'office, nom affiché
const MODELES: Record<string, { logiciel: string; modules: Record<string, boolean>; nom: [string, string] }> = {
  commerce: { logiciel: 'stockpro', modules: {}, nom: ['Commerce', 'Retail'] },
  rh: { logiciel: 'rhpro', modules: {}, nom: ['Services / RH', 'Services / HR'] },
  hotel: { logiciel: 'ilano', modules: { reservation: true }, nom: ['Hôtellerie', 'Hospitality'] },
  ecole: { logiciel: 'ilano', modules: {}, nom: ['École privée', 'Private school'] },
  clinique: { logiciel: 'ilano', modules: { stock: true, reservation: true }, nom: ['Clinique', 'Clinic'] },
  immobilier: { logiciel: 'ilano', modules: {}, nom: ['Agence immobilière', 'Real estate agency'] },
  transport: { logiciel: 'ilano', modules: {}, nom: ['Transport / logistique', 'Transport / logistics'] },
  beaute: { logiciel: 'ilano', modules: { reservation: true }, nom: ['Salon de beauté', 'Beauty salon'] },
  nettoyage: { logiciel: 'ilano', modules: {}, nom: ['Nettoyage', 'Cleaning'] },
  securite: { logiciel: 'ilano', modules: {}, nom: ['Sécurité', 'Security'] },
  btp: { logiciel: 'ilano', modules: {}, nom: ['BTP', 'Construction'] },
  generique: { logiciel: 'ilano', modules: {}, nom: ['Mon activité', 'My business'] },
};
const EFFECTIFS: Record<string, number | null> = { '1-10': 10, '11-50': 50, '51-500': 500, '500+': null };
const couleur = (c: unknown, d: string) => typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c) ? c : d;
const slugifier = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'espace';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const SITE = 'https://sackoconcept.com';
const LOGO = `${SITE}/ilano/images/ilano-logo-email.png`;
const WHATSAPP = 'https://wa.me/15054642331';

function emailBienvenue(o: { en: boolean; prenom: string; entreprise: string; slug: string; fin: string; appli: string; email: string; ilano: boolean }) {
  const t = (fr: string, en: string) => (o.en ? en : fr);
  const lien = `${SITE}/plateforme/?e=${encodeURIComponent(o.slug)}${o.en ? '&lang=en' : '&lang=fr'}`;
  const dateFin = new Date(o.fin + 'T12:00:00Z').toLocaleDateString(o.en ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const etapes = o.ilano
    ? (o.en
      ? [['Add your customers and your services', 'Import your Excel file or add them one by one — your dashboard fills up right away.'],
         ['Send your first quote or invoice', 'With your logo and your details, ready to share on WhatsApp or print.'],
         ['Invite your team and install Ilano', 'Each person gets their own access. Open your link on your phone and choose “Add to Home Screen”.']]
      : [['Ajoutez vos clients et vos prestations', 'Importez votre fichier Excel ou ajoutez-les un par un : votre tableau de bord se remplit tout de suite.'],
         ['Envoyez votre premier devis ou votre première facture', 'À votre logo et à vos coordonnées, prêt à partager sur WhatsApp ou à imprimer.'],
         ['Invitez votre équipe et installez Ilano', 'Chacun reçoit son propre accès. Ouvrez votre lien sur téléphone puis « Ajouter à l’écran d’accueil ».']])
    : (o.en
      ? [['Add your products or your team', 'Your workspace is empty and ready: start with what matters most to you.'],
         ['Invite your staff', 'Each person gets their own access — by email, or with a username and PIN.'],
         ['Install Ilano on your phone', 'Open your workspace link on your phone and choose “Add to Home Screen”.']]
      : [['Ajoutez vos produits ou votre équipe', 'Votre espace est vide et prêt : commencez par ce qui compte le plus pour vous.'],
         ['Invitez vos collaborateurs', 'Chacun reçoit son propre accès, par e-mail ou avec un identifiant et un code PIN.'],
         ['Installez Ilano sur votre téléphone', 'Ouvrez le lien de votre espace sur votre téléphone puis « Ajouter à l’écran d’accueil ».']]);
  const sujet = t(`Bienvenue sur Ilano — l’espace ${o.entreprise} est prêt`, `Welcome to Ilano — your ${o.entreprise} workspace is ready`);
  const ligne = (k: string, v: string) => `<tr><td style="padding:10px 0;border-bottom:1px solid #E6ECE8;font-size:13px;color:#6B7A8C">${k}</td><td style="padding:10px 0;border-bottom:1px solid #E6ECE8;font-size:14px;font-weight:700;color:#071E3E;text-align:right">${v}</td></tr>`;
  const html = `<!doctype html><html lang="${o.en ? 'en' : 'fr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(sujet)}</title></head>
<body style="margin:0;padding:0;background:#F3F6F4;font-family:Helvetica,Arial,sans-serif;color:#071E3E">
<div style="display:none;max-height:0;overflow:hidden">${esc(t('Votre espace est prêt. Voici vos accès et vos premières étapes.', 'Your workspace is ready. Here are your access details and first steps.'))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6F4;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden">
<tr><td style="background:#E6F5EC;padding:28px 36px"><img src="${LOGO}" width="120" height="48" alt="Ilano" style="display:block;border:0"></td></tr>
<tr><td style="padding:36px 36px 8px">
<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0E7A50">${t('Inscription confirmée', 'You’re signed up')}</p>
<h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:#071E3E">${esc(t(`Bienvenue, ${o.prenom}.`, `Welcome, ${o.prenom}.`))}<br><span style="color:#0E7A50">${t('Tout est prêt.', 'You’re all set.')}</span></h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#4A5568">${esc(t(`L’espace de ${o.entreprise} a été créé, à votre nom et à vos couleurs. Votre essai gratuit de 14 jours commence aujourd’hui, sans carte bancaire.`, `The ${o.entreprise} workspace has been created, in your name and with your colors. Your 14-day free trial starts today — no credit card needed.`))}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:12px;background:#0E7A50"><a href="${lien}" style="display:inline-block;padding:15px 28px;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:12px">${t('Ouvrir mon espace', 'Open my workspace')} &rarr;</a></td></tr></table>
</td></tr>
<tr><td style="padding:28px 36px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAF9;border-radius:14px;padding:6px 20px">
${ligne(t('Entreprise', 'Company'), esc(o.entreprise))}
${ligne(t('Identifiant de connexion', 'Sign-in email'), esc(o.email))}
${ligne(t('Code entreprise', 'Company code'), esc(o.slug))}
${ligne(t('Votre espace', 'Your workspace'), esc(o.appli))}
<tr><td style="padding:10px 0;font-size:13px;color:#6B7A8C">${t('Fin de l’essai gratuit', 'Free trial ends')}</td><td style="padding:10px 0;font-size:14px;font-weight:700;color:#071E3E;text-align:right">${dateFin}</td></tr>
</table>
<p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#6B7A8C">${t('Le code entreprise sert à vos collaborateurs qui se connectent avec un identifiant et un code PIN.', 'Your company code is used by staff who sign in with a username and PIN.')}</p>
</td></tr>
<tr><td style="padding:28px 36px 8px">
<p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#071E3E">${t('Vos 3 premières étapes', 'Your first 3 steps')}</p>
${etapes.map((e, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
<td width="40" valign="top"><div style="width:28px;height:28px;border-radius:8px;background:#E6F5EC;color:#0E7A50;font-weight:700;font-size:14px;line-height:28px;text-align:center">${i + 1}</div></td>
<td valign="top"><p style="margin:2px 0 2px;font-size:14px;font-weight:700;color:#071E3E">${esc(e[0])}</p><p style="margin:0;font-size:13px;line-height:1.55;color:#4A5568">${esc(e[1])}</p></td></tr></table>`).join('')}
</td></tr>
<tr><td style="padding:12px 36px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E6ECE8"><tr><td style="padding-top:20px;font-size:13px;line-height:1.6;color:#4A5568">
${t('Une question ? Notre équipe vous répond', 'Questions? Our team is here for you')} :
<a href="${WHATSAPP}" style="color:#0E7A50;font-weight:700;text-decoration:none">WhatsApp</a> ·
<a href="mailto:contact@sackoconcept.com" style="color:#0E7A50;font-weight:700;text-decoration:none">contact@sackoconcept.com</a>
</td></tr></table>
</td></tr>
</table>
<p style="margin:20px 0 0;font-size:11px;line-height:1.6;color:#8A96A6;text-align:center">Ilano™ — ${t('un produit de', 'a product of')} SACKO CONCEPT LLC · Albuquerque, NM, USA<br>${t('Vous recevez cet e-mail car vous venez de créer un espace Ilano.', 'You’re receiving this email because you just created an Ilano workspace.')}</p>
</td></tr></table></body></html>`;
  const texte = [
    t(`Bienvenue, ${o.prenom}. Tout est prêt.`, `Welcome, ${o.prenom}. You’re all set.`), '',
    t(`L’espace de ${o.entreprise} a été créé. Essai gratuit jusqu’au ${dateFin}.`, `The ${o.entreprise} workspace has been created. Free trial until ${dateFin}.`), '',
    t('Ouvrir mon espace : ', 'Open my workspace: ') + lien,
    t('Identifiant : ', 'Sign-in email: ') + o.email,
    t('Code entreprise : ', 'Company code: ') + o.slug, '',
    t('Une question ? WhatsApp ', 'Questions? WhatsApp ') + WHATSAPP + ' · contact@sackoconcept.com',
  ].join('\n');
  return { sujet, html, texte };
}

async function envoyerBienvenue(o: Parameters<typeof emailBienvenue>[0] & { nom: string }) {
  const cle = Deno.env.get('BREVO_API_KEY');
  if (!cle) return 'non_configure';
  const { sujet, html, texte } = emailBienvenue(o);
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': cle, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Ilano', email: Deno.env.get('EMAIL_EXPEDITEUR') || 'contact@sackoconcept.com' },
      replyTo: { email: 'contact@sackoconcept.com', name: 'Ilano — SACKO CONCEPT' },
      to: [{ email: o.email, name: o.nom }],
      subject: sujet, htmlContent: html, textContent: texte,
      tags: ['ilano-bienvenue'],
    }),
  });
  if (!r.ok) { console.error('Brevo', r.status, await r.text()); return 'erreur'; }
  return 'envoye';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return rep({ erreur: 'Méthode non autorisée' }, 405);
  try {
    const b = await req.json();
    if (b.site_web) return rep({ ok: true }); // piège anti-robots
    const en = b.langue === 'en';
    const t = (fr: string, enTxt: string) => (en ? enTxt : fr);
    const entreprise = String(b.entreprise ?? '').trim();
    const nom = String(b.nom ?? '').trim();
    const email = String(b.email ?? '').trim().toLowerCase();
    const password = String(b.password ?? '');
    // Modèle du secteur (hôtel, école, clinique…) ; « commerce » et « rh » gardent StockPro / RH Pro
    let modele = typeof b.modele === 'string' && MODELES[b.modele] ? b.modele : '';
    if (!modele) modele = b.logiciel === 'rhpro' ? 'rh' : (b.logiciel === 'stockpro' || !b.logiciel) ? 'commerce' : 'generique';
    const M = MODELES[modele];
    const demande = LOGICIELS.includes(b.logiciel) ? b.logiciel : null;
    const logiciel = demande && !['stockpro', 'ilano', 'rhpro'].includes(demande) ? demande : M.logiciel;
    const effectif = typeof b.effectif === 'string' && b.effectif in EFFECTIFS ? b.effectif : null;
    if (entreprise.length < 2 || entreprise.length > 80) return rep({ erreur: t("Nom d'entreprise invalide", 'Invalid company name') }, 400);
    if (nom.length < 2 || nom.length > 80) return rep({ erreur: t('Votre nom est requis', 'Your name is required') }, 400);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return rep({ erreur: t('E-mail invalide', 'Invalid email') }, 400);
    if (password.length < 8) return rep({ erreur: t('Le mot de passe doit contenir au moins 8 caractères', 'Password must be at least 8 characters') }, 400);

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

    const { data: cree, error: errU } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { nom_complet: nom, langue: en ? 'en' : 'fr' } });
    if (errU) {
      const msg = /already|registered|exists/i.test(errU.message) ? t('Un compte existe déjà avec cet e-mail. Connectez-vous.', 'An account already exists with this email. Please sign in.') : errU.message;
      return rep({ erreur: msg }, 400);
    }
    const userId = cree.user.id;

    const base = slugifier(entreprise);
    let slug = base.length >= 2 ? base : base + '-e';
    for (let i = 2; i < 200; i++) {
      const { data } = await admin.from('espaces').select('id').eq('slug', slug).maybeSingle();
      if (!data) break;
      slug = `${base}-${i}`;
    }

    let logo_url: string | null = null;
    if (typeof b.logo === 'string' && b.logo.startsWith('data:image/')) {
      const m = b.logo.match(/^data:(image\/(png|jpeg|webp));base64,(.+)$/);
      if (m) {
        const bytes = Uint8Array.from(atob(m[3]), (c) => c.charCodeAt(0));
        if (bytes.length <= 2_000_000) {
          const chemin = `${slug}/logo-${Date.now()}.${m[2] === 'jpeg' ? 'jpg' : m[2]}`;
          const { error } = await admin.storage.from('logos').upload(chemin, bytes, { contentType: m[1], upsert: true });
          if (!error) logo_url = admin.storage.from('logos').getPublicUrl(chemin).data.publicUrl;
        }
      }
    }

    const devise = ['XOF', 'EUR', 'USD'].includes(b.devise) ? b.devise : 'XOF';
    const { data: espace, error: errE } = await admin.from('espaces').insert({
      slug, nom: entreprise, logo_url,
      couleur_principale: couleur(b.couleur_principale, '#0E7A50'),
      couleur_secondaire: couleur(b.couleur_secondaire, '#EAF7F0'),
      langue: en ? 'en' : 'fr', devise,
      pays: b.pays ? String(b.pays).slice(0, 60) : null,
      secteur: b.secteur ? String(b.secteur).slice(0, 60) : null,
      telephone: b.telephone ? String(b.telephone).slice(0, 30) : null,
      modele, effectif, modules: M.modules,
      reglages: { delai_paiement: 15, tva: 0 },
    }).select().single();
    if (errE) { console.error(errE); await admin.auth.admin.deleteUser(userId); return rep({ erreur: t("Création de l'espace impossible", 'Could not create the workspace') }, 500); }

    await admin.from('membres').insert({ espace_id: espace.id, user_id: userId, nom_complet: nom, role: 'proprietaire', telephone: espace.telephone });
    const fin = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
    const employes_max = effectif ? EFFECTIFS[effectif] : null;
    await admin.from('licences').insert({ espace_id: espace.id, logiciel, formule: 'essai', statut: 'essai', date_fin: fin, devise, employes_max });
    // Modules inclus dans le pack (Stock pour la pharmacie d'une clinique, etc.)
    const inclus: string[] = [];
    if (M.modules.stock && logiciel !== 'stockpro') inclus.push('stockpro');
    if (M.modules.rh && logiciel !== 'rhpro') inclus.push('rhpro');
    for (const code of inclus) {
      await admin.from('licences').insert({ espace_id: espace.id, logiciel: code, formule: 'essai', statut: 'essai', date_fin: fin, devise, employes_max, inclus_dans: logiciel });
    }

    const appli = M.logiciel === 'ilano' ? `Ilano · ${M.nom[en ? 1 : 0]}` : (NOMS_LOGICIELS[logiciel] || NOMS_LOGICIELS.stockpro)[en ? 1 : 0];
    let email_bienvenue = 'erreur';
    try { email_bienvenue = await envoyerBienvenue({ en, prenom: nom.split(/\s+/)[0], nom, entreprise, slug, fin, appli, email, ilano: logiciel === 'ilano' }); }
    catch (e) { console.error('Email bienvenue', e); }

    return rep({ ok: true, slug, espace_id: espace.id, modele, logiciel, email_bienvenue });
  } catch (e) {
    return rep({ erreur: 'Erreur : ' + (e as Error).message }, 500);
  }
});
