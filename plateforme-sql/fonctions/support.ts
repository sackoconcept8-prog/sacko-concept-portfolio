import { createClient } from 'npm:@supabase/supabase-js@2';

// Ilano — aide en ligne : l'IA répond d'abord, puis l'équipe Ilano prend le relais.
// Gère aussi l'équipe (ajout / retrait d'assistants), réservé à l'administratrice.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const rep = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const SITE = 'https://sackoconcept.com';
const ADMIN_EMAIL = 'contact@sackoconcept.com';
const WHATSAPP = '+1 505 464 2331';
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

const CONNAISSANCES = `Tu es l'assistant du support d'Ilano, le logiciel de gestion de SACKO CONCEPT LLC (Albuquerque, USA), utilisé surtout par des PME d'Afrique de l'Ouest.
Ce que fait Ilano :
- Chaque client a un espace à son logo et à ses couleurs, sur ordinateur et téléphone (on l'installe depuis le navigateur : « Ajouter à l'écran d'accueil »).
- Socle commun : clients (fiches, historique, import Excel), agenda (rendez-vous, réservations, missions), ressources (chambres, biens, véhicules, sites), prestations et tarifs, devis → factures → reçus (PDF au logo, envoi WhatsApp ou e-mail, relances), paiements en plusieurs fois (frais de scolarité, loyers), dépenses (fournisseurs, budget, bilan du mois), notifications.
- Modèles par secteur : hôtellerie, école, clinique, immobilier, transport, beauté, nettoyage, plus Stock & Ventes (commerce) et RH Pro (employés, congés, pointage, paie). La sécurité (SécuriPro) arrive bientôt.
- Menu « Modules et réglages » : activer ou couper des modules, renommer les rubriques, ajouter ses propres champs, TVA, numéro Mobile Money et lien de paiement affichés sur les factures, lien de réservation en ligne (hôtel, beauté, clinique).
- Menu « Équipe » : ajouter des collaborateurs (connexion par e-mail ou par identifiant + code PIN, avec le code entreprise).
- Bouton « Demander une fonctionnalité » : pour tout besoin sur mesure ; l'équipe répond avec un devis.
- Mot de passe oublié : lien « Mot de passe oublié ? » sur la page de connexion. Les collaborateurs avec code PIN demandent un nouveau code à leur responsable.
Prix (en dollars US, convertis dans la devise du pays au paiement, par Chariow : Mobile Money ou carte) : Démarrage 1-10 personnes 42 $/mois, PME 11-50 : 82 $/mois, Croissance 51-500 : 199 $/mois, Entreprise 500+ sur devis. Cliniques et sécurité : 167 $/mois jusqu'à 50, 335 $ de 51 à 500. -10 % sur 3 mois, -20 % sur 12 mois. Essai gratuit 14 jours sans carte. Tous les modules du secteur sont inclus dans chaque pack.
Contact humain : WhatsApp ${WHATSAPP}, e-mail ${ADMIN_EMAIL}.
Règles :
- Réponds dans la langue du client (français ou anglais), en phrases courtes et simples, chaleureuses, sans jargon. 4 à 6 phrases maximum. Pas de markdown lourd.
- Donne des étapes concrètes (« Menu → … → … »).
- N'invente jamais une fonctionnalité, un prix, une remise, un délai ou un remboursement. Si tu ne sais pas, dis-le et passe la main.
- Passe la main à un conseiller humain (transferer = true) pour : un problème technique qui bloque (erreur, page qui ne charge pas, données perdues), un paiement ou une facture Ilano, une résiliation, un remboursement, une réclamation, une demande de devis ou de rendez-vous, ou si le client demande à parler à quelqu'un. Dans ce cas, dis-lui qu'un conseiller lui répond ici très vite.
Réponds UNIQUEMENT avec un objet JSON : {"reponse": "texte pour le client", "transferer": true ou false}`;

async function brevo(to: string[], sujet: string, html: string, texte: string) {
  const cle = Deno.env.get('BREVO_API_KEY');
  if (!cle || !to.length) return;
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'api-key': cle, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name: 'Ilano Support', email: Deno.env.get('EMAIL_EXPEDITEUR') || ADMIN_EMAIL },
      to: [...new Set(to)].map((email) => ({ email })), subject: sujet.slice(0, 180), htmlContent: html, textContent: texte, tags: ['ilano-support'] }),
  }).catch((e) => console.error('Brevo', e));
}
async function emailsEquipe() {
  const { data } = await admin.from('equipe_ilano').select('email').eq('actif', true);
  return [ADMIN_EMAIL, ...(data ?? []).map((x) => x.email)];
}
async function prevenirEquipe(es: { nom: string; slug: string }, auteur: string, message: string, raison: string) {
  const lien = `${SITE}/plateforme/admin.html#support`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#071E3E"><h2 style="color:#0E7A50">Support Ilano — ${esc(raison)}</h2>
<p><b>${esc(es.nom)}</b> (${esc(es.slug)}) · ${esc(auteur)}</p><div style="background:#F3F6F4;border-radius:12px;padding:14px;white-space:pre-wrap">${esc(message)}</div>
<p><a href="${lien}" style="display:inline-block;background:#0E7A50;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700">Répondre dans l'espace admin →</a></p></div>`;
  await brevo(await emailsEquipe(), `Support Ilano — ${es.nom} : ${raison}`, html, `${es.nom} (${es.slug}) — ${auteur}\n\n${message}\n\n${lien}`);
}

async function repondreIA(es: Record<string, unknown>, historique: { auteur: string; message: string }[]) {
  const cle = Deno.env.get('ANTHROPIC_API_KEY');
  if (!cle) return null;
  const contexte = `Espace du client : « ${es.nom} », secteur ${es.modele}, statut ${es.statut}${es.essai_fin ? `, fin d'essai ${String(es.essai_fin).slice(0, 10)}` : ''}, langue ${es.langue}.`;
  const messages: { role: string; content: string }[] = [];
  for (const m of historique) {
    const role = m.auteur === 'client' ? 'user' : 'assistant';
    const txt = m.auteur === 'equipe' ? `(Conseiller) ${m.message}` : m.message;
    if (messages.length && messages[messages.length - 1].role === role) messages[messages.length - 1].content += '\n' + txt;
    else messages.push({ role, content: txt });
  }
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length) return null;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': cle, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: Deno.env.get('ANTHROPIC_MODEL') || 'claude-haiku-5-5', max_tokens: 600, system: CONNAISSANCES + '\n' + contexte, messages }),
  });
  if (!r.ok) { console.error('IA', r.status, await r.text()); return null; }
  const j = await r.json();
  const texte = (j.content ?? []).map((c: { text?: string }) => c.text ?? '').join('').trim();
  try {
    const o = JSON.parse(texte.slice(texte.indexOf('{'), texte.lastIndexOf('}') + 1));
    if (typeof o.reponse === 'string' && o.reponse.trim()) return { reponse: o.reponse.trim().slice(0, 3000), transferer: !!o.transferer };
  } catch { /* réponse non JSON */ }
  return texte ? { reponse: texte.slice(0, 3000), transferer: false } : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return rep({ erreur: 'Méthode non autorisée' }, 405);
  try {
    const b = await req.json();
    const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
    const { data: ud } = jwt ? await admin.auth.getUser(jwt) : { data: null };
    const u = ud?.user;
    if (!u) return rep({ erreur: 'Non connecté' }, 401);

    // ---------- Équipe Ilano (administratrice uniquement) ----------
    if (b.action === 'equipe_ajouter' || b.action === 'equipe_retirer') {
      const { data: sa } = await admin.from('super_admins').select('user_id').eq('user_id', u.id).maybeSingle();
      if (!sa) return rep({ erreur: 'Réservé à l’administratrice' }, 403);
      if (b.action === 'equipe_retirer') {
        await admin.from('equipe_ilano').delete().eq('user_id', b.user_id);
        return rep({ ok: true });
      }
      const email = String(b.email ?? '').trim().toLowerCase(), nom = String(b.nom ?? '').trim().slice(0, 80);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || nom.length < 2) return rep({ erreur: 'Nom et e-mail valides requis' }, 400);
      let id: string | null = null;
      const pw = crypto.randomUUID() + 'Aa1!';
      const { data: cree, error } = await admin.auth.admin.createUser({ email, password: pw, email_confirm: true, user_metadata: { nom_complet: nom } });
      if (cree?.user) id = cree.user.id;
      else if (error && /already|registered|exists/i.test(error.message)) {
        for (let page = 1; page <= 20 && !id; page++) {
          const { data: l } = await admin.auth.admin.listUsers({ page, perPage: 200 });
          id = l?.users.find((x) => x.email?.toLowerCase() === email)?.id ?? null;
          if (!l || l.users.length < 200) break;
        }
      }
      if (!id) return rep({ erreur: error?.message ?? 'Compte introuvable' }, 400);
      await admin.from('equipe_ilano').upsert({ user_id: id, nom, email, actif: true });
      const { data: lk } = await admin.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: `${SITE}/plateforme/admin.html` } });
      const lien = lk?.properties?.action_link ?? `${SITE}/plateforme/admin.html`;
      await brevo([email], 'Vous rejoignez l’équipe support Ilano',
        `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#071E3E"><h2 style="color:#0E7A50">Bienvenue dans l’équipe Ilano, ${esc(nom)}</h2>
<p>Vous pouvez maintenant répondre aux clients Ilano depuis l’espace admin. Choisissez d’abord votre mot de passe :</p>
<p><a href="${lien}" style="display:inline-block;background:#0E7A50;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700">Choisir mon mot de passe →</a></p>
<p style="color:#667085;font-size:13px">Ensuite, connectez-vous sur ${SITE}/plateforme/admin.html avec ${esc(email)}.</p></div>`,
        `Choisissez votre mot de passe : ${lien}\nPuis connectez-vous sur ${SITE}/plateforme/admin.html`);
      return rep({ ok: true, user_id: id });
    }

    // ---------- Message d'un client ----------
    if (b.action === 'envoyer') {
      const message = String(b.message ?? '').trim().slice(0, 2000);
      if (!message) return rep({ erreur: 'Message vide' }, 400);
      const { data: m } = await admin.from('membres').select('id, nom_complet, espaces!inner(id, nom, slug, modele, statut, essai_fin, langue)')
        .eq('espace_id', b.espace_id).eq('user_id', u.id).eq('actif', true).maybeSingle();
      // deno-lint-ignore no-explicit-any
      const mb = m as any;
      if (!mb) return rep({ erreur: 'Accès refusé' }, 403);
      const es = mb.espaces;
      const depuis = new Date(Date.now() - 864e5).toISOString();
      const { count } = await admin.from('support_messages').select('id', { count: 'exact', head: true }).eq('espace_id', es.id).eq('auteur', 'client').gte('created_at', depuis);
      if ((count ?? 0) >= 60) return rep({ erreur: 'Trop de messages aujourd’hui. Écrivez-nous sur WhatsApp : ' + WHATSAPP }, 429);

      await admin.from('support_messages').insert({ espace_id: es.id, membre_id: mb.id, auteur: 'client', auteur_nom: mb.nom_complet, message });
      const { data: f } = await admin.from('support_fils').select('*').eq('espace_id', es.id).maybeSingle();
      const statut = !f || f.statut === 'resolu' ? 'ia' : f.statut;
      await admin.from('support_fils').upsert({ espace_id: es.id, statut, pris_par: f?.pris_par ?? null, non_lus_equipe: (f?.non_lus_equipe ?? 0) + 1, non_lus_client: 0, dernier_message: message.slice(0, 200), maj_le: new Date().toISOString() });

      if (statut === 'humain') {
        if (!f?.non_lus_equipe) await prevenirEquipe(es, mb.nom_complet, message, 'nouveau message');
        return rep({ ok: true, statut });
      }
      const { data: hist } = await admin.from('support_messages').select('auteur, message').eq('espace_id', es.id).neq('auteur', 'systeme').order('created_at', { ascending: false }).limit(14);
      const ia = await repondreIA(es, (hist ?? []).reverse());
      if (!ia && statut === 'attente') return rep({ ok: true, statut });
      const en = es.langue === 'en';
      let reponse: string, transferer: boolean, auteur = 'ia';
      if (ia) { reponse = ia.reponse; transferer = ia.transferer; }
      else {
        auteur = 'systeme'; transferer = true;
        reponse = en ? 'Thank you for your message. An Ilano advisor will reply right here very soon. For anything urgent: WhatsApp ' + WHATSAPP + '.'
          : 'Merci pour votre message. Un conseiller Ilano vous répond ici très vite. Pour une urgence : WhatsApp ' + WHATSAPP + '.';
      }
      await admin.from('support_messages').insert({ espace_id: es.id, auteur, auteur_nom: auteur === 'ia' ? 'Assistant Ilano' : 'Ilano', message: reponse });
      const nouveau = transferer && statut !== 'attente' ? 'attente' : statut;
      await admin.from('support_fils').update({ statut: nouveau, dernier_message: reponse.slice(0, 200), maj_le: new Date().toISOString() }).eq('espace_id', es.id);
      if (transferer && statut !== 'attente') await prevenirEquipe(es, mb.nom_complet, message, 'un conseiller est demandé');
      return rep({ ok: true, statut: nouveau });
    }

    return rep({ erreur: 'Action inconnue' }, 400);
  } catch (e) {
    return rep({ erreur: (e as Error).message }, 500);
  }
});
