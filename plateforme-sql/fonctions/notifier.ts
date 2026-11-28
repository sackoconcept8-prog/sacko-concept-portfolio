import { createClient } from 'npm:@supabase/supabase-js@2';

// Ilano — envois : mot de passe oublié, invitation d'un membre, e-mail ou SMS à un client,
// demande de fonctionnalité (prévient SACKO CONCEPT). Tous les e-mails passent par Brevo.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const rep = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const SITE = 'https://sackoconcept.com';
const LOGO = `${SITE}/ilano/images/ilano-logo-email.png`;
const ADMIN_EMAIL = 'contact@sackoconcept.com';
const EXP = () => Deno.env.get('EMAIL_EXPEDITEUR') || 'contact@sackoconcept.com';
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

function gabarit(o: { en: boolean; titre: string; intro: string; corps?: string; bouton?: [string, string]; pied?: string; logo?: string | null; marque?: string }) {
  const logo = o.logo ? `<img src="${esc(o.logo)}" alt="" style="max-height:56px;max-width:180px;display:block;border:0">`
    : `<img src="${LOGO}" width="120" height="48" alt="Ilano" style="display:block;border:0">`;
  return `<!doctype html><html lang="${o.en ? 'en' : 'fr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.titre)}</title></head>
<body style="margin:0;padding:0;background:#F3F6F4;font-family:Helvetica,Arial,sans-serif;color:#071E3E">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6F4;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden">
<tr><td style="background:#E6F5EC;padding:24px 36px">${logo}${o.marque ? `<div style="margin-top:8px;font-size:13px;font-weight:700;color:#0E7A50">${esc(o.marque)}</div>` : ''}</td></tr>
<tr><td style="padding:32px 36px 12px">
<h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#071E3E">${esc(o.titre)}</h1>
<p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#4A5568">${o.intro}</p>
${o.corps ?? ''}
${o.bouton ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 10px"><tr><td style="border-radius:12px;background:#0E7A50"><a href="${esc(o.bouton[1])}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:12px">${esc(o.bouton[0])} &rarr;</a></td></tr></table>` : ''}
</td></tr>
<tr><td style="padding:8px 36px 30px;font-size:12px;line-height:1.6;color:#6B7A8C">${o.pied ?? ''}</td></tr>
</table>
<p style="margin:18px 0 0;font-size:11px;line-height:1.6;color:#8A96A6;text-align:center">Ilano™ — ${o.en ? 'a product of' : 'un produit de'} SACKO CONCEPT LLC · Albuquerque, NM, USA</p>
</td></tr></table></body></html>`;
}

async function brevoEmail(m: { to: string; nom?: string; sujet: string; html: string; texte: string; expNom?: string; replyTo?: string; tag: string }) {
  const cle = Deno.env.get('BREVO_API_KEY');
  if (!cle) return 'non_configure';
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'api-key': cle, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: (m.expNom || 'Ilano').slice(0, 70), email: EXP() },
      replyTo: { email: m.replyTo || ADMIN_EMAIL },
      to: [{ email: m.to, name: m.nom || m.to }], subject: m.sujet.slice(0, 180), htmlContent: m.html, textContent: m.texte, tags: [m.tag],
    }),
  });
  if (!r.ok) { console.error('Brevo e-mail', r.status, await r.text()); return 'erreur'; }
  return 'envoye';
}

async function utilisateur(req: Request) {
  const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (!jwt) return null;
  const { data } = await admin.auth.getUser(jwt);
  return data?.user ?? null;
}
async function membreDe(userId: string, espaceId: string) {
  const { data } = await admin.from('membres').select('id, role, nom_complet, telephone, espaces!inner(id, nom, slug, logo_url, statut, langue, telephone)')
    .eq('espace_id', espaceId).eq('user_id', userId).eq('actif', true).maybeSingle();
  // deno-lint-ignore no-explicit-any
  const m = data as any;
  if (!m || !['essai', 'actif'].includes(m.espaces.statut)) return null;
  return m;
}
// Petit garde-fou contre les abus : nombre d'envois par jour et par espace
async function compter(espaceId: string, cle: string, max: number) {
  const mois = `${cle}-${new Date().toISOString().slice(0, 10)}`;
  const { data } = await admin.from('co_sms').select('nb').eq('espace_id', espaceId).eq('mois', mois).maybeSingle();
  const n = data?.nb ?? 0;
  if (n >= max) return false;
  await admin.from('co_sms').upsert({ espace_id: espaceId, mois, nb: n + 1 });
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return rep({ erreur: 'Méthode non autorisée' }, 405);
  try {
    const b = await req.json();
    const en = b.langue === 'en';
    const t = (fr: string, e: string) => (en ? e : fr);

    // ---------- Mot de passe oublié (sans connexion) ----------
    if (b.action === 'reset') {
      const email = String(b.email ?? '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.endsWith('.membres.sackoconcept.com')) return rep({ ok: true });
      const retour = String(b.retour ?? '').startsWith(SITE) || String(b.retour ?? '').startsWith('https://www.sackoconcept.com') ? String(b.retour) : `${SITE}/plateforme/`;
      const { data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: retour } });
      if (error || !data?.properties?.action_link) return rep({ ok: true }); // ne révèle pas si le compte existe
      const lien = data.properties.action_link;
      const html = gabarit({ en, titre: t('Choisissez un nouveau mot de passe', 'Choose a new password'),
        intro: t('Vous avez demandé à réinitialiser le mot de passe de votre espace Ilano. Cliquez sur le bouton ci-dessous : le lien est valable une heure.', 'You asked to reset the password of your Ilano workspace. Click the button below — the link is valid for one hour.'),
        bouton: [t('Choisir mon nouveau mot de passe', 'Choose my new password'), lien],
        pied: t('Vous n’êtes pas à l’origine de cette demande ? Ignorez simplement cet e-mail : votre mot de passe actuel reste valable.', 'Didn’t ask for this? Just ignore this email — your current password stays the same.') });
      await brevoEmail({ to: email, sujet: t('Ilano — votre nouveau mot de passe', 'Ilano — reset your password'), html,
        texte: t('Choisissez votre nouveau mot de passe : ', 'Choose your new password: ') + lien, tag: 'ilano-mot-de-passe' });
      return rep({ ok: true });
    }

    const u = await utilisateur(req);
    if (!u) return rep({ erreur: t('Non connecté', 'Not signed in') }, 401);
    const m = await membreDe(u.id, String(b.espace_id ?? ''));
    if (!m) return rep({ erreur: t('Accès refusé', 'Access denied') }, 403);
    const es = m.espaces;
    const gerant = ['proprietaire', 'gerant'].includes(m.role);

    // ---------- Invitation d'un nouveau membre ----------
    if (b.action === 'invitation') {
      if (!gerant) return rep({ erreur: t('Accès refusé', 'Access denied') }, 403);
      const email = String(b.email ?? '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return rep({ erreur: t('E-mail invalide', 'Invalid email') }, 400);
      if (!(await compter(es.id, 'inv', 50))) return rep({ erreur: t('Limite d’envois atteinte pour aujourd’hui', 'Daily sending limit reached') }, 429);
      const lien = `${SITE}/plateforme/?e=${encodeURIComponent(es.slug)}&lang=${en ? 'en' : 'fr'}`;
      const nom = String(b.nom ?? '').slice(0, 80);
      const corps = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAF9;border-radius:14px;padding:8px 18px;margin-bottom:18px">
<tr><td style="padding:8px 0;font-size:13px;color:#6B7A8C">${t('E-mail de connexion', 'Sign-in email')}</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right">${esc(email)}</td></tr>
${b.mot_de_passe ? `<tr><td style="padding:8px 0;font-size:13px;color:#6B7A8C">${t('Mot de passe provisoire', 'Temporary password')}</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right">${esc(String(b.mot_de_passe).slice(0, 64))}</td></tr>` : ''}
<tr><td style="padding:8px 0;font-size:13px;color:#6B7A8C">${t('Code entreprise', 'Company code')}</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right">${esc(es.slug)}</td></tr></table>`;
      const html = gabarit({ en, logo: es.logo_url, marque: es.nom, titre: t(`${nom ? 'Bonjour ' + nom + ', v' : 'V'}otre accès est prêt`, `${nom ? 'Hello ' + nom + ', y' : 'Y'}our access is ready`),
        intro: esc(t(`${m.nom_complet} vous invite à rejoindre l’espace ${es.nom} sur Ilano.`, `${m.nom_complet} invited you to join the ${es.nom} workspace on Ilano.`)), corps,
        bouton: [t('Ouvrir l’espace', 'Open the workspace'), lien],
        pied: t('Pensez à changer votre mot de passe provisoire après votre première connexion (« Mot de passe oublié ? »).', 'Remember to change your temporary password after your first sign-in (“Forgot password?”).') });
      const st = await brevoEmail({ to: email, nom, sujet: t(`Votre accès à ${es.nom}`, `Your access to ${es.nom}`), html, expNom: `${es.nom} via Ilano`, replyTo: u.email,
        texte: `${lien}\n${email}${b.mot_de_passe ? '\n' + b.mot_de_passe : ''}`, tag: 'ilano-invitation' });
      return rep({ ok: st === 'envoye', statut: st });
    }

    // ---------- E-mail à un client (facture, relance, rappel de rendez-vous) ----------
    if (b.action === 'email') {
      if (m.role === 'employe') return rep({ erreur: t('Accès refusé', 'Access denied') }, 403);
      const to = String(b.to ?? '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return rep({ erreur: t('E-mail du client invalide', 'Invalid customer email') }, 400);
      const sujet = String(b.sujet ?? '').slice(0, 160), message = String(b.message ?? '').slice(0, 4000);
      if (!sujet || !message) return rep({ erreur: t('Message vide', 'Empty message') }, 400);
      if (!(await compter(es.id, 'mail', 200))) return rep({ erreur: t('Limite d’envois atteinte pour aujourd’hui', 'Daily sending limit reached') }, 429);
      const lien = typeof b.lien === 'string' && /^https:\/\//.test(b.lien) ? b.lien.slice(0, 500) : null;
      const html = gabarit({ en, logo: es.logo_url, marque: es.nom, titre: sujet, intro: esc(message).replace(/\n/g, '<br>'),
        bouton: lien ? [String(b.bouton ?? t('Voir', 'View')).slice(0, 40), lien] : undefined,
        pied: esc(t(`Envoyé par ${es.nom}${es.telephone ? ' · ' + es.telephone : ''}. Répondez directement à cet e-mail pour nous contacter.`, `Sent by ${es.nom}${es.telephone ? ' · ' + es.telephone : ''}. Reply to this email to contact us.`)) });
      const st = await brevoEmail({ to, sujet, html, texte: message + (lien ? '\n' + lien : ''), expNom: es.nom, replyTo: u.email, tag: 'ilano-client' });
      return rep({ ok: st === 'envoye', statut: st });
    }

    // ---------- SMS (Brevo SMS, quota selon le pack) ----------
    if (b.action === 'sms') {
      if (m.role === 'employe') return rep({ erreur: t('Accès refusé', 'Access denied') }, 403);
      const to = String(b.to ?? '').replace(/[^0-9]/g, '');
      const message = String(b.message ?? '').slice(0, 450);
      if (to.length < 8 || !message) return rep({ erreur: t('Numéro (avec indicatif) et message requis', 'Number (with country code) and message required') }, 400);
      const { data: q } = await admin.rpc('co_sms_quota', { p_espace: es.id });
      if (!q || q.utilises >= q.quota) return rep({ erreur: t(`Quota de SMS du mois atteint (${q?.quota ?? 0}). Contactez Ilano pour un pack de SMS.`, `Monthly SMS quota reached (${q?.quota ?? 0}). Contact Ilano for an SMS pack.`), quota: q }, 429);
      const cle = Deno.env.get('BREVO_API_KEY');
      if (!cle) return rep({ erreur: t('SMS bientôt disponibles', 'SMS coming soon') }, 503);
      const exp = String(es.nom).normalize('NFD').replace(/[^A-Za-z0-9]/g, '').slice(0, 11) || 'Ilano';
      const r = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
        method: 'POST', headers: { 'api-key': cle, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ sender: exp, recipient: to, content: message, type: 'transactional', tag: 'ilano' }),
      });
      if (!r.ok) { const txt = await r.text(); console.error('Brevo SMS', r.status, txt);
        return rep({ erreur: t('Envoi du SMS impossible pour le moment. Utilisez WhatsApp.', 'SMS could not be sent right now. Use WhatsApp instead.') }, 502); }
      const mois = new Date().toISOString().slice(0, 7);
      await admin.from('co_sms').upsert({ espace_id: es.id, mois, nb: (q.utilises ?? 0) + 1 });
      return rep({ ok: true, quota: { ...q, utilises: (q.utilises ?? 0) + 1 } });
    }

    if (b.action === 'quota_sms') {
      const { data: q } = await admin.rpc('co_sms_quota', { p_espace: es.id });
      return rep({ ok: true, quota: q });
    }

    // ---------- Demande de fonctionnalité : prévient SACKO CONCEPT ----------
    if (b.action === 'demande') {
      const { data: d } = await admin.from('co_demandes').select('*').eq('id', b.demande_id).eq('espace_id', es.id).maybeSingle();
      if (!d) return rep({ erreur: 'Demande introuvable' }, 404);
      const URG: Record<string, string> = { normale: 'Normale', importante: 'Importante', urgente: '🔴 Urgente' };
      const corps = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAF9;border-radius:14px;padding:8px 18px;margin-bottom:18px;font-size:14px">
<tr><td style="padding:6px 0;color:#6B7A8C">Client</td><td style="padding:6px 0;font-weight:700;text-align:right">${esc(es.nom)} (${esc(es.slug)})</td></tr>
<tr><td style="padding:6px 0;color:#6B7A8C">Demandé par</td><td style="padding:6px 0;font-weight:700;text-align:right">${esc(m.nom_complet)} · ${esc(u.email)}${m.telephone ? ' · ' + esc(m.telephone) : ''}</td></tr>
<tr><td style="padding:6px 0;color:#6B7A8C">Urgence</td><td style="padding:6px 0;font-weight:700;text-align:right">${URG[d.urgence] ?? esc(d.urgence)}</td></tr></table>
<p style="margin:0 0 6px;font-weight:700">${esc(d.titre)}</p><p style="margin:0 0 18px;line-height:1.6;color:#4A5568">${esc(d.description).replace(/\n/g, '<br>')}</p>`;
      const html = gabarit({ en: false, titre: 'Nouvelle demande de fonctionnalité', intro: 'Un client Ilano demande une fonctionnalité sur mesure. Répondez-lui par un devis depuis votre espace admin.', corps,
        bouton: ['Ouvrir l’espace admin', `${SITE}/plateforme/admin.html#demandes`] });
      const st = await brevoEmail({ to: ADMIN_EMAIL, sujet: `Ilano — demande de ${es.nom} : ${d.titre}`, html, replyTo: u.email,
        texte: `${es.nom} (${es.slug}) — ${m.nom_complet} ${u.email}\nUrgence : ${d.urgence}\n\n${d.titre}\n${d.description}`, tag: 'ilano-demande' });
      return rep({ ok: true, statut: st });
    }

    return rep({ erreur: 'Action inconnue' }, 400);
  } catch (e) {
    return rep({ erreur: (e as Error).message }, 500);
  }
});
