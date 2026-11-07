/* ---------- Prospects : agences de sécurité à démarcher (feuille « Prospects ») ---------- */
const P_ST = ["À contacter","Contacté","Relancé","En discussion","Intéressé","Démo faite","Gagné","Pas intéressé"];
const P_DONE_KEY = "sc_pros_contact";
const P_TPL_KEY = "sc_pros_tpl";
const P_VISIT = ["Togo","Bénin","Mali"]; // représentants sur place (Lomé, Cotonou, Bamako)
const P_TPL = {
  premier:{n:"Premier contact",d:"Agences moyennes et petites",t:"Imaginez gérer tous vos agents depuis votre téléphone : planning, pointage sur site, rondes, alerte SOS et rapports clients. Fini Excel, les cahiers de présence et les appels pour savoir qui est à son poste.\n\nSécuriPro est conçu pour les sociétés de gardiennage comme {agence}.\nRépondez DÉMO et je vous envoie l'accès gratuit.\n\nSACKO CONCEPT · sackoconcept.com"},
  grandes:{n:"Grandes agences",d:"Direction, plusieurs sites",t:"Imaginez voir en temps réel, sur tous vos sites, quels agents sont à leur poste, quelles rondes sont faites et quelles alertes sont en cours.\n\nSécuriPro est le logiciel de gestion des sociétés de gardiennage : planning, pointage, rondes, SOS, paie et rapports clients, installé à vos couleurs sur votre propre nom de domaine.\n\nRépondez DÉMO pour une présentation de 15 minutes à la direction de {agence}.\n\nSACKO CONCEPT · sackoconcept.com"},
  relance:{n:"Relance unique",d:"7 jours après, une seule fois",t:"Pour faire suite à mon message : SécuriPro remplace les plannings Excel, les feuilles de présence et les rapports faits à la main.\nRépondez DÉMO et je vous montre en 10 minutes ce que ça donne pour {agence}."},
  appel:{n:"Après un appel",d:"Quand vous avez eu quelqu'un au téléphone",t:"Merci pour notre échange. Comme convenu, voici la présentation de SécuriPro pour {agence}.\nJe vous propose la démo mardi ou jeudi, à l'heure qui vous arrange."},
  en:{n:"Anglais",d:"Zone anglophone (Buea, Bamenda)",t:"Imagine managing all your guards from your phone: scheduling, on-site check-in, patrols, SOS alerts and client reports. No more spreadsheets or phone calls to check who is at their post.\n\nSécuriPro is built for security companies like {agence}.\nReply DEMO and I'll send you free access.\n\nSACKO CONCEPT · sackoconcept.com"}
};
let pFilter="À faire", pCountry="", pSize="", pMob=false;
function pJSON(k){try{return JSON.parse(store.get(k)||"{}")}catch(e){return{}}}
function pTpl(k){const o=pJSON(P_TPL_KEY);return o[k]||P_TPL[k].t}
function pContactAt(r){return pJSON(P_DONE_KEY)[pKey(r)]}
function pKey(r){return digits(r["Téléphone"])||r.Agence}
function pDue(r){const st=r.Statut||"À contacter";const t=pContactAt(r);return st==="Contacté"&&t&&(Date.now()-t)>=7*864e5}
function pAuto(r){if(pDue(r))return"relance";if(/Buea|Bamenda/i.test(r.Ville||""))return"en";return r.Taille==="Grande"?"grandes":"premier"}
function pMsg(r,k){return pTpl(k).split("{agence}").join(r.Agence||"votre agence")}
const P_SAMPLE = [
  ["2026-11-05","Sénégal","DIS – Dakar Intérim Sécurité","Dakar","+221 33 825 58 34","Fixe","Grande","Plus de 1 000 agents, convoyage de fonds.","","À contacter",""],
  ["2026-11-05","Guinée","G4S Guinée","Conakry, Kipé","+224 669 40 00 02","Mobile","Grande","Filiale du groupe mondial G4S.","","Contacté",""],
  ["2026-11-05","Togo","GIPS","Lomé, Agoè","+228 92 20 83 63","Mobile","Moyenne","Sécurité aéroportuaire et portuaire.","","Intéressé",""],
  ["2026-11-05","Cameroun","Shepherd Security and Consultancy","Buea","+237 676 03 75 26","Mobile","À qualifier","Zone anglophone.","","À contacter",""],
  ["2026-11-05","Bénin","MSA Sécurité","Cotonou, Cadjèhoun","+229 01 21 31 28 80","Fixe","Moyenne","Certifiée ISO 9001.","","À contacter",""]
];
function pRows(){
  if(data&&data.prospects)return rowsOf("prospects").sort((a,b)=>a._row-b._row);
  if(demo){const h=["Date","Pays","Agence","Ville","Téléphone","Type","Taille","Infos","Autres numéros","Statut","Notes"];return P_SAMPLE.map((v,i)=>{const o={_row:i+2,_k:"prospects"};h.forEach((x,j)=>o[x]=v[j]);return o})}
  return null;
}
function pBadge(){const rs=pRows()||[];return rs.filter(pDue).length}
function renderPros(){
  const all=pRows();const el=$("v-pros");
  if(!all){el.innerHTML='<div class="toolbar"><h1>Prospects</h1></div><div class="empty" style="text-align:left;line-height:1.6"><b style="color:var(--fg)">Encore une petite étape pour voir tes 235 agences ici.</b><br>Tes prospects sont déjà dans ta feuille Google, onglet <b>Prospects</b>. Pour que l\'application les lise :<br>1. Ouvre ta feuille « SACKO CONCEPT – Demandes de devis », puis <b>Extensions › Apps Script</b>.<br>2. Trouve la ligne qui commence par <code>const FEUILLES = {</code> et ajoute juste après l\'accolade : <code>prospects: "Prospects", </code><br>3. Clique <b>Déployer › Gérer les déploiements</b>, le crayon, <b>Version : Nouvelle version</b>, puis <b>Déployer</b>.<br>4. Reviens ici et touche la flèche ronde.</div>';return}
  const q=(($("prosq")||{}).value||"").trim().toLowerCase();
  const countries=[...new Set(all.map(r=>r.Pays))].sort((a,b)=>a.localeCompare(b,"fr"));
  const F={"À faire":r=>(r.Statut||"À contacter")==="À contacter","À relancer":pDue,"En cours":r=>["Contacté","Relancé","En discussion","Intéressé","Démo faite"].includes(r.Statut),"Gagnés":r=>r.Statut==="Gagné","Tous":()=>true};
  const cnt=k=>all.filter(F[k]).length;
  const rank={"Grande":0,"Moyenne":1,"À qualifier":2};
  const rs=all.filter(r=>F[pFilter](r)&&(!pCountry||r.Pays===pCountry)&&(!pSize||r.Taille===pSize)&&(!pMob||r.Type==="Mobile")&&(!q||[r.Agence,r.Ville,r.Pays,r.Infos].join(" ").toLowerCase().includes(q))).sort((a,b)=>(pDue(b)-pDue(a))||((rank[a.Taille]??3)-(rank[b.Taille]??3)));
  const done=all.filter(r=>(r.Statut||"À contacter")!=="À contacter").length;
  el.innerHTML='<div class="toolbar"><h1>Prospects</h1><button class="btn sm" id="pTplBtn">Mes messages</button><input class="search" id="prosq" type="search" placeholder="Agence, ville, pays…" value="'+esc(q)+'"></div>'+
    '<div class="pros-sum"><div><b>'+all.length+'</b><span>agences</span></div><div><b>'+done+'</b><span>contactées</span></div><div><b>'+cnt("À relancer")+'</b><span>à relancer</span></div><div><b>'+cnt("Gagnés")+'</b><span>gagnées</span></div></div>'+
    '<div class="chips">'+Object.keys(F).map(k=>'<button class="chip" data-pf="'+esc(k)+'" aria-pressed="'+(k===pFilter)+'">'+esc(k)+' · '+cnt(k)+'</button>').join("")+'</div>'+
    '<div class="pros-filters"><select id="pCountry" aria-label="Pays"><option value="">Tous les pays</option>'+countries.map(c=>'<option'+(c===pCountry?' selected':'')+'>'+esc(c)+'</option>').join("")+'</select><select id="pSize" aria-label="Taille"><option value="">Toutes tailles</option>'+["Grande","Moyenne","À qualifier"].map(s=>'<option'+(s===pSize?' selected':'')+'>'+s+'</option>').join("")+'</select><label class="small muted"><input type="checkbox" id="pMob"'+(pMob?' checked':'')+'> Mobiles seulement</label></div>'+
    '<div class="list">'+(rs.length?rs.map(r=>{const st=r.Statut||"À contacter";const due=pDue(r);return '<button class="item" data-pr="'+r._row+'"><span class="avatar" style="background:'+avColor(r.Agence)+'">'+esc(initials(r.Agence))+'</span><span class="mid"><span class="t">'+esc(r.Agence)+'</span><span class="s">'+esc([r.Pays,r.Ville].filter(Boolean).join(" · "))+'</span></span><span class="end"><span class="pill '+(due?"p-red":(PILL[st]||"p-off"))+'">'+(due?"À relancer":esc(st))+'</span><span class="d">'+esc(r.Taille||"")+(r.Type==="Fixe"?" · fixe":"")+'</span></span></button>'}).join(""):'<div class="empty">Aucune agence dans ce filtre.</div>')+'</div>';
  el.querySelectorAll("[data-pf]").forEach(b=>b.onclick=()=>{pFilter=b.dataset.pf;renderPros()});
  $("pCountry").onchange=e=>{pCountry=e.target.value;renderPros()};
  $("pSize").onchange=e=>{pSize=e.target.value;renderPros()};
  $("pMob").onchange=e=>{pMob=e.target.checked;renderPros()};
  $("prosq").oninput=()=>keepFocus("prosq",renderPros);
  $("pTplBtn").onclick=editTpl;
  el.querySelectorAll("[data-pr]").forEach(b=>b.onclick=()=>openPros(all.find(r=>r._row===+b.dataset.pr)));
}
async function pSet(r,s,quiet){
  r.Statut=s;
  if(demo){if(!quiet)toast("Statut enregistré : "+s);return}
  try{const j=await api({action:"statut",feuille:"prospects",row:r._row,statut:s});if(!j.ok)throw 0;
    const t=data.prospects;const i=t.headers.indexOf("Statut");const row=t.rows.find(x=>x.row===r._row);if(row&&i>=0)row.values[i]=s;
    if(!quiet)toast("Statut enregistré : "+s)}
  catch(e){toast("Le statut n'a pas été enregistré. Vérifie ta connexion.")}
}
function openPros(r,tk){
  if(!r)return;const st=r.Statut||"À contacter";tk=tk||pAuto(r);
  const wa=digits(r["Téléphone"]);const msg=pMsg(r,tk);const t=pContactAt(r);
  $("sheetTitle").textContent=r.Agence;
  $("sheetBody").innerHTML=
    (/PROSPECT DÉJÀ EN COURS/.test(r.Infos||"")?'<div class="demo-bar" style="margin:0">Prospect déjà en discussion : ne lui envoie pas le message standard.</div>':'')+
    (pDue(r)?'<div class="demo-bar" style="margin:0">Contactée il y a plus de 7 jours sans réponse : c\'est le moment de la relance unique.</div>':'')+
    '<div class="pros-tel"><code>'+esc(r["Téléphone"]||"")+'</code><span class="pill '+(r.Type==="Mobile"?"p-ok":"p-off")+'">'+esc(r.Type||"")+'</span>'+(r.Taille?'<span class="pill p-gold">'+esc(r.Taille)+'</span>':'')+(P_VISIT.includes(r.Pays)?'<span class="pill p-vio">Visite possible</span>':'')+'</div>'+
    (r.Type==="Fixe"?'<p class="muted small" style="margin:0">Numéro fixe : WhatsApp marche rarement. Appelle et demande le WhatsApp du gérant, puis utilise le message « Après un appel ».</p>':'')+
    '<div><div class="eyebrow" style="margin-bottom:8px">Message</div><div class="status-row">'+Object.keys(P_TPL).map(k=>'<button type="button" data-tk="'+k+'" aria-pressed="'+(k===tk)+'">'+esc(P_TPL[k].n)+'</button>').join("")+'</div></div>'+
    '<p class="pros-msg">'+esc(msg)+'</p>'+
    '<div class="acts">'+(wa?'<a class="btn dark" id="pWa" href="https://wa.me/'+wa+'?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">Envoyer sur WhatsApp</a>':'')+'<button class="btn" id="pCopy">Copier le message</button><button class="btn" id="pCopyN">Copier le numéro</button></div>'+
    (t?'<p class="muted small" style="margin:0">Message envoyé le '+new Date(t).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})+'.</p>':'')+
    '<div><div class="eyebrow" style="margin-bottom:8px">Statut</div><div class="status-row">'+P_ST.map(s=>'<button type="button" data-ps="'+esc(s)+'" aria-pressed="'+(s===st)+'">'+esc(s)+'</button>').join("")+'</div></div>'+
    '<dl class="fields">'+["Pays","Ville","Infos","Autres numéros","Notes"].filter(x=>r[x]).map(x=>'<div><dt>'+esc(x)+'</dt><dd>'+esc(r[x])+'</dd></div>').join("")+'</dl>';
  $("sheetBody").querySelectorAll("[data-tk]").forEach(b=>b.onclick=()=>openPros(r,b.dataset.tk));
  $("sheetBody").querySelectorAll("[data-ps]").forEach(b=>b.onclick=async()=>{await pSet(r,b.dataset.ps);openPros(r,tk);renderAll()});
  const copy=(txt,ok)=>{try{navigator.clipboard.writeText(txt).then(()=>toast(ok)).catch(()=>toast("Copie impossible : sélectionne le texte"))}catch(e){toast("Copie impossible : sélectionne le texte")}};
  $("pCopy").onclick=()=>copy(msg,"Message copié");
  $("pCopyN").onclick=()=>copy(r["Téléphone"]||"","Numéro copié");
  const w=$("pWa");if(w)w.onclick=()=>{
    const o=pJSON(P_DONE_KEY);o[pKey(r)]=Date.now();store.set(P_DONE_KEY,JSON.stringify(o));
    const cur=r.Statut||"À contacter";
    if(cur==="À contacter")pSet(r,"Contacté",true).then(renderAll);
    else if(tk==="relance"&&cur==="Contacté")pSet(r,"Relancé",true).then(renderAll);
    setTimeout(()=>openPros(r,tk),300);
  };
  openSheet();
}
function editTpl(){
  const o=pJSON(P_TPL_KEY);
  $("sheetTitle").textContent="Mes messages";
  $("sheetBody").innerHTML='<p class="muted small" style="margin:0">{agence} est remplacé par le nom de l\'agence. L\'application choisit seule le bon message : grandes agences, anglais pour Buea et Bamenda, relance après 7 jours. Tes changements restent sur cet appareil.</p>'+
    Object.keys(P_TPL).map(k=>'<label class="pros-tpl"><span><b>'+esc(P_TPL[k].n)+'</b> · <span class="muted">'+esc(P_TPL[k].d)+'</span></span><textarea id="tpl_'+k+'" rows="6">'+esc(o[k]||P_TPL[k].t)+'</textarea></label>').join("")+
    '<div class="acts"><button class="btn gold" id="tplSave">Enregistrer</button><button class="btn" id="tplReset">Revenir aux messages d\'origine</button></div>';
  $("tplSave").onclick=()=>{const n={};Object.keys(P_TPL).forEach(k=>{const v=$("tpl_"+k).value.trim();if(v&&v!==P_TPL[k].t)n[k]=v});store.set(P_TPL_KEY,JSON.stringify(n));toast("Messages enregistrés");closeSheet()};
  $("tplReset").onclick=()=>{store.del(P_TPL_KEY);toast("Messages d'origine remis");editTpl()};
  openSheet();
}
