/* ---------- Prospects : agences de sécurité à démarcher (feuille « Prospects ») ---------- */
const P_ST = ["À contacter","Pas sur WhatsApp","Contacté","Relancé","A répondu","Intéressé","Démo faite","Devis envoyé","Client","Pas intéressé"];
const P_ACTIONS = ["Rappeler","Envoyer la démo","Faire la démo","Envoyer le devis","Relancer le devis","Visite sur place"];
const P_DONE_KEY = "sc_pros_contact";
const P_TPL_KEY = "sc_pros_tpl";
const P_EDIT_KEY = "sc_pros_edit";
const P_FIELDS = ["WhatsApp","E-mail","Facebook"];
const P_EDITABLE = P_FIELDS.concat(["Notes","Prochaine action","Date action"]);
const P_VISIT = ["Togo","Bénin","Mali"]; // représentants sur place (Lomé, Cotonou, Bamako)
const P_TPL = {
  premier:{n:"Premier contact",d:"Agences moyennes et petites",t:"Bonjour,\nJ'aimerais m'entretenir avec vous au sujet de la gestion de vos agents.\nNous avons conçu SécuriPro, un logiciel pour les sociétés de gardiennage : planning, pointage, rondes et alerte SOS.\nJe peux vous le présenter en 15 minutes.\nHawa Sacko · SACKO CONCEPT"},
  grandes:{n:"Grandes agences",d:"Direction, plusieurs sites",t:"Bonjour,\nJ'aimerais m'entretenir avec la direction de {agence} au sujet du suivi de vos agents.\nNous avons conçu SécuriPro, un logiciel de gestion pour les sociétés de gardiennage, installé à vos couleurs.\nJe peux vous le présenter en 15 minutes.\nHawa Sacko · SACKO CONCEPT"},
  relance:{n:"Relance unique",d:"7 jours après, une seule fois",t:"Bonjour,\nJe reviens vers vous au sujet de SécuriPro, notre logiciel pour les sociétés de gardiennage.\nJe peux vous le présenter en 15 minutes, quand vous voulez.\nHawa Sacko · SACKO CONCEPT"},
  appel:{n:"Après un appel",d:"Quand vous avez eu quelqu'un au téléphone",t:"Bonjour,\nMerci pour notre échange. Comme convenu, voici SécuriPro, notre logiciel pour les sociétés de gardiennage.\nJe vous propose une présentation de 15 minutes, quand vous voulez.\nHawa Sacko · SACKO CONCEPT"},
  en:{n:"Anglais",d:"Zone anglophone (Buea, Bamenda)",t:"Hello,\nI would like to speak with you about managing your guards.\nWe built SécuriPro, a software for security companies: scheduling, check-in, patrols and SOS alerts.\nI can show it to you in 15 minutes.\nHawa Sacko · SACKO CONCEPT"}
};
let pFilter="À faire", pCountry="", pSize="", pMob=false;
function pJSON(k){try{return JSON.parse(store.get(k)||"{}")}catch(e){return{}}}
function pTpl(k){const o=pJSON(P_TPL_KEY);return o[k]||P_TPL[k].t}
function pContactAt(r){return pJSON(P_DONE_KEY)[pKey(r)]}
function pKey(r){return digits(r["Téléphone"])||r.Agence}
function pDue(r){const st=r.Statut||"À contacter";const t=pContactAt(r);return st==="Contacté"&&t&&(Date.now()-t)>=7*864e5}
function pAuto(r){if(pDue(r))return"relance";if(/Buea|Bamenda/i.test(r.Ville||""))return"en";return r.Taille==="Grande"?"grandes":"premier"}
function pWa(r){if(r.Statut==="Pas sur WhatsApp")return"";return digits(r.WhatsApp)||(r.Type==="Mobile"?digits(r["Téléphone"]):"")}
function pMobile(r){return r.Type==="Mobile"?digits(r["Téléphone"]):digits(r.WhatsApp)}
function pFb(r){const v=String(r.Facebook||"").trim();if(!v)return"";return /^https?:/.test(v)?v:"https://www.facebook.com/"+v.replace(/^@/,"")}
const PI = {
  wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.2-5.3A8.4 8.4 0 1 1 21 11.5z"/></svg>',
  tel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  sms:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  fb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'
};
function pLinks(r,tk){
  const msg=pMsg(r,tk),wa=pWa(r),mob=pMobile(r),tel=digits(r["Téléphone"]),mail=String(r["E-mail"]||"").trim(),fb=pFb(r);
  const subj=tk==="en"?"SécuriPro – management software for security companies":"SécuriPro – logiciel de gestion pour sociétés de gardiennage";
  return {msg,wa,mob,tel,mail,fb,
    waH:wa?"https://wa.me/"+wa+"?text="+encodeURIComponent(msg):"",
    smsH:mob?"sms:+"+mob+"?&body="+encodeURIComponent(msg):"",
    telH:tel?"tel:+"+tel:"",
    mailH:mail?"mailto:"+mail+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(msg):"",
    fbH:fb||"https://www.facebook.com/search/pages/?q="+encodeURIComponent(r.Agence+" "+(r.Pays||""))};
}
function pMarkSent(r,tk,how){
  if(how==="fb"){try{navigator.clipboard.writeText(pMsg(r,tk)).then(()=>toast("Message copié : colle-le dans Messenger")).catch(()=>{})}catch(e){}}
  if(how==="tel")return;
  const o=pJSON(P_DONE_KEY);o[pKey(r)]=Date.now();store.set(P_DONE_KEY,JSON.stringify(o));
  const cur=r.Statut||"À contacter";
  if(cur==="À contacter"||cur==="Pas sur WhatsApp")return pSet(r,"Contacté",true).then(renderAll);
  if(tk==="relance"&&cur==="Contacté")return pSet(r,"Relancé",true).then(renderAll);
}
function pClient(r){return r.Statut==="Client"||r.Statut==="Gagné"}
function pTask(r){return String(r["Prochaine action"]||"").trim()}
function pTaskDay(r){const d=r["Date action"];return d?dayKey(d):""}
function pTaskDue(r){return !!pTask(r)&&(!pTaskDay(r)||pTaskDay(r)<=dayKey(new Date()))}
function pShortDate(k){if(!k)return"";const d=new Date(k+"T12:00:00");return isNaN(d)?k:d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}
async function pSave(r,ch){
  Object.assign(r,ch);let saved=demo;
  if(!demo){try{saved=true;for(const f in ch){const j=await api({action:"contact",row:r._row,champ:f,valeur:ch[f]});if(!j.ok){saved=false;break}
    const T=data.prospects;const i=T.headers.indexOf(f);if(i>=0){const row=T.rows.find(x=>x.row===r._row);if(row)row.values[i]=ch[f]}}}catch(e){saved=false}}
  if(!saved){const ed=pJSON(P_EDIT_KEY);ed[r._row]=Object.assign(ed[r._row]||{},ch,{Agence:r.Agence});store.set(P_EDIT_KEY,JSON.stringify(ed))}
  return saved;
}
function pMsg(r,k){return pTpl(k).split("{agence}").join(r.Agence||"votre agence")}
const P_SAMPLE = [
  ["2026-11-05","Sénégal","DIS – Dakar Intérim Sécurité","Dakar","+221 33 825 58 34","Fixe","Grande","Plus de 1 000 agents, convoyage de fonds.","","À contacter","","","contact@exemple-dis.sn",""],
  ["2026-11-05","Guinée","G4S Guinée","Conakry, Kipé","+224 669 40 00 02","Mobile","Grande","Filiale du groupe mondial G4S.","","Contacté",""],
  ["2026-11-05","Togo","GIPS","Lomé, Agoè","+228 92 20 83 63","Mobile","Moyenne","Sécurité aéroportuaire et portuaire.","","Intéressé","","+228 92 20 83 63","","https://www.facebook.com/exemple.gips"],
  ["2026-11-05","Cameroun","Shepherd Security and Consultancy","Buea","+237 676 03 75 26","Mobile","À qualifier","Zone anglophone.","","À contacter",""],
  ["2026-11-05","Bénin","MSA Sécurité","Cotonou, Cadjèhoun","+229 01 21 31 28 80","Fixe","Moyenne","Certifiée ISO 9001.","","À contacter",""]
];
function pRows(){
  let rs=null;
  if(data&&data.prospects)rs=rowsOf("prospects").sort((a,b)=>a._row-b._row);
  else if(demo){const h=["Date","Pays","Agence","Ville","Téléphone","Type","Taille","Infos","Autres numéros","Statut","Notes","WhatsApp","E-mail","Facebook"];rs=P_SAMPLE.map((v,i)=>{const o={_row:i+2,_k:"prospects"};h.forEach((x,j)=>o[x]=v[j]||"");return o})}
  if(!rs)return null;
  const ed=pJSON(P_EDIT_KEY);rs.forEach(r=>{const e=ed[r._row];if(e&&e.Agence===r.Agence)P_EDITABLE.forEach(f=>{if(e[f]!==undefined)r[f]=e[f]})});
  return rs;
}
function pBadge(){const rs=pRows()||[];return rs.filter(r=>pDue(r)||pTaskDue(r)).length}
function renderPros(){
  const all=pRows();const el=$("v-pros");
  if(!all){el.innerHTML='<div class="toolbar"><h1>Prospects</h1></div><div class="empty" style="text-align:left;line-height:1.6"><b style="color:var(--fg)">Encore une petite étape pour voir tes 235 agences ici.</b><br>Tes prospects sont déjà dans ta feuille Google, onglet <b>Prospects</b>. Pour que l\'application les lise :<br>1. Ouvre ta feuille « SACKO CONCEPT – Demandes de devis », puis <b>Extensions › Apps Script</b>.<br>2. Trouve la ligne qui commence par <code>const FEUILLES = {</code> et ajoute juste après l\'accolade : <code>prospects: "Prospects", </code><br>3. Clique <b>Déployer › Gérer les déploiements</b>, le crayon, <b>Version : Nouvelle version</b>, puis <b>Déployer</b>.<br>4. Reviens ici et touche la flèche ronde.</div>';return}
  const q=(($("prosq")||{}).value||"").trim().toLowerCase();
  const countries=[...new Set(all.map(r=>r.Pays))].sort((a,b)=>a.localeCompare(b,"fr"));
  const F={"À faire":r=>(r.Statut||"À contacter")==="À contacter","Tâches du jour":pTaskDue,"À relancer":pDue,"À appeler":r=>!pWa(r)&&!pClient(r)&&r.Statut!=="Pas intéressé","En cours":r=>["Contacté","Relancé","A répondu","Intéressé","Démo faite","Devis envoyé","En discussion"].includes(r.Statut),"Clients":pClient,"Tous":()=>true};
  const cnt=k=>all.filter(F[k]).length;
  const rank={"Grande":0,"Moyenne":1,"À qualifier":2};
  const rs=all.filter(r=>F[pFilter](r)&&(!pCountry||r.Pays===pCountry)&&(!pSize||r.Taille===pSize)&&(!pMob||!!pWa(r))&&(!q||[r.Agence,r.Ville,r.Pays,r.Infos].join(" ").toLowerCase().includes(q))).sort((a,b)=>(pTaskDue(b)-pTaskDue(a))||(pDue(b)-pDue(a))||((rank[a.Taille]??3)-(rank[b.Taille]??3)));
  const done=all.filter(r=>(r.Statut||"À contacter")!=="À contacter").length;
  el.innerHTML='<div class="toolbar"><h1>Prospects</h1><button class="btn sm dark" id="pAddBtn">+ Ajouter</button><button class="btn sm" id="pTplBtn">Mes messages</button><input class="search" id="prosq" type="search" placeholder="Agence, ville, pays…" value="'+esc(q)+'"></div>'+
    '<div class="pros-sum"><div><b>'+all.length+'</b><span>agences</span></div><div><b>'+done+'</b><span>contactées</span></div><div><b>'+cnt("À relancer")+'</b><span>à relancer</span></div><div><b>'+cnt("Clients")+'</b><span>clients</span></div></div>'+
    '<div class="chips">'+Object.keys(F).map(k=>'<button class="chip" data-pf="'+esc(k)+'" aria-pressed="'+(k===pFilter)+'">'+esc(k)+' · '+cnt(k)+'</button>').join("")+'</div>'+
    '<div class="pros-filters"><select id="pCountry" aria-label="Pays"><option value="">Tous les pays</option>'+countries.map(c=>'<option'+(c===pCountry?' selected':'')+'>'+esc(c)+'</option>').join("")+'</select><select id="pSize" aria-label="Taille"><option value="">Toutes tailles</option>'+["Grande","Moyenne","À qualifier"].map(s=>'<option'+(s===pSize?' selected':'')+'>'+s+'</option>').join("")+'</select><label class="small muted"><input type="checkbox" id="pMob"'+(pMob?' checked':'')+'> Avec WhatsApp</label></div>'+
    '<div class="pgrid">'+(rs.length?rs.map(r=>{const st=r.Statut||"À contacter";const due=pDue(r),td=pTaskDue(r);const tk=pAuto(r);const L=pLinks(r,tk);
      return '<article class="pcard'+(due||td?' due':'')+'">'+
        '<button class="pc-open" data-pr="'+r._row+'"><span class="avatar" style="background:'+avColor(r.Agence)+'">'+esc(initials(r.Agence))+'</span><span class="mid"><span class="t">'+esc(r.Agence)+'</span><span class="s">'+esc([r.Pays,r.Ville].filter(Boolean).join(" · "))+'</span></span><span class="pill '+(due?"p-red":(PILL[st]||"p-off"))+'">'+(due?"À relancer":esc(st))+'</span></button>'+
        '<div class="pc-meta"><code>'+esc(r["Téléphone"]||"")+'</code>'+(r.Taille?'<span class="tg tg-'+(r.Taille==="Grande"?"a":r.Taille==="Moyenne"?"b":"c")+'">'+esc(r.Taille)+'</span>':'')+(pTask(r)?'<span class="ptask'+(td?' due':'')+'">'+esc(pTask(r))+(pTaskDay(r)?' · '+esc(pShortDate(pTaskDay(r))):'')+'</span>':'')+'</div>'+
        '<div class="pc-acts">'+
          (L.wa?'<a class="qa wa" data-q="wa" data-row="'+r._row+'" href="'+L.waH+'" target="_blank" rel="noopener">'+PI.wa+'WhatsApp</a>':(L.mob?'<a class="qa" data-q="sms" data-row="'+r._row+'" href="'+L.smsH+'">'+PI.sms+'SMS</a>':''))+
          (L.telH?'<a class="qa" data-q="tel" data-row="'+r._row+'" href="'+L.telH+'">'+PI.tel+'Appeler</a>':'')+
          (L.mail?'<a class="qa" data-q="mail" data-row="'+r._row+'" href="'+L.mailH+'">'+PI.mail+'E-mail</a>':'')+
          '<a class="qa fb" data-q="fb" data-row="'+r._row+'" href="'+esc(L.fbH)+'" target="_blank" rel="noopener">'+PI.fb+'Facebook</a>'+
        '</div></article>'}).join(""):'<div class="empty">Aucune agence dans ce filtre.</div>')+'</div>';
  el.querySelectorAll("[data-pf]").forEach(b=>b.onclick=()=>{pFilter=b.dataset.pf;renderPros()});
  $("pCountry").onchange=e=>{pCountry=e.target.value;renderPros()};
  $("pSize").onchange=e=>{pSize=e.target.value;renderPros()};
  $("pMob").onchange=e=>{pMob=e.target.checked;renderPros()};
  $("prosq").oninput=()=>keepFocus("prosq",renderPros);
  $("pTplBtn").onclick=editTpl;
  $("pAddBtn").onclick=()=>addPros(countries);
  el.querySelectorAll("[data-pr]").forEach(b=>b.onclick=()=>openPros(all.find(r=>r._row===+b.dataset.pr)));
  el.querySelectorAll("[data-q]").forEach(a=>a.addEventListener("click",()=>{const r=all.find(x=>x._row===+a.dataset.row);if(!r)return;if(a.dataset.q==="fb"&&!pFb(r))return;pMarkSent(r,pAuto(r),a.dataset.q)}));
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
  const wa=pWa(r),mob=pMobile(r),tel=digits(r["Téléphone"]),mail=String(r["E-mail"]||"").trim(),fb=pFb(r);
  const msg=pMsg(r,tk);const t=pContactAt(r);
  const city=String(r.Ville||"").split(/[,(]/)[0].trim();
  const fbSearch="https://www.facebook.com/search/pages/?q="+encodeURIComponent(r.Agence+" "+(r.Pays||""));
  const mailSearch="https://www.google.com/search?q="+encodeURIComponent('"'+r.Agence+'" '+city+" e-mail contact");
  const subj=tk==="en"?"SécuriPro – management software for security companies":"SécuriPro – logiciel de gestion pour sociétés de gardiennage";
  const line=(lab,val,btn)=>'<div class="pc-row"><span class="pc-lab">'+lab+'</span><span class="pc-val'+(val?'':' muted')+'">'+(val?esc(val):'Pas encore trouvé')+'</span>'+btn+'</div>';
  $("sheetTitle").textContent=r.Agence;
  $("sheetBody").innerHTML=
    (/PROSPECT DÉJÀ EN COURS/.test(r.Infos||"")?'<div class="demo-bar" style="margin:0">Prospect déjà en discussion : ne lui envoie pas le message standard.</div>':'')+
    (pDue(r)?'<div class="demo-bar" style="margin:0">Contactée il y a plus de 7 jours sans réponse : c\'est le moment de la relance unique.</div>':'')+
    '<div class="pros-tel"><code>'+esc(r["Téléphone"]||"")+'</code><span class="pill '+(r.Type==="Mobile"?"p-ok":"p-off")+'">'+esc(r.Type||"")+'</span>'+(r.Taille?'<span class="pill p-gold">'+esc(r.Taille)+'</span>':'')+(P_VISIT.includes(r.Pays)?'<span class="pill p-vio">Visite possible</span>':'')+'</div>'+
    '<div class="pc"><div class="eyebrow">Contacts</div>'+
      line("WhatsApp",wa?("+"+wa):"",wa?'<a class="qa wa" data-send="wa" href="https://wa.me/'+wa+'?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">'+PI.wa+'Envoyer</a>':'')+
      line("E-mail",mail,mail?'<a class="qa" data-send="mail" href="mailto:'+esc(mail)+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(msg)+'">'+PI.mail+'Envoyer</a>':'<a class="qa" href="'+mailSearch+'" target="_blank" rel="noopener">Chercher</a>')+
      line("Facebook",fb?"Page trouvée":"",fb?'<a class="qa fb" data-send="fb" href="'+esc(fb)+'" target="_blank" rel="noopener">'+PI.fb+'Copier et ouvrir</a>':'<a class="qa fb" href="'+fbSearch+'" target="_blank" rel="noopener">'+PI.fb+'Chercher</a>')+
      '<div class="acts">'+(tel?'<a class="qa" href="tel:+'+tel+'">'+PI.tel+'Appeler</a>':'')+(mob?'<a class="qa" data-send="sms" href="sms:+'+mob+'?&body='+encodeURIComponent(msg)+'">'+PI.sms+'SMS</a>':'')+'<button class="qa" id="pEdit">+ Ajouter un contact</button></div>'+
    '</div>'+
    (!wa?'<p class="muted small" style="margin:0">'+(r.Type==="Fixe"?'Numéro fixe : appelle et demande le WhatsApp ou l\'e-mail du gérant, puis ajoute-le avec « Ajouter un contact ».':'Pas de WhatsApp : envoie un SMS, ou cherche sa page Facebook.')+'</p>':'')+
    '<div><div class="eyebrow" style="margin-bottom:8px">Message</div><div class="status-row">'+Object.keys(P_TPL).map(k=>'<button type="button" data-tk="'+k+'" aria-pressed="'+(k===tk)+'">'+esc(P_TPL[k].n)+'</button>').join("")+'</div></div>'+
    '<p class="pros-msg">'+esc(msg)+'</p>'+
    '<div class="acts"><button class="btn" id="pCopy">Copier le message</button><button class="btn" id="pCopyN">Copier le numéro</button></div>'+
    (t?'<p class="muted small" style="margin:0">Message envoyé le '+new Date(t).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})+'.</p>':'')+
    '<div><div class="eyebrow" style="margin-bottom:8px">Statut</div><div class="status-row">'+P_ST.map(s=>'<button type="button" data-ps="'+esc(s)+'" aria-pressed="'+(s===(st==="Gagné"?"Client":st))+'">'+esc(s)+'</button>').join("")+'</div></div>'+
    '<div class="pc"><div class="eyebrow">Suivi</div>'+
      (pTask(r)?'<div class="pc-row task'+(pTaskDue(r)?' due':'')+'"><span class="pc-val"><b>'+esc(pTask(r))+'</b>'+(pTaskDay(r)?' · '+esc(pShortDate(pTaskDay(r))):'')+'</span><button class="btn sm dark" id="pTaskDone">Tâche terminée</button></div>':'')+
      '<label class="pros-tpl"><b>Prochaine action</b><input id="pt_action" list="pt_list" value="'+esc(pTask(r))+'" placeholder="Ex. Rappeler, Envoyer la démo…"><datalist id="pt_list">'+P_ACTIONS.map(a=>'<option value="'+esc(a)+'">').join("")+'</datalist></label>'+
      '<div class="chips" style="margin:0">'+[["Demain",1],["Dans 3 jours",3],["Dans 7 jours",7]].map(x=>'<button type="button" class="chip" data-pd="'+x[1]+'">'+x[0]+'</button>').join("")+'</div>'+
      '<label class="pros-tpl"><b>Date</b><input id="pt_date" type="date" value="'+esc(pTaskDay(r))+'"></label>'+
      '<label class="pros-tpl"><b>Notes</b><textarea id="pt_notes" rows="3" placeholder="Ce qu\'il a dit, qui décide, budget…">'+esc(r.Notes||"")+'</textarea></label>'+
      '<div class="acts"><button class="btn gold" id="pt_save">Enregistrer le suivi</button></div>'+
    '</div>'+
    '<dl class="fields">'+["Pays","Ville","Infos","Autres numéros"].filter(x=>r[x]).map(x=>'<div><dt>'+esc(x)+'</dt><dd>'+esc(r[x])+'</dd></div>').join("")+'</dl>';
  $("sheetBody").querySelectorAll("[data-tk]").forEach(b=>b.onclick=()=>openPros(r,b.dataset.tk));
  $("sheetBody").querySelectorAll("[data-ps]").forEach(b=>b.onclick=async()=>{await pSet(r,b.dataset.ps);openPros(r,tk);renderAll()});
  const copy=(txt,ok)=>{try{navigator.clipboard.writeText(txt).then(()=>toast(ok)).catch(()=>toast("Copie impossible : sélectionne le texte"))}catch(e){toast("Copie impossible : sélectionne le texte")}};
  $("pCopy").onclick=()=>copy(msg,"Message copié");
  $("pCopyN").onclick=()=>copy(r["Téléphone"]||"","Numéro copié");
  $("pEdit").onclick=()=>editContacts(r,tk);
  $("sheetBody").querySelectorAll("[data-pd]").forEach(b=>b.onclick=()=>{const d=new Date();d.setDate(d.getDate()+(+b.dataset.pd));$("pt_date").value=dayKey(d);if(!$("pt_action").value)$("pt_action").value="Rappeler"});
  $("pt_save").onclick=async()=>{const ch={};const v={"Prochaine action":$("pt_action").value.trim(),"Date action":$("pt_date").value,"Notes":$("pt_notes").value.trim()};
    Object.keys(v).forEach(f=>{if(v[f]!==String(f==="Date action"?pTaskDay(r):(r[f]||"")))ch[f]=v[f]});
    if(!Object.keys(ch).length)return toast("Rien à enregistrer");
    const ok=await pSave(r,ch);toast(ok?"Suivi enregistré":"Suivi enregistré sur ce téléphone");openPros(r,tk);renderAll()};
  const td=$("pTaskDone");if(td)td.onclick=async()=>{const now=new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"});
    const ok=await pSave(r,{"Notes":(now+" : fait – "+pTask(r))+(r.Notes?"\n"+r.Notes:""),"Prochaine action":"","Date action":""});
    toast(ok?"Tâche terminée":"Tâche terminée (sur ce téléphone)");openPros(r,tk);renderAll()};
  $("sheetBody").querySelectorAll("[data-send]").forEach(a=>a.addEventListener("click",()=>{pMarkSent(r,tk,a.dataset.send);setTimeout(()=>openPros(r,tk),300)}));
  openSheet();
}
function editContacts(r,tk){
  $("sheetTitle").textContent=r.Agence;
  const ph={"WhatsApp":"+229 01 97 00 00 00","E-mail":"direction@agence.com","Facebook":"Lien de la page Facebook"};
  $("sheetBody").innerHTML='<p class="muted small" style="margin:0">Ajoute ce que tu as trouvé (appel, Facebook, site web). C\'est enregistré dans ta feuille Google.</p>'+
    P_FIELDS.map(f=>'<label class="pros-tpl"><b>'+f+'</b><input id="pe_'+f.replace(/\W/g,"")+'" type="'+(f==="E-mail"?"email":f==="WhatsApp"?"tel":"url")+'" value="'+esc(r[f]||"")+'" placeholder="'+esc(ph[f])+'"></label>').join("")+
    '<div class="acts"><button class="btn gold" id="peSave">Enregistrer</button><button class="btn" id="peBack">Annuler</button></div>';
  $("peBack").onclick=()=>openPros(r,tk);
  $("peSave").onclick=async()=>{
    const ch={};P_FIELDS.forEach(f=>{const v=$("pe_"+f.replace(/\W/g,"")).value.trim();if(v!==String(r[f]||""))ch[f]=v});
    if(!Object.keys(ch).length)return openPros(r,tk);
    const ok=await pSave(r,ch);toast(ok?"Contact enregistré":"Contact enregistré sur ce téléphone");openPros(r,tk);renderAll();
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

function addPros(countries){
  $("sheetTitle").textContent="Nouveau prospect";
  const f=(id,lab,type,ph,extra)=>'<label class="pros-tpl"><b>'+lab+'</b><input id="pa_'+id+'" type="'+type+'" placeholder="'+esc(ph||"")+'"'+(extra||"")+'></label>';
  $("sheetBody").innerHTML='<p class="muted small" style="margin:0">Le prospect est ajouté à ta feuille Google et apparaît tout de suite dans ta liste.</p>'+
    f("ag","Nom de l\'agence *","text","Ex. Alpha Sécurité")+
    f("pays","Pays *","text","Ex. Bénin",' list="pa_pl"')+'<datalist id="pa_pl">'+countries.map(c=>'<option value="'+esc(c)+'">').join("")+'</datalist>'+
    f("ville","Ville / quartier","text","Ex. Cotonou, Fidjrossè")+
    f("tel","Téléphone *","tel","+229 01 97 00 00 00")+
    '<label class="pros-tpl"><b>Type de numéro</b><select id="pa_type"><option>Mobile</option><option>Fixe</option></select></label>'+
    '<label class="pros-tpl"><b>Taille</b><select id="pa_taille"><option>À qualifier</option><option>Moyenne</option><option>Grande</option></select></label>'+
    f("mail","E-mail","email","direction@agence.com")+f("fb","Facebook","url","Lien de la page Facebook")+
    '<label class="pros-tpl"><b>Infos</b><textarea id="pa_infos" rows="2" placeholder="Nombre d\'agents, où tu l\'as trouvée…"></textarea></label>'+
    '<p class="err" id="pa_err"></p><div class="acts"><button class="btn gold" id="pa_save">Ajouter le prospect</button></div>';
  $("pa_save").onclick=async()=>{
    const v=id=>$("pa_"+id).value.trim();
    if(!v("ag")||!v("pays")||!v("tel")){$("pa_err").textContent="Remplis au moins le nom, le pays et le téléphone.";return}
    let tel=v("tel");if(!tel.startsWith("+"))tel="+"+tel.replace(/^00/,"");
    const d={"Date":dayKey(new Date()),"Pays":v("pays"),"Agence":v("ag"),"Ville":v("ville"),"Téléphone":"'"+tel,"Type":$("pa_type").value,"Taille":$("pa_taille").value,"Infos":v("infos"),"Statut":"À contacter","WhatsApp":$("pa_type").value==="Mobile"?"'"+tel:"","E-mail":v("mail"),"Facebook":v("fb")};
    if(demo){P_SAMPLE.push(["Date","Pays","Agence","Ville","Téléphone","Type","Taille","Infos","Autres numéros","Statut","Notes","WhatsApp","E-mail","Facebook"].map(h=>String(d[h]||"").replace(/^'/,"")));toast("Prospect ajouté");closeSheet();renderAll();return}
    $("pa_save").disabled=true;
    try{const j=await api({action:"contact",row:"nouveau",valeur:JSON.stringify(d)});if(!j.ok)throw 0;toast("Prospect ajouté");closeSheet();await load()}
    catch(e){$("pa_save").disabled=false;$("pa_err").textContent="Le prospect n'a pas été ajouté. Vérifie que l'étape Apps Script est faite, puis réessaie."}
  };
  openSheet();
}
