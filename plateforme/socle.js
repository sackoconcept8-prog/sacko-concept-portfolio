/* =====================================================================
   Ilano — SOCLE UNIVERSEL (tables co_*) : clients, agenda / réservations,
   ressources, prestations, devis → factures → reçus, échéanciers, dépenses,
   notifications, modules, demandes sur mesure.
   Le vocabulaire, les champs et les indicateurs viennent du modèle du
   secteur (dossier secteurs/). Chargé après rhpro.js et avant le script
   principal : il utilise au moment de l'appel les outils globaux
   (sb, CTX, C, E, entete, modale, verif, toast, esc, tr, L, LOC, fmt…).
   ===================================================================== */

/* ---------- Styles ---------- */
(function(){const s=document.createElement('style');s.textContent=`
.co-barre{display:inline-flex;gap:6px;align-items:center}
.co-ico{position:relative;width:40px;height:40px;border-radius:10px;border:1px solid var(--bord);background:#fff;display:inline-grid;place-items:center;cursor:pointer;color:#475467}
.co-ico:hover{border-color:var(--p);color:var(--p)}.co-ico svg{width:19px;height:19px}
.co-ico b{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;border-radius:9px;background:var(--rouge);color:#fff;font-size:11px;display:grid;place-items:center;padding:0 4px}
.co-bienv{background:linear-gradient(120deg,var(--p2),#fff 70%);border:1px solid var(--bord);border-radius:var(--r);padding:18px 20px;margin-bottom:16px;display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}
.co-bienv h2{margin:0 0 4px;font-size:19px}.co-bienv p{margin:0;color:var(--mut);font-size:14px}
.co-etapes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.co-etape{background:#fff;border:1px solid var(--bord);border-radius:12px;padding:14px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;text-align:left}
.co-etape:hover{border-color:var(--p)}.co-etape i{font-style:normal;width:28px;height:28px;border-radius:8px;background:var(--p2);color:var(--p);display:grid;place-items:center;font-weight:800;flex:none}
.co-etape.ok i{background:var(--p);color:#fff}.co-etape span{font-size:14px;font-weight:600}
.co-jour{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin:14px 0 6px}
.co-rdv{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:11px 12px;border:1px solid var(--bord);border-left:4px solid var(--p);border-radius:10px;background:#fff;margin-bottom:8px;cursor:pointer}
.co-rdv:hover{box-shadow:0 2px 10px #0000000d}.co-rdv .h{font-weight:800;min-width:92px;font-size:14px}.co-rdv .x{flex:1;min-width:0}.co-rdv .x b{display:block;font-size:14px}.co-rdv small{color:var(--mut)}
.co-rdv.demande{border-left-color:var(--orange)}.co-rdv.termine{border-left-color:#98a2b3;opacity:.8}.co-rdv.annule,.co-rdv.absent{border-left-color:var(--rouge);opacity:.6}
.co-plan{overflow:auto;border:1px solid var(--bord);border-radius:12px;background:#fff}
.co-plan table{border-collapse:separate;border-spacing:0;font-size:12px;min-width:760px}
.co-plan th,.co-plan td{border-bottom:1px solid #f2f4f7;border-right:1px solid #f2f4f7;padding:0;height:38px;text-align:center}
.co-plan th{background:var(--fond);padding:6px 4px;position:sticky;top:0;text-transform:none;letter-spacing:0}
.co-plan td.n{position:sticky;left:0;background:#fff;text-align:left;padding:0 10px;font-weight:700;min-width:120px;z-index:1}
.co-plan td.l{cursor:pointer}.co-plan td.l:hover{background:var(--p2)}
.co-plan td.o{background:var(--p);color:#fff;cursor:pointer;font-weight:700;font-size:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:60px;padding:0 4px}
.co-plan td.o.dem{background:var(--orange)}.co-plan td.o.fin{background:#98a2b3}.co-plan th.auj{background:var(--p2);color:var(--p)}
.co-res{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.co-carte{background:#fff;border:1px solid var(--bord);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:6px}
.co-carte h4{margin:0;font-size:15px}.co-carte small{color:var(--mut)}.co-carte .bas{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:auto;flex-wrap:wrap}
.co-lignes td{padding:4px}.co-lignes input{padding:8px}.co-tot{display:grid;grid-template-columns:1fr auto;gap:4px 18px;max-width:320px;margin-left:auto;font-size:14px;margin-top:10px}
.co-tot b{text-align:right}.co-tot .g{font-size:18px}
.co-barre-b{height:8px;border-radius:6px;background:var(--fond);overflow:hidden}.co-barre-b i{display:block;height:100%;background:var(--p)}.co-barre-b i.d{background:var(--rouge)}
.co-switch{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f2f4f7}.co-switch:last-child{border-bottom:0}
.co-switch small{color:var(--mut);display:block}.co-switch input{width:44px;height:24px;accent-color:var(--p);flex:none}
.co-alerte{background:#fef3f2;border:1px solid #fecdca;color:#912018;border-radius:10px;padding:8px 12px;font-size:13px;margin:6px 0}
.co-notif{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f2f4f7;cursor:pointer}.co-notif.nonlu b{color:var(--p)}.co-notif small{color:var(--mut)}
.co-pt{width:9px;height:9px;border-radius:50%;background:var(--p);flex:none;margin-top:6px}.co-notif:not(.nonlu) .co-pt{background:var(--bord)}
.co-fid{display:flex;gap:4px;flex-wrap:wrap}.co-fid i{width:18px;height:18px;border-radius:50%;border:2px solid var(--p)}.co-fid i.on{background:var(--p)}
.co-grille3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 12px}
@media(max-width:900px){.co-etapes{grid-template-columns:1fr}.co-grille3{grid-template-columns:1fr 1fr}.co-rdv .h{min-width:70px}.co-barre .co-txt{display:none}}
`;document.head.appendChild(s)})();

/* SMS désactivés pour l'instant : WhatsApp d'abord (mettre à true quand les crédits Brevo seront achetés) */
const CO_SMS=false;

/* ---------- Modèle du secteur ---------- */
const CO_IC={
 co_accueil:'<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
 co_agenda:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3"/>',
 co_clients:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M17 11a3 3 0 100-6M22 21c0-3-2-5-4-5.5"/>',
 co_ressources:'<path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-7h6v7"/>',
 co_prestations:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
 co_factures:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
 co_echeanciers:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2"/>',
 co_depenses:'<path d="M20 7H5a2 2 0 010-4h14v4zM3 5v14a2 2 0 002 2h15V7"/><circle cx="16" cy="14" r="1.5"/>',
 co_modules:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 co_demandes:'<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/>',
 co_notifs:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
 co_mes:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>'
};
function coS(){const T=window.ILANO_SECTEURS||{},G=T.generique,m=CTX?.espace?.modele;let X=T[m]||G;
  if(m==='securite'||m==='btp')X=G;
  return Object.assign({},G,X,{mots:Object.assign({},G.mots,X.mots||{}),modules:Object.assign({},G.modules,X.modules||{})})}
const coL=a=>Array.isArray(a)?(LANG==='en'?a[1]:a[0]):a;
function coM(k){const lib=CTX?.espace?.libelles||{};if(lib[k])return lib[k];return coL(coS().mots[k])||k}
const coLow=s=>LANG==='en'?s.toLowerCase():s.charAt(0).toLowerCase()+s.slice(1);
const coPrincipal=()=>!!CTX?.licences?.some(l=>l.logiciel==='ilano'&&!l.inclus_dans);
const coActif=()=>CTX?.logiciels?.includes('ilano');
function coMod(k){if(k==='stock')return CTX.logiciels.includes('stockpro');if(k==='rh')return CTX.logiciels.includes('rhpro');
  const m=CTX?.espace?.modules||{};if(k in m)return !!m[k];return !!coS().modules[k]}
const coRO=()=>(CTX?.lecture_seule||[]).includes('ilano');
const coStaff=()=>CTX?.membre?.role!=='employe';
const coReg=k=>(CTX?.espace?.reglages||{})[k];
const coAuj=()=>new Date().toISOString().slice(0,10);
const coDateL=d=>d?new Date(String(d).length<=10?d+'T12:00:00':d).toLocaleDateString(LOC(),{day:'2-digit',month:'short',year:'numeric'}):'—';
const coHeure=d=>new Date(d).toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'});
const coLocal=d=>{const x=new Date(d);x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,16)};
const coTel=t=>String(t||'').replace(/[^\d]/g,'');
const coO={fmt:v=>fmt(v),L:(a,b)=>L(a,b)};
const CO_TITRES=()=>({co_accueil:L('Tableau de bord','Dashboard'),co_agenda:coM('rdvs'),co_clients:coM('clients'),co_ressources:coM('ressources'),
  co_prestations:coM('prestations'),co_factures:L('Devis et factures','Quotes & invoices'),co_echeanciers:coM('echeanciers'),co_depenses:L('Dépenses','Expenses'),
  co_modules:L('Modules et réglages','Modules & settings'),co_demandes:L('Sur mesure','Custom requests'),co_notifs:L('Notifications','Notifications'),co_mes:L('Mes interventions','My jobs')});
const CO_PAGE_MOD={co_agenda:'agenda',co_clients:'clients',co_ressources:'ressources',co_prestations:'prestations',co_factures:'factures',co_echeanciers:'echeanciers',co_depenses:'depenses'};

/* ---------- Menu ---------- */
function coPages(g){Object.assign(IC,CO_IC);
  if(coPrincipal()){ROLES.vendeur=L('Collaborateur','Team member');ROLES.gerant=L('Gérant','Manager')}
  const S=coS(),T={...CO_TITRES(),...(S.titres?S.titres():{})};
  Object.assign(RH_COURT,S.courts?S.courts():{});Object.assign(RH_COURT,{co_accueil:L('Accueil','Home'),co_agenda:coM('rdvs').split(' ')[0],co_clients:coM('clients').split(' ')[0],co_factures:L('Factures','Invoices'),co_mes:L('Mes tâches','My jobs'),co_ressources:coM('ressources').split(' ')[0]});
  if(!coActif())return [];
  if(CTX.membre.role==='employe')return coMod('agenda')?[['co_mes',T.co_mes]]:[];
  return S.pages.filter(k=>k==='co_accueil'||coMod(CO_PAGE_MOD[k]||k)).filter(k=>g||!['co_depenses',...(S.pagesGestion||[])].includes(k)).map(k=>[k,T[k]]);
}
function coPagesFin(g){const T=CO_TITRES();return [g&&['co_modules',T.co_modules],['co_demandes',T.co_demandes]].filter(Boolean)}
function vueDepart(){const s=CTX.logiciels.includes('stockpro'),r=CTX.logiciels.includes('rhpro');
  if(coPrincipal()){if(CTX.membre.role==='employe')return r?'rh_moi':'co_mes';return 'co_accueil'}
  if(r&&(!s||CTX.membre.role==='employe'))return estGerant()?'rh_accueil':'rh_moi';return estGerant()?'accueil':'caisse'}
function coTitreMenu(k,t){const R=coS().renommer||{};return R[k]?coL(R[k]):t}

/* ---------- Barre d'outils : notifications + demande sur mesure ---------- */
let CO_NB_NOTIFS=0,CO_NB_SUP=0;
function coOutils(){if(!CTX)return'';return`<span class="co-barre"><button type="button" class="co-ico" title="${esc(L('Notifications','Notifications'))}" onclick="aller('co_notifs')">${svg('co_notifs')}${CO_NB_NOTIFS?`<b>${CO_NB_NOTIFS>99?'99+':CO_NB_NOTIFS}</b>`:''}</button>
  <button type="button" class="co-ico" title="${esc(L('Aide et support','Help & support'))}" onclick="coSupport()" id="co-sup-b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1121 12z"/><path d="M9.5 9.5a2.5 2.5 0 014.6 1.3c0 1.7-2.1 2-2.1 3.2M12 17h.01"/></svg>${CO_NB_SUP?`<b>${CO_NB_SUP}</b>`:''}</button>
    <button type="button" class="btn sec pt" onclick="coDemander()" title="${esc(L('Demander une fonctionnalité','Request a feature'))}">💡 <span class="co-txt">${esc(L('Demander une fonctionnalité','Request a feature'))}</span></button></span>`}
async function coCompterNotifs(){if(!CTX)return;try{const{count}=await sb.from('co_notifications').select('id',{count:'exact',head:true}).eq('espace_id',E()).eq('lu',false);
  const n=count||0;if(n!==CO_NB_NOTIFS){CO_NB_NOTIFS=n;document.querySelectorAll('.co-ico b').forEach(b=>b.textContent=n);if(!document.querySelector('.co-ico b')&&n&&document.querySelector('.co-ico'))document.querySelector('.co-ico').insertAdjacentHTML('beforeend',`<b>${n}</b>`)}}catch{}}
setInterval(coCompterNotifs,60000);
async function coCompterSupport(){if(!CTX)return;try{const{data}=await sb.from('support_fils').select('non_lus_client').eq('espace_id',E()).maybeSingle();CO_NB_SUP=data?.non_lus_client||0;
  const b=document.getElementById('co-sup-b');if(b){b.querySelector('b')?.remove();if(CO_NB_SUP)b.insertAdjacentHTML('beforeend',`<b>${CO_NB_SUP}</b>`)}}catch{}}
setInterval(coCompterSupport,60000);

/* ---------- Aide en ligne : l'assistant Ilano répond, puis un conseiller prend le relais ---------- */
let CO_SUP_T=null;
async function coSupport(){clearInterval(CO_SUP_T);
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale large" style="display:flex;flex-direction:column;max-height:88vh;padding:0;overflow:hidden">
   <div style="padding:16px 20px;border-bottom:1px solid var(--bord);display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b>💬 ${esc(L('Aide et support Ilano','Ilano help & support'))}</b><br><small style="color:var(--mut)" id="sup-st">${esc(L('Notre assistant vous répond tout de suite. Un conseiller prend le relais si besoin.','Our assistant answers right away. An advisor takes over if needed.'))}</small></div><button class="btn sec pt" id="sup-x">✕</button></div>
   <div id="sup-l" style="flex:1;overflow:auto;padding:16px 20px;background:var(--fond);min-height:260px"></div>
   <form id="sup-f" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--bord)"><textarea id="sup-m" rows="2" maxlength="2000" placeholder="${esc(L('Écrivez votre question…','Type your question…'))}" style="flex:1;resize:none"></textarea><button class="btn" id="sup-ok">${esc(L('Envoyer','Send'))}</button></form>
   <div style="padding:0 14px 10px;font-size:12px;color:var(--mut);text-align:center">${esc(L('Urgent ?','Urgent?'))} <a target="_blank" href="https://wa.me/15054642331?text=${encodeURIComponent(L('Bonjour Ilano, j’ai besoin d’aide pour ','Hello Ilano, I need help with ')+CTX.espace.nom+' ('+CTX.espace.slug+')')}">WhatsApp</a></div></div></div>`;
  const fermerSup=()=>{clearInterval(CO_SUP_T);fermer()};$('#sup-x').onclick=fermerSup;
  let dernier='';
  const charger=async()=>{const{data}=await sb.from('support_messages').select('*').eq('espace_id',E()).order('created_at').limit(200);const l=data||[];
    const cle=l.length+(l[l.length-1]?.id||'');if(cle===dernier)return;dernier=cle;
    const{data:f}=await sb.from('support_fils').select('statut,pris_par').eq('espace_id',E()).maybeSingle();
    if(f&&$('#sup-st'))$('#sup-st').textContent=f.statut==='humain'?L(`${f.pris_par||'Un conseiller'} vous répond.`,`${f.pris_par||'An advisor'} is replying.`):f.statut==='attente'?L('Un conseiller a été prévenu et vous répond ici très vite.','An advisor has been notified and will reply here soon.'):L('Notre assistant vous répond tout de suite. Un conseiller prend le relais si besoin.','Our assistant answers right away. An advisor takes over if needed.');
    $('#sup-l').innerHTML=l.length?l.map(m=>{const moi=m.auteur==='client';return`<div style="display:flex;justify-content:${moi?'flex-end':'flex-start'};margin-bottom:10px"><div style="max-width:82%;background:${moi?'var(--p)':'#fff'};color:${moi?'#fff':'var(--txt)'};border:1px solid ${moi?'var(--p)':'var(--bord)'};border-radius:14px;padding:10px 13px;font-size:14px;line-height:1.5;white-space:pre-wrap">${moi?'':`<small style="display:block;font-weight:700;color:var(--p);margin-bottom:2px">${esc(m.auteur==='ia'?L('Assistant Ilano','Ilano assistant'):m.auteur_nom||'Ilano')}</small>`}${esc(m.message)}<small style="display:block;opacity:.65;font-size:11px;margin-top:4px;text-align:right">${coHeure(m.created_at)}</small></div></div>`}).join('')
      :`<div class="vide">${esc(L('Bonjour 👋 Posez votre question : comment ajouter un client, envoyer une facture, inviter votre équipe…','Hello 👋 Ask your question: how to add a customer, send an invoice, invite your team…'))}</div>`;
    $('#sup-l').scrollTop=1e6;sb.rpc('support_lu_client',{p_espace:E()}).then(()=>{CO_NB_SUP=0;document.querySelector('#co-sup-b b')?.remove()})};
  $('#sup-m').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#sup-f').requestSubmit()}};
  $('#sup-f').onsubmit=async ev=>{ev.preventDefault();const t=$('#sup-m').value.trim();if(!t)return;const b=$('#sup-ok');b.disabled=true;$('#sup-m').value='';
    $('#sup-l').insertAdjacentHTML('beforeend',`<div style="display:flex;justify-content:flex-end;margin-bottom:10px"><div style="max-width:82%;background:var(--p);color:#fff;border-radius:14px;padding:10px 13px;font-size:14px;white-space:pre-wrap">${esc(t)}</div></div><div class="vide" id="sup-att" style="padding:6px">${esc(L('L’assistant écrit…','The assistant is typing…'))}</div>`);$('#sup-l').scrollTop=1e6;
    try{const{data:{session}}=await sb.auth.getSession();const r=await fetch(SB_URL+'/functions/v1/support',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+session.access_token},body:JSON.stringify({action:'envoyer',espace_id:E(),message:t})});
      const j=await r.json();if(!r.ok||j.erreur)throw new Error(j.erreur||'Erreur')}catch(e){toast(erreurMsg(e));$('#sup-m').value=t}
    b.disabled=false;dernier='';await charger()};
  await charger();CO_SUP_T=setInterval(()=>{if(!$('#sup-l')){clearInterval(CO_SUP_T);return}charger()},6000);
}

/* Bandeau : la taille de l'équipe dépasse le pack */
const CO_PACKS=[['demarrage',10,'Démarrage','Starter'],['pme',50,'PME','SME'],['croissance',500,'Croissance','Growth'],['entreprise',null,'Entreprise','Enterprise']];
function coPackPour(n){return CO_PACKS.find(p=>p[1]===null||n<=p[1])}
function coBandeaux(){if(!estGerant()||!CTX)return'';const lic=(CTX.licences||[]).find(l=>!l.inclus_dans);const n=+CTX.taille||0;
  const max=lic?.employes_max??({'1-10':10,'11-50':50,'51-500':500}[CTX.espace.effectif]??null);
  if(!max||n<=max)return'';const p=coPackPour(n);
  return`<div class="rh-bandeau rap"><span>${esc(L(`📈 Votre équipe compte ${n} personnes : elle dépasse votre pack (${max} maximum). Le pack ${p[2]} est fait pour vous.`,`📈 Your team has ${n} people — more than your plan allows (${max} max). The ${p[3]} plan is made for you.`))}</span><button class="btn pt" onclick="aller('abonnement')">${esc(L('Voir le pack','See the plan'))}</button></div>`}

/* ---------- Données de référence (clients, ressources, prestations, équipe) ---------- */
let CO_REF=null,CO_REF_T=0;
async function coRef(force){if(!force&&CO_REF&&CO_REF.e===E()&&Date.now()-CO_REF_T<20000)return CO_REF;
  const[c,r,p,m]=await Promise.all([
    sb.from('co_clients').select('*').eq('espace_id',E()).eq('actif',true).order('nom').limit(5000),
    sb.from('co_ressources').select('*').eq('espace_id',E()).eq('actif',true).order('nom'),
    sb.from('co_prestations').select('*').eq('espace_id',E()).eq('actif',true).order('nom'),
    sb.from('membres').select('id,nom_complet,role,telephone,actif').eq('espace_id',E()).eq('actif',true).order('nom_complet')]);
  CO_REF={e:E(),clients:c.data||[],ressources:r.data||[],prestations:p.data||[],membres:m.data||[]};CO_REF_T=Date.now();return CO_REF}
const coRefVider=()=>{CO_REF=null};
const coCli=id=>CO_REF?.clients.find(x=>x.id===id);
const coRes=id=>CO_REF?.ressources.find(x=>x.id===id);
const coPre=id=>CO_REF?.prestations.find(x=>x.id===id);
const coMem=id=>CO_REF?.membres.find(x=>x.id===id);
async function coRafraichir(){const{data}=await sb.rpc('mes_espaces');const x=(data||[]).find(d=>d.espace.id===E());if(x){CTX=x;appliquerMarque(CTX.espace)}construireMenu()}

/* Champs : modèle du secteur + champs personnalisés */
function coChamps(type){const S=coS();const base=(type==='client'?S.champsClient:type==='rdv'?S.champsRdv:S.champsRessource)||[];
  const perso=((CTX.espace.champs_perso||{})[type]||[]).map(c=>({k:c.k,l:[c.l,c.l],t:c.t||'text',perso:true}));return[...base,...perso]}
function coChampHTML(c,v){const lab=esc(coL(c.l)),n='ch_'+c.k;v=v??'';
  if(c.t==='textarea')return`<label>${lab}</label><textarea name="${n}" rows="2">${esc(v)}</textarea>`;
  if(c.t==='select')return`<label>${lab}</label><select name="${n}">${c.o.map(o=>`<option value="${esc(o[0])}" ${o[0]===v?'selected':''}>${esc(LANG==='en'?o[2]:o[1])}</option>`).join('')}</select>`;
  return`<label>${lab}</label><input name="${n}" type="${c.t==='number'?'number':c.t==='date'?'date':c.t==='tel'?'tel':'text'}" ${c.t==='number'?'step="any"':''} value="${esc(v)}" ${c.requis?'required':''}>`}
function coLireChamps(v,type,avant={}){const o={...avant};for(const c of coChamps(type)){const x=v['ch_'+c.k];if(x===undefined)continue;if(x===''||x==null)delete o[c.k];else o[c.k]=c.t==='number'?+x:x}return o}

/* ======================================================================
   TABLEAU DE BORD
   ====================================================================== */
async function coAccueil(){
  const S=coS(),prenom=esc(CTX.membre.nom_complet.split(' ')[0]);
  C().innerHTML=entete(L('Bonjour ','Hello ')+prenom+' 👋')+`<div class="vide">${esc(L('Chargement…','Loading…'))}</div>`;
  const[r,ref,rdv]=await Promise.all([sb.rpc('co_resume',{p_espace:E()}).then(verif),coRef(true),
    sb.from('co_rdv').select('*').eq('espace_id',E()).not('statut','in','(annule,absent)').lt('debut',new Date(Date.now()+864e5).toISOString()).gte('fin',new Date(new Date().setHours(0,0,0,0)).toISOString()).order('debut').limit(30).then(verif)]);
  const k=(S.kpis||window.ILANO_SECTEURS.generique.kpis)(r,coO);
  const vide=!ref.clients.length&&!ref.prestations.length&&!ref.ressources.length;
  const fait={co_clients:ref.clients.length>0,co_prestations:ref.prestations.length>0,co_ressources:ref.ressources.length>0,co_agenda:r.rdv_semaine+r.rdv_jour>0,co_factures:r.ca_mois>0,co_echeanciers:r.a_venir+r.impayes>0,co_depenses:r.depenses_mois>0};
  const etapes=(S.premiers||[]).filter(([p])=>p==='co_modules'||p==='equipe'||p==='articles'||coMod(CO_PAGE_MOD[p]||'clients'));
  const alertes=[];
  if(r.rdv_demandes)alertes.push(`<div class="co-alerte" style="background:#fffaeb;border-color:#fedf89;color:#93370d;cursor:pointer" onclick="window._coFiltre='demandes';aller('co_agenda')">🔔 ${esc(L(`${r.rdv_demandes} demande(s) en ligne à confirmer`,`${r.rdv_demandes} online request(s) to confirm`))} →</div>`);
  if(r.nb_retard)alertes.push(`<div class="co-alerte" style="cursor:pointer" onclick="window._coFF='retard';aller('co_factures')">⏰ ${esc(L(`${r.nb_retard} facture(s) en retard : ${fmt(r.en_retard)}`,`${r.nb_retard} overdue invoice(s): ${fmt(r.en_retard)}`))} →</div>`);
  for(const a of r.alertes_echeances||[]){const c=coChamps('ressource').find(x=>x.k===a.cle);alertes.push(`<div class="co-alerte">📄 ${esc(a.nom)} — ${esc(c?coL(c.l):coLibCle(a.cle))} : <b>${coDateL(a.date)}</b>${a.date<coAuj()?' · '+esc(L('dépassée','expired')):''}</div>`)}
  const ligneRdv=x=>{const c=coCli(x.client_id),re=coRes(x.ressource_id),me=coMem(x.membre_id);
    return`<div class="co-rdv ${x.statut}" data-rdv="${x.id}"><div class="h">${S.agenda.mode==='sejour'?coDateL(x.debut).slice(0,6):coHeure(x.debut)}</div><div class="x"><b>${esc(c?.nom||x.titre||'—')}</b><small>${esc([x.titre&&c?x.titre:'',re?.nom,me?.nom_complet].filter(Boolean).join(' · '))}</small></div>${coTagRdv(x.statut)}</div>`};
  C().innerHTML=entete(L('Bonjour ','Hello ')+prenom+' 👋',`${coMod('agenda')&&!coRO()?`<button class="btn" onclick="coFormRdv()">+ ${esc(coM('rdv'))}</button>`:''} ${coMod('factures')&&!coRO()?`<button class="btn sec" onclick="coFormFacture({type:'facture'})">+ ${esc(L('Facture','Invoice'))}</button>`:''}`)+`
   ${vide&&estGerant()?`<div class="co-bienv"><div><h2>${S.icone||'✨'} ${esc(L('Bienvenue dans votre espace','Welcome to your workspace'))} ${esc(coL(S.nom))}</h2><p>${esc(L('Trois étapes pour bien démarrer. Vous pouvez aussi remplir l’espace avec des exemples pour le découvrir.','Three steps to get started. You can also fill the workspace with examples to explore it.'))}</p></div>${S.exemples?`<button class="btn sec" onclick="coExemples()">${esc(L('Remplir avec des exemples','Fill with examples'))}</button>`:''}</div>`:''}
   ${etapes.length&&estGerant()&&etapes.some(([p])=>!fait[p])?`<div class="co-etapes">${etapes.map(([p,t],i)=>`<button class="co-etape ${fait[p]?'ok':''}" onclick="aller('${p}')"><i>${fait[p]?'✓':i+1}</i><span>${esc(coL(t))}</span></button>`).join('')}</div>`:''}
   ${alertes.join('')}
   <div class="kpis">${k.map(([t,v,s,p])=>`<div class="kpi ${p?'p':''}"><small>${esc(t)}</small><div>${esc(String(v))}</div>${s?`<small>${esc(s)}</small>`:''}</div>`).join('')}</div>
   <div class="deux">
    ${coMod('agenda')?`<div class="carte"><h3 style="margin-top:0;display:flex;justify-content:space-between;align-items:center">${esc(L('Aujourd’hui','Today'))}<button class="btn lien pt" onclick="aller('co_agenda')">${esc(L('Tout voir','See all'))} →</button></h3>
      ${rdv.length?rdv.map(ligneRdv).join(''):`<div class="vide">${esc(L('Rien de prévu aujourd’hui','Nothing planned today'))}</div>`}</div>`:''}
    <div class="carte"><h3 style="margin-top:0">${esc(L('Ce mois-ci','This month'))}</h3>
      <div class="rh-info"><span>${esc(L('Facturé','Invoiced'))}</span><b>${fmt(r.ca_mois)}</b><span>${esc(L('Encaissé','Collected'))}</span><b>${fmt(r.encaisse_mois)}</b>
      ${estGerant()?`<span>${esc(L('Dépenses','Expenses'))}</span><b>${fmt(r.depenses_mois)}</b><span>${esc(L('Résultat (encaissé − dépenses)','Result (collected − expenses)'))}</span><b style="color:${r.encaisse_mois-r.depenses_mois<0?'var(--rouge)':'var(--p)'}">${fmt(r.encaisse_mois-r.depenses_mois)}</b>`:''}
      <span>${esc(L('Reste à encaisser','Outstanding'))}</span><b>${fmt(r.impayes)}</b></div>
      ${S.parRessource&&(r.recette_ressource||[]).length?`<h4 style="margin:16px 0 6px">${esc(L('Recette par ','Revenue per '))}${esc(coLow(coM('ressource')))}</h4><table class="rh-compact"><tr><th>${esc(coM('ressource'))}</th><th style="text-align:right">${esc(L('Recette','Revenue'))}</th><th style="text-align:right">${esc(L('Dépenses','Expenses'))}</th><th style="text-align:right">${esc(L('Marge','Margin'))}</th></tr>
        ${r.recette_ressource.slice(0,8).map(x=>`<tr><td>${esc(x.nom)}</td><td style="text-align:right">${fmt(x.montant)}</td><td style="text-align:right">${fmt(x.depenses)}</td><td style="text-align:right"><b>${fmt(x.montant-x.depenses)}</b></td></tr>`).join('')}</table>`:''}
    </div></div>`;
  document.querySelectorAll('[data-rdv]').forEach(b=>b.onclick=()=>coVoirRdv(b.dataset.rdv));
  if(S.accueilExtra&&window[S.accueilExtra]){const z=document.createElement('div');z.id='co-metier';document.querySelector('#contenu .kpis')?.after(z);window[S.accueilExtra](z)}
}
const coLibCle=k=>{const t=String(k).replace(/^p_/,'').replace(/_fin$/,'').replace(/_/g,' ');return t.charAt(0).toUpperCase()+t.slice(1)+L(' (échéance)',' (expiry)')};
const CO_ST_RDV={demande:['À confirmer','To confirm','orange'],prevu:['Prévu','Planned','gris'],confirme:['Confirmé','Confirmed',''],en_cours:['En cours','In progress',''],termine:['Terminé','Done','gris'],annule:['Annulé','Cancelled','rouge'],absent:['Absent','No-show','rouge']};
function coTagRdv(s){const x=CO_ST_RDV[s]||[s,s,''];if(coS().agenda.mode==='sejour'){if(s==='en_cours')return rhTag(L('Arrivé','Checked in'));if(s==='termine')return rhTag(L('Parti','Checked out'),'gris')}return rhTag(LANG==='en'?x[1]:x[0],x[2])}

/* Exemples pour découvrir l'espace */
async function coExemples(){const ex=coS().exemples||{};if(!confirm(L('Ajouter quelques données d’exemple ? Vous pourrez les modifier ou les supprimer.','Add a few sample records? You can edit or delete them later.')))return;
  try{const S=coS();
    if(ex.prestations?.length)verif(await sb.from('co_prestations').insert(ex.prestations.map(([nom,prix,d])=>({espace_id:E(),nom,prix,duree_min:d||null}))));
    if(ex.ressources?.length)verif(await sb.from('co_ressources').insert(ex.ressources.map(([nom,categorie,prix])=>({espace_id:E(),nom,categorie,prix,type:S.typeRessource||'ressource',statut:(S.statutsRessource||[['disponible']])[0][0]}))));
    if(ex.clients?.length)verif(await sb.from('co_clients').insert(ex.clients.map(([nom,telephone,champs])=>({espace_id:E(),nom,telephone:telephone||null,champs:champs||{},categorie:(S.categoriesClient||[['client']])[0][0]}))));
    toast(L('Exemples ajoutés ✓','Samples added ✓'));coRefVider();coAccueil()}catch(e){toast(erreurMsg(e))}}

/* ======================================================================
   CLIENTS / BÉNÉFICIAIRES
   ====================================================================== */
let CO_CCAT='';
async function coClients(){
  const S=coS(),ref=await coRef(true),cats=S.categoriesClient||[['client','Client','Customer']];
  const champsListe=coChamps('client').filter(c=>c.liste);
  C().innerHTML=entete(esc(coM('clients')),coRO()?'':`<button class="btn sec" id="cc-imp">${esc(L('Importer (Excel/CSV)','Import (Excel/CSV)'))}</button> <button class="btn" id="cc-new">+ ${esc(L('Ajouter','Add'))}</button>`)+`
   ${cats.length>1?rhChips('cc-cat',[['',L('Tous','All')],...cats.map(c=>[c[0],LANG==='en'?c[2]:c[1]])],CO_CCAT):''}
   <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px"><input class="recherche" id="cc-q" placeholder="${esc(L('🔍 Rechercher (nom, téléphone…)','🔍 Search (name, phone…)'))}">
   ${S.echeancier?.groupe?`<select id="cc-g" style="max-width:200px"><option value="">${esc(L('Toutes les classes','All classes'))}</option>${[...new Set(ref.clients.map(c=>c.champs?.[S.echeancier.groupe]).filter(Boolean))].sort().map(g=>`<option>${esc(g)}</option>`).join('')}</select>`:''}</div>
   <div class="carte tab-scroll"><table id="cc-t"></table></div>`;
  const dess=()=>{const q=$('#cc-q').value.toLowerCase().trim(),g=$('#cc-g')?.value||'';
    const l=ref.clients.filter(c=>(!CO_CCAT||c.categorie===CO_CCAT)&&(!g||c.champs?.[S.echeancier.groupe]===g)&&(!q||[c.nom,c.telephone,c.email,...Object.values(c.champs||{})].join(' ').toLowerCase().includes(q)));
    $('#cc-t').innerHTML=l.length?`<tr><th>${esc(L('Nom','Name'))}</th>${cats.length>1?`<th>${esc(L('Type','Type'))}</th>`:''}${champsListe.map(c=>`<th>${esc(coL(c.l))}</th>`).join('')}<th>${esc(L('Téléphone','Phone'))}</th><th></th></tr>`+l.slice(0,500).map(c=>{const tel=c.telephone||c.champs?.[S.telContact];
      return`<tr><td><b>${esc(c.nom)}</b>${c.email?`<br><small style="color:var(--mut)">${esc(c.email)}</small>`:''}</td>${cats.length>1?`<td>${rhTag(esc((cats.find(x=>x[0]===c.categorie)||[,c.categorie,c.categorie])[LANG==='en'?2:1]),'gris')}</td>`:''}
      ${champsListe.map(f=>`<td>${esc(c.champs?.[f.k]??'')}</td>`).join('')}<td>${tel?`<a href="https://wa.me/${coTel(tel)}" target="_blank">${esc(tel)}</a>`:''}</td>
      <td style="white-space:nowrap"><button class="btn pt sec" data-fiche="${c.id}">${esc(L('Fiche','Profile'))}</button></td></tr>`}).join('')+(l.length>500?`<tr><td colspan="9" class="vide">${esc(L('Affinez la recherche pour voir plus de résultats','Refine your search to see more'))}</td></tr>`:'')
      :`<tr><td class="vide">${esc(L('Aucun enregistrement. Ajoutez-en un ou importez votre fichier Excel.','Nothing yet. Add one or import your Excel file.'))}</td></tr>`;
    document.querySelectorAll('[data-fiche]').forEach(b=>b.onclick=()=>coFicheClient(b.dataset.fiche))};
  $('#cc-q').oninput=dess;if($('#cc-g'))$('#cc-g').onchange=dess;
  document.querySelectorAll('#cc-cat [data-chip]').forEach(b=>b.onclick=()=>{CO_CCAT=b.dataset.chip;document.querySelectorAll('#cc-cat button').forEach(x=>x.classList.toggle('on',x===b));dess()});
  if($('#cc-new'))$('#cc-new').onclick=()=>coFormClient({categorie:CO_CCAT||cats[0][0]});if($('#cc-imp'))$('#cc-imp').onclick=coImporterClients;dess();
}
function coFormClient(c={},apres){const S=coS(),cats=S.categoriesClient||[['client','Client','Customer']];
  modale(`<h3>${c.id?esc(L('Modifier','Edit')):'+ '+esc(coM('client'))}</h3>
    <label>${esc(L('Nom complet','Full name'))}</label><input name="nom" required maxlength="120" value="${esc(c.nom)}">
    <div class="grille2">${cats.length>1?`<div><label>${esc(L('Type','Type'))}</label><select name="categorie">${cats.map(x=>`<option value="${x[0]}" ${x[0]===c.categorie?'selected':''}>${esc(LANG==='en'?x[2]:x[1])}</option>`).join('')}</select></div>`:''}
    <div><label>${esc(L('Téléphone / WhatsApp','Phone / WhatsApp'))}</label><input name="telephone" type="tel" value="${esc(c.telephone)}" placeholder="+229…"></div>
    <div><label>${esc(L('E-mail','Email'))}</label><input name="email" type="email" value="${esc(c.email)}"></div>
    <div><label>${esc(L('Adresse','Address'))}</label><input name="adresse" value="${esc(c.adresse)}"></div></div>
    ${coChamps('client').map(f=>coChampHTML(f,c.champs?.[f.k])).join('')}
    <label>${esc(L('Note','Note'))}</label><textarea name="note" rows="2">${esc(c.note)}</textarea>
    ${c.id&&estGerant()?`<button type="button" class="btn rouge pt" style="margin-top:12px" id="cc-arch">${esc(L('Archiver','Archive'))}</button>`:''}`,
  async f=>{const v=Object.fromEntries(new FormData(f));
    const row={nom:v.nom.trim(),telephone:v.telephone||null,email:v.email||null,adresse:v.adresse||null,note:v.note||null,categorie:v.categorie||c.categorie||cats[0][0],champs:coLireChamps(v,'client',c.champs)};
    let res;if(c.id)res=verif(await sb.from('co_clients').update(row).eq('id',c.id).select().single());else res=verif(await sb.from('co_clients').insert({...row,espace_id:E()}).select().single());
    toast(L('Enregistré ✓','Saved ✓'));coRefVider();if(apres)apres(res);else aller(VUE)});
  rhModaleLarge();
  if($('#cc-arch'))$('#cc-arch').onclick=async()=>{if(!confirm(L('Archiver cette fiche ? Elle n’apparaîtra plus dans les listes.','Archive this record? It will no longer appear in lists.')))return;verif(await sb.from('co_clients').update({actif:false}).eq('id',c.id));fermer();coRefVider();aller(VUE)};
}
async function coFicheClient(id){const S=coS();await coRef();const c=coCli(id)||verif(await sb.from('co_clients').select('*').eq('id',id).single());
  const[fa,rd]=await Promise.all([sb.from('co_factures').select('*').eq('client_id',id).order('date_emission',{ascending:false}).limit(50).then(verif),
    sb.from('co_rdv').select('*').eq('client_id',id).order('debut',{ascending:false}).limit(30).then(verif)]);
  const du=fa.filter(f=>f.type==='facture'&&['emise','partielle'].includes(f.statut)&&f.date_emission<=coAuj()).reduce((a,f)=>a+(+f.total_client-f.paye),0);
  const visites=rd.filter(x=>x.statut==='termine').length,seuil=+coReg('fidelite_seuil')||10;
  const tel=c.telephone||c.champs?.[S.telContact];const alerte=coChamps('client').filter(f=>f.alerte&&c.champs?.[f.k]);
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale large"><h3>${esc(c.nom)}</h3><p style="color:var(--mut);margin:2px 0 10px">${esc([c.telephone,c.email,c.adresse].filter(Boolean).join(' · '))}</p>
   ${alerte.map(f=>`<div class="co-alerte">⚠️ <b>${esc(coL(f.l))} :</b> ${esc(c.champs[f.k])}</div>`).join('')}
   <div class="rh-info" style="margin-bottom:12px">${coChamps('client').filter(f=>!f.alerte&&c.champs?.[f.k]!=null&&c.champs[f.k]!=='').map(f=>`<span>${esc(coL(f.l))}</span><b>${esc(f.t==='date'?coDateL(c.champs[f.k]):c.champs[f.k])}</b>`).join('')}
    <span>${esc(L('Reste dû','Balance due'))}</span><b style="color:${du>0?'var(--rouge)':'var(--p)'}">${fmt(du)}</b></div>
   ${S.fidelite?`<div class="carte" style="margin-bottom:12px"><b>${esc(L('Carte de fidélité','Loyalty card'))}</b> · ${visites} ${esc(L('visite(s)','visit(s)'))}<div class="co-fid" style="margin-top:8px">${Array.from({length:seuil},(_,i)=>`<i class="${i<visites%seuil||(visites>0&&visites%seuil===0)?'on':''}"></i>`).join('')}</div>
     <small style="color:var(--mut)">${visites>0&&visites%seuil===0?esc(L('🎁 Récompense à offrir : ','🎁 Reward due: ')+(coReg('fidelite_cadeau')||L('une prestation offerte','a free service'))):esc(L(`Encore ${seuil-visites%seuil} visite(s) avant la récompense`,`${seuil-visites%seuil} more visit(s) before the reward`))}</small></div>`:''}
   ${c.note?`<div class="rh-texte" style="margin-bottom:12px">${esc(c.note)}</div>`:''}
   <div id="fc-metier"></div>
   ${coMod('factures')?`<h4 style="margin:10px 0 4px">${esc(L('Factures et devis','Invoices & quotes'))}</h4>${fa.length?`<div class="rh-liste">${fa.slice(0,12).map(f=>`<div><span><b>${esc(f.numero)}</b> · ${coDateL(f.date_emission)}<br><small>${esc(f.objet||'')}</small></span><span style="text-align:right">${fmt(f.total)}<br>${coTagFacture(f)}</span></div>`).join('')}</div>`:`<div class="vide" style="padding:10px">—</div>`}`:''}
   ${coMod('agenda')?`<h4 style="margin:14px 0 4px">${esc(L('Historique','History'))}</h4>${rd.length?`<div class="rh-liste">${rd.slice(0,10).map(x=>`<div><span>${coDateL(x.debut)} · ${esc(x.titre||'')}</span>${coTagRdv(x.statut)}</div>`).join('')}</div>`:`<div class="vide" style="padding:10px">—</div>`}`:''}
   <div class="actions" style="flex-wrap:wrap">${tel?`<a class="btn sec" target="_blank" href="https://wa.me/${coTel(tel)}">WhatsApp</a>`:''}${coRO()?'':`<button class="btn sec" id="fc-mod">${esc(L('Modifier','Edit'))}</button>
     ${coMod('agenda')?`<button class="btn sec" id="fc-rdv">+ ${esc(coM('rdv'))}</button>`:''}${coMod('factures')?`<button class="btn" id="fc-fac">+ ${esc(L('Facture','Invoice'))}</button>`:''}`}<button class="btn sec" onclick="fermer()">${esc(L('Fermer','Close'))}</button></div></div></div>`;
  $('.voile').onclick=e=>{if(e.target.classList.contains('voile'))fermer()};
  if($('#fc-mod'))$('#fc-mod').onclick=()=>coFormClient(c);if($('#fc-rdv'))$('#fc-rdv').onclick=()=>coFormRdv({client_id:c.id});
  if($('#fc-fac'))$('#fc-fac').onclick=()=>coFormFacture({type:'facture',client_id:c.id,taux_assurance:+c.champs?.taux_assurance||0});
  if(S.ficheExtra&&window[S.ficheExtra])window[S.ficheExtra](c,$('#fc-metier'));
}
/* Import Excel / CSV */
async function coLireTableur(file){
  if(/\.xlsx?$/i.test(file.name)){if(!window.XLSX)await new Promise((ok,ko)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';s.onload=ok;s.onerror=()=>ko(new Error(L('Lecture Excel impossible. Enregistrez le fichier en CSV.','Could not read Excel. Save the file as CSV.')));document.head.appendChild(s)});
    const wb=XLSX.read(await file.arrayBuffer(),{type:'array'});return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:'',raw:false})}
  const txt=await file.text();const l=txt.split(/\r?\n/).filter(x=>x.trim());const sep=l[0].includes(';')?';':',';
  return l.map(x=>x.split(sep).map(s=>s.trim().replace(/^"|"$/g,'')))}
const coNorm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function coImporterClients(){const champs=coChamps('client');
  const cols=[['nom',L('nom','name')],['telephone',L('telephone','phone')],['email','email'],['adresse',L('adresse','address')],...champs.map(c=>[c.k,coL(c.l)])];
  modale(`<h3>${esc(L('Importer depuis Excel','Import from Excel'))}</h3><p style="color:var(--mut);font-size:14px">${esc(L('Fichier Excel (.xlsx) ou CSV. La première ligne contient les titres des colonnes, par exemple :','Excel (.xlsx) or CSV file. The first row holds the column titles, for example:'))}<br><b>${cols.map(c=>esc(c[1])).join(' ; ')}</b></p>
    <button type="button" class="btn lien pt" id="ci-mod">⬇ ${esc(L('Télécharger le modèle','Download the template'))}</button>
    <input type="file" name="f" accept=".xlsx,.xls,.csv,text/csv" required style="margin-top:8px">`,
  async f=>{const rows=await coLireTableur(f.f.files[0]);if(rows.length<2)throw new Error(L('Fichier vide','Empty file'));
    const ent=rows[0].map(coNorm);const idx=k=>{const c=cols.find(x=>x[0]===k);return ent.findIndex(h=>h===coNorm(k)||h===coNorm(c[1])||h.startsWith(coNorm(c[1]).slice(0,5)))};
    const I=Object.fromEntries(cols.map(c=>[c[0],idx(c[0])]));if(I.nom<0)I.nom=0;
    const cat=(coS().categoriesClient||[['client']])[0][0];
    const lot=rows.slice(1).filter(r=>String(r[I.nom]||'').trim()).map(r=>{const ch={};for(const c of champs)if(I[c.k]>=0&&String(r[I[c.k]]).trim())ch[c.k]=c.t==='number'?+String(r[I[c.k]]).replace(',','.'):String(r[I[c.k]]).trim();
      return{espace_id:E(),categorie:cat,nom:String(r[I.nom]).trim().slice(0,120),telephone:I.telephone>=0?String(r[I.telephone]).trim()||null:null,email:I.email>=0?String(r[I.email]).trim()||null:null,adresse:I.adresse>=0?String(r[I.adresse]).trim()||null:null,champs:ch}});
    for(let i=0;i<lot.length;i+=200)verif(await sb.from('co_clients').insert(lot.slice(i,i+200)));
    toast(L(`${lot.length} fiche(s) importée(s) ✓`,`${lot.length} record(s) imported ✓`));coRefVider();aller(VUE)});
  $('#m-ok').textContent=L('Importer','Import');
  $('#ci-mod').onclick=()=>rhCsv('modele-'+coNorm(coM('clients'))+'.csv',[cols.map(c=>c[1])]);
}

/* ======================================================================
   RESSOURCES (chambres, biens, véhicules, sites…)
   ====================================================================== */
async function coRessources(){const S=coS(),ref=await coRef(true),st=S.statutsRessource||[];
  const g=estGerant()&&!coRO();
  C().innerHTML=entete(esc(coM('ressources')),g?`<button class="btn" id="cr-new">+ ${esc(coM('ressource'))}</button>`:'')+`
   ${st.length?rhChips('cr-f',[['',L('Toutes','All')+' ('+ref.ressources.length+')'],...st.map(s=>[s[0],(LANG==='en'?s[2]:s[1])+' ('+ref.ressources.filter(r=>r.statut===s[0]).length+')'])],window._coRF||''):''}
   <div class="co-res" id="cr-l"></div>`;
  const dess=()=>{const f=window._coRF||'';const l=ref.ressources.filter(r=>!f||r.statut===f);
    $('#cr-l').innerHTML=l.length?l.map(r=>{const s=st.find(x=>x[0]===r.statut)||[r.statut,r.statut,r.statut,'gris'];const pr=coCli(r.client_id);
      const ech=coChamps('ressource').filter(c=>c.t==='date'&&c.k.endsWith('_fin')&&r.champs?.[c.k]);
      return`<div class="co-carte"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h4>${esc(r.nom)}</h4>${rhTag(esc(LANG==='en'?s[2]:s[1]),s[3])}</div>
       <small>${esc([r.categorie,r.prix?fmt(r.prix)+(S.libPrixRessource?' · '+coL(S.libPrixRessource).toLowerCase():''):'',pr?(L('Propriétaire : ','Owner: ')+pr.nom):''].filter(Boolean).join(' · '))}</small>
       ${coChamps('ressource').filter(c=>c.liste&&c.t!=='date'&&r.champs?.[c.k]).map(c=>`<small>${esc(coL(c.l))} : ${esc(r.champs[c.k])}</small>`).join('')}
       ${ech.map(c=>{const d=r.champs[c.k],j=Math.ceil((new Date(d+'T12:00:00')-Date.now())/864e5);return`<small style="color:${j<0?'var(--rouge)':j<=30?'#b54708':'var(--mut)'}">${esc(coL(c.l))} : <b>${coDateL(d)}</b>${j<0?' ⚠️':j<=30?' ⏰':''}</small>`}).join('')}
       <div class="bas">${st.length>1&&!coRO()?`<select data-st="${r.id}" style="max-width:150px;padding:6px 8px;font-size:13px">${st.map(x=>`<option value="${x[0]}" ${x[0]===r.statut?'selected':''}>${esc(LANG==='en'?x[2]:x[1])}</option>`).join('')}</select>`:'<span></span>'}
       ${g?`<button class="btn pt lien" data-ed="${r.id}">${esc(L('Modifier','Edit'))}</button>`:''}</div></div>`}).join('')
      :`<div class="carte vide" style="grid-column:1/-1">${esc(L('Aucun élément pour le moment.','Nothing here yet.'))}${g?` <a href="#" onclick="coFormRessource();return false">+ ${esc(coM('ressource'))}</a>`:''}</div>`;
    document.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>coFormRessource(coRes(b.dataset.ed)));
    document.querySelectorAll('[data-st]').forEach(s=>s.onchange=async()=>{try{verif(await sb.rpc('co_ressource_statut',{p_id:s.dataset.st,p_statut:s.value}));coRes(s.dataset.st).statut=s.value;toast(L('État mis à jour ✓','Status updated ✓'));coRessources()}catch(e){toast(erreurMsg(e))}})};
  document.querySelectorAll('#cr-f [data-chip]').forEach(b=>b.onclick=()=>{window._coRF=b.dataset.chip;document.querySelectorAll('#cr-f button').forEach(x=>x.classList.toggle('on',x===b));dess()});
  if($('#cr-new'))$('#cr-new').onclick=()=>coFormRessource();dess();
}
async function coFormRessource(r={}){const S=coS(),ref=await coRef(),st=S.statutsRessource||[['disponible','Disponible','Available']];
  const props=ref.clients.filter(c=>c.categorie==='proprietaire'||(S.code==='nettoyage'));
  modale(`<h3>${r.id?esc(L('Modifier','Edit')):'+ '+esc(coM('ressource'))}</h3>
   <label>${esc(L('Nom','Name'))}</label><input name="nom" required maxlength="120" value="${esc(r.nom)}" placeholder="${esc(S.code==='hotel'?'Chambre 101':S.code==='transport'?'Camion 1':'')}">
   <div class="grille2"><div><label>${esc(L('Catégorie / type','Category / type'))}</label><input name="categorie" list="cr-cats" value="${esc(r.categorie)}"><datalist id="cr-cats">${(S.categoriesRessource||[]).map(c=>`<option value="${esc(c)}">`).join('')}</datalist></div>
   <div><label>${esc(coL(S.libPrixRessource||['Prix','Price']))}</label><input name="prix" type="number" min="0" step="any" value="${r.prix??0}"></div>
   <div><label>${esc(L('État','Status'))}</label><select name="statut">${st.map(x=>`<option value="${x[0]}" ${x[0]===r.statut?'selected':''}>${esc(LANG==='en'?x[2]:x[1])}</option>`).join('')}</select></div>
   ${S.code==='hotel'?`<div><label>${esc(L('Personnes max.','Max guests'))}</label><input name="capacite" type="number" min="0" value="${r.capacite??''}"></div>`:''}
   ${S.proprietaireRessource?`<div><label>${esc(S.code==='nettoyage'?L('Client','Client'):L('Propriétaire','Owner'))}</label><select name="client_id"><option value="">—</option>${props.map(c=>`<option value="${c.id}" ${c.id===r.client_id?'selected':''}>${esc(c.nom)}</option>`).join('')}</select></div>`:''}</div>
   ${coChamps('ressource').map(f=>coChampHTML(f,r.champs?.[f.k])).join('')}
   ${S.code==='hotel'?`<label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" name="reservable" style="width:auto" ${r.champs?.reservable===false?'':'checked'}> ${esc(L('Proposée à la réservation en ligne','Offered for online booking'))}</label>`:''}
   ${r.id?`<button type="button" class="btn rouge pt" style="margin-top:12px" id="cr-sup">${esc(L('Retirer','Remove'))}</button>`:''}`,
  async f=>{const v=Object.fromEntries(new FormData(f));const ch=coLireChamps(v,'ressource',r.champs);if(S.code==='hotel')ch.reservable=!!v.reservable;if(S.ressourcePartagee)ch.partage=true;
    const row={nom:v.nom.trim(),categorie:v.categorie||null,prix:+v.prix||0,statut:v.statut,capacite:v.capacite?+v.capacite:null,client_id:v.client_id||null,champs:ch,type:S.typeRessource||'ressource'};
    if(r.id)verif(await sb.from('co_ressources').update(row).eq('id',r.id));else verif(await sb.from('co_ressources').insert({...row,espace_id:E()}));
    toast(L('Enregistré ✓','Saved ✓'));coRefVider();aller(VUE)});
  rhModaleLarge();
  if($('#cr-sup'))$('#cr-sup').onclick=async()=>{if(!confirm(L('Retirer cet élément de la liste ?','Remove this item from the list?')))return;verif(await sb.from('co_ressources').update({actif:false}).eq('id',r.id));fermer();coRefVider();aller(VUE)};
}

/* ======================================================================
   PRESTATIONS ET TARIFS
   ====================================================================== */
async function coPrestations(){const ref=await coRef(true),g=estGerant()&&!coRO();
  C().innerHTML=entete(esc(coM('prestations')),g?`<button class="btn" id="cp-new">+ ${esc(L('Ajouter','Add'))}</button>`:'')+`<div class="carte tab-scroll">${ref.prestations.length?`<table><tr><th>${esc(coM('prestation'))}</th><th>${esc(L('Catégorie','Category'))}</th><th>${esc(L('Durée','Duration'))}</th><th style="text-align:right">${esc(L('Prix','Price'))}</th><th></th></tr>
   ${ref.prestations.map(p=>`<tr><td><b>${esc(p.nom)}</b>${p.description?`<br><small style="color:var(--mut)">${esc(p.description)}</small>`:''}${p.publique?'':` ${rhTag(L('interne','internal'),'gris')}`}</td><td>${esc(p.categorie||'—')}</td><td>${p.duree_min?coDuree(p.duree_min):'—'}</td><td style="text-align:right"><b>${fmt(p.prix)}</b>${p.unite?` <small>/ ${esc(p.unite)}</small>`:''}</td>
   <td>${g?`<button class="btn pt lien" data-ed="${p.id}">${esc(L('Modifier','Edit'))}</button>`:''}</td></tr>`).join('')}</table>`:`<div class="vide">${esc(L('Aucune prestation. Ajoutez vos services et leurs prix : ils serviront pour les rendez-vous et les factures.','No services yet. Add your services and prices: they are used for appointments and invoices.'))}</div>`}</div>`;
  if($('#cp-new'))$('#cp-new').onclick=()=>coFormPrestation();document.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>coFormPrestation(coPre(b.dataset.ed)));
}
const coDuree=m=>m>=60?Math.floor(m/60)+' h'+(m%60?' '+String(m%60).padStart(2,'0'):''):m+' min';
function coFormPrestation(p={}){
  modale(`<h3>${p.id?esc(L('Modifier','Edit')):'+ '+esc(coM('prestation'))}</h3>
   <label>${esc(L('Nom','Name'))}</label><input name="nom" required maxlength="120" value="${esc(p.nom)}">
   <div class="grille2"><div><label>${esc(L('Prix','Price'))}</label><input name="prix" type="number" min="0" step="any" required value="${p.prix??''}"></div>
   <div><label>${esc(L('Durée (minutes)','Duration (minutes)'))}</label><input name="duree_min" type="number" min="0" value="${p.duree_min??''}"></div>
   <div><label>${esc(L('Catégorie','Category'))}</label><input name="categorie" value="${esc(p.categorie)}"></div>
   <div><label>${esc(L('Unité (facultatif)','Unit (optional)'))}</label><input name="unite" value="${esc(p.unite)}" placeholder="${esc(L('ex. heure, m², mois','e.g. hour, m², month'))}"></div></div>
   <label>${esc(L('Description','Description'))}</label><input name="description" maxlength="1000" value="${esc(p.description)}">
   <label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" name="publique" style="width:auto" ${p.publique===false?'':'checked'}> ${esc(L('Visible sur le lien de réservation en ligne','Shown on the online booking link'))}</label>
   ${p.id?`<button type="button" class="btn rouge pt" style="margin-top:12px" id="cp-sup">${esc(L('Retirer','Remove'))}</button>`:''}`,
  async f=>{const v=Object.fromEntries(new FormData(f));const row={nom:v.nom.trim(),prix:+v.prix||0,duree_min:v.duree_min?+v.duree_min:null,categorie:v.categorie||null,unite:v.unite||null,description:v.description||null,publique:!!v.publique};
    if(p.id)verif(await sb.from('co_prestations').update(row).eq('id',p.id));else verif(await sb.from('co_prestations').insert({...row,espace_id:E()}));toast(L('Enregistré ✓','Saved ✓'));coRefVider();aller(VUE)});
  if($('#cp-sup'))$('#cp-sup').onclick=async()=>{if(!confirm(L('Retirer cette prestation ?','Remove this service?')))return;verif(await sb.from('co_prestations').update({actif:false}).eq('id',p.id));fermer();coRefVider();aller(VUE)};
}

/* ======================================================================
   AGENDA : rendez-vous, réservations, missions, interventions
   ====================================================================== */
function coPrixNuits(r,d1,d2){const hs=coReg('haute_saison')||coS().reglagesDefaut?.haute_saison||[];const ph=+r?.champs?.prix_haute||0;const n={};let tot=0;
  for(let d=new Date(d1+'T12:00:00');d<new Date(d2+'T12:00:00');d.setDate(d.getDate()+1)){const h=ph&&hs.includes(d.getMonth()+1);const p=h?ph:+r?.prix||0;tot+=p;n[p]=(n[p]||0)+1}
  return{tot,detail:n,nuits:Object.values(n).reduce((a,b)=>a+b,0)}}
let CO_AJOUR=0;
async function coAgenda(){const S=coS(),ref=await coRef(true),A=S.agenda;
  const f=window._coFiltre||(A.mode==='sejour'?'planning':'semaine');window._coFiltre=f;
  const opts=[...(A.mode==='sejour'?[['planning',L('Planning','Planner')]]:[]),['jour',L('Aujourd’hui','Today')],['semaine',L('7 jours','7 days')],['mois',L('30 jours','30 days')],['demandes',L('Demandes en ligne','Online requests')],['passe',L('Passés','Past')]];
  C().innerHTML=entete(esc(coM('rdvs')),coRO()?'':`<button class="btn" id="ag-new">+ ${esc(coM('rdv'))}</button>`)+rhChips('ag-f',opts,f)+`<div id="ag-c"><div class="vide">${esc(L('Chargement…','Loading…'))}</div></div>`;
  document.querySelectorAll('#ag-f [data-chip]').forEach(b=>b.onclick=()=>{window._coFiltre=b.dataset.chip;coAgenda()});
  if($('#ag-new'))$('#ag-new').onclick=()=>coFormRdv();
  const auj=new Date();auj.setHours(0,0,0,0);
  if(f==='planning'){const d0=new Date(auj.getTime()+CO_AJOUR*864e5),N=14,d1=new Date(d0.getTime()+N*864e5);
    const l=verif(await sb.from('co_rdv').select('*').eq('espace_id',E()).not('statut','in','(annule,absent)').lt('debut',d1.toISOString()).gt('fin',d0.toISOString()).limit(1000));
    const jours=Array.from({length:N},(_,i)=>new Date(d0.getTime()+i*864e5));const ressources=ref.ressources;
    const cell=(r,j)=>{const a=j.getTime()+12*36e5;return l.find(x=>x.ressource_id===r.id&&new Date(x.debut).getTime()<a+12*36e5&&new Date(x.fin).getTime()>a)};
    $('#ag-c').innerHTML=`<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px"><button class="btn sec pt" id="pl-p">←</button><button class="btn sec pt" id="pl-a">${esc(L('Aujourd’hui','Today'))}</button><button class="btn sec pt" id="pl-s">→</button>
      <small style="color:var(--mut)">${esc(L('Touchez une case libre pour réserver.','Tap a free cell to book.'))}</small></div>
      ${ressources.length?`<div class="co-plan"><table><tr><th style="position:sticky;left:0;z-index:2">${esc(coM('ressource'))}</th>${jours.map(j=>`<th class="${j.getTime()===auj.getTime()?'auj':''}">${j.toLocaleDateString(LOC(),{weekday:'short'})}<br>${j.getDate()}</th>`).join('')}</tr>
      ${ressources.map(r=>`<tr><td class="n">${esc(r.nom)}<br><small style="color:var(--mut);font-weight:500">${esc(r.categorie||'')}</small></td>${jours.map(j=>{const x=cell(r,j);if(!x)return`<td class="l" data-lr="${r.id}" data-lj="${j.toISOString().slice(0,10)}"></td>`;
        const c=coCli(x.client_id);return`<td class="o ${x.statut==='demande'?'dem':x.statut==='termine'?'fin':''}" data-rdv="${x.id}" title="${esc(c?.nom||'')}">${esc((c?.nom||'•').split(' ')[0])}</td>`}).join('')}</tr>`).join('')}</table></div>`
      :`<div class="carte vide">${esc(L('Ajoutez d’abord vos ','First add your '))}${esc(coLow(coM('ressources')))}. <a href="#" onclick="aller('co_ressources');return false">→</a></div>`}`;
    if($('#pl-p')){$('#pl-p').onclick=()=>{CO_AJOUR-=7;coAgenda()};$('#pl-s').onclick=()=>{CO_AJOUR+=7;coAgenda()};$('#pl-a').onclick=()=>{CO_AJOUR=0;coAgenda()}}
    document.querySelectorAll('[data-lr]').forEach(t=>t.onclick=()=>!coRO()&&coFormRdv({ressource_id:t.dataset.lr,_jour:t.dataset.lj}));
  }else{let q=sb.from('co_rdv').select('*').eq('espace_id',E());
    if(f==='demandes')q=q.eq('statut','demande').order('debut');
    else if(f==='passe')q=q.lt('debut',auj.toISOString()).order('debut',{ascending:false}).limit(200);
    else{const n=f==='jour'?1:f==='semaine'?7:30;q=q.gte('fin',auj.toISOString()).lt('debut',new Date(auj.getTime()+n*864e5).toISOString()).order('debut').limit(500)}
    const l=verif(await q);let jour='';
    $('#ag-c').innerHTML=l.length?l.map(x=>{const d=new Date(x.debut);const jk=d.toDateString();const t=jk!==jour?`<div class="co-jour">${d.toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long'})}</div>`:'';jour=jk;
      const c=coCli(x.client_id),re=coRes(x.ressource_id),me=coMem(x.membre_id);
      const h=A.mode==='sejour'?`${coDateL(x.debut).slice(0,6)} → ${coDateL(x.fin).slice(0,6)}`:`${coHeure(x.debut)}<br><small>${coHeure(x.fin)}</small>`;
      return t+`<div class="co-rdv ${x.statut}" data-rdv="${x.id}"><div class="h">${h}</div><div class="x"><b>${esc(c?.nom||x.titre||'—')}</b><small>${esc([c&&x.titre?x.titre:'',re?.nom,me?.nom_complet,x.champs?.arrivee?'→ '+x.champs.arrivee:'',x.lieu].filter(Boolean).join(' · '))}</small></div>
       <div style="text-align:right">${coTagRdv(x.statut)}${x.montant?`<br><small>${fmt(x.montant)}</small>`:''}${x.source==='public'?`<br><small>🌐 ${esc(L('en ligne','online'))}</small>`:''}</div></div>`}).join('')
      :`<div class="carte vide">${esc(f==='demandes'?L('Aucune demande en ligne en attente.','No pending online requests.'):L('Rien de prévu sur cette période.','Nothing planned for this period.'))}</div>`;
  }
  document.querySelectorAll('#ag-c [data-rdv]').forEach(b=>b.onclick=()=>coVoirRdv(b.dataset.rdv));
}
async function coFormRdv(x={}){const S=coS(),A=S.agenda,ref=await coRef();const sej=A.mode==='sejour';
  const dj=x._jour||coAuj();const deb=x.debut?coLocal(x.debut):dj+'T'+(new Date().getHours()+1).toString().padStart(2,'0')+':00';
  const finD=x.fin?coLocal(x.fin):coLocal(new Date(new Date(deb).getTime()+(A.duree||60)*6e4));
  const arr=x.debut?coLocal(x.debut).slice(0,10):dj,dep=x.fin?coLocal(x.fin).slice(0,10):new Date(new Date(dj+'T12:00:00').getTime()+864e5).toISOString().slice(0,10);
  const optsCli=ref.clients.map(c=>`<option value="${c.id}" ${c.id===x.client_id?'selected':''}>${esc(c.nom)}${c.telephone?' · '+esc(c.telephone):''}</option>`).join('');
  modale(`<h3>${x.id?esc(L('Modifier','Edit')):'+ '+esc(coM('rdv'))}</h3>
   <label>${esc(coM('client'))}</label><div style="display:flex;gap:6px"><select name="client_id" id="rv-cli"><option value="">—</option>${optsCli}</select><button type="button" class="btn sec pt" id="rv-ncli" title="${esc(L('Nouveau','New'))}">+</button></div>
   ${(A.ressource||sej)&&ref.ressources.length?`<label>${esc(coM('ressource'))}</label><select name="ressource_id" id="rv-res"><option value="">—</option>${ref.ressources.map(r=>`<option value="${r.id}" ${r.id===x.ressource_id?'selected':''}>${esc(r.nom)}${r.categorie?' · '+esc(r.categorie):''}${r.prix&&sej?' · '+fmt(r.prix):''}</option>`).join('')}</select>`:''}
   ${!sej&&ref.prestations.length?`<label>${esc(coM('prestation'))}</label><select name="prestation_id" id="rv-pre"><option value="">—</option>${ref.prestations.map(p=>`<option value="${p.id}" ${p.id===x.prestation_id?'selected':''}>${esc(p.nom)} · ${fmt(p.prix)}${p.duree_min?' · '+coDuree(p.duree_min):''}</option>`).join('')}</select>`:''}
   <label>${esc(L('Objet / titre','Subject / title'))}</label><input name="titre" maxlength="200" value="${esc(x.titre)}">
   ${sej?`<div class="grille2"><div><label>${esc(L('Arrivée','Check-in'))}</label><input name="arr" type="date" required value="${arr}" id="rv-a"></div><div><label>${esc(L('Départ','Check-out'))}</label><input name="dep" type="date" required value="${dep}" id="rv-d"></div></div>`
     :`<div class="grille2"><div><label>${esc(L('Début','Start'))}</label><input name="deb" type="datetime-local" required value="${deb}" id="rv-deb"></div><div><label>${esc(L('Fin','End'))}</label><input name="fin" type="datetime-local" required value="${finD}" id="rv-fin"></div></div>`}
   <div class="grille2">${A.membre&&ref.membres.length?`<div><label>${esc(coM('membre'))}</label><select name="membre_id"><option value="">—</option>${ref.membres.map(m=>`<option value="${m.id}" ${m.id===x.membre_id?'selected':''}>${esc(m.nom_complet)}</option>`).join('')}</select></div>`:''}
   <div><label>${esc(L('Montant','Amount'))}</label><input name="montant" type="number" min="0" step="any" value="${x.montant??0}" id="rv-mt"></div>
   <div><label>${esc(L('État','Status'))}</label><select name="statut">${['demande','prevu','confirme','en_cours','termine','annule','absent'].map(s=>`<option value="${s}" ${(x.statut||'confirme')===s?'selected':''}>${esc(LANG==='en'?CO_ST_RDV[s][1]:CO_ST_RDV[s][0])}</option>`).join('')}</select></div>
   ${S.agenda.mode==='mission'?`<div><label>${esc(L('Lieu','Location'))}</label><input name="lieu" value="${esc(x.lieu)}"></div>`:''}</div>
   ${coChamps('rdv').map(f=>coChampHTML(f,x.champs?.[f.k])).join('')}
   <label>${esc(coL(S.notesRdv||['Note','Note']))}</label><textarea name="note" rows="${S.notesRdv?4:2}">${esc(x.note)}</textarea>
   ${A.repeter&&!x.id?`<div class="grille2"><div><label>${esc(L('Répéter chaque semaine','Repeat weekly'))}</label><select name="rep"><option value="0">${esc(L('Non','No'))}</option>${[2,4,8,12,26,52].map(n=>`<option value="${n}">${n} ${esc(L('semaines','weeks'))}</option>`).join('')}</select></div></div>`:''}
   <div id="rv-info" style="font-size:13px;color:var(--mut);margin-top:8px"></div>
   ${x.id&&estGerant()?`<button type="button" class="btn rouge pt" style="margin-top:12px" id="rv-sup">${esc(L('Supprimer','Delete'))}</button>`:''}`,
  async f=>{const v=Object.fromEntries(new FormData(f));let debut,fin;
    if(sej){if(v.dep<=v.arr)throw new Error(L('Le départ doit être après l’arrivée','Check-out must be after check-in'));debut=new Date(v.arr+'T14:00').toISOString();fin=new Date(v.dep+'T12:00').toISOString()}
    else{debut=new Date(v.deb).toISOString();fin=new Date(v.fin).toISOString();if(fin<debut)throw new Error(L('La fin doit être après le début','End must be after start'))}
    const row={client_id:v.client_id||null,ressource_id:v.ressource_id||null,prestation_id:v.prestation_id||null,membre_id:v.membre_id||null,titre:v.titre||null,debut,fin,statut:v.statut,montant:+v.montant||0,lieu:v.lieu||null,note:v.note||null,champs:coLireChamps(v,'rdv',x.champs)};
    if(x.id)verif(await sb.from('co_rdv').update(row).eq('id',x.id));
    else{const n=Math.max(1,+v.rep||1),lot=[];for(let i=0;i<n;i++)lot.push({...row,espace_id:E(),created_by:CTX.membre.id,debut:new Date(new Date(debut).getTime()+i*7*864e5).toISOString(),fin:new Date(new Date(fin).getTime()+i*7*864e5).toISOString()});verif(await sb.from('co_rdv').insert(lot))}
    toast(L('Enregistré ✓','Saved ✓'));aller(VUE)});
  rhModaleLarge();
  const maj=()=>{if(sej){const r=coRes($('#rv-res')?.value);const a=$('#rv-a').value,d=$('#rv-d').value;if(r&&a&&d&&d>a){const p=coPrixNuits(r,a,d);$('#rv-mt').value=p.tot;$('#rv-info').textContent=L(`${p.nuits} nuit(s) · ${fmt(p.tot)}`,`${p.nuits} night(s) · ${fmt(p.tot)}`)}}};
  if(sej){['rv-res','rv-a','rv-d'].forEach(i=>$('#'+i)&&($('#'+i).onchange=maj));if(!x.id)maj()}
  if($('#rv-pre'))$('#rv-pre').onchange=()=>{const p=coPre($('#rv-pre').value);if(!p)return;$('#rv-mt').value=p.prix;if(!document.querySelector('[name=titre]').value)document.querySelector('[name=titre]').value=p.nom;
    if(p.duree_min&&$('#rv-deb').value)$('#rv-fin').value=coLocal(new Date(new Date($('#rv-deb').value).getTime()+p.duree_min*6e4))};
  if($('#rv-deb'))$('#rv-deb').onchange=()=>{const p=coPre($('#rv-pre')?.value);const dmin=p?.duree_min||A.duree||60;$('#rv-fin').value=coLocal(new Date(new Date($('#rv-deb').value).getTime()+dmin*6e4))};
  $('#rv-ncli').onclick=()=>{const brouillon=new FormData(document.querySelector('#modale-zone form'));const keep=Object.fromEntries(brouillon);
    coFormClient({categorie:(S.categoriesClient||[['client']])[0][0]},async c=>{await coRef(true);coFormRdv({...x,client_id:c.id,ressource_id:keep.ressource_id||x.ressource_id,titre:keep.titre})})};
  if($('#rv-sup'))$('#rv-sup').onclick=async()=>{if(!confirm(L('Supprimer définitivement ?','Delete permanently?')))return;verif(await sb.from('co_rdv').delete().eq('id',x.id));fermer();aller(VUE)};
}
async function coVoirRdv(id){const S=coS(),sej=S.agenda.mode==='sejour';await coRef();const x=verif(await sb.from('co_rdv').select('*').eq('id',id).single());
  const c=coCli(x.client_id),re=coRes(x.ressource_id),me=coMem(x.membre_id),pr=coPre(x.prestation_id);const tel=c?.telephone||c?.champs?.[S.telContact];
  const ro=coRO()||!coStaff();
  const btn=[];
  if(!ro){if(x.statut==='demande')btn.push(['confirme',L('✓ Confirmer','✓ Confirm'),'']);
    if(['prevu','confirme','demande'].includes(x.statut))btn.push(['en_cours',sej?L('Arrivée (check-in)','Check in'):S.agenda.mode==='mission'?L('Démarrer','Start'):L('Arrivé(e)','Arrived'),'']);
    if(['prevu','confirme','en_cours'].includes(x.statut))btn.push(['termine',sej?L('Départ (check-out)','Check out'):L('Terminé','Done'),'']);
    if(!['annule','termine'].includes(x.statut))btn.push(['annule',L('Annuler','Cancel'),'rouge']);
    if(['prevu','confirme'].includes(x.statut)&&!sej)btn.push(['absent',L('Absent','No-show'),'rouge'])}
  const rappel=encodeURIComponent(L(`Bonjour ${c?.nom||''}, nous vous rappelons votre ${coLow(coM('rdv'))} chez ${CTX.espace.nom} le ${coDateL(x.debut)}${sej?'':' à '+coHeure(x.debut)}. À bientôt !`,`Hello ${c?.nom||''}, a reminder of your ${coM('rdv').toLowerCase()} at ${CTX.espace.nom} on ${coDateL(x.debut)}${sej?'':' at '+coHeure(x.debut)}. See you soon!`));
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale large"><h3>${esc(c?.nom||x.titre||coM('rdv'))} ${coTagRdv(x.statut)}</h3>
   <div class="rh-info" style="margin:12px 0">${sej?`<span>${esc(L('Séjour','Stay'))}</span><b>${coDateL(x.debut)} → ${coDateL(x.fin)} · ${Math.round((new Date(x.fin)-new Date(x.debut))/864e5)} ${esc(L('nuit(s)','night(s)'))}</b>`:`<span>${esc(L('Quand','When'))}</span><b>${coDateL(x.debut)} · ${coHeure(x.debut)} → ${coHeure(x.fin)}</b>`}
   ${x.titre&&c?`<span>${esc(L('Objet','Subject'))}</span><b>${esc(x.titre)}</b>`:''}${re?`<span>${esc(coM('ressource'))}</span><b>${esc(re.nom)}</b>`:''}${pr?`<span>${esc(coM('prestation'))}</span><b>${esc(pr.nom)}</b>`:''}
   ${me?`<span>${esc(coM('membre'))}</span><b>${esc(me.nom_complet)}</b>`:''}${x.lieu?`<span>${esc(L('Lieu','Location'))}</span><b>${esc(x.lieu)}</b>`:''}
   ${coChamps('rdv').filter(f=>x.champs?.[f.k]).map(f=>`<span>${esc(coL(f.l))}</span><b>${esc(x.champs[f.k])}</b>`).join('')}
   <span>${esc(L('Montant','Amount'))}</span><b>${fmt(x.montant)}</b>${tel?`<span>${esc(L('Téléphone','Phone'))}</span><b>${esc(tel)}</b>`:''}${x.source==='public'?`<span>${esc(L('Source','Source'))}</span><b>🌐 ${esc(L('Réservation en ligne','Online booking'))}</b>`:''}</div>
   ${c&&coChamps('client').filter(f=>f.alerte&&c.champs?.[f.k]).map(f=>`<div class="co-alerte">⚠️ <b>${esc(coL(f.l))} :</b> ${esc(c.champs[f.k])}</div>`).join('')}
   ${x.note?`<div class="rh-texte">${esc(x.note)}</div>`:''}
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${btn.map(([s,t,cl])=>`<button class="btn ${cl==='rouge'?'rouge':s==='termine'||s==='confirme'?'':'sec'} pt" data-s="${s}">${esc(t)}</button>`).join('')}</div>
   <div class="actions" style="flex-wrap:wrap">${tel?`<a class="btn sec" target="_blank" href="https://wa.me/${coTel(tel)}?text=${rappel}">💬 ${esc(L('Rappel WhatsApp','WhatsApp reminder'))}</a>${CO_SMS?`<button class="btn sec" id="rv-sms">SMS</button>`:''}`:''}
    ${!ro&&coMod('factures')?(x.facture_id?`<button class="btn sec" id="rv-vf">${esc(L('Voir la facture','View invoice'))}</button>`:`<button class="btn sec" id="rv-fac">${esc(L('Facturer','Invoice'))}</button>`):''}
    ${!ro?`<button class="btn sec" id="rv-mod">${esc(L('Modifier','Edit'))}</button>`:''}<button class="btn sec" onclick="fermer()">${esc(L('Fermer','Close'))}</button></div></div></div>`;
  $('.voile').onclick=e=>{if(e.target.classList.contains('voile'))fermer()};
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=async()=>{try{verif(await sb.rpc('co_rdv_statut',{p_id:x.id,p_statut:b.dataset.s,p_note:null}));
    if(sej&&re&&b.dataset.s==='termine'){try{await sb.rpc('co_ressource_statut',{p_id:re.id,p_statut:'a_nettoyer'})}catch{}}
    toast(L('Mis à jour ✓','Updated ✓'));
    if(b.dataset.s==='termine'&&coMod('factures')&&!x.facture_id&&x.montant>0&&confirm(L('Créer la facture maintenant ?','Create the invoice now?'))){fermer();return coFactureDepuisRdv(x)}
    fermer();aller(VUE)}catch(e){toast(erreurMsg(e))}});
  if($('#rv-mod'))$('#rv-mod').onclick=()=>coFormRdv(x);
  if($('#rv-fac'))$('#rv-fac').onclick=()=>{fermer();coFactureDepuisRdv(x)};
  if($('#rv-vf'))$('#rv-vf').onclick=async()=>{const f=verif(await sb.from('co_factures').select('*').eq('id',x.facture_id).single());fermer();coVoirFacture(f)};
  if($('#rv-sms'))$('#rv-sms').onclick=()=>coEnvoyerSMS(tel,decodeURIComponent(rappel));
}
function coFactureDepuisRdv(x){const S=coS(),re=coRes(x.ressource_id),pr=coPre(x.prestation_id),c=coCli(x.client_id);let lignes=[];
  if(S.agenda.mode==='sejour'&&re){const a=coLocal(x.debut).slice(0,10),d=coLocal(x.fin).slice(0,10);const p=coPrixNuits(re,a,d);
    lignes=Object.entries(p.detail).map(([pu,q])=>({libelle:`${re.nom} — ${L('nuitée','night')} (${coDateL(a)} → ${coDateL(d)})`,qte:q,pu:+pu}));
    if(!lignes.length||p.tot!==+x.montant)lignes=[{libelle:`${re.nom} — ${L('séjour','stay')} (${coDateL(a)} → ${coDateL(d)})`,qte:1,pu:+x.montant}]}
  else lignes=[{libelle:x.titre||pr?.nom||coM('rdv'),qte:1,pu:+x.montant||+pr?.prix||0}];
  coFormFacture({type:'facture',client_id:x.client_id,ressource_id:x.ressource_id,rdv_id:x.id,objet:(x.titre||coM('rdv'))+' — '+coDateL(x.debut),lignes,taux_assurance:+c?.champs?.taux_assurance||0})}

/* Espace employé : mes interventions */
async function coMes(){const auj=new Date();auj.setHours(0,0,0,0);await coRef().catch(()=>null);
  const l=verif(await sb.from('co_rdv').select('*').eq('espace_id',E()).eq('membre_id',CTX.membre.id).gte('fin',auj.toISOString()).lt('debut',new Date(auj.getTime()+14*864e5).toISOString()).order('debut'));
  C().innerHTML=entete(esc(L('Mes interventions','My jobs')))+(l.length?l.map(x=>`<div class="carte" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px"><div><b>${coDateL(x.debut)} · ${coHeure(x.debut)} → ${coHeure(x.fin)}</b><br>${esc(x.titre||'')}${x.lieu?' · '+esc(x.lieu):''}${x.champs?.depart?`<br><small>${esc(x.champs.depart)} → ${esc(x.champs.arrivee||'')}</small>`:''}</div>${coTagRdv(x.statut)}</div>
   ${x.note?`<div class="rh-texte" style="margin-top:8px">${esc(x.note)}</div>`:''}
   <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${['prevu','confirme'].includes(x.statut)?`<button class="btn pt" data-m="${x.id}:en_cours">${esc(L('Démarrer','Start'))}</button>`:''}${['prevu','confirme','en_cours'].includes(x.statut)?`<button class="btn pt" data-m="${x.id}:termine">${esc(L('Terminé','Done'))}</button>`:''}</div></div>`).join(''):`<div class="carte vide">${esc(L('Aucune intervention prévue dans les 14 prochains jours.','No jobs planned in the next 14 days.'))}</div>`);
  document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const[id,s]=b.dataset.m.split(':');
    modale(`<h3>${esc(s==='termine'?L('Terminer','Finish'):L('Démarrer','Start'))}</h3><label>${esc(L('Commentaire (facultatif)','Comment (optional)'))}</label><textarea name="n" rows="3"></textarea>`,async f=>{verif(await sb.rpc('co_rdv_statut',{p_id:id,p_statut:s,p_note:f.n.value?`[${coHeure(new Date())}] ${f.n.value}`:null}));toast(L('Merci ✓','Thanks ✓'));coMes()})})}

/* ======================================================================
   DEVIS → FACTURES → REÇUS
   ====================================================================== */
const CO_ST_FAC={brouillon:['Brouillon','Draft','gris'],envoye:['Envoyé','Sent','orange'],accepte:['Accepté','Accepted',''],refuse:['Refusé','Declined','rouge'],emise:['À payer','Unpaid','orange'],partielle:['Payée en partie','Part paid','orange'],payee:['Payée','Paid',''],annulee:['Annulée','Cancelled','gris']};
function coTagFacture(f){let s=CO_ST_FAC[f.statut]||[f.statut,f.statut,''];if(['emise','partielle'].includes(f.statut)&&f.date_echeance&&f.date_echeance<coAuj())s=[L('En retard','Overdue'),'Overdue','rouge'];
  else if(f.statut==='emise'&&f.date_emission>coAuj())s=[L('À venir','Upcoming'),'Upcoming','gris'];return rhTag(esc(LANG==='en'?(s[1]):s[0]),s[2])}
const coTitreDoc=f=>f.type==='devis'?L('Devis','Quote'):coS().mots.facture?coM('facture'):L('Facture','Invoice');
async function coFactures(){const ref=await coRef(true),S=coS();const ff=window._coFF||'tous';
  const ch=[['tous',L('Factures','Invoices')],['apayer',L('À encaisser','To collect')],['retard',L('En retard','Overdue')],['payees',L('Payées','Paid')],['devis',L('Devis','Quotes')],['recus',coL(S.mots.recu||['Reçus','Receipts'])]];
  C().innerHTML=entete(esc(L('Devis et factures','Quotes & invoices')),coRO()?'':`${S.facturationMensuelle?`<button class="btn sec" id="cf-mois">${esc(L('Facturer le mois','Invoice the month'))}</button> `:''}<button class="btn sec" id="cf-dev">+ ${esc(L('Devis','Quote'))}</button> <button class="btn" id="cf-fac">+ ${esc(coTitreDoc({type:'facture'}))}</button>`)+
   rhChips('cf-f',ch,ff)+`<input class="recherche" id="cf-q" placeholder="${esc(L('🔍 Rechercher (n°, client…)','🔍 Search (no., customer…)'))}" style="margin-bottom:12px"><div class="carte tab-scroll" id="cf-l"><div class="vide">…</div></div>`;
  document.querySelectorAll('#cf-f [data-chip]').forEach(b=>b.onclick=()=>{window._coFF=b.dataset.chip;coFactures()});
  if($('#cf-fac')){$('#cf-fac').onclick=()=>coFormFacture({type:'facture'});$('#cf-dev').onclick=()=>coFormFacture({type:'devis'})}
  if($('#cf-mois'))$('#cf-mois').onclick=coFacturerMois;
  if(ff==='recus'){const r=verif(await sb.from('co_reglements').select('*, co_factures(numero,client_id,objet)').eq('espace_id',E()).order('created_at',{ascending:false}).limit(300));
    const dess=()=>{const q=$('#cf-q').value.toLowerCase();const l=r.filter(x=>!q||[x.numero,x.co_factures?.numero,coCli(x.co_factures?.client_id)?.nom].join(' ').toLowerCase().includes(q));
      $('#cf-l').innerHTML=l.length?`<table><tr><th>N°</th><th>Date</th><th>${esc(coM('client'))}</th><th>${esc(L('Facture','Invoice'))}</th><th>${esc(L('Mode','Method'))}</th><th style="text-align:right">${esc(L('Montant','Amount'))}</th><th></th></tr>${l.map(x=>`<tr><td><b>${esc(x.numero)}</b></td><td>${coDateL(x.date_reglement)}</td><td>${esc(coCli(x.co_factures?.client_id)?.nom||'—')}</td><td>${esc(x.co_factures?.numero||'')}</td><td>${esc(coMode(x.mode))}</td><td style="text-align:right"><b>${fmt(x.montant)}</b></td><td><button class="btn pt sec" data-recu="${x.id}">PDF</button></td></tr>`).join('')}</table>`:`<div class="vide">${esc(L('Aucun encaissement','No payments yet'))}</div>`;
      document.querySelectorAll('[data-recu]').forEach(b=>b.onclick=async()=>{const x=r.find(y=>y.id===b.dataset.recu);const f=verif(await sb.from('co_factures').select('*').eq('id',x.facture_id).single());coImprimerRecu(x,f)})};
    $('#cf-q').oninput=dess;return dess()}
  let q=sb.from('co_factures').select('*').eq('espace_id',E()).order('date_emission',{ascending:false}).order('created_at',{ascending:false}).limit(500);
  q=ff==='devis'?q.eq('type','devis'):q.eq('type','facture');
  if(ff==='apayer')q=q.in('statut',['emise','partielle']).lte('date_emission',coAuj());if(ff==='retard')q=q.in('statut',['emise','partielle']).lt('date_echeance',coAuj());if(ff==='payees')q=q.eq('statut','payee');
  const l=verif(await q);
  const dess=()=>{const s=$('#cf-q').value.toLowerCase();const x=l.filter(f=>!s||[f.numero,f.objet,coCli(f.client_id)?.nom].join(' ').toLowerCase().includes(s));
    const tot=x.filter(f=>f.statut!=='annulee').reduce((a,f)=>a+(+f.total),0),reste=x.filter(f=>['emise','partielle'].includes(f.statut)).reduce((a,f)=>a+(f.total_client-f.paye),0);
    $('#cf-l').innerHTML=x.length?`<table><tr><th>N°</th><th>Date</th><th>${esc(coM('client'))}</th><th>${esc(L('Objet','Subject'))}</th><th>${esc(L('État','Status'))}</th><th style="text-align:right">Total</th>${ff==='devis'?'':`<th style="text-align:right">${esc(L('Reste','Due'))}</th>`}</tr>
     ${x.map(f=>`<tr data-f="${f.id}" style="cursor:pointer"><td><b>${esc(f.numero)}</b></td><td>${coDateL(f.date_emission)}${f.date_echeance&&f.type==='facture'?`<br><small style="color:var(--mut)">${esc(L('éch. ','due '))}${coDateL(f.date_echeance)}</small>`:''}</td><td>${esc(coCli(f.client_id)?.nom||'—')}</td><td>${esc(f.objet||'')}</td><td>${coTagFacture(f)}</td><td style="text-align:right">${fmt(f.total)}</td>${ff==='devis'?'':`<td style="text-align:right"><b>${['emise','partielle'].includes(f.statut)?fmt(f.total_client-f.paye):'—'}</b></td>`}</tr>`).join('')}
     <tr><td colspan="5" style="text-align:right;color:var(--mut)">${x.length} ${esc(L('document(s)','document(s)'))}</td><td style="text-align:right"><b>${fmt(tot)}</b></td>${ff==='devis'?'':`<td style="text-align:right"><b>${fmt(reste)}</b></td>`}</tr></table>`
     :`<div class="vide">${esc(L('Aucun document. Créez votre premier devis ou votre première facture.','No documents. Create your first quote or invoice.'))}</div>`;
    document.querySelectorAll('[data-f]').forEach(t=>t.onclick=()=>coVoirFacture(l.find(f=>f.id===t.dataset.f)))};
  $('#cf-q').oninput=dess;dess();
}
const CO_MODES={especes:['Espèces','Cash'],mobile_money:['Mobile Money','Mobile Money'],carte:['Carte','Card'],virement:['Virement','Bank transfer'],cheque:['Chèque','Cheque'],assurance:['Assurance','Insurance'],autre:['Autre','Other']};
const coMode=m=>coL(CO_MODES[m]||[m,m]);
async function coFormFacture(f={}){const S=coS(),ref=await coRef();const dev=f.type==='devis';
  const lignes=f.lignes?.length?f.lignes:[{libelle:'',qte:1,pu:0}];const tva=f.tva_taux??(+coReg('tva')||0);
  const ech=f.date_echeance||new Date(Date.now()+(+coReg('delai_paiement')||15)*864e5).toISOString().slice(0,10);
  modale(`<h3>${f.id?esc(L('Modifier','Edit')):'+ '+esc(coTitreDoc(f))}${f.numero?' '+esc(f.numero):''}</h3>
   <div class="grille2"><div><label>${esc(coM('client'))}</label><div style="display:flex;gap:6px"><select name="client_id" id="fa-cli"><option value="">—</option>${ref.clients.map(c=>`<option value="${c.id}" ${c.id===f.client_id?'selected':''}>${esc(c.nom)}</option>`).join('')}</select><button type="button" class="btn sec pt" id="fa-ncli">+</button></div></div>
   <div><label>${esc(L('Objet','Subject'))}</label><input name="objet" maxlength="300" value="${esc(f.objet)}"></div>
   <div><label>${esc(L('Date','Date'))}</label><input name="date_emission" type="date" value="${f.date_emission||coAuj()}"></div>
   <div><label>${esc(dev?L('Valable jusqu’au','Valid until'):L('À payer avant le','Due by'))}</label><input name="date_echeance" type="date" value="${ech}"></div></div>
   <label>${esc(L('Lignes','Lines'))}</label><table class="co-lignes" style="width:100%"><tbody id="fa-l"></tbody></table>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button type="button" class="btn sec pt" id="fa-add">+ ${esc(L('Ligne','Line'))}</button>
   ${ref.prestations.length?`<select id="fa-pre" style="max-width:260px;padding:7px"><option value="">+ ${esc(coM('prestation'))}…</option>${ref.prestations.map(p=>`<option value="${p.id}">${esc(p.nom)} · ${fmt(p.prix)}</option>`).join('')}</select>`:''}</div>
   <div class="co-grille3"><div><label>${esc(L('Remise','Discount'))}</label><input name="remise" type="number" min="0" step="any" value="${f.remise??0}" id="fa-rem"></div>
   <div><label>${esc(L('TVA (%)','VAT (%)'))}</label><input name="tva_taux" type="number" min="0" max="100" step="any" value="${tva}" id="fa-tva"></div>
   ${S.facture?.assurance?`<div><label>${esc(L('Part assurance (%)','Insurance share (%)'))}</label><input name="taux_assurance" type="number" min="0" max="100" step="any" value="${f.taux_assurance??0}" id="fa-ass"></div>`:''}</div>
   <div class="co-tot" id="fa-tot"></div>
   <label>${esc(L('Note (affichée sur le document)','Note (shown on the document)'))}</label><textarea name="note" rows="2">${esc(f.note??coReg('mentions')??'')}</textarea>`,
  async fo=>{const v=Object.fromEntries(new FormData(fo));const ls=coLignesLire();if(!ls.length)throw new Error(L('Ajoutez au moins une ligne','Add at least one line'));
    const row={client_id:v.client_id||null,objet:v.objet||null,date_emission:v.date_emission||coAuj(),date_echeance:v.date_echeance||null,lignes:ls,remise:+v.remise||0,tva_taux:+v.tva_taux||0,taux_assurance:+v.taux_assurance||0,note:v.note||null};
    let res;if(f.id)res=verif(await sb.from('co_factures').update(row).eq('id',f.id).select().single());
    else res=verif(await sb.from('co_factures').insert({...row,espace_id:E(),type:dev?'devis':'facture',statut:dev?'envoye':'emise',ressource_id:f.ressource_id||null,rdv_id:f.rdv_id||null,created_by:CTX.membre.id}).select().single());
    if(f.rdv_id&&!f.id)await sb.from('co_rdv').update({facture_id:res.id}).eq('id',f.rdv_id);
    toast(L(`${coTitreDoc(res)} ${res.numero} enregistré(e) ✓`,`${coTitreDoc(res)} ${res.numero} saved ✓`));setTimeout(()=>coVoirFacture(res),60);if(VUE==='co_factures')coFactures()});
  rhModaleLarge();
  const ligneHTML=l=>`<tr><td style="width:55%"><input data-k="libelle" value="${esc(l.libelle)}" placeholder="${esc(L('Désignation','Description'))}" required></td><td style="width:14%"><input data-k="qte" type="number" step="any" min="0" value="${l.qte??1}"></td><td style="width:24%"><input data-k="pu" type="number" step="any" min="0" value="${l.pu??0}" placeholder="${esc(L('Prix','Price'))}"></td><td><button type="button" class="btn lien pt" data-x>✕</button></td></tr>`;
  const tot=()=>{const ls=coLignesLire(true);const st=ls.reduce((a,l)=>a+Math.round(l.qte*l.pu),0),base=Math.max(0,st-(+$('#fa-rem').value||0)),t=Math.round(base*(+$('#fa-tva').value||0)/100),T=base+t,ass=Math.round(T*(+($('#fa-ass')?.value)||0)/100);
    $('#fa-tot').innerHTML=`<span>${esc(L('Sous-total','Subtotal'))}</span><b>${fmt(st)}</b>${+$('#fa-rem').value?`<span>${esc(L('Remise','Discount'))}</span><b>− ${fmt(+$('#fa-rem').value)}</b>`:''}${t?`<span>TVA</span><b>${fmt(t)}</b>`:''}<span class="g">Total</span><b class="g">${fmt(T)}</b>${ass?`<span>${esc(L('Part assurance','Insurance share'))}</span><b>− ${fmt(ass)}</b><span>${esc(L('À payer par le patient','Patient pays'))}</span><b>${fmt(T-ass)}</b>`:''}`};
  const lier=()=>{document.querySelectorAll('#fa-l input,#fa-rem,#fa-tva,#fa-ass').forEach(i=>i.oninput=tot);document.querySelectorAll('#fa-l [data-x]').forEach(b=>b.onclick=()=>{b.closest('tr').remove();tot()});tot()};
  $('#fa-l').innerHTML=lignes.map(ligneHTML).join('');lier();
  $('#fa-add').onclick=()=>{$('#fa-l').insertAdjacentHTML('beforeend',ligneHTML({libelle:'',qte:1,pu:0}));lier()};
  if($('#fa-pre'))$('#fa-pre').onchange=()=>{const p=coPre($('#fa-pre').value);if(!p)return;const vide=[...document.querySelectorAll('#fa-l tr')].find(t=>!t.querySelector('[data-k=libelle]').value);if(vide)vide.remove();
    $('#fa-l').insertAdjacentHTML('beforeend',ligneHTML({libelle:p.nom,qte:1,pu:p.prix}));$('#fa-pre').value='';lier()};
  $('#fa-cli').onchange=()=>{const c=coCli($('#fa-cli').value);if($('#fa-ass')&&c?.champs?.taux_assurance!=null){$('#fa-ass').value=+c.champs.taux_assurance||0;tot()}};
  $('#fa-ncli').onclick=()=>{const keep={...f,lignes:coLignesLire(true)};coFormClient({categorie:(S.categoriesClient||[['client']])[0][0]},async c=>{await coRef(true);coFormFacture({...keep,client_id:c.id})})};
}
function coLignesLire(tous){return[...document.querySelectorAll('#fa-l tr')].map(t=>({libelle:t.querySelector('[data-k=libelle]').value.trim(),qte:+t.querySelector('[data-k=qte]').value||0,pu:+t.querySelector('[data-k=pu]').value||0})).filter(l=>tous||l.libelle)}
function coMsgFacture(f){const c=coCli(f.client_id),e=CTX.espace,reste=f.total_client-f.paye;const lien=coReg('lien_paiement'),mm=coReg('mobile_money');
  return L(`Bonjour ${c?.nom||''},\n${coTitreDoc(f)} ${f.numero} de ${e.nom}${f.objet?' — '+f.objet:''} : ${fmt(f.total)}.`+(f.type==='facture'&&reste>0?`\nReste à payer : ${fmt(reste)}${f.date_echeance?' avant le '+coDateL(f.date_echeance):''}.`:'')+(f.type==='facture'&&reste>0&&mm?`\nMobile Money : ${mm}`:'')+(f.type==='facture'&&reste>0&&lien?`\nPayer en ligne : ${lien}`:'')+`\nMerci de votre confiance.`,
   `Hello ${c?.nom||''},\n${coTitreDoc(f)} ${f.numero} from ${e.nom}${f.objet?' — '+f.objet:''}: ${fmt(f.total)}.`+(f.type==='facture'&&reste>0?`\nAmount due: ${fmt(reste)}${f.date_echeance?' by '+coDateL(f.date_echeance):''}.`:'')+(f.type==='facture'&&reste>0&&mm?`\nMobile Money: ${mm}`:'')+(f.type==='facture'&&reste>0&&lien?`\nPay online: ${lien}`:'')+`\nThank you.`)}
async function coVoirFacture(f){const S=coS();await coRef();const c=coCli(f.client_id);const reste=f.total_client-f.paye;const tel=c?.telephone||c?.champs?.[S.telContact];const ro=coRO();
  const regs=f.type==='facture'?verif(await sb.from('co_reglements').select('*').eq('facture_id',f.id).order('created_at')):[];
  const apayer=f.type==='facture'&&['emise','partielle'].includes(f.statut),retard=apayer&&f.date_echeance&&f.date_echeance<coAuj();
  const msg=coMsgFacture(f);
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale large"><h3>${esc(coTitreDoc(f))} ${esc(f.numero)} ${coTagFacture(f)}</h3><p style="color:var(--mut);margin:4px 0 12px">${esc(c?.nom||'—')} · ${coDateL(f.date_emission)}${f.objet?' · '+esc(f.objet):''}</p>
   <table class="rh-compact"><tr><th>${esc(L('Désignation','Description'))}</th><th style="text-align:right">${esc(L('Qté','Qty'))}</th><th style="text-align:right">${esc(L('Prix','Price'))}</th><th style="text-align:right">Total</th></tr>${f.lignes.map(l=>`<tr><td>${esc(l.libelle)}</td><td style="text-align:right">${l.qte}</td><td style="text-align:right">${fmt(l.pu)}</td><td style="text-align:right">${fmt(Math.round(l.qte*l.pu))}</td></tr>`).join('')}</table>
   <div class="co-tot">${f.remise?`<span>${esc(L('Remise','Discount'))}</span><b>− ${fmt(f.remise)}</b>`:''}${f.tva?`<span>TVA ${f.tva_taux} %</span><b>${fmt(f.tva)}</b>`:''}<span class="g">Total</span><b class="g">${fmt(f.total)}</b>${f.part_assurance?`<span>${esc(L('Part assurance','Insurance share'))}</span><b>${fmt(f.part_assurance)}</b>`:''}
    ${f.type==='facture'?`<span>${esc(L('Déjà payé','Paid'))}</span><b>${fmt(f.paye)}</b><span>${esc(L('Reste','Due'))}</span><b style="color:${reste>0?'var(--rouge)':'var(--p)'}">${fmt(reste)}</b>`:''}</div>
   ${regs.length?`<h4 style="margin:12px 0 4px">${esc(L('Encaissements','Payments'))}</h4><div class="rh-liste">${regs.map(r=>`<div><span><b>${esc(r.numero)}</b> · ${coDateL(r.date_reglement)} · ${esc(coMode(r.mode))}</span><span>${fmt(r.montant)} <button class="btn pt lien" data-recu="${r.id}">PDF</button></span></div>`).join('')}</div>`:''}
   ${f.nb_relances?`<p style="font-size:12px;color:var(--mut)">${esc(L(`Relancé ${f.nb_relances} fois · dernière relance le ${coDateL(f.derniere_relance)}`,`Reminded ${f.nb_relances} time(s) · last on ${coDateL(f.derniere_relance)}`))}</p>`:''}
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
    ${apayer&&!ro?`<button class="btn" id="vf-enc">💰 ${esc(L('Encaisser','Collect payment'))}</button>`:''}
    ${f.type==='devis'&&!f.converti_en&&!ro&&f.statut!=='refuse'?`<button class="btn" id="vf-conv">${esc(L('Transformer en facture','Convert to invoice'))}</button><button class="btn sec" id="vf-ref">${esc(L('Refusé','Declined'))}</button>`:''}
    <button class="btn sec" id="vf-pdf">🖨 PDF</button>
    ${tel?`<a class="btn sec" id="vf-wa" target="_blank" href="https://wa.me/${coTel(tel)}?text=${encodeURIComponent(msg)}">💬 WhatsApp</a>`:''}
    ${c?.email?`<button class="btn sec" id="vf-mail">✉️ ${esc(L('E-mail','Email'))}</button>`:''}${tel&&CO_SMS?`<button class="btn sec" id="vf-sms">SMS</button>`:''}
    ${!ro&&!['payee','annulee','accepte'].includes(f.statut)&&!f.paye?`<button class="btn sec" id="vf-mod">${esc(L('Modifier','Edit'))}</button>`:''}
    ${!ro&&estGerant()&&!['annulee'].includes(f.statut)&&!f.paye?`<button class="btn rouge" id="vf-ann">${esc(L('Annuler','Cancel'))}</button>`:''}</div>
   <div class="actions"><button class="btn sec" onclick="fermer()">${esc(L('Fermer','Close'))}</button></div></div></div>`;
  $('.voile').onclick=e=>{if(e.target.classList.contains('voile'))fermer()};
  const relance=async()=>{if(apayer)try{await sb.from('co_factures').update({nb_relances:(f.nb_relances||0)+1,derniere_relance:new Date().toISOString()}).eq('id',f.id)}catch{}};
  $('#vf-pdf').onclick=()=>coImprimerFacture(f,regs);
  if($('#vf-wa'))$('#vf-wa').addEventListener('click',relance);
  if($('#vf-sms'))$('#vf-sms').onclick=async()=>{if(await coEnvoyerSMS(tel,msg))relance()};
  if($('#vf-mail'))$('#vf-mail').onclick=async()=>{try{const j=await coNotifier({action:'email',to:c.email,sujet:`${coTitreDoc(f)} ${f.numero} — ${CTX.espace.nom}`,message:msg,lien:coReg('lien_paiement')||undefined,bouton:L('Payer en ligne','Pay online')});
    if(j.ok){toast(L('E-mail envoyé ✓','Email sent ✓'));relance()}else toast(L('E-mail non envoyé','Email not sent'))}catch(e){toast(erreurMsg(e))}};
  if($('#vf-enc'))$('#vf-enc').onclick=()=>coEncaisser(f);
  if($('#vf-conv'))$('#vf-conv').onclick=async()=>{try{const r=verif(await sb.rpc('co_convertir_devis',{p_devis:f.id}));toast(L('Facture ','Invoice ')+r.numero+' ✓');const n=verif(await sb.from('co_factures').select('*').eq('id',r.id).single());coVoirFacture(n);if(VUE==='co_factures')coFactures()}catch(e){toast(erreurMsg(e))}};
  if($('#vf-ref'))$('#vf-ref').onclick=async()=>{verif(await sb.from('co_factures').update({statut:'refuse'}).eq('id',f.id));fermer();aller(VUE)};
  if($('#vf-mod'))$('#vf-mod').onclick=()=>coFormFacture(f);
  if($('#vf-ann'))$('#vf-ann').onclick=async()=>{if(!confirm(L('Annuler ce document ? Il restera dans l’historique.','Cancel this document? It stays in the history.')))return;verif(await sb.from('co_factures').update({statut:'annulee'}).eq('id',f.id));fermer();aller(VUE)};
  document.querySelectorAll('[data-recu]').forEach(b=>b.onclick=()=>coImprimerRecu(regs.find(r=>r.id===b.dataset.recu),f));
}
function coEncaisser(f){const reste=f.total_client-f.paye;const ass=f.part_assurance>0;
  modale(`<h3>${esc(L('Encaisser','Collect payment'))} — ${esc(f.numero)}</h3><p style="color:var(--mut);margin:4px 0">${esc(L('Reste à payer : ','Amount due: '))}<b>${fmt(reste)}</b></p>
   <div class="grille2"><div><label>${esc(L('Montant reçu','Amount received'))}</label><input name="m" type="number" min="1" step="any" required value="${reste}"></div>
   <div><label>${esc(L('Mode','Method'))}</label><select name="mode">${Object.keys(CO_MODES).filter(k=>ass||k!=='assurance').map(k=>`<option value="${k}">${esc(coMode(k))}</option>`).join('')}</select></div>
   <div><label>${esc(L('Date','Date'))}</label><input name="d" type="date" value="${coAuj()}"></div><div><label>${esc(L('Référence (facultatif)','Reference (optional)'))}</label><input name="ref" placeholder="${esc(L('n° de transaction','transaction no.'))}"></div></div>
   ${ass?`<p style="font-size:12px;color:var(--mut)">${esc(L('Le mode « Assurance » enregistre le règlement de la part assurance sans changer le reste à payer du patient.','The “Insurance” method records the insurer’s payment without changing the patient’s balance.'))}</p>`:''}`,
  async fo=>{const v=Object.fromEntries(new FormData(fo));const r=verif(await sb.rpc('co_encaisser',{p_facture:f.id,p_montant:+v.m,p_mode:v.mode,p_reference:v.ref||null,p_date:v.d||coAuj()}));
    toast(L('Encaissement ','Payment ')+r.numero+' ✓');const n=verif(await sb.from('co_factures').select('*').eq('id',f.id).single());const reg=verif(await sb.from('co_reglements').select('*').eq('id',r.id).single());
    setTimeout(()=>{coVoirFacture(n);if(confirm(L('Imprimer le reçu ?','Print the receipt?')))coImprimerRecu(reg,n)},80);if(VUE==='co_factures')coFactures()});
  $('#m-ok').textContent=L('Encaisser','Collect');
}
function coBlocPaiement(){const lien=coReg('lien_paiement'),mm=coReg('mobile_money'),rib=coReg('rib');if(!lien&&!mm&&!rib)return'';
  return`<div style="margin-top:18px;border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;font-size:10.5pt"><b>${esc(L('Moyens de paiement','How to pay'))}</b><br>${mm?esc(L('Mobile Money : ','Mobile Money: '))+esc(mm)+'<br>':''}${rib?esc(L('Virement : ','Bank transfer: '))+esc(rib)+'<br>':''}${lien?esc(L('Paiement en ligne : ','Pay online: '))+`<a href="${esc(lien)}">${esc(lien)}</a>`:''}</div>`}
function coImprimerFacture(f,regs=[]){const c=coCli(f.client_id),re=coRes(f.ressource_id);const reste=f.total_client-f.paye;
  rhPapier(coTitreDoc(f)+' '+f.numero,`<h1>${esc(coTitreDoc(f).toUpperCase())} N° ${esc(f.numero)}</h1>
   <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:18px;font-size:11pt"><div><small style="color:#667085">${esc(L('Date','Date'))}</small><br><b>${coDateL(f.date_emission)}</b>${f.date_echeance?`<br><small style="color:#667085">${esc(f.type==='devis'?L('Valable jusqu’au','Valid until'):L('Échéance','Due date'))}</small><br><b>${coDateL(f.date_echeance)}</b>`:''}</div>
   <div style="text-align:right;border:1px solid #e6e8ec;border-radius:8px;padding:10px 14px;min-width:220px"><small style="color:#667085">${esc(coM('client'))}</small><br><b>${esc(c?.nom||'—')}</b>${c?.adresse?'<br>'+esc(c.adresse):''}${c?.telephone?'<br>'+esc(c.telephone):''}${c?.email?'<br>'+esc(c.email):''}${c?.champs?.assurance?'<br>'+esc(L('Assurance : ','Insurance: ')+c.champs.assurance):''}</div></div>
   ${f.objet||re?`<p><b>${esc(L('Objet : ','Subject: '))}</b>${esc(f.objet||'')}${re?' — '+esc(re.nom):''}</p>`:''}
   <table><tr><th>${esc(L('Désignation','Description'))}</th><th class="r">${esc(L('Qté','Qty'))}</th><th class="r">${esc(L('Prix unitaire','Unit price'))}</th><th class="r">${esc(L('Montant','Amount'))}</th></tr>
   ${f.lignes.map(l=>`<tr><td>${esc(l.libelle)}</td><td class="r">${l.qte}</td><td class="r">${fmt(l.pu)}</td><td class="r">${fmt(Math.round(l.qte*l.pu))}</td></tr>`).join('')}
   <tr><td colspan="3" class="r">${esc(L('Sous-total','Subtotal'))}</td><td class="r">${fmt(f.sous_total)}</td></tr>${f.remise?`<tr><td colspan="3" class="r">${esc(L('Remise','Discount'))}</td><td class="r">− ${fmt(f.remise)}</td></tr>`:''}
   ${f.tva_taux?`<tr><td colspan="3" class="r">TVA ${f.tva_taux} %</td><td class="r">${fmt(f.tva)}</td></tr>`:''}<tr><td colspan="3" class="r"><b>${esc(L('TOTAL','TOTAL'))}</b></td><td class="r"><b>${fmt(f.total)}</b></td></tr>
   ${f.part_assurance?`<tr><td colspan="3" class="r">${esc(L('Part prise en charge par l’assurance','Covered by insurance'))} (${f.taux_assurance} %)</td><td class="r">${fmt(f.part_assurance)}</td></tr><tr><td colspan="3" class="r"><b>${esc(L('À la charge du patient','Patient share'))}</b></td><td class="r"><b>${fmt(f.total_client)}</b></td></tr>`:''}
   ${f.type==='facture'&&f.paye?`<tr><td colspan="3" class="r">${esc(L('Déjà réglé','Already paid'))}</td><td class="r">${fmt(f.paye)}</td></tr><tr><td colspan="3" class="r"><b>${esc(L('Reste à payer','Balance due'))}</b></td><td class="r"><b>${fmt(reste)}</b></td></tr>`:''}</table>
   ${f.type==='facture'&&f.statut==='payee'?`<p style="text-align:center;color:#13734B;font-weight:800;font-size:14pt;margin-top:16px">✓ ${esc(L('PAYÉE','PAID'))}</p>`:f.type==='facture'?coBlocPaiement():''}
   ${f.note?`<p style="margin-top:16px;font-size:10.5pt;white-space:pre-wrap">${esc(f.note)}</p>`:''}
   <div class="sig"><div></div><div style="text-align:center">${esc(L('Cachet et signature','Stamp and signature'))}<br><br><br>${esc(CTX.espace.nom)}</div></div>`)}
function coImprimerRecu(r,f){const c=coCli(f.client_id),S=coS();const titre=coL(S.mots.recu||['Reçu','Receipt']);const re=coRes(f.ressource_id);
  rhPapier(titre+' '+r.numero,`<h1>${esc(titre.toUpperCase())} N° ${esc(r.numero)}</h1>
   <p>${esc(L('Nous soussignés','We, the undersigned,'))} <b>${esc(CTX.espace.nom)}</b>, ${esc(L('reconnaissons avoir reçu de','acknowledge receipt from'))} <b>${esc(c?.nom||'—')}</b> ${esc(L('la somme de','of the sum of'))} <b>${fmt(r.montant)}</b>, ${esc(L('payée par','paid by'))} ${esc(coMode(r.mode).toLowerCase())}${r.reference?' ('+esc(r.reference)+')':''}, ${esc(L('le','on'))} ${coDateL(r.date_reglement)}.</p>
   <table><tr><th>${esc(L('Pour','For'))}</th><td>${esc(coTitreDoc(f))} ${esc(f.numero)}${f.objet?' — '+esc(f.objet):''}${re?' — '+esc(re.nom):''}</td></tr><tr><th>${esc(L('Montant du document','Document total'))}</th><td>${fmt(f.total_client)}</td></tr>
   <tr><th>${esc(L('Total réglé à ce jour','Total paid to date'))}</th><td>${fmt(f.paye)}</td></tr><tr><th>${esc(L('Reste à payer','Balance due'))}</th><td><b>${fmt(Math.max(0,f.total_client-f.paye))}</b></td></tr></table>
   ${S.code==='immobilier'?`<p style="font-size:10pt;color:#667085;margin-top:12px">${esc(L('Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte sur la période concernée.','This receipt cancels any receipt previously issued as a deposit for the same period.'))}</p>`:''}
   <div class="sig"><div></div><div style="text-align:center">${esc(L('Cachet et signature','Stamp and signature'))}<br><br><br>${esc(CTX.espace.nom)}</div></div>`)}
/* Nettoyage : une facture par client pour les interventions terminées du mois */
async function coFacturerMois(){const ref=await coRef();const m=new Date();const d1=new Date(m.getFullYear(),m.getMonth(),1),d2=new Date(m.getFullYear(),m.getMonth()+1,1);
  modale(`<h3>${esc(L('Facturer le mois','Invoice the month'))}</h3><label>${esc(L('Mois','Month'))}</label><input type="month" name="mois" value="${d1.toISOString().slice(0,7)}">
   <p style="font-size:13px;color:var(--mut)">${esc(L('Une facture par client : le forfait mensuel de ses sites, ou à défaut ses interventions terminées et pas encore facturées.','One invoice per client: the monthly fee of their sites, or else their completed jobs not yet invoiced.'))}</p>`,
  async f=>{const[a,b]=f.mois.value.split('-').map(Number);const x1=new Date(a,b-1,1),x2=new Date(a,b,1);
    const rdv=verif(await sb.from('co_rdv').select('*').eq('espace_id',E()).eq('statut','termine').is('facture_id',null).gte('debut',x1.toISOString()).lt('debut',x2.toISOString()));
    const nomMois=x1.toLocaleDateString(LOC(),{month:'long',year:'numeric'});const parCli={};
    for(const s of ref.ressources.filter(r=>r.client_id&&r.prix>0&&r.statut!=='suspendu'))(parCli[s.client_id]=parCli[s.client_id]||{forfaits:[],rdv:[]}).forfaits.push(s);
    for(const r of rdv)if(r.client_id)(parCli[r.client_id]=parCli[r.client_id]||{forfaits:[],rdv:[]}).rdv.push(r);
    let n=0;for(const[cid,g]of Object.entries(parCli)){const lignes=g.forfaits.length?g.forfaits.map(s=>({libelle:`${s.nom} — ${L('forfait','monthly fee')} ${nomMois}`,qte:1,pu:+s.prix})):g.rdv.map(r=>({libelle:`${r.titre||coM('rdv')} — ${coDateL(r.debut)}`,qte:1,pu:+r.montant}));
      if(!lignes.some(l=>l.pu>0))continue;const fa=verif(await sb.from('co_factures').insert({espace_id:E(),type:'facture',client_id:cid,objet:L('Prestations ','Services ')+nomMois,lignes,tva_taux:+coReg('tva')||0,date_echeance:new Date(Date.now()+(+coReg('delai_paiement')||15)*864e5).toISOString().slice(0,10),created_by:CTX.membre.id}).select().single());
      if(g.rdv.length)await sb.from('co_rdv').update({facture_id:fa.id}).in('id',g.rdv.map(r=>r.id));n++}
    toast(L(`${n} facture(s) créée(s) ✓`,`${n} invoice(s) created ✓`));window._coFF='tous';coFactures()});
  $('#m-ok').textContent=L('Créer les factures','Create invoices');
}

/* ======================================================================
   ÉCHÉANCIERS (frais par tranches, loyers mensuels)
   ====================================================================== */
async function coEcheanciers(){const S=coS(),ref=await coRef(true),E2=S.echeancier||{mode:'tranches',tranches:3,libelle:['Échéancier','Payment plan']};
  const[ec,fa]=await Promise.all([sb.from('co_echeanciers').select('*').eq('espace_id',E()).order('created_at',{ascending:false}).limit(1000).then(verif),
    sb.from('co_factures').select('id,echeancier_id,total_client,paye,statut,date_echeance').eq('espace_id',E()).not('echeancier_id','is',null).limit(10000).then(verif)]);
  C().innerHTML=entete(esc(coM('echeanciers')),coRO()?'':`<button class="btn" id="ce-new">+ ${esc(coL(E2.libelle))}</button>`)+`
   <p style="color:var(--mut);margin:-8px 0 14px;font-size:14px">${esc(E2.mode==='mensuel'?L('Chaque loyer devient un avis d’échéance : vous encaissez, la quittance est prête.','Each month becomes a rent notice: collect it and the receipt is ready.'):L('Chaque tranche devient un avis de paiement : vous encaissez, le reçu est prêt, et les retards sont relancés.','Each instalment becomes a payment notice: collect it, the receipt is ready, and late payers get reminders.'))}</p>
   <div class="carte tab-scroll">${ec.length?`<table><tr><th>${esc(coM('client'))}</th><th>${esc(L('Libellé','Label'))}</th>${E2.ressource?`<th>${esc(coM('ressource'))}</th>`:''}<th style="text-align:right">Total</th><th>${esc(L('Payé','Paid'))}</th><th>${esc(L('Prochaine échéance','Next due'))}</th></tr>
   ${ec.map(e=>{const fs=fa.filter(f=>f.echeancier_id===e.id&&f.statut!=='annulee');const p=fs.reduce((a,f)=>a+(+f.paye),0),t=fs.reduce((a,f)=>a+(+f.total_client),0);const pro=fs.filter(f=>['emise','partielle'].includes(f.statut)).sort((a,b)=>a.date_echeance<b.date_echeance?-1:1)[0];const ret=pro&&pro.date_echeance<coAuj();
     return`<tr data-cli="${e.client_id}" style="cursor:pointer"><td><b>${esc(coCli(e.client_id)?.nom||'—')}</b>${S.echeancier?.groupe&&coCli(e.client_id)?.champs?.[S.echeancier.groupe]?`<br><small style="color:var(--mut)">${esc(coCli(e.client_id).champs[S.echeancier.groupe])}</small>`:''}</td><td>${esc(e.libelle)}</td>${E2.ressource?`<td>${esc(coRes(e.ressource_id)?.nom||'—')}</td>`:''}<td style="text-align:right">${fmt(t)}</td>
     <td style="min-width:120px"><div class="co-barre-b"><i style="width:${t?Math.round(100*p/t):0}%"></i></div><small>${fmt(p)}</small></td><td>${pro?`<span style="color:${ret?'var(--rouge)':'inherit'}">${coDateL(pro.date_echeance)}${ret?' ⚠️':''}</span>`:rhTag(L('Soldé','Settled'))}</td></tr>`}).join('')}</table>`
   :`<div class="vide">${esc(L('Aucun échéancier pour le moment.','No payment plans yet.'))}</div>`}</div>`;
  if($('#ce-new'))$('#ce-new').onclick=()=>coFormEcheancier();
  document.querySelectorAll('[data-cli]').forEach(t=>t.onclick=()=>coFicheClient(t.dataset.cli));
}
async function coFormEcheancier(){const S=coS(),ref=await coRef(),E2=S.echeancier||{mode:'tranches',tranches:3,libelle:['Échéancier','Payment plan']};const mens=E2.mode==='mensuel';
  const grp=E2.groupe,groupes=grp?[...new Set(ref.clients.map(c=>c.champs?.[grp]).filter(Boolean))].sort():[];
  const locs=ref.clients.filter(c=>!mens||c.categorie!=='proprietaire');const debut=new Date();debut.setDate(1);debut.setMonth(debut.getMonth()+(new Date().getDate()>5?1:0));
  modale(`<h3>+ ${esc(coL(E2.libelle))}</h3>
   ${grp&&groupes.length?`<label>${esc(L('Pour','For'))}</label><select name="cible" id="ef-cible"><option value="client">${esc(L('Un seul ','One '))}${esc(coLow(coM('client')))}</option>${groupes.map(g=>`<option value="g:${esc(g)}">${esc(L('Toute la classe ','Whole class '))}${esc(g)} (${ref.clients.filter(c=>c.champs?.[grp]===g).length})</option>`).join('')}</select>`:''}
   <div id="ef-cz"><label>${esc(coM('client'))}</label><select name="client_id"><option value="">—</option>${locs.map(c=>`<option value="${c.id}">${esc(c.nom)}${grp&&c.champs?.[grp]?' · '+esc(c.champs[grp]):''}</option>`).join('')}</select></div>
   ${E2.ressource?`<label>${esc(coM('ressource'))}</label><select name="ressource_id" id="ef-res"><option value="">—</option>${ref.ressources.map(r=>`<option value="${r.id}">${esc(r.nom)} · ${fmt(r.prix)}</option>`).join('')}</select>`:''}
   <label>${esc(L('Libellé','Label'))}</label><input name="libelle" required value="${esc(coL(E2.libelle))}${mens?'':' '+new Date().getFullYear()+'-'+(new Date().getFullYear()+1)}">
   <div class="grille2">${mens?`<div><label>${esc(L('Montant par mois','Amount per month'))}</label><input name="montant" type="number" min="1" step="any" required id="ef-mt"></div>
     <div><label>${esc(L('Nombre de mois','Number of months'))}</label><input name="nb" type="number" min="1" max="60" value="${E2.mois||12}" required></div>
     <div><label>${esc(L('Premier loyer le','First rent on'))}</label><input name="d1" type="date" required value="${debut.toISOString().slice(0,10)}"></div>`
    :`<div><label>${esc(L('Montant total','Total amount'))}</label><input name="montant" type="number" min="1" step="any" required id="ef-mt"></div>
     <div><label>${esc(L('Nombre de tranches','Number of instalments'))}</label><input name="nb" type="number" min="1" max="12" value="${E2.tranches||3}" required id="ef-nb"></div>
     <div><label>${esc(L('1re tranche le','1st instalment on'))}</label><input name="d1" type="date" required value="${coAuj()}" id="ef-d1"></div>
     <div><label>${esc(L('Puis tous les (mois)','Then every (months)'))}</label><input name="pas" type="number" min="1" max="12" value="3" id="ef-pas"></div>`}</div>
   <div id="ef-ap" style="font-size:13px;color:var(--mut);margin-top:10px"></div>`,
  async f=>{const v=Object.fromEntries(new FormData(f));const nb=+v.nb,mt=+v.montant;const lib=v.libelle.trim();const ech=[];
    for(let i=0;i<nb;i++){const d=new Date(v.d1+'T12:00:00');d.setMonth(d.getMonth()+i*(mens?1:+v.pas||1));
      const m=mens?mt:(i<nb-1?Math.round(mt/nb):mt-Math.round(mt/nb)*(nb-1));
      ech.push({date:d.toISOString().slice(0,10),montant:m,libelle:mens?`${lib} — ${d.toLocaleDateString(LOC(),{month:'long',year:'numeric'})}`:`${lib} — ${L('tranche','instalment')} ${i+1}/${nb}`})}
    let cibles=[];if(v.cible&&v.cible.startsWith('g:'))cibles=ref.clients.filter(c=>c.champs?.[grp]===v.cible.slice(2)).map(c=>c.id);else{if(!v.client_id)throw new Error(L('Choisissez le ','Choose the ')+coLow(coM('client')));cibles=[v.client_id]}
    for(const cid of cibles)verif(await sb.rpc('co_creer_echeancier',{p_espace:E(),p_client:cid,p_libelle:lib,p_type:mens?'mensuel':'tranches',p_echeances:ech,p_ressource:v.ressource_id||null,p_tva:+coReg('tva')||0}));
    if(mens&&v.ressource_id&&estGerant()){try{await sb.from('co_ressources').update({statut:'loue'}).eq('id',v.ressource_id)}catch{}}
    toast(L(`${cibles.length*nb} échéance(s) créée(s) ✓`,`${cibles.length*nb} instalment(s) created ✓`));coRefVider();aller(VUE)});
  rhModaleLarge();
  const ap=()=>{const nb=+document.querySelector('[name=nb]').value||0,mt=+$('#ef-mt').value||0;$('#ef-ap').textContent=mt&&nb?(mens?L(`${nb} loyers de ${fmt(mt)} = ${fmt(mt*nb)}`,`${nb} payments of ${fmt(mt)} = ${fmt(mt*nb)}`):L(`${nb} tranches d’environ ${fmt(Math.round(mt/nb))}`,`${nb} instalments of about ${fmt(Math.round(mt/nb))}`)):''};
  document.querySelectorAll('#modale-zone input').forEach(i=>i.addEventListener('input',ap));
  if($('#ef-res'))$('#ef-res').onchange=()=>{const r=coRes($('#ef-res').value);if(r){$('#ef-mt').value=(+r.prix||0)+(+r.champs?.charges||0);ap()}};
  if($('#ef-cible'))$('#ef-cible').onchange=()=>$('#ef-cz').classList.toggle('cache',$('#ef-cible').value!=='client');
}

/* ======================================================================
   DÉPENSES, FOURNISSEURS, BUDGET, BILAN DU MOIS
   ====================================================================== */
let CO_DMOIS=null;
async function coDepenses(){const S=coS(),ref=await coRef();CO_DMOIS=CO_DMOIS||coAuj().slice(0,7);const onglet=window._coDT||'depenses';
  const[a,b]=CO_DMOIS.split('-').map(Number);const d1=`${CO_DMOIS}-01`,d2=new Date(a,b,1);const d2s=`${d2.getFullYear()}-${String(d2.getMonth()+1).padStart(2,'0')}-01`;
  const[dep,bud,fo,fa,rg]=await Promise.all([sb.from('co_depenses').select('*').eq('espace_id',E()).gte('date_depense',d1).lt('date_depense',d2s).order('date_depense',{ascending:false}).then(verif),
    sb.from('co_budgets').select('*').eq('espace_id',E()).then(verif),sb.from('co_fournisseurs').select('*').eq('espace_id',E()).order('nom').then(verif),
    sb.from('co_factures').select('total,statut').eq('espace_id',E()).eq('type','facture').gte('date_emission',d1).lt('date_emission',d2s).then(verif),
    sb.from('co_reglements').select('montant,mode').eq('espace_id',E()).gte('date_reglement',d1).lt('date_reglement',d2s).then(verif)]);
  const totD=dep.reduce((x,d)=>x+(+d.montant),0),ca=fa.filter(f=>!['annulee','brouillon'].includes(f.statut)).reduce((x,f)=>x+(+f.total),0),enc=rg.filter(r=>r.mode!=='assurance').reduce((x,r)=>x+(+r.montant),0);
  const cats=[...new Set([...(S.depenses||[]),...dep.map(d=>d.categorie),...bud.map(x=>x.categorie)])];
  const nomMois=new Date(a,b-1,1).toLocaleDateString(LOC(),{month:'long',year:'numeric'});
  C().innerHTML=entete(esc(L('Dépenses','Expenses')),coRO()?'':`<button class="btn sec" id="cd-bud">${esc(L('Budget','Budget'))}</button> <button class="btn" id="cd-new">+ ${esc(L('Dépense','Expense'))}</button>`)+`
   <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px"><button class="btn sec pt" id="cd-p">←</button><b style="min-width:150px;text-align:center;text-transform:capitalize">${esc(nomMois)}</b><button class="btn sec pt" id="cd-s">→</button></div>
   <div class="kpis"><div class="kpi"><small>${esc(L('Facturé','Invoiced'))}</small><div>${fmt(ca)}</div></div><div class="kpi"><small>${esc(L('Encaissé','Collected'))}</small><div>${fmt(enc)}</div></div>
    <div class="kpi"><small>${esc(L('Dépenses','Expenses'))}</small><div>${fmt(totD)}</div></div><div class="kpi p"><small>${esc(L('Résultat du mois','Monthly result'))}</small><div>${fmt(enc-totD)}</div><small>${esc(L('encaissé − dépenses','collected − expenses'))}</small></div></div>
   ${rhChips('cd-o',[['depenses',L('Dépenses','Expenses')],['categories',L('Par catégorie et budget','By category & budget')],['fournisseurs',L('Fournisseurs','Suppliers')]],onglet)}<div id="cd-c"></div>`;
  $('#cd-p').onclick=()=>{const d=new Date(a,b-2,1);CO_DMOIS=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;coDepenses()};
  $('#cd-s').onclick=()=>{const d=new Date(a,b,1);CO_DMOIS=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;coDepenses()};
  document.querySelectorAll('#cd-o [data-chip]').forEach(x=>x.onclick=()=>{window._coDT=x.dataset.chip;coDepenses()});
  if($('#cd-new'))$('#cd-new').onclick=()=>coFormDepense({},fo,cats);if($('#cd-bud'))$('#cd-bud').onclick=()=>coFormBudget(cats,bud);
  if(onglet==='depenses')$('#cd-c').innerHTML=`<div class="carte tab-scroll">${dep.length?`<table><tr><th>Date</th><th>${esc(L('Catégorie','Category'))}</th><th>${esc(L('Libellé','Label'))}</th>${S.depenseParRessource?`<th>${esc(coM('ressource'))}</th>`:''}<th>${esc(L('Fournisseur','Supplier'))}</th><th style="text-align:right">${esc(L('Montant','Amount'))}</th><th></th></tr>
    ${dep.map(d=>`<tr><td>${coDateL(d.date_depense)}</td><td>${rhTag(esc(d.categorie),'gris')}</td><td>${esc(d.libelle)}</td>${S.depenseParRessource?`<td>${esc(coRes(d.ressource_id)?.nom||'—')}</td>`:''}<td>${esc(fo.find(x=>x.id===d.fournisseur_id)?.nom||'—')}</td><td style="text-align:right"><b>${fmt(d.montant)}</b></td><td>${coRO()?'':`<button class="btn pt lien" data-ed="${d.id}">${esc(L('Modifier','Edit'))}</button>`}</td></tr>`).join('')}</table>`
    :`<div class="vide">${esc(L('Aucune dépense ce mois-ci.','No expenses this month.'))}</div>`}</div>`;
  if(onglet==='categories'){const parC=cats.map(c=>[c,dep.filter(d=>d.categorie===c).reduce((x,d)=>x+(+d.montant),0),+bud.find(x=>x.categorie===c)?.montant||0]).filter(x=>x[1]||x[2]).sort((x,y)=>y[1]-x[1]);
    $('#cd-c').innerHTML=`<div class="carte">${parC.length?parC.map(([c,m,bg])=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:14px"><b>${esc(c)}</b><span>${fmt(m)}${bg?` / ${fmt(bg)}`:''}</span></div><div class="co-barre-b" style="margin-top:6px"><i class="${bg&&m>bg?'d':''}" style="width:${bg?Math.min(100,Math.round(100*m/bg)):totD?Math.round(100*m/totD):0}%"></i></div>${bg&&m>bg?`<small style="color:var(--rouge)">${esc(L('Budget dépassé de ','Over budget by '))}${fmt(m-bg)}</small>`:''}</div>`).join(''):`<div class="vide">${esc(L('Rien à afficher. Fixez un budget par catégorie avec le bouton « Budget ».','Nothing to show. Set a budget per category with the “Budget” button.'))}</div>`}</div>`}
  if(onglet==='fournisseurs'){$('#cd-c').innerHTML=`<div style="text-align:right;margin-bottom:10px">${coRO()?'':`<button class="btn sec pt" id="cf-nf">+ ${esc(L('Fournisseur','Supplier'))}</button>`}</div><div class="carte tab-scroll">${fo.length?`<table><tr><th>${esc(L('Nom','Name'))}</th><th>${esc(L('Catégorie','Category'))}</th><th>${esc(L('Téléphone','Phone'))}</th><th>${esc(L('E-mail','Email'))}</th><th></th></tr>${fo.map(x=>`<tr><td><b>${esc(x.nom)}</b></td><td>${esc(x.categorie||'')}</td><td>${x.telephone?`<a target="_blank" href="https://wa.me/${coTel(x.telephone)}">${esc(x.telephone)}</a>`:''}</td><td>${esc(x.email||'')}</td><td>${coRO()?'':`<button class="btn pt lien" data-fo="${x.id}">${esc(L('Modifier','Edit'))}</button>`}</td></tr>`).join('')}</table>`:`<div class="vide">${esc(L('Aucun fournisseur','No suppliers'))}</div>`}</div>`;
    if($('#cf-nf'))$('#cf-nf').onclick=()=>coFormFournisseur();document.querySelectorAll('[data-fo]').forEach(x=>x.onclick=()=>coFormFournisseur(fo.find(y=>y.id===x.dataset.fo)))}
  document.querySelectorAll('#cd-c [data-ed]').forEach(x=>x.onclick=()=>coFormDepense(dep.find(d=>d.id===x.dataset.ed),fo,cats));
}
function coFormDepense(d={},fo=[],cats=[]){const S=coS();
  modale(`<h3>${d.id?esc(L('Modifier','Edit')):'+ '+esc(L('Dépense','Expense'))}</h3>
   <div class="grille2"><div><label>${esc(L('Date','Date'))}</label><input name="date_depense" type="date" value="${d.date_depense||coAuj()}" required></div>
   <div><label>${esc(L('Montant','Amount'))}</label><input name="montant" type="number" min="0" step="any" required value="${d.montant??''}"></div>
   <div><label>${esc(L('Catégorie','Category'))}</label><input name="categorie" list="cd-cats" required value="${esc(d.categorie||'')}"><datalist id="cd-cats">${cats.map(c=>`<option value="${esc(c)}">`).join('')}</datalist></div>
   <div><label>${esc(L('Payé par','Paid by'))}</label><select name="mode">${['Espèces','Mobile Money','Virement','Chèque','Carte'].map(m=>`<option ${m===d.mode?'selected':''}>${esc(m)}</option>`).join('')}</select></div></div>
   <label>${esc(L('Libellé','Label'))}</label><input name="libelle" required maxlength="200" value="${esc(d.libelle)}">
   <div class="grille2"><div><label>${esc(L('Fournisseur','Supplier'))}</label><select name="fournisseur_id"><option value="">—</option>${fo.map(x=>`<option value="${x.id}" ${x.id===d.fournisseur_id?'selected':''}>${esc(x.nom)}</option>`).join('')}</select></div>
   ${CO_REF?.ressources?.length?`<div><label>${esc(coM('ressource'))} ${esc(L('(facultatif)','(optional)'))}</label><select name="ressource_id"><option value="">—</option>${CO_REF.ressources.map(r=>`<option value="${r.id}" ${r.id===d.ressource_id?'selected':''}>${esc(r.nom)}</option>`).join('')}</select></div>`:''}</div>
   <label>${esc(L('Note','Note'))}</label><input name="note" value="${esc(d.note)}">
   ${d.id?`<button type="button" class="btn rouge pt" style="margin-top:12px" id="cd-sup">${esc(L('Supprimer','Delete'))}</button>`:''}`,
  async f=>{const v=Object.fromEntries(new FormData(f));const row={date_depense:v.date_depense,montant:+v.montant||0,categorie:v.categorie.trim(),mode:v.mode,libelle:v.libelle.trim(),fournisseur_id:v.fournisseur_id||null,ressource_id:v.ressource_id||null,note:v.note||null};
    if(d.id)verif(await sb.from('co_depenses').update(row).eq('id',d.id));else verif(await sb.from('co_depenses').insert({...row,espace_id:E(),created_by:CTX.membre.id}));toast(L('Enregistré ✓','Saved ✓'));coDepenses()});
  if($('#cd-sup'))$('#cd-sup').onclick=async()=>{if(!confirm(L('Supprimer cette dépense ?','Delete this expense?')))return;verif(await sb.from('co_depenses').delete().eq('id',d.id));fermer();coDepenses()};
}
function coFormBudget(cats,bud){
  modale(`<h3>${esc(L('Budget mensuel par catégorie','Monthly budget per category'))}</h3><p style="color:var(--mut);font-size:13px">${esc(L('Laissez vide pour ne pas suivre une catégorie.','Leave empty not to track a category.'))}</p>
   ${cats.map((c,i)=>`<div style="display:grid;grid-template-columns:1fr 160px;gap:10px;align-items:center;margin-top:6px"><span>${esc(c)}</span><input type="number" min="0" step="any" name="b${i}" value="${bud.find(x=>x.categorie===c)?.montant??''}"></div>`).join('')}`,
  async f=>{const v=Object.fromEntries(new FormData(f));const up=[],del=[];cats.forEach((c,i)=>{const m=v['b'+i];if(m!==''&&+m>0)up.push({espace_id:E(),categorie:c,montant:+m});else if(bud.some(x=>x.categorie===c))del.push(c)});
    if(up.length)verif(await sb.from('co_budgets').upsert(up));if(del.length)verif(await sb.from('co_budgets').delete().eq('espace_id',E()).in('categorie',del));toast(L('Budget enregistré ✓','Budget saved ✓'));window._coDT='categories';coDepenses()});rhModaleLarge()}
function coFormFournisseur(x={}){
  modale(`<h3>${x.id?esc(L('Modifier','Edit')):'+ '+esc(L('Fournisseur','Supplier'))}</h3><label>${esc(L('Nom','Name'))}</label><input name="nom" required value="${esc(x.nom)}">
   <div class="grille2"><div><label>${esc(L('Catégorie','Category'))}</label><input name="categorie" value="${esc(x.categorie)}"></div><div><label>${esc(L('Téléphone','Phone'))}</label><input name="telephone" value="${esc(x.telephone)}"></div></div>
   <label>${esc(L('E-mail','Email'))}</label><input name="email" type="email" value="${esc(x.email)}"><label>${esc(L('Note','Note'))}</label><input name="note" value="${esc(x.note)}">`,
  async f=>{const v=Object.fromEntries(new FormData(f));const row={nom:v.nom.trim(),categorie:v.categorie||null,telephone:v.telephone||null,email:v.email||null,note:v.note||null};
    if(x.id)verif(await sb.from('co_fournisseurs').update(row).eq('id',x.id));else verif(await sb.from('co_fournisseurs').insert({...row,espace_id:E()}));toast(L('Enregistré ✓','Saved ✓'));window._coDT='fournisseurs';coDepenses()})}

/* ======================================================================
   NOTIFICATIONS, SMS, E-MAILS
   ====================================================================== */
async function coNotifier(corps){const{data:{session}}=await sb.auth.getSession();
  const r=await fetch(SB_URL+'/functions/v1/notifier',{method:'POST',headers:{'Content-Type':'application/json',apikey:SB_KEY,Authorization:'Bearer '+session.access_token},body:JSON.stringify({espace_id:E(),langue:LANG,...corps})});
  const j=await r.json();if(!r.ok||j.erreur)throw new Error(j.erreur||'Erreur');return j}
async function coEnvoyerSMS(tel,msg){return new Promise(ok=>{
  modale(`<h3>SMS</h3><label>${esc(L('Numéro avec indicatif','Number with country code'))}</label><input name="to" required value="${esc(coTel(tel))}" inputmode="tel"><label>${esc(L('Message','Message'))}</label><textarea name="m" rows="5" maxlength="450">${esc(msg)}</textarea><p id="sms-q" style="font-size:12px;color:var(--mut)"></p>`,
   async f=>{const j=await coNotifier({action:'sms',to:f.to.value,message:f.m.value});toast(L(`SMS envoyé ✓ (${j.quota.utilises}/${j.quota.quota} ce mois)`,`SMS sent ✓ (${j.quota.utilises}/${j.quota.quota} this month)`));ok(true)});
  $('#m-ok').textContent=L('Envoyer','Send');$('#m-ann').addEventListener('click',()=>ok(false));
  coNotifier({action:'quota_sms'}).then(j=>{if($('#sms-q'))$('#sms-q').textContent=L(`SMS utilisés ce mois : ${j.quota.utilises} / ${j.quota.quota}`,`SMS used this month: ${j.quota.utilises} / ${j.quota.quota}`)}).catch(()=>{})})}
const CO_LIENS={support:'co_support',agenda:'co_agenda',factures:'co_factures',ressources:'co_ressources',demandes:'co_demandes',clients:'co_clients'};
async function coNotifs(){const l=verif(await sb.from('co_notifications').select('*').eq('espace_id',E()).order('created_at',{ascending:false}).limit(100));
  C().innerHTML=entete(esc(L('Notifications','Notifications')),l.some(n=>!n.lu)?`<button class="btn sec" id="cn-tout">${esc(L('Tout marquer comme lu','Mark all as read'))}</button>`:'')+`<div class="carte">${l.length?l.map(n=>`<div class="co-notif ${n.lu?'':'nonlu'}" data-n="${n.id}"><span class="co-pt"></span><div style="flex:1"><b>${esc(n.titre)}</b>${n.message?`<br><small>${esc(n.message)}</small>`:''}<br><small>${dt(n.created_at)}</small></div></div>`).join(''):`<div class="vide">${esc(L('Aucune notification','No notifications'))}</div>`}</div>`;
  if($('#cn-tout'))$('#cn-tout').onclick=async()=>{await sb.from('co_notifications').update({lu:true}).eq('espace_id',E()).eq('lu',false);CO_NB_NOTIFS=0;coNotifs()};
  document.querySelectorAll('[data-n]').forEach(d=>d.onclick=async()=>{const n=l.find(x=>x.id===d.dataset.n);if(!n.lu){await sb.from('co_notifications').update({lu:true}).eq('id',n.id);CO_NB_NOTIFS=Math.max(0,CO_NB_NOTIFS-1)}
    if(n.lien==='support')return coSupport();
    const v=CO_LIENS[n.lien];if(v&&(v==='co_demandes'||coActif())){if(v==='co_agenda'&&n.type==='reservation')window._coFiltre='demandes';aller(v)}else coNotifs()});
}

/* ======================================================================
   MODULES ET RÉGLAGES (activation, rubriques renommées, champs, paiement)
   ====================================================================== */
async function coModules(){const S=coS(),e=CTX.espace,reg=e.reglages||{},co=coActif(),pr=coPrincipal();
  const MODS=[['agenda',coM('rdvs'),L('Calendrier, créneaux, rappels','Calendar, time slots, reminders')],['clients',coM('clients'),L('Fiches, historique, import Excel','Profiles, history, Excel import')],
    ['ressources',coM('ressources'),L('Ce que vous louez, réservez ou utilisez','What you rent, book or use')],['prestations',coM('prestations'),L('Catalogue, prix, durées','Catalogue, prices, durations')],
    ['factures',L('Devis et factures','Quotes & invoices'),L('Devis → facture → reçu, relances','Quote → invoice → receipt, reminders')],['echeanciers',coM('echeanciers'),L('Paiement en plusieurs fois','Pay in instalments')],
    ['depenses',L('Dépenses','Expenses'),L('Achats, fournisseurs, budget, bilan','Purchases, suppliers, budget, result')],['reservation',L('Réservation en ligne','Online booking'),L('Lien public pour vos clients','Public link for your customers')],
    ['stock',L('Stock & Ventes','Inventory & Sales'),L('Articles, caisse, ventes','Products, checkout, sales')],['rh',L('RH Pro','HR Pro'),L('Employés, congés, pointage, paie','Employees, leave, time clock, payroll')],...(S.modulesMetier||[]).map(m=>[m[0],coL(m[1]),coL(m[2])])];
  const lienRes=location.origin+location.pathname.replace(/[^/]*$/,'')+'reserver.html?e='+e.slug;
  const libs=[['clients',L('Rubrique des clients','Customers section')],['client',L('Un client','One customer')],['ressources',L('Rubrique des ressources','Resources section')],['ressource',L('Une ressource','One resource')],['rdvs',L('Rubrique de l’agenda','Calendar section')],['rdv',L('Un rendez-vous','One appointment')],['prestations',L('Rubrique des prestations','Services section')],['membre',L('Un collaborateur','One team member')]];
  const perso=e.champs_perso||{};
  C().innerHTML=entete(esc(L('Modules et réglages','Modules & settings')))+`<div class="deux">
   <div class="carte"><h3 style="margin-top:0">${esc(L('Modules de votre espace','Your workspace modules'))}</h3><p style="color:var(--mut);font-size:13px;margin-top:-6px">${esc(L('Tous les modules de votre secteur sont inclus dans votre pack. Activez seulement ce dont vous avez besoin.','Every module for your sector is included in your plan. Turn on only what you need.'))}</p>
    ${MODS.filter(([k])=>pr||!['ressources','echeanciers','reservation'].includes(k)||co).map(([k,t,d])=>{const fixe=(k==='stock'&&!pr&&CTX.logiciels.includes('stockpro')&&!CTX.licences.find(l=>l.logiciel==='stockpro')?.inclus_dans)||(k==='rh'&&!pr&&CTX.logiciels.includes('rhpro')&&!CTX.licences.find(l=>l.logiciel==='rhpro')?.inclus_dans);
      const on=['stock','rh'].includes(k)?coMod(k):co&&coMod(k);return`<label class="co-switch"><span><b>${esc(t)}</b><small>${esc(d)}</small></span><input type="checkbox" data-mod="${k}" ${on?'checked':''} ${fixe?'disabled':''}></label>`}).join('')}</div>
   <div>
   ${co&&coMod('reservation')?`<div class="carte" style="margin-bottom:14px"><h3 style="margin-top:0">🌐 ${esc(L('Votre lien de réservation','Your booking link'))}</h3><p style="color:var(--mut);font-size:13px">${esc(L('À mettre dans votre bio Instagram, votre statut WhatsApp, vos affiches.','Put it in your Instagram bio, WhatsApp status, posters.'))}</p>
     <div class="rh-lien"><b>${esc(lienRes)}</b></div><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn sec pt" id="cm-cp">${esc(L('Copier','Copy'))}</button><a class="btn sec pt" target="_blank" href="${esc(lienRes)}">${esc(L('Voir la page','Open the page'))}</a><a class="btn sec pt" target="_blank" href="https://wa.me/?text=${encodeURIComponent(L('Réservez en ligne chez ','Book online at ')+e.nom+' : '+lienRes)}">WhatsApp</a></div></div>`:''}
   <form class="carte" id="cm-reg"><h3 style="margin-top:0">${esc(L('Factures et paiements','Invoices & payments'))}</h3>
     <div class="grille2"><div><label>${esc(L('TVA par défaut (%)','Default VAT (%)'))}</label><input name="tva" type="number" min="0" max="100" step="any" value="${reg.tva??0}"></div>
     <div><label>${esc(L('Délai de paiement (jours)','Payment terms (days)'))}</label><input name="delai_paiement" type="number" min="0" max="365" value="${reg.delai_paiement??15}"></div>
     <div><label>${esc(L('Numéro Mobile Money','Mobile Money number'))}</label><input name="mobile_money" value="${esc(reg.mobile_money||'')}" placeholder="MTN · +229 …"></div>
     <div><label>${esc(L('Lien de paiement (Chariow, Wave…)','Payment link (Chariow, Wave…)'))}</label><input name="lien_paiement" type="url" value="${esc(reg.lien_paiement||'')}" placeholder="https://"></div></div>
     <label>${esc(L('Coordonnées bancaires (facultatif)','Bank details (optional)'))}</label><input name="rib" value="${esc(reg.rib||'')}">
     <label>${esc(L('Mention en bas des factures','Footer note on invoices'))}</label><textarea name="mentions" rows="2">${esc(reg.mentions||'')}</textarea>
     ${S.code==='hotel'?`<label>${esc(L('Mois de haute saison','High-season months'))}</label><div style="display:flex;flex-wrap:wrap;gap:6px">${Array.from({length:12},(_,i)=>`<label style="margin:0;display:flex;gap:4px;align-items:center;font-weight:500;font-size:13px"><input type="checkbox" name="hs${i+1}" style="width:auto" ${(reg.haute_saison||S.reglagesDefaut?.haute_saison||[]).includes(i+1)?'checked':''}>${new Date(2026,i,1).toLocaleDateString(LOC(),{month:'short'})}</label>`).join('')}</div>`:''}
     ${S.fidelite?`<div class="grille2"><div><label>${esc(L('Visites pour une récompense','Visits for a reward'))}</label><input name="fidelite_seuil" type="number" min="2" max="50" value="${reg.fidelite_seuil??10}"></div><div><label>${esc(L('Récompense','Reward'))}</label><input name="fidelite_cadeau" value="${esc(reg.fidelite_cadeau||'')}" placeholder="${esc(L('ex. un brushing offert','e.g. a free blow-dry'))}"></div></div>`:''}
     ${coMod('reservation')?`<div class="co-grille3"><div><label>${esc(L('Ouverture','Opens'))}</label><input name="h_ouv" type="time" value="${reg.horaires?.ouverture||'08:00'}"></div><div><label>${esc(L('Fermeture','Closes'))}</label><input name="h_fer" type="time" value="${reg.horaires?.fermeture||'18:00'}"></div><div><label>${esc(L('Jours fermés','Closed on'))}</label><select name="h_ferme"><option value="0" ${(reg.horaires?.fermes||[0]).join()==='0'?'selected':''}>${esc(L('Dimanche','Sunday'))}</option><option value="" ${(reg.horaires?.fermes||[0]).length===0?'selected':''}>${esc(L('Aucun','None'))}</option><option value="0,6" ${(reg.horaires?.fermes||[]).join()==='0,6'?'selected':''}>${esc(L('Samedi et dimanche','Weekend'))}</option></select></div></div>`:''}
     <div class="err" id="cm-err"></div><button class="btn" style="margin-top:12px">${esc(L('Enregistrer','Save'))}</button></form></div></div>
   ${co?`<div class="deux" style="margin-top:14px"><form class="carte" id="cm-lib"><h3 style="margin-top:0">${esc(L('Votre vocabulaire','Your own words'))}</h3><p style="color:var(--mut);font-size:13px;margin-top:-6px">${esc(L('Renommez les rubriques comme vous parlez dans votre entreprise.','Rename sections the way your business talks.'))}</p>
     <div class="grille2">${libs.map(([k,t])=>`<div><label>${esc(t)}</label><input name="${k}" value="${esc((e.libelles||{})[k]||'')}" placeholder="${esc(coL(S.mots[k]))}"></div>`).join('')}</div><button class="btn" style="margin-top:12px">${esc(L('Enregistrer','Save'))}</button></form>
    <div class="carte"><h3 style="margin-top:0">${esc(L('Vos champs à vous','Your own fields'))}</h3><p style="color:var(--mut);font-size:13px;margin-top:-6px">${esc(L('Ajoutez les informations dont vous avez besoin sur vos fiches.','Add the information you need on your records.'))}</p>
     ${['client','ressource'].map(t=>`<h4 style="margin:12px 0 4px">${esc(t==='client'?coM('clients'):coM('ressources'))}</h4><div class="rh-liste">${(perso[t]||[]).map((c,i)=>`<div><span>${esc(c.l)} <small>(${esc(c.t||'text')})</small></span><button class="btn pt lien" data-dch="${t}:${i}">✕</button></div>`).join('')||`<div><small>—</small></div>`}</div><button class="btn sec pt" data-ach="${t}" style="margin-top:6px">+ ${esc(L('Champ','Field'))}</button>`).join('')}</div></div>`:''}`;
  document.querySelectorAll('[data-mod]').forEach(i=>i.onchange=async()=>{i.disabled=true;try{verif(await sb.rpc('co_activer_module',{p_espace:E(),p_module:i.dataset.mod,p_actif:i.checked}));
    await coRafraichir();toast(L('Module mis à jour ✓','Module updated ✓'));coModules()}catch(e){toast(erreurMsg(e));i.checked=!i.checked;i.disabled=false}});
  if($('#cm-cp'))$('#cm-cp').onclick=()=>{navigator.clipboard?.writeText(lienRes);toast(L('Lien copié','Link copied'))};
  $('#cm-reg').onsubmit=async ev=>{ev.preventDefault();const v=Object.fromEntries(new FormData(ev.target));const r={...reg,tva:+v.tva||0,delai_paiement:+v.delai_paiement||0,mobile_money:v.mobile_money||null,lien_paiement:v.lien_paiement||null,rib:v.rib||null,mentions:v.mentions||null};
    if(S.code==='hotel')r.haute_saison=Array.from({length:12},(_,i)=>i+1).filter(m=>v['hs'+m]);if(S.fidelite){r.fidelite_seuil=+v.fidelite_seuil||10;r.fidelite_cadeau=v.fidelite_cadeau||null}
    if('h_ouv' in v)r.horaires={ouverture:v.h_ouv,fermeture:v.h_fer,fermes:v.h_ferme===''?[]:v.h_ferme.split(',').map(Number)};
    try{const m=verif(await sb.from('espaces').update({reglages:r}).eq('id',e.id).select().single());CTX.espace=m;toast(L('Enregistré ✓','Saved ✓'))}catch(er){$('#cm-err').textContent=erreurMsg(er)}};
  if($('#cm-lib'))$('#cm-lib').onsubmit=async ev=>{ev.preventDefault();const v=Object.fromEntries(new FormData(ev.target));const lb={};for(const[k,x]of Object.entries(v))if(x.trim())lb[k]=x.trim().slice(0,40);
    const m=verif(await sb.from('espaces').update({libelles:lb}).eq('id',e.id).select().single());CTX.espace=m;construireMenu();toast(L('Enregistré ✓','Saved ✓'));coModules()};
  document.querySelectorAll('[data-ach]').forEach(b=>b.onclick=()=>modale(`<h3>+ ${esc(L('Champ','Field'))}</h3><label>${esc(L('Nom du champ','Field name'))}</label><input name="l" required maxlength="40"><label>${esc(L('Type','Type'))}</label><select name="t"><option value="text">${esc(L('Texte','Text'))}</option><option value="number">${esc(L('Nombre','Number'))}</option><option value="date">${esc(L('Date','Date'))}</option><option value="textarea">${esc(L('Texte long','Long text'))}</option></select>
    <p style="font-size:12px;color:var(--mut)">${esc(L('Astuce : un champ de type date dont le nom finit par « fin » (ex. « Assurance fin ») déclenche une alerte d’échéance.','Tip: a date field whose name ends with “end” triggers an expiry alert.'))}</p>`,
    async f=>{const t=b.dataset.ach;const l=f.l.value.trim();let k='p_'+coNorm(l).slice(0,24);if(f.t.value==='date'&&/(fin|end|expir)/i.test(l))k+='_fin';const p={...(CTX.espace.champs_perso||{})};p[t]=[...(p[t]||[]).filter(c=>c.k!==k),{k,l,t:f.t.value}];
      const m=verif(await sb.from('espaces').update({champs_perso:p}).eq('id',e.id).select().single());CTX.espace=m;toast(L('Champ ajouté ✓','Field added ✓'));coModules()}));
  document.querySelectorAll('[data-dch]').forEach(b=>b.onclick=async()=>{const[t,i]=b.dataset.dch.split(':');if(!confirm(L('Retirer ce champ ? Les valeurs déjà saisies restent enregistrées.','Remove this field? Values already entered are kept.')))return;
    const p={...(CTX.espace.champs_perso||{})};p[t]=(p[t]||[]).filter((_,j)=>j!==+i);const m=verif(await sb.from('espaces').update({champs_perso:p}).eq('id',e.id).select().single());CTX.espace=m;coModules()});
}

/* ======================================================================
   SUR MESURE : demander une fonctionnalité
   ====================================================================== */
function coDemander(){
  modale(`<h3>💡 ${esc(L('Demander une fonctionnalité','Request a feature'))}</h3><p style="color:var(--mut);font-size:14px;margin:4px 0 6px">${esc(L('Il vous manque quelque chose ? Décrivez-le : l’équipe Ilano étudie votre demande et vous répond avec un devis.','Missing something? Describe it: the Ilano team reviews your request and replies with a quote.'))}</p>
   <label>${esc(L('En quelques mots','In a few words'))}</label><input name="titre" required minlength="3" maxlength="150" placeholder="${esc(L('ex. Envoyer les bulletins aux parents par WhatsApp','e.g. Send report cards to parents on WhatsApp'))}">
   <label>${esc(L('Décrivez votre besoin','Describe what you need'))}</label><textarea name="description" required minlength="5" rows="5" placeholder="${esc(L('Ce que vous voulez faire, qui va l’utiliser, comment vous faites aujourd’hui…','What you want to do, who will use it, how you do it today…'))}"></textarea>
   <label>${esc(L('Urgence','Urgency'))}</label><select name="urgence"><option value="normale">${esc(L('Normale','Normal'))}</option><option value="importante">${esc(L('Importante','Important'))}</option><option value="urgente">${esc(L('Urgente','Urgent'))}</option></select>`,
  async f=>{const v=Object.fromEntries(new FormData(f));const id=verif(await sb.rpc('co_demander',{p_espace:E(),p_titre:v.titre,p_description:v.description,p_urgence:v.urgence}));
    coNotifier({action:'demande',demande_id:id}).catch(()=>{});toast(L('Demande envoyée ✓ Nous vous répondons très vite.','Request sent ✓ We’ll get back to you soon.'));if(VUE==='co_demandes')coDemandes()});
  $('#m-ok').textContent=L('Envoyer la demande','Send request');
}
const CO_ST_DEM={nouvelle:['Envoyée','Sent','orange'],en_etude:['À l’étude','Under review','orange'],devis_envoye:['Devis envoyé','Quote sent',''],acceptee:['Acceptée','Accepted',''],refusee:['Non retenue','Declined','gris'],livree:['Livrée ✓','Delivered ✓','']};
async function coDemandes(){const l=verif(await sb.from('co_demandes').select('*').eq('espace_id',E()).order('created_at',{ascending:false}));
  C().innerHTML=entete(esc(L('Sur mesure','Custom requests')),`<button class="btn" onclick="coDemander()">💡 ${esc(L('Demander une fonctionnalité','Request a feature'))}</button>`)+`
   <div class="carte" style="margin-bottom:14px;background:var(--p2);border-color:transparent"><b>${esc(L('Votre logiciel grandit avec vous.','Your software grows with you.'))}</b><br><span style="font-size:14px;color:#344054">${esc(L('Un document, un calcul, un espace pour un nouveau rôle ? Demandez-le ici : nous l’étudions et vous répondons par un devis.','A document, a calculation, a space for a new role? Ask here: we review it and reply with a quote.'))}</span></div>
   <div class="carte">${l.length?`<div class="rh-liste">${l.map(d=>{const s=CO_ST_DEM[d.statut]||[d.statut,d.statut,''];return`<div style="display:block"><div style="display:flex;justify-content:space-between;gap:10px"><b>${esc(d.titre)}</b>${rhTag(esc(LANG==='en'?s[1]:s[0]),s[2])}</div><small>${dt(d.created_at)} · ${esc(L('urgence ','urgency '))}${esc(d.urgence)}</small>
    <div class="rh-texte" style="margin-top:6px">${esc(d.description)}</div>${d.reponse?`<div style="margin-top:8px;font-size:14px"><b>${esc(L('Réponse Ilano :','Ilano’s answer:'))}</b> ${esc(d.reponse)}${d.montant_devis?` · <b>${fmt(d.montant_devis)}</b>`:''}</div>`:''}</div>`}).join('')}</div>`
    :`<div class="vide">${esc(L('Aucune demande pour le moment.','No requests yet.'))}</div>`}</div>`}

/* ======================================================================
   INSCRIPTION : secteur choisi → modèle appliqué ; liens ?secteur=…
   ====================================================================== */
const CO_SECT_LIEN={hotel:'hotel',ecole:'ecole',clinique:'clinique',immobilier:'immobilier',transport:'transport',beaute:'beaute',nettoyage:'nettoyage',commerce:'commerce',rh:'rh'};
function coInscriptionInit(){const sel=$('#i-sect');if(!sel)return;
  const q=(params.get('secteur')||'').toLowerCase();
  if(CO_SECT_LIEN[q]){const o=[...sel.options].find(o=>o.dataset.modele===q);if(o)o.selected=true;
    const S=(window.ILANO_SECTEURS||{})[q];
    const T={hotel:[L('Votre hôtel, simplement.','Run your hotel, simply.'),L('Chambres, réservations, check-in / check-out, ménage et factures de séjour, sur ordinateur et téléphone.','Rooms, bookings, check-in / check-out, housekeeping and stay invoices — on computer and phone.')],
      ecole:[L('Votre école, sans cahier.','Run your school, paper-free.'),L('Élèves, classes, frais de scolarité par tranches, reçus et relances des impayés.','Students, classes, tuition by instalments, receipts and reminders for late payers.')],
      clinique:[L('Votre clinique, bien organisée.','Your clinic, well organized.'),L('Patients, rendez-vous, consultations, actes, facturation avec part assurance et pharmacie.','Patients, appointments, consultations, procedures, billing with insurance share and pharmacy.')],
      immobilier:[L('Vos biens et vos loyers, sous contrôle.','Your properties and rent, under control.'),L('Biens, locataires, propriétaires, loyers mensuels, quittances et relances.','Properties, tenants, landlords, monthly rent, receipts and reminders.')],
      transport:[L('Votre flotte, toujours en règle.','Your fleet, always compliant.'),L('Véhicules, chauffeurs, missions, carburant, entretien et recette par véhicule.','Vehicles, drivers, jobs, fuel, maintenance and revenue per vehicle.')],
      beaute:[L('Votre salon, toujours complet.','Keep your salon fully booked.'),L('Rendez-vous en ligne, prestations, employées, fidélité et rappels WhatsApp.','Online booking, services, staff, loyalty and WhatsApp reminders.')],
      nettoyage:[L('Vos équipes, vos sites, vos factures.','Your teams, sites and invoices.'),L('Clients et sites, interventions planifiées, équipes assignées, facturation mensuelle.','Clients and sites, planned jobs, assigned teams, monthly invoicing.')]}[q];
    if(T){$('#auth-titre').innerHTML=`<span>${esc(T[0])}</span><span class="acc">${esc(L('Tout est prêt.','You’re all set.'))}</span>`;$('#auth-texte').textContent=T[1]}
    if(S?.icone)$('#auth-badge').textContent=S.icone+' '+coL(S.nom)+' · '+L('Essai gratuit 14 jours','14-day free trial');
    ongletIns();}
  sel.addEventListener('change',coInfoSecteur);coInfoSecteur();
}
function coInfoSecteur(){const o=$('#i-sect').selectedOptions[0];const m=o?.dataset.modele;const z=$('#sect-ok');if(!z)return;
  const S=(window.ILANO_SECTEURS||{})[m];const couvert=S&&!S.existant&&!['securite','btp','generique'].includes(m);
  z.classList.toggle('cache',!couvert&&m!=='generique');
  if(couvert){const MOTS={agenda:coL(S.mots.rdvs),clients:coL(S.mots.clients),ressources:coL(S.mots.ressources),prestations:coL(S.mots.prestations),factures:L('devis, factures et reçus','quotes, invoices and receipts'),echeanciers:coL(S.mots.echeanciers||['Échéanciers','Payment plans']),depenses:L('dépenses','expenses'),stock:L('pharmacie (stock)','pharmacy (stock)'),reservation:L('réservation en ligne','online booking')};
    z.innerHTML=`✓ ${esc(L('Votre espace','Your workspace'))} <b>${S.icone} ${esc(coL(S.nom))}</b> ${esc(L('est prêt tout de suite :','is ready right away:'))} ${esc(Object.entries(S.modules).filter(([,v])=>v).map(([k])=>MOTS[k]).filter(Boolean).join(', ').toLowerCase())}.`}
  else if(m==='generique')z.innerHTML=`✓ ${esc(L('Votre espace démarre avec le socle Ilano : clients, agenda, prestations, devis et factures, dépenses. Demandez ensuite les fonctionnalités propres à votre métier.','Your workspace starts with the Ilano core: customers, calendar, services, quotes & invoices, expenses. Then request the features your trade needs.'))}`;
}
function coModeleInscription(){return $('#i-sect').selectedOptions[0]?.dataset.modele||'commerce'}

/* ---------- Table des vues ---------- */
window.CO_VUES={co_accueil:coAccueil,co_agenda:coAgenda,co_clients:coClients,co_ressources:coRessources,co_prestations:coPrestations,co_factures:coFactures,
  co_echeanciers:coEcheanciers,co_depenses:coDepenses,co_modules:coModules,co_demandes:coDemandes,co_notifs:coNotifs,co_mes:coMes};
Object.assign(window.RH_VUES,window.CO_VUES);
RH_NOMS.ilano='Ilano';
