/* SACKO CONCEPT Pilotage – logique de l'application */
const URL_API = window.SACKO_SCRIPT_URL || "COLLER";
const SITE = "https://www.sackoconcept.com/";
const S = SackoDocs;
document.head.insertAdjacentHTML("beforeend", "<style>" + S.CSS.split("@media print")[0] + "</style>");

/* ---------- configuration ---------- */
const REQ = {
  devis:{title:"Devis demandés", statuses:["Nouveau","Devis envoyé","En discussion","Gagné","Perdu"], name:"Entreprise", person:"Nom et prénom", sub:["Application","Pays"], first:"Nouveau"},
  inscriptions:{title:"Inscriptions démo", statuses:["À relancer","Relancé","Intéressé","Devis demandé","Pas intéressé"], name:"Nom et prénom", person:"Nom et prénom", sub:["Démo ouverte","Entreprise"], first:"À relancer"},
  clients:{title:"Demandes clients", statuses:["À faire","En cours","Terminé"], name:"Entreprise", person:"Contact", sub:["Application","Type de demande"], first:"À faire"}
};
const DOC_ST = ["Brouillon","Envoyé","Accepté","Paiement à vérifier","Payée","Livré","Annulé"];
const PILL = {"Nouveau":"p-new","À relancer":"p-new","À faire":"p-new","Devis envoyé":"p-wip","En discussion":"p-wip","Relancé":"p-wip","Intéressé":"p-gold","En cours":"p-wip","Devis demandé":"p-vio","Gagné":"p-ok","Terminé":"p-ok","Perdu":"p-off","Pas intéressé":"p-off","Brouillon":"p-off","Envoyé":"p-wip","Accepté":"p-vio","Paiement à vérifier":"p-red","Payée":"p-ok","Livré":"p-ok","Annulé":"p-off"};
const STAGES = [["interesse","Intéressés","p-gold","Intéressé"],["demande","Devis demandé","p-vio","Devis demandé"],["envoye","Devis envoyé","p-wip","Devis envoyé"],["gagne","Gagnés","p-ok","Client"],["perdu","Perdus","p-off","Perdu"]];
const PRESETS = [["NettoPro – formule Standard",1],["NettoPro – formule Premium",1],["RH Pro – formule Standard",1],["RH Pro – formule Premium",1],["StockPro – formule Standard",1],["PhonePro – formule Standard",1],["Option Sérénité (par mois)",3],["Personnalisation à votre image",1],["Import de vos données Excel",1]];
const SETTINGS = ["Nom légal","Adresse","EIN","E-mail","Téléphone / WhatsApp","Site","PayPal","Numéro Mobile Money","Lien Mobile Money par défaut","Acompte par défaut (%)","Validité devis (jours)","Conditions","Virement bancaire"];

let key=null, demo=false, data=null, V={}, codes={}, view="home", reqTab="devis", reqFilter="Tous", docFilter="Tous", crmMode="pipeline", statsDays=7, notifs=[], timer=null;
const $ = id => document.getElementById(id);
const esc = S.esc;
const store = {get(k){try{return localStorage.getItem(k)}catch(e){return null}}, set(k,v){try{localStorage.setItem(k,v)}catch(e){}}, del(k){try{localStorage.removeItem(k)}catch(e){}}};
function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}
function fmtDate(v){if(!v)return"";const d=new Date(v);if(isNaN(d))return String(v);const now=new Date();const y=new Date(now);y.setDate(now.getDate()-1);const hm=d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});return d.toDateString()===now.toDateString()?"Aujourd'hui "+hm:d.toDateString()===y.toDateString()?"Hier "+hm:d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}
function dayKey(v){const d=new Date(v);if(isNaN(d))return"";return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function isToday(v){return !!v&&dayKey(v)===dayKey(new Date())}
function isThisMonth(v){if(!v)return false;const d=new Date(v),n=new Date();return !isNaN(d)&&d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()}
function ageH(v){return (Date.now()-new Date(v))/36e5}
function digits(p){return String(p||"").replace(/[^\d]/g,"")}
function plural(n,s,p){return n+" "+(n>1?(p||s+"s"):s)}
function initials(n){return String(n||"?").trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase()||"?"}
const AV = [["#F6EBD2","#8A6516"],["#DDF3E8","#1F7A50"],["#E1ECF8","#2C63A8"],["#ECE6FA","#6D4BC4"],["#FDE7DC","#B4502C"],["#E6F4F6","#1F7A86"]];
function avColor(n){let h=0;String(n).split("").forEach(c=>h=(h*31+c.charCodeAt(0))%997);const c=AV[h%AV.length];return c[0]+";color:"+c[1]}
function sumByCur(list,fn){const o={};list.forEach(d=>{const c=S.curCode(d.Devise);o[c]=(o[c]||0)+fn(d)});return o}
function curText(o){const k=Object.keys(o).filter(c=>o[c]);return k.length?k.map(c=>S.money(o[c],c)).join(" · "):"0"}
function keepFocus(id,fn){const el=$(id);const pos=el?el.selectionStart:0;fn();const n=$(id);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}}
const ICON = {
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/></svg>',
  money:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/></svg>',
  tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

/* ---------- données d'exemple ---------- */
function sample(){
  const t=h=>new Date(Date.now()-h*3600e3).toISOString();
  const jours={};for(let i=0;i<30;i++){const d=new Date();d.setDate(d.getDate()-i);const v=Math.round(18+12*Math.sin(i/3)+((i*7)%9));jours[dayKey(d)]={visites:v,uniques:Math.round(v*.7),clics:Math.round(v/4)}}
  const L1=JSON.stringify([{desc:"RH Pro – formule Premium",qte:1,prix:850000},{desc:"Option Sérénité (par mois)",qte:3,prix:45000}]);
  return {
    devis:{headers:["Date","Nom et prénom","Entreprise","E-mail","WhatsApp","Pays","Application","Secteur","Utilisateurs","Formule","Option Sérénité","Devise","Besoins","Date de mise en service","Source","Fichiers joints","Statut"],rows:[
      {row:2,values:[t(1),"Aminata Koné","Clean Plus Abidjan","contact@cleanplus.ci","+225 07 00 00 00","Côte d'Ivoire","NettoPro – Nettoyage","Nettoyage de bureaux","11 à 50","Premium","Oui","Franc CFA","Planning de 32 agents sur 14 sites, factures mensuelles et relances.","","Facebook","","Nouveau"]},
      {row:3,values:[t(26),"Julien Moreau","Boutique Élan","julien@elan.fr","+33 6 00 00 00 00","France","StockPro – Commerce","Prêt-à-porter","1 à 10","Standard","À discuter","Euro (€)","Suivi du stock de 2 boutiques et catalogue client.","","Google","","Devis envoyé"]},
      {row:4,values:[t(70),"Moussa Traoré","Hôtel Djoliba","rh@djoliba.ml","+223 70 00 00 00","Mali","RH Pro – Ressources humaines","Hôtellerie","51 à 200","Premium","Oui","Franc CFA","Congés et absences de 85 salariés, fiches de paie.","","Recommandation","","Gagné"]}]},
    inscriptions:{headers:["Date","Nom et prénom","Entreprise","E-mail","WhatsApp","Démo ouverte","Statut"],rows:[
      {row:2,values:[t(.3),"Koffi Mensah","Mensah Phones","koffi@gmail.com","+229 97 00 00 00","PhonePro","À relancer"]},
      {row:3,values:[t(5),"Fatou Diop","","fatou.diop@gmail.com","+221 77 00 00 00","NettoPro","À relancer"]},
      {row:4,values:[t(30),"Sarah Johnson","SJ Realty","sarah@sjrealty.com","+1 505 000 0000","RH Pro","Relancé"]},
      {row:5,values:[t(80),"Aminata Koné","Clean Plus Abidjan","contact@cleanplus.ci","+225 07 00 00 00","NettoPro","Devis demandé"]}]},
    clients:{headers:["Date","Entreprise","Contact","E-mail","WhatsApp","Application","Type de demande","Détail","Urgence","Fichiers","Statut"],rows:[
      {row:2,values:[t(2),"Hôtel Djoliba","Moussa Traoré","rh@djoliba.ml","+223 70 00 00 00","RH Pro","Ajouter ou retirer des salariés ou utilisateurs","3 nouveaux salariés, fichier joint.","Urgente (sous 24 h)","","À faire"]}]},
    documents:{headers:["Numéro","Type","Date","Échéance","Entreprise","Contact","E-mail","WhatsApp","Pays","Devise","Lignes","Total","Acompte %","Lien Mobile Money","Notes","Statut","Jeton","Origine","Payé"],rows:[
      {row:2,values:["DEV-2026-001","Devis",t(60),"","Hôtel Djoliba","Moussa Traoré","rh@djoliba.ml","+223 70 00 00 00","Mali","XOF",L1,985000,50,"","","Accepté","ex1","",""]},
      {row:3,values:["FAC-2026-001","Facture",t(30),"","Hôtel Djoliba","Moussa Traoré","rh@djoliba.ml","+223 70 00 00 00","Mali","XOF",L1,985000,50,"","","Payée","ex2","DEV-2026-001",t(3)]},
      {row:4,values:["DEV-2026-002","Devis",t(20),"","Boutique Élan","Julien Moreau","julien@elan.fr","+33 6 00 00 00 00","France","EUR",JSON.stringify([{desc:"StockPro – formule Standard",qte:1,prix:690}]),690,50,"","","Envoyé","ex3","",""]}]},
    stats:{jours,pages:{"/":240,"/applications.html":96,"/nettopro/demo/":71,"/devis.html":38,"/phonepro/demo/":33,"/offres.html":29},sources:{"direct":180,"facebook.com":120,"lien-wa-nettopro":64,"google.com":41,"linkedin.com":18},clics:{"wa-nettopro":64,"fb-phonepro":27},documents:{"DEV-2026-002":4,"FAC-2026-001":2},visiteurs:312,total:540},
    liens:[{"Code":"wa-nettopro","Nom":"WhatsApp – démo NettoPro","Destination":SITE+"commencer.html#nettopro"},{"Code":"fb-phonepro","Nom":"Facebook – PhonePro","Destination":SITE+"commencer.html#phonepro"}]
  };
}
const SAMPLE_V = {"Nom légal":"SACKO CONCEPT LLC","Adresse":"8206 Louisiana Blvd NE, Ste A 8694, Albuquerque, NM 87113, USA","EIN":"35-2950833","E-mail":"sackoconcept8@gmail.com","Site":"www.sackoconcept.com","PayPal":"sackoconcept8@gmail.com","Acompte par défaut (%)":"50","Validité devis (jours)":"15","Conditions":"Acompte à la commande, solde à la livraison."};

/* ---------- données ---------- */
function rowsOf(k){const t=data&&data[k];if(!t||!t.headers)return[];return t.rows.map(r=>{const o={_row:r.row,_k:k};t.headers.forEach((h,i)=>o[h]=r.values[i]);return o}).sort((a,b)=>new Date(b.Date)-new Date(a.Date))}
const SEEN = () => demo ? "sc_seen_demo" : "sc_seen";
function idOf(k,r){return k+":"+r._row+":"+(r.Date||"")}
async function api(params){const u=new URL(URL_API);Object.entries(Object.assign({key},params||{})).forEach(([a,b])=>u.searchParams.set(a,b));const res=await fetch(u.toString());return res.json()}
async function load(first){
  $("sync").textContent="Synchronisation…";
  try{
    if(demo){data=data||sample();V=Object.keys(V).length?V:Object.assign({},SAMPLE_V)}
    else{const j=await api();if(!j.ok){if(j.erreur==="code"){logout();$("loginErr").textContent="Code d'accès incorrect.";return}throw new Error(j.erreur)}data=j.data;V=j.vendeur||{};codes={};(j.data.clientsCodes||[]).forEach(c=>codes[String(c.email).toLowerCase()]=c.code)}
    detectNew(first);renderAll();
    $("sync").textContent="À jour · "+new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
  }catch(e){$("sync").textContent="Hors ligne · nouvel essai dans 1 min"}
}
function lab(f){return f.k==="devis"?"Nouvelle demande de devis":f.k==="inscriptions"?"Nouvelle inscription démo":f.k==="documents"?(f.r.Statut==="Accepté"?"Devis accepté":"Paiement signalé")+" "+(f.r["Numéro"]||""):"Nouvelle demande client"}
function detectNew(first){
  let prev={};try{prev=JSON.parse(store.get(SEEN())||"{}")}catch(e){}
  const firstRun=first&&!store.get(SEEN());const fresh=[];
  ["devis","inscriptions","clients","documents"].forEach(k=>rowsOf(k).forEach(r=>{
    if(k==="documents"){const id="doc:"+r["Jeton"]+":"+r.Statut;if(!prev[id]){prev[id]=1;if(!firstRun&&["Accepté","Paiement à vérifier"].includes(r.Statut))fresh.push({k,r,id})}return}
    const id=idOf(k,r);if(!prev[id]){prev[id]=1;if(!firstRun)fresh.push({k,r,id})}}));
  store.set(SEEN(),JSON.stringify(prev));
  fresh.forEach(f=>notifs.unshift(f));
  if(fresh.length){
    const f=fresh[0],label=lab(f),who=f.r["Entreprise"]||f.r["Nom et prénom"]||f.r["Contact"]||"";
    toast(label+(fresh.length>1?" (+"+(fresh.length-1)+")":"")+" · "+who);beep();
    if("Notification" in window&&Notification.permission==="granted"){try{navigator.serviceWorker.ready.then(reg=>reg.showNotification("SACKO CONCEPT · "+label,{body:who,icon:"../assets/sacko-logo-512.png",badge:"../assets/sacko-logo-96.png",tag:f.id}))}catch(e){}}
  }
  updateBell();
}
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.setValueAtTime(.08,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.35);o.start();o.stop(a.currentTime+.35)}catch(e){}}
function updateBell(){const n=notifs.length;$("bellDot").hidden=!n;$("bellDot").textContent=n>9?"9+":n;document.title=(n?"("+n+") ":"")+"SACKO CONCEPT Pilotage"}

/* ---------- CRM : contacts fusionnés ---------- */
function contacts(){
  const map={};
  const keyOf=r=>{const e=String(r["E-mail"]||"").trim().toLowerCase();if(e)return e;const w=digits(r["WhatsApp"]);if(w)return "wa:"+w;return "n:"+(r["Nom et prénom"]||r["Contact"]||r["Entreprise"]||Math.random())};
  const get=r=>{const k=keyOf(r);return map[k]||(map[k]={key:k,name:r["Nom et prénom"]||r["Contact"]||"",company:r["Entreprise"]||"",email:r["E-mail"]||"",wa:r["WhatsApp"]||"",country:r["Pays"]||"",events:[],docs:[],reqs:[],apps:new Set(),last:null,source:""})};
  const touch=(c,d)=>{if(!c.last||new Date(d)>new Date(c.last))c.last=d};
  rowsOf("inscriptions").forEach(r=>{const c=get(r);c.events.push({d:r.Date,t:"A testé la démo "+(r["Démo ouverte"]||""),k:"inscriptions",r});c.reqs.push(r);if(r["Démo ouverte"])c.apps.add(r["Démo ouverte"]);touch(c,r.Date);c.company=c.company||r["Entreprise"]||""});
  rowsOf("devis").forEach(r=>{const c=get(r);const a=String(r["Application"]||"").split(" – ")[0];c.events.push({d:r.Date,t:"Demande de devis "+a,k:"devis",r});c.reqs.push(r);c.apps.add(a);touch(c,r.Date);c.country=c.country||r["Pays"];c.source=c.source||r["Source"]||"";c.company=c.company||r["Entreprise"]||""});
  rowsOf("clients").forEach(r=>{const c=get(r);c.events.push({d:r.Date,t:"Demande client : "+(r["Type de demande"]||""),k:"clients",r});c.reqs.push(r);touch(c,r.Date)});
  rowsOf("documents").forEach(r=>{const c=get(r);c.events.push({d:r.Date,t:r.Type+" "+r["Numéro"]+" · "+(r.Statut||"Brouillon")+" · "+S.money(S.total(r),r.Devise),k:"documents",r});c.docs.push(r);touch(c,r.Date);c.country=c.country||r["Pays"]});
  return Object.values(map).map(c=>{
    c.events.sort((a,b)=>new Date(b.d)-new Date(a.d));
    const rq=c.reqs;
    const won=c.docs.some(d=>d.Type==="Facture"&&["Payée","Livré"].includes(d.Statut))||rq.some(r=>r._k==="devis"&&r.Statut==="Gagné")||rq.some(r=>r._k==="clients");
    const sent=c.docs.some(d=>d.Type==="Devis"&&["Envoyé","Accepté"].includes(d.Statut))||c.docs.some(d=>d.Type==="Facture"&&d.Statut!=="Annulé")||rq.some(r=>r._k==="devis"&&["Devis envoyé","En discussion"].includes(r.Statut));
    const asked=rq.some(r=>r._k==="devis"&&r.Statut!=="Perdu")||rq.some(r=>r._k==="inscriptions"&&r.Statut==="Devis demandé");
    const lost=rq.some(r=>r._k==="devis"&&r.Statut==="Perdu")||(rq.length>0&&rq.every(r=>r._k==="inscriptions"&&r.Statut==="Pas intéressé"));
    c.stage=won?"gagne":sent?"envoye":asked?"demande":lost?"perdu":"interesse";
    const latest=c.docs.slice().sort((a,b)=>new Date(b.Date)-new Date(a.Date))[0];
    c.value=latest?{n:S.total(latest),cur:latest.Devise}:null;
    c.paid=sumByCur(c.docs.filter(d=>d.Type==="Facture"&&["Payée","Livré"].includes(d.Statut)),d=>S.total(d));
    c.apps=[...c.apps].filter(Boolean);
    return c;
  }).sort((a,b)=>new Date(b.last)-new Date(a.last));
}

/* ---------- vues ---------- */
function setView(v){view=v;document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-current",t.dataset.v===v?"page":"false"));["home","crm","req","sales","stats"].forEach(x=>$("v-"+x).hidden=x!==v);renderAll();window.scrollTo(0,0)}
function renderAll(){
  if(!data)return;
  const ins=rowsOf("inscriptions"),dv=rowsOf("devis"),cl=rowsOf("clients"),docs=rowsOf("documents");
  const b=(id,n)=>{$(id).hidden=!n;$(id).textContent=n>9?"9+":n};
  b("b-req",dv.filter(r=>(r.Statut||"Nouveau")==="Nouveau").length+cl.filter(r=>(r.Statut||"À faire")==="À faire").length);
  b("b-crm",ins.filter(r=>(r.Statut||"À relancer")==="À relancer").length);
  b("b-sales",docs.filter(d=>["Accepté","Paiement à vérifier"].includes(d.Statut)).length);
  const h=new Date().getHours();$("hello").textContent=(h<12?"Bonjour":h<18?"Bon après-midi":"Bonsoir")+" Hawa";
  ({home:renderHome,crm:renderCRM,req:renderReq,sales:renderSales,stats:renderStats})[view]();
}

/* ---- Accueil : bilan du jour ---- */
function renderHome(){
  const ins=rowsOf("inscriptions"),dv=rowsOf("devis"),cl=rowsOf("clients"),docs=rowsOf("documents");
  const st=data.stats||{jours:{}};const vis=((st.jours||{})[dayKey(new Date())]||{}).visites||0;
  const insT=ins.filter(r=>isToday(r.Date)).length,dvT=dv.filter(r=>isToday(r.Date)).length,clT=cl.filter(r=>isToday(r.Date)).length;
  const fact=docs.filter(d=>d.Type==="Facture");
  const salesT=fact.filter(d=>isToday(d["Payé"])&&["Payée","Livré"].includes(d.Statut));
  const toDeliver=fact.filter(d=>d.Statut==="Payée");
  const toCheck=docs.filter(d=>d.Statut==="Paiement à vérifier");
  const accepted=docs.filter(d=>d.Type==="Devis"&&d.Statut==="Accepté");
  const relance=ins.filter(r=>(r.Statut||"À relancer")==="À relancer");
  const late=relance.filter(r=>ageH(r.Date)>24);
  const newDv=dv.filter(r=>(r.Statut||"Nouveau")==="Nouveau");
  const urgent=cl.filter(r=>(r.Statut||"À faire")!=="Terminé"&&/Urgente/.test(r.Urgence||""));
  const paidList=fact.filter(d=>["Payée","Livré"].includes(d.Statut));
  const monthPaid=sumByCur(paidList.filter(d=>isThisMonth(d["Payé"]||d.Date)),d=>S.total(d));
  const unpaid=fact.filter(d=>!["Payée","Livré","Annulé"].includes(d.Statut));
  const pipe=sumByCur(docs.filter(d=>d.Type==="Devis"&&["Envoyé","Accepté"].includes(d.Statut)),d=>S.total(d));
  const parts=[];
  if(insT)parts.push(plural(insT,"personne")+" "+(insT>1?"se sont intéressées":"s'est intéressée")+" à vos démos");
  if(dvT)parts.push(plural(dvT,"demande")+" de devis");
  if(salesT.length)parts.push(plural(salesT.length,"vente")+" encaissée"+(salesT.length>1?"s":"")+" ("+curText(sumByCur(salesT,d=>S.total(d)))+")");
  if(clT)parts.push(plural(clT,"demande")+" de mise à jour");
  let sentence;
  if(parts.length){const last=parts.pop();sentence="Aujourd'hui, "+(parts.length?parts.join(", ")+" et "+last:last)+"."}
  else sentence="Pas encore d'activité aujourd'hui."+(vis?" "+plural(vis,"visite")+" sur votre site.":"");
  const after=[];if(toDeliver.length)after.push(plural(toDeliver.length,"commande")+" à livrer");if(toCheck.length)after.push(plural(toCheck.length,"paiement")+" à vérifier");if(accepted.length)after.push(plural(accepted.length,"devis","devis")+" à facturer");if(relance.length)after.push(plural(relance.length,"prospect")+" à relancer");
  const todo=[];
  toCheck.forEach(d=>todo.push({ic:ICON.money,c:"p-red",t:"Vérifier le paiement "+d["Numéro"],s:d.Entreprise+" · "+S.money(S.total(d),d.Devise),go:()=>openDoc(d)}));
  accepted.forEach(d=>todo.push({ic:ICON.doc,c:"p-vio",t:"Facturer "+d.Entreprise,s:"Devis "+d["Numéro"]+" accepté · "+S.money(S.total(d),d.Devise),go:()=>openDoc(d)}));
  toDeliver.forEach(d=>todo.push({ic:ICON.box,c:"p-ok",t:"Livrer l'application à "+d.Entreprise,s:"Facture "+d["Numéro"]+" payée",go:()=>openDoc(d)}));
  urgent.forEach(r=>todo.push({ic:ICON.tool,c:"p-red",t:"Mise à jour urgente · "+r.Entreprise,s:r["Type de demande"],go:()=>openReq("clients",r)}));
  newDv.forEach(r=>todo.push({ic:ICON.doc,c:"p-new",t:"Répondre au devis de "+(r.Entreprise||r["Nom et prénom"]),s:String(r.Application||"").split(" – ")[0]+" · "+fmtDate(r.Date),go:()=>openReq("devis",r)}));
  late.slice(0,5).forEach(r=>todo.push({ic:ICON.clock,c:"p-gold",t:"Relancer "+r["Nom et prénom"],s:"Démo "+(r["Démo ouverte"]||"")+" · "+fmtDate(r.Date),go:()=>openReq("inscriptions",r)}));
  const days=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dayKey(d);days.push({k,label:d.getDate(),v:((st.jours||{})[k]||{}).visites||0,i:ins.filter(r=>dayKey(r.Date)===k).length+dv.filter(r=>dayKey(r.Date)===k).length})}
  const funnelData=[["Visiteurs (30 j)",st.visiteurs||0],["Inscriptions démo",ins.length],["Devis demandés",dv.length],["Devis envoyés",docs.filter(d=>d.Type==="Devis"&&d.Statut!=="Brouillon").length],["Clients gagnés",contacts().filter(c=>c.stage==="gagne").length]];
  const fmax=Math.sqrt(Math.max(1,...funnelData.map(x=>x[1])));
  $("v-home").innerHTML=
    '<section class="hero"><div class="eyebrow">Bilan du jour · '+new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})+'</div><h2>'+esc(sentence)+'</h2><p>'+(after.length?"À suivre : "+esc(after.join(", "))+".":"Tout est à jour.")+'</p>'+
      '<div class="hero-stats"><div class="hs"><b>'+vis+'</b><span>visites aujourd\'hui</span></div><div class="hs"><b>'+insT+'</b><span>intéressés aujourd\'hui</span></div><div class="hs"><b>'+salesT.length+'</b><span>ventes aujourd\'hui</span></div><div class="hs"><b>'+toDeliver.length+'</b><span>commandes à livrer</span></div></div></section>'+
    '<div class="kpis"><div class="kpi card"><small>Encaissé ce mois</small><b>'+esc(curText(monthPaid))+'</b><span>factures payées</span></div><div class="kpi card"><small>En attente de paiement</small><b>'+esc(curText(sumByCur(unpaid,d=>S.total(d))))+'</b><span>'+plural(unpaid.length,"facture")+'</span></div><div class="kpi card"><small>Devis en cours</small><b>'+esc(curText(pipe))+'</b><span>envoyés ou acceptés</span></div><div class="kpi card"><small>Conversion</small><b>'+(ins.length?Math.round(100*dv.length/ins.length):0)+' %</b><span>démo → devis</span></div></div>'+
    '<div class="grid2"><section class="panel card"><div class="panel-h"><h2>À faire maintenant</h2><span class="pill p-gold">'+todo.length+'</span></div>'+(todo.length?'<div class="todo">'+todo.slice(0,8).map((x,i)=>'<button data-todo="'+i+'"><span class="ic '+x.c+'">'+x.ic+'</span><span class="tx"><b>'+esc(x.t)+'</b><span>'+esc(x.s||"")+'</span></span></button>').join("")+'</div>':'<div class="empty">Rien d\'urgent. Profitez-en pour relancer d\'anciens prospects.</div>')+'</section>'+
    '<section class="panel card"><div class="panel-h"><h2>Entonnoir de vente</h2></div><div class="funnel">'+funnelData.map(f=>'<div class="fn"><span>'+esc(f[0])+'</span><span class="bar"><i style="width:'+Math.max(2,Math.round(100*Math.sqrt(f[1])/fmax))+'%"></i></span><b>'+f[1]+'</b></div>').join("")+'</div>'+
    '<div class="sec chart"><div class="panel-h" style="margin-bottom:6px"><h3>14 derniers jours</h3></div>'+barChart(days)+'<div class="legend"><span><i style="background:#EEEEF2;border:1px solid #E2E2E8"></i>Visites</span><span><i style="background:#B8892B"></i>Inscriptions et devis</span></div></div></section></div>';
  $("v-home").querySelectorAll("[data-todo]").forEach(b=>b.onclick=()=>todo[+b.dataset.todo].go());
}
function barChart(days){
  const W=560,H=150,pad=24,bw=(W-pad)/days.length;const maxV=Math.max(4,...days.map(d=>d.v)),maxI=Math.max(1,...days.map(d=>d.i));
  const y=(v,m)=>H-18-(v/m)*(H-34);
  let s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Visites, inscriptions et devis sur 14 jours">';
  [0,.5,1].forEach(f=>{const yy=y(maxV*f,maxV);s+='<line x1="'+pad+'" x2="'+W+'" y1="'+yy+'" y2="'+yy+'" stroke="#E2E2E8" stroke-width="1"/><text x="0" y="'+(yy+4)+'" font-size="10" fill="#64636D">'+Math.round(maxV*f)+'</text>'});
  days.forEach((d,i)=>{const x=pad+i*bw+3,w=bw-6;s+='<rect x="'+x+'" y="'+y(d.v,maxV)+'" width="'+w+'" height="'+(H-18-y(d.v,maxV))+'" rx="4" fill="#EEEEF2" stroke="#E2E2E8"><title>'+d.v+' visites</title></rect>';if(d.i)s+='<circle cx="'+(x+w/2)+'" cy="'+Math.min(y(d.v,maxV)-8,H-26)+'" r="'+(4+3*d.i/maxI)+'" fill="#B8892B"><title>'+d.i+' inscriptions et devis</title></circle>';s+='<text x="'+(x+w/2)+'" y="'+(H-4)+'" font-size="10" text-anchor="middle" fill="#64636D">'+d.label+'</text>'});
  return s+'</svg>';
}

/* ---- CRM ---- */
function renderCRM(){
  const all=contacts();const q=(($("crmq")||{}).value||"").trim().toLowerCase();
  const list=all.filter(c=>!q||[c.name,c.company,c.email,c.wa,c.country,c.apps.join(" ")].join(" ").toLowerCase().includes(q));
  const won=all.filter(c=>c.stage==="gagne").length;
  let body;
  if(crmMode==="pipeline"){
    body='<div class="pipe">'+STAGES.map(([k,label])=>{const cs=list.filter(c=>c.stage===k);return '<div class="col"><div class="col-h">'+label+' <span>'+cs.length+'</span></div>'+(cs.length?cs.map(c=>'<button class="deal" data-c="'+esc(c.key)+'"><div class="row"><b>'+esc(c.company||c.name||"Sans nom")+'</b>'+(c.value?'<span class="num">'+esc(S.money(c.value.n,c.value.cur))+'</span>':'')+'</div><span>'+esc([c.name&&c.company?c.name:"",c.apps.join(", ")].filter(Boolean).join(" · "))+'</span><span>'+esc(fmtDate(c.last))+'</span></button>').join(""):'<div class="muted small" style="padding:8px">Aucun contact</div>')+'</div>'}).join("")+'</div>';
  }else{
    body='<div class="list">'+(list.length?list.map(c=>{const st=STAGES.find(s=>s[0]===c.stage);return '<button class="item" data-c="'+esc(c.key)+'"><span class="avatar" style="background:'+avColor(c.name||c.company)+'">'+esc(initials(c.name||c.company))+'</span><span class="mid"><span class="t">'+esc(c.company||c.name)+'</span><span class="s">'+esc([c.company?c.name:"",c.country,c.apps.join(", ")].filter(Boolean).join(" · "))+'</span></span><span class="end"><span class="pill '+st[2]+'">'+st[3]+'</span><span class="d">'+esc(fmtDate(c.last))+'</span></span></button>'}).join(""):'<div class="empty">Aucun contact trouvé.</div>')+'</div>';
  }
  $("v-crm").innerHTML='<div class="toolbar"><h1>CRM</h1><div class="seg"><button data-m="pipeline" aria-pressed="'+(crmMode==="pipeline")+'">Pipeline</button><button data-m="liste" aria-pressed="'+(crmMode==="liste")+'">Contacts</button></div><input class="search" id="crmq" type="search" placeholder="Rechercher un contact…" value="'+esc(q)+'"></div>'+
    '<p class="muted small" style="margin:0 0 12px">'+plural(all.length,"contact")+' · '+plural(won,"client")+' gagné'+(won>1?"s":"")+'. Chaque personne qui teste une démo, demande un devis ou reçoit une facture apparaît ici automatiquement.</p>'+body;
  $("v-crm").querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{crmMode=b.dataset.m;renderCRM()});
  $("crmq").oninput=()=>keepFocus("crmq",renderCRM);
  $("v-crm").querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>openContact(all.find(c=>c.key===b.dataset.c)));
}
function openContact(c){
  if(!c)return;
  const st=STAGES.find(s=>s[0]===c.stage),wa=digits(c.wa),first=String(c.name).split(" ")[0];
  const msg="Bonjour "+first+", c'est Hawa de SACKO CONCEPT. Je reviens vers vous au sujet de "+(c.apps[0]||"votre application")+". Avez-vous un moment pour en parler ?";
  $("sheetTitle").textContent=c.company||c.name||"Contact";
  $("sheetBody").innerHTML=
    '<div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:52px;height:52px;font-size:18px;background:'+avColor(c.name||c.company)+'">'+esc(initials(c.name||c.company))+'</span><div><b style="font-size:17px">'+esc(c.name||c.company)+'</b><div class="muted small">'+esc([c.company&&c.name?c.company:"",c.country].filter(Boolean).join(" · "))+'</div><span class="pill '+st[2]+'" style="margin-top:4px">'+st[3]+'</span></div></div>'+
    '<div class="acts">'+(wa?'<a class="btn dark" href="https://wa.me/'+wa+'?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">WhatsApp</a>':'')+(c.email?'<a class="btn" href="mailto:'+esc(c.email)+'">E-mail</a>':'')+'<button class="btn gold" id="cDoc">Créer un devis</button></div>'+
    '<div class="kpis" style="grid-template-columns:1fr 1fr;margin:0"><div class="kpi card"><small>Total payé</small><b style="font-size:18px">'+esc(curText(c.paid))+'</b></div><div class="kpi card"><small>Dernière activité</small><b style="font-size:18px">'+esc(fmtDate(c.last))+'</b></div></div>'+
    '<dl class="fields">'+[["E-mail",c.email],["WhatsApp",c.wa],["Pays",c.country],["Applications",c.apps.join(", ")],["Source",c.source],["Code espace client",codes[String(c.email).toLowerCase()]||""]].filter(x=>x[1]).map(x=>'<div><dt>'+x[0]+'</dt><dd>'+esc(x[1])+'</dd></div>').join("")+'</dl>'+
    '<div><div class="eyebrow" style="margin-bottom:10px">Historique</div><div class="timeline">'+c.events.map((e,i)=>'<div class="ev"><button data-ev="'+i+'">'+esc(e.t)+'</button><span>'+esc(fmtDate(e.d))+'</span></div>').join("")+'</div></div>';
  $("sheetBody").querySelectorAll("[data-ev]").forEach(b=>b.onclick=()=>{const e=c.events[+b.dataset.ev];e.k==="documents"?openDoc(e.r):openReq(e.k,e.r)});
  $("cDoc").onclick=()=>{const src=c.reqs.find(r=>r._k==="devis")||c.reqs[0]||{"Entreprise":c.company,"Nom et prénom":c.name,"E-mail":c.email,"WhatsApp":c.wa,"Pays":c.country};editDoc(fromRequest(src))};
  openSheet();
}

/* ---- Demandes ---- */
function renderReq(){
  const T=REQ[reqTab];const rs0=rowsOf(reqTab);const q=(($("reqq")||{}).value||"").trim().toLowerCase();
  const rs=rs0.filter(r=>(reqFilter==="Tous"||(r.Statut||T.first)===reqFilter)&&(!q||Object.values(r).join(" ").toLowerCase().includes(q)));
  const fresh=new Set(notifs.map(n=>n.id));
  const cnt=k=>rowsOf(k).filter(r=>(r.Statut||REQ[k].first)===REQ[k].first).length;
  $("v-req").innerHTML='<div class="toolbar"><h1>Demandes</h1><input class="search" id="reqq" type="search" placeholder="Rechercher…" value="'+esc(q)+'"></div>'+
    '<div class="seg" style="margin-bottom:12px">'+Object.keys(REQ).map(k=>'<button data-rt="'+k+'" aria-pressed="'+(k===reqTab)+'">'+REQ[k].title+(cnt(k)?' · '+cnt(k):'')+'</button>').join("")+'</div>'+
    '<div class="chips">'+["Tous"].concat(T.statuses).map(s=>'<button class="chip" data-f="'+esc(s)+'" aria-pressed="'+(s===reqFilter)+'">'+esc(s)+'</button>').join("")+'</div>'+
    '<div class="list">'+(rs.length?rs.map(r=>{const st=r.Statut||T.first,title=r[T.name]||r[T.person]||"Sans nom";return '<button class="item'+(fresh.has(idOf(reqTab,r))?' fresh':'')+'" data-row="'+r._row+'"><span class="avatar" style="background:'+avColor(title)+'">'+esc(initials(title))+'</span><span class="mid"><span class="t">'+esc(title)+'</span><span class="s">'+esc(T.sub.map(h=>String(r[h]||"").split(" – ")[0]).filter(Boolean).join(" · "))+'</span></span><span class="end"><span class="pill '+(PILL[st]||"p-off")+'">'+esc(st)+'</span><span class="d">'+esc(fmtDate(r.Date))+'</span></span></button>'}).join(""):'<div class="empty">Aucune demande ici pour l\'instant. Les nouvelles apparaîtront automatiquement.</div>')+'</div>';
  $("v-req").querySelectorAll("[data-rt]").forEach(b=>b.onclick=()=>{reqTab=b.dataset.rt;reqFilter="Tous";renderReq()});
  $("v-req").querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{reqFilter=b.dataset.f;renderReq()});
  $("reqq").oninput=()=>keepFocus("reqq",renderReq);
  $("v-req").querySelectorAll("[data-row]").forEach(b=>b.onclick=()=>openReq(reqTab,rs0.find(r=>r._row===+b.dataset.row)));
}
function openReq(k,r){
  if(!r)return;r=rowsOf(k).find(x=>x._row===r._row)||r;const T=REQ[k],st=r.Statut||T.first;
  notifs=notifs.filter(n=>n.id!==idOf(k,r));updateBell();
  const person=r[T.person]||"",first=String(person).split(" ")[0],app=String(r["Application"]||r["Démo ouverte"]||"votre application").split(" – ")[0];
  const msg=k==="inscriptions"?"Bonjour "+first+", c'est Hawa de SACKO CONCEPT. Vous avez testé la démo "+app+". Qu'en avez-vous pensé ? Je peux vous préparer une version à votre nom.":k==="devis"?"Bonjour "+first+", c'est Hawa de SACKO CONCEPT. Merci pour votre demande de devis pour "+app+". Avez-vous 20 minutes cette semaine pour en parler ?":"Bonjour "+first+", c'est Hawa de SACKO CONCEPT. J'ai bien reçu votre demande pour "+app+", je m'en occupe.";
  const wa=digits(r["WhatsApp"]),files=r["Fichiers joints"]||r["Fichiers"];
  $("sheetTitle").textContent=r[T.name]||r[T.person]||"Demande";
  $("sheetBody").innerHTML=
    '<div class="acts">'+(wa?'<a class="btn dark" href="https://wa.me/'+wa+'?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">WhatsApp</a>':'')+(r["E-mail"]?'<a class="btn" href="mailto:'+esc(r["E-mail"])+'">E-mail</a>':'')+(files?'<a class="btn" href="'+esc(files)+'" target="_blank" rel="noopener">Fichiers</a>':'')+(k!=="clients"?'<button class="btn gold" id="mkDoc">Créer un devis</button>':'')+'</div>'+
    '<div><div class="eyebrow" style="margin-bottom:8px">Statut</div><div class="status-row">'+T.statuses.map(s=>'<button type="button" data-s="'+esc(s)+'" aria-pressed="'+(s===st)+'">'+esc(s)+'</button>').join("")+'</div></div>'+
    '<dl class="fields">'+Object.keys(r).filter(x=>!x.startsWith("_")&&x!=="Statut"&&r[x]!=="").map(x=>'<div><dt>'+esc(x)+'</dt><dd>'+esc(x==="Date"?fmtDate(r[x]):r[x])+'</dd></div>').join("")+'</dl>'+
    (wa?'<div><div class="eyebrow" style="margin-bottom:8px">Message WhatsApp préparé</div><p class="muted small" style="margin:0">'+esc(msg)+'</p></div>':'');
  $("sheetBody").querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>setStatus(k,r,b.dataset.s,()=>openReq(k,r)));
  const mk=$("mkDoc");if(mk)mk.onclick=()=>editDoc(fromRequest(r));
  openSheet();renderAll();
}

/* ---- Ventes ---- */
function renderSales(){
  const docs=rowsOf("documents");const q=(($("salq")||{}).value||"").trim().toLowerCase();
  const F={"Tous":()=>true,"Devis":d=>d.Type==="Devis","Factures":d=>d.Type==="Facture","À encaisser":d=>d.Type==="Facture"&&!["Payée","Livré","Annulé"].includes(d.Statut),"À livrer":d=>d.Type==="Facture"&&d.Statut==="Payée","Payées":d=>["Payée","Livré"].includes(d.Statut)};
  const list=docs.filter(F[docFilter]||F.Tous).filter(d=>!q||[d["Numéro"],d.Entreprise,d.Contact].join(" ").toLowerCase().includes(q));
  const fact=docs.filter(d=>d.Type==="Facture");const views=(data.stats||{}).documents||{};
  $("v-sales").innerHTML='<div class="toolbar"><h1>Ventes</h1><button class="btn dark" id="newDoc">+ Nouveau devis</button></div>'+
    '<div class="kpis" style="margin-top:0;margin-bottom:14px"><div class="kpi card"><small>Encaissé (total)</small><b>'+esc(curText(sumByCur(fact.filter(F["Payées"]),d=>S.total(d))))+'</b></div><div class="kpi card"><small>À encaisser</small><b>'+esc(curText(sumByCur(fact.filter(F["À encaisser"]),d=>S.total(d))))+'</b></div><div class="kpi card"><small>Devis envoyés</small><b>'+docs.filter(d=>d.Type==="Devis"&&d.Statut!=="Brouillon").length+'</b><span>'+docs.filter(d=>d.Type==="Devis"&&d.Statut==="Accepté").length+' accepté(s)</span></div><div class="kpi card"><small>Commandes à livrer</small><b>'+fact.filter(F["À livrer"]).length+'</b></div></div>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px"><div class="chips" style="margin:0;flex:1">'+Object.keys(F).map(s=>'<button class="chip" data-f="'+s+'" aria-pressed="'+(s===docFilter)+'">'+s+'</button>').join("")+'</div><input class="search" id="salq" type="search" placeholder="N°, entreprise…" value="'+esc(q)+'"></div>'+
    '<div class="list">'+(list.length?list.map(d=>'<button class="item" data-row="'+d._row+'"><span class="avatar" style="background:'+(d.Type==="Facture"?"#E1ECF8;color:#2C63A8":"#F6EBD2;color:#8A6516")+';font-size:11px">'+(d.Type==="Facture"?"FAC":"DEV")+'</span><span class="mid"><span class="t">'+esc(d.Entreprise||d.Contact)+'</span><span class="s">'+esc(d["Numéro"]+" · "+fmtDate(d.Date)+(views[d["Numéro"]]?" · ouvert "+views[d["Numéro"]]+" fois":""))+'</span></span><span class="end"><span class="amt">'+esc(S.money(S.total(d),d.Devise))+'</span><span class="pill '+(PILL[d.Statut]||"p-off")+'">'+esc(d.Statut||"Brouillon")+'</span></span></button>').join(""):'<div class="empty">Aucun document ici. Créez un devis depuis une demande ou avec « Nouveau devis ».</div>')+'</div>';
  $("newDoc").onclick=()=>editDoc();
  $("v-sales").querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{docFilter=b.dataset.f;renderSales()});
  $("salq").oninput=()=>keepFocus("salq",renderSales);
  $("v-sales").querySelectorAll("[data-row]").forEach(b=>b.onclick=()=>openDoc(docs.find(d=>d._row===+b.dataset.row)));
}

/* ---- Statistiques ---- */
function renderStats(){
  const st=data.stats||{};const J=st.jours||{};const liens=data.liens||[];
  const days=[];for(let i=statsDays-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dayKey(d);const j=J[k]||{};days.push({k,label:statsDays>14?(i%3?"":d.getDate()):d.getDate(),v:j.visites||0,u:j.uniques||0,c:j.clics||0,i:rowsOf("inscriptions").filter(r=>dayKey(r.Date)===k).length})}
  const tv=days.reduce((a,d)=>a+d.v,0),tu=days.reduce((a,d)=>a+d.u,0),tc=days.reduce((a,d)=>a+d.c,0),ti=days.reduce((a,d)=>a+d.i,0);
  const top=(o,n)=>Object.entries(o||{}).sort((a,b)=>b[1]-a[1]).slice(0,n||6);
  const blist=(arr,fmt)=>{const m=Math.max(1,...arr.map(x=>x[1]));return arr.length?'<div class="bars-list">'+arr.map(([k,v])=>'<div class="bl"><div class="lab"><span>'+esc(fmt?fmt(k):k)+'</span><i><em style="width:'+Math.round(100*v/m)+'%"></em></i></div><b>'+v+'</b></div>').join("")+'</div>':'<div class="empty">Pas encore de données.</div>'};
  const NAMES={"/":"Accueil","/applications.html":"Applications","/offres.html":"Offres","/devis.html":"Demande de devis","/commencer.html":"Inscription démo","/contact.html":"Contact","/espace-client.html":"Espace client","/client.html":"Demande de mise à jour","/studio.html":"Boutique et packs"};
  const pageName=p=>NAMES[p]||String(p).replace(/^\/(\w+)\/demo\/$/,(m,a)=>"Démo "+a).replace(/^\/(\w+)\/(dollars\/|fcfa\/)?$/,(m,a)=>"Page de vente "+a);
  const srcName=s=>s==="direct"?"Accès direct":String(s).startsWith("lien-")?"Lien suivi : "+String(s).slice(5):s;
  $("v-stats").innerHTML='<div class="toolbar"><h1>Statistiques</h1><div class="seg"><button data-d="7" aria-pressed="'+(statsDays===7)+'">7 jours</button><button data-d="30" aria-pressed="'+(statsDays===30)+'">30 jours</button></div></div>'+
    '<div class="kpis" style="margin-top:0"><div class="kpi card"><small>Visites</small><b>'+tv+'</b><span>pages vues</span></div><div class="kpi card"><small>Visiteurs</small><b>'+tu+'</b><span>personnes par jour, cumulées</span></div><div class="kpi card"><small>Clics sur vos liens</small><b>'+tc+'</b><span>liens suivis</span></div><div class="kpi card"><small>Inscriptions démo</small><b>'+ti+'</b><span>'+(tu?Math.round(100*ti/tu):0)+' % des visiteurs</span></div></div>'+
    '<section class="panel card sec chart"><div class="panel-h"><h2>Visites par jour</h2></div>'+lineChart(days)+'<div class="legend"><span><i style="background:#2C63A8"></i>Visites</span><span><i style="background:#B8892B"></i>Clics sur vos liens</span></div></section>'+
    '<div class="grid2"><section class="panel card"><div class="panel-h"><h2>Vos liens suivis</h2><button class="btn sm dark" id="newLink">+ Créer un lien</button></div>'+
      '<p class="muted small" style="margin:0 0 12px">Partagez ces liens sur WhatsApp, Facebook ou LinkedIn : chaque clic est compté ici (30 derniers jours).</p>'+
      (liens.length?'<div class="list">'+liens.map(l=>{const u=SITE+"go.html?l="+encodeURIComponent(l.Code);return '<div class="link-row"><div class="mid"><b>'+esc(l.Nom||l.Code)+'</b><span>'+esc(u)+'</span></div><span class="n" title="clics">'+((st.clics||{})[l.Code]||0)+'</span><button class="btn sm" data-copy="'+esc(u)+'">Copier</button></div>'}).join("")+'</div>':'<div class="empty">Aucun lien suivi. Créez-en un pour chaque endroit où vous partagez votre démo.</div>')+'</section>'+
      '<section class="panel card"><div class="panel-h"><h2>D\'où viennent vos visiteurs</h2></div>'+blist(top(st.sources,7),srcName)+'</section></div>'+
    '<div class="grid2"><section class="panel card"><div class="panel-h"><h2>Pages les plus vues</h2></div>'+blist(top(st.pages,8),pageName)+'</section>'+
      '<section class="panel card"><div class="panel-h"><h2>Devis et factures ouverts</h2></div>'+blist(top(st.documents,8),n=>{const d=rowsOf("documents").find(x=>x["Numéro"]===n);return n+(d?" · "+(d.Entreprise||""):"")})+'<p class="muted xs" style="margin:10px 0 0">Nombre de fois où le client a ouvert son lien.</p></section></div>'+
    '<p class="muted xs" style="margin-top:14px">Statistiques anonymes sur 30 jours, démos NettoPro, RH Pro, StockPro et PhonePro comprises.</p>';
  $("v-stats").querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{statsDays=+b.dataset.d;renderStats()});
  $("v-stats").querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast("Lien copié")}catch(e){toast(b.dataset.copy)}});
  $("newLink").onclick=openNewLink;
}
function lineChart(days){
  const W=640,H=180,pl=26,pb=20;const max=Math.max(4,...days.map(d=>Math.max(d.v,d.c)));const n=days.length;
  const x=i=>pl+(n===1?0:i*(W-pl-8)/(n-1)),y=v=>H-pb-(v/max)*(H-pb-12);
  const path=k=>days.map((d,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(d[k]).toFixed(1)).join(" ");
  let s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Visites par jour">';
  [0,.5,1].forEach(f=>{const yy=y(max*f);s+='<line x1="'+pl+'" x2="'+W+'" y1="'+yy+'" y2="'+yy+'" stroke="#E2E2E8"/><text x="0" y="'+(yy+4)+'" font-size="10" fill="#64636D">'+Math.round(max*f)+'</text>'});
  s+='<path d="'+path("v")+' L'+x(n-1)+' '+(H-pb)+' L'+x(0)+' '+(H-pb)+' Z" fill="rgba(44,99,168,.08)"/>';
  s+='<path d="'+path("v")+'" fill="none" stroke="#2C63A8" stroke-width="2.2" stroke-linejoin="round"/><path d="'+path("c")+'" fill="none" stroke="#B8892B" stroke-width="2" stroke-dasharray="4 3"/>';
  const L=days[n-1];s+='<circle cx="'+x(n-1)+'" cy="'+y(L.v)+'" r="4" fill="#2C63A8"/><text x="'+(x(n-1)-6)+'" y="'+(y(L.v)-8)+'" font-size="11" font-weight="700" text-anchor="end" fill="#2C63A8">'+L.v+'</text>';
  days.forEach((d,i)=>{if(d.label!=="")s+='<text x="'+x(i)+'" y="'+(H-4)+'" font-size="10" text-anchor="middle" fill="#64636D">'+d.label+'</text>'});
  return s+'</svg>';
}
function openNewLink(){
  $("sheetTitle").textContent="Créer un lien suivi";
  const dests=[["Accueil du site",SITE],["Démo NettoPro",SITE+"commencer.html#nettopro"],["Démo RH Pro",SITE+"commencer.html#rhpro"],["Démo StockPro",SITE+"commencer.html#stockpro"],["Démo PhonePro",SITE+"commencer.html#phonepro"],["Demande de devis",SITE+"devis.html"],["Offres",SITE+"offres.html"]];
  $("sheetBody").innerHTML='<form class="ed" id="lf"><label>Nom du lien<input id="l_nom" placeholder="Ex. : Groupe WhatsApp commerçants Cotonou" required></label>'+
    '<label>Vers quelle page ?<select id="l_dest">'+dests.map(d=>'<option value="'+esc(d[1])+'">'+esc(d[0])+'</option>').join("")+'<option value="autre">Autre adresse…</option></select></label>'+
    '<label id="l_other" hidden>Adresse<input id="l_url" type="url" placeholder="https://"></label>'+
    '<label>Code court (facultatif)<input id="l_code" placeholder="ex. : wa-cotonou"></label>'+
    '<div class="note">Le lien ressemblera à : '+SITE+'go.html?l=wa-cotonou</div>'+
    '<div class="acts"><button class="btn dark" type="submit" id="l_save">Créer le lien</button></div><span class="err" id="l_err"></span></form>';
  $("l_dest").onchange=()=>$("l_other").hidden=$("l_dest").value!=="autre";
  $("lf").onsubmit=async e=>{e.preventDefault();const nom=$("l_nom").value.trim();let dest=$("l_dest").value;if(dest==="autre")dest=$("l_url").value.trim();if(!nom||!dest){$("l_err").textContent="Indiquez un nom et une page.";return}
    const code=$("l_code").value.trim().toLowerCase().replace(/[^a-z0-9-]/g,"");
    if(demo){(data.liens=data.liens||[]).push({Code:code||"lien"+data.liens.length,Nom:nom,Destination:dest});toast("Lien créé (exemple)");closeSheet();renderStats();return}
    $("l_save").disabled=true;
    try{const j=await api({action:"creerlien",nom,destination:dest,code});if(!j.ok){$("l_save").disabled=false;$("l_err").textContent=j.erreur==="existe"?"Ce code existe déjà, choisissez-en un autre.":"Création impossible. Réessayez.";return}
      (data.liens=data.liens||[]).push({Code:j.code,Nom:nom,Destination:dest});try{await navigator.clipboard.writeText(SITE+"go.html?l="+j.code)}catch(err){}toast("Lien créé et copié");closeSheet();renderStats()}
    catch(err){$("l_save").disabled=false;$("l_err").textContent="Création impossible. Vérifiez votre connexion."}};
  openSheet();$("l_nom").focus();
}

/* ---------- statuts ---------- */
async function setStatus(k,r,s,after,quiet){
  const t=data[k];const i=t.headers.indexOf("Statut");const pi=t.headers.indexOf("Payé");const raw=t.rows.find(x=>x.row===r._row);const old=raw?raw.values[i]:"";
  if(i>=0&&raw)raw.values[i]=s;
  if(k==="documents"&&s==="Payée"&&pi>=0&&raw&&!raw.values[pi])raw.values[pi]=new Date().toISOString();
  if(after)after();renderAll();
  if(demo){if(!quiet)toast("Statut : "+s+" (exemple)");return}
  try{const j=await api({action:"statut",feuille:k,row:r._row,statut:s});if(!j.ok)throw 0;if(!quiet)toast("Statut enregistré : "+s)}
  catch(e){if(i>=0&&raw)raw.values[i]=old;if(after)after();renderAll();toast("Le statut n'a pas pu être enregistré. Vérifiez votre connexion.")}
}

/* ---------- devis & factures ---------- */
function docLink(d){return SITE+"document.html?t="+encodeURIComponent(d["Jeton"])}
function addDays(n){const d=new Date();d.setDate(d.getDate()+n);return dayKey(d)}
function fromRequest(r){
  const app=String(r["Application"]||r["Démo ouverte"]||"").split(" – ")[0];
  const formule=r["Formule"]&&r["Formule"]!=="Je ne sais pas encore"?r["Formule"]:"Standard";
  const L=[];if(app&&app!=="Sur mesure")L.push({desc:app+" – formule "+formule,qte:1,prix:0});
  if(r["Option Sérénité"]==="Oui")L.push({desc:"Option Sérénité (par mois)",qte:3,prix:0});
  const pays=r["Pays"]||"";
  return {Type:"Devis",Entreprise:r["Entreprise"]||"",Contact:r["Nom et prénom"]||r["Contact"]||"","E-mail":r["E-mail"]||"",WhatsApp:r["WhatsApp"]||"",Pays:pays,Devise:r["Devise"]?S.curCode(r["Devise"]):/France|Belgique|Suisse/.test(pays)?"EUR":/États-Unis|Canada|Royaume/.test(pays)?"USD":"XOF",Lignes:L.length?L:[{desc:"",qte:1,prix:0}],"Acompte %":Number(V["Acompte par défaut (%)"])||50,Notes:"",Origine:r["Application"]||""};
}
function editDoc(d){
  d=JSON.parse(JSON.stringify(d||{Type:"Devis",Devise:"XOF",Lignes:[{desc:"",qte:1,prix:0}],"Acompte %":Number(V["Acompte par défaut (%)"])||50}));
  if(typeof d.Lignes==="string"){try{d.Lignes=JSON.parse(d.Lignes)}catch(e){d.Lignes=[]}}
  if(!d.Lignes||!d.Lignes.length)d.Lignes=[{desc:"",qte:1,prix:0}];
  d["Échéance"]=d["Échéance"]?String(d["Échéance"]).slice(0,10):(d.Type==="Devis"?addDays(Number(V["Validité devis (jours)"])||15):addDays(7));
  d.Devise=S.curCode(d.Devise);
  $("sheetTitle").textContent=d["Numéro"]?"Modifier "+d["Numéro"]:"Nouveau "+(d.Type==="Facture"?"document":"devis");
  const f=(id,label,val,type)=>'<label>'+label+'<input id="'+id+'" type="'+(type||"text")+'" value="'+esc(val||"")+'"></label>';
  $("sheetBody").innerHTML='<form class="ed" id="edf" novalidate>'+
    '<div class="row2"><label>Type<select id="e_type"><option'+(d.Type==="Devis"?" selected":"")+'>Devis</option><option'+(d.Type==="Facture"?" selected":"")+'>Facture</option></select></label><label>Devise<select id="e_cur"><option value="XOF"'+(d.Devise==="XOF"?" selected":"")+'>Franc CFA</option><option value="EUR"'+(d.Devise==="EUR"?" selected":"")+'>Euro (€)</option><option value="USD"'+(d.Devise==="USD"?" selected":"")+'>Dollar ($)</option></select></label></div>'+
    '<div class="row2">'+f("e_ent","Entreprise",d.Entreprise)+f("e_con","Contact",d.Contact)+'</div>'+
    '<div class="row2">'+f("e_mail","E-mail",d["E-mail"],"email")+f("e_wa","WhatsApp",d.WhatsApp,"tel")+'</div>'+
    '<div class="row2">'+f("e_pays","Pays",d.Pays)+f("e_ech",d.Type==="Facture"?"À payer avant le":"Valable jusqu'au",d["Échéance"],"date")+'</div>'+
    '<div><div class="eyebrow" style="margin-bottom:8px">Lignes</div><div class="lines" id="lines"></div><div style="margin-top:8px"><button type="button" class="btn sm" id="addLine">+ Ajouter une ligne</button></div><div class="presets" style="margin-top:8px">'+PRESETS.map((p,i)=>'<button type="button" data-p="'+i+'">+ '+esc(p[0])+'</button>').join("")+'</div></div>'+
    '<div class="row2">'+f("e_dep","Acompte (%) · 0 pour tout payer d\'un coup",d["Acompte %"],"number")+f("e_momo","Lien Mobile Money (FedaPay, KKiaPay…)",d["Lien Mobile Money"]||"")+'</div>'+
    '<label>Note pour le client<textarea id="e_notes">'+esc(d.Notes||"")+'</textarea></label>'+
    '<div class="totbar"><span>Total</span><span id="e_tot"></span></div>'+
    '<div class="acts"><button class="btn dark" type="submit" id="e_save">Enregistrer</button><button class="btn" type="button" id="e_cancel">Annuler</button></div><div class="err" id="e_err"></div></form>';
  const tot=()=>{d.Devise=$("e_cur").value;$("e_tot").textContent=S.money(S.total(d),d.Devise)};
  const drawLines=()=>{$("lines").innerHTML=d.Lignes.map((l,i)=>'<div class="line"><input aria-label="Description" data-i="'+i+'" data-k="desc" value="'+esc(l.desc)+'" placeholder="Description"><input aria-label="Quantité" data-i="'+i+'" data-k="qte" type="number" min="0" step="any" value="'+esc(l.qte)+'"><input aria-label="Prix unitaire" data-i="'+i+'" data-k="prix" type="number" min="0" step="any" value="'+esc(l.prix)+'" placeholder="Prix"><button type="button" data-del="'+i+'" aria-label="Retirer">×</button></div>').join("");tot()};
  drawLines();
  $("lines").oninput=e=>{const x=e.target;if(x.dataset.i==null)return;const l=d.Lignes[+x.dataset.i];l[x.dataset.k]=x.dataset.k==="desc"?x.value:Number(x.value);tot()};
  $("lines").onclick=e=>{const b=e.target.closest("[data-del]");if(b){d.Lignes.splice(+b.dataset.del,1);if(!d.Lignes.length)d.Lignes.push({desc:"",qte:1,prix:0});drawLines()}};
  $("addLine").onclick=()=>{d.Lignes.push({desc:"",qte:1,prix:0});drawLines()};
  $("sheetBody").querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{const p=PRESETS[+b.dataset.p];const empty=d.Lignes.findIndex(l=>!l.desc);const L={desc:p[0],qte:p[1],prix:0};if(empty>=0)d.Lignes[empty]=L;else d.Lignes.push(L);drawLines()});
  $("e_cur").onchange=tot;
  $("e_cancel").onclick=()=>d.row?openDoc(rowsOf("documents").find(x=>x._row===d.row)):closeSheet();
  let force=false;
  $("edf").onsubmit=async e=>{
    e.preventDefault();
    const out=Object.assign({},d,{Type:$("e_type").value,Devise:$("e_cur").value,Entreprise:$("e_ent").value.trim(),Contact:$("e_con").value.trim(),"E-mail":$("e_mail").value.trim(),WhatsApp:$("e_wa").value.trim(),Pays:$("e_pays").value.trim(),"Échéance":$("e_ech").value,"Acompte %":Number($("e_dep").value)||0,"Lien Mobile Money":$("e_momo").value.trim(),Notes:$("e_notes").value.trim()});
    delete out._row;delete out._k;
    out.Lignes=d.Lignes.filter(l=>l.desc);out.Total=S.total(out);
    if(!out.Entreprise&&!out.Contact){$("e_err").textContent="Indiquez au moins l'entreprise ou le contact.";return}
    if(!out.Lignes.length){$("e_err").textContent="Ajoutez au moins une ligne.";return}
    if(!force&&out.Lignes.some(l=>!(Number(l.prix)>0))){force=true;$("e_err").textContent="Une ligne n'a pas de prix. Touchez encore « Enregistrer » pour confirmer.";return}
    $("e_save").disabled=true;$("e_save").textContent="Enregistrement…";
    try{
      let saved;
      if(demo){saved=Object.assign({},out,{"Numéro":out["Numéro"]||(out.Type==="Facture"?"FAC":"DEV")+"-2026-00"+(rowsOf("documents").length+1),Jeton:out.Jeton||"ex"+Date.now(),Date:out.Date||new Date().toISOString(),Statut:out.Statut||"Brouillon"});saved.row=d.row||(100+rowsOf("documents").length)}
      else{const j=await api({action:"enregistrer",data:JSON.stringify(Object.assign({},out,{row:d.row||""}))});if(!j.ok)throw new Error(j.erreur);saved=j.doc;if(j.code&&out["E-mail"])codes[out["E-mail"].toLowerCase()]=j.code}
      upsertDoc(saved);toast((saved.Type||"Document")+" "+saved["Numéro"]+" enregistré");if(view!=="sales")setView("sales");else renderAll();openDoc(rowsOf("documents").find(x=>x._row===saved.row));
    }catch(err){$("e_save").disabled=false;$("e_save").textContent="Enregistrer";$("e_err").textContent="L'enregistrement n'a pas abouti. Vérifiez votre connexion et réessayez."}
  };
  openSheet();$("e_ent").focus();
}
function upsertDoc(o){const t=data.documents;const vals=t.headers.map(h=>h==="Lignes"&&typeof o[h]!=="string"?JSON.stringify(o[h]||[]):(o[h]??""));const ex=t.rows.find(x=>x.row===o.row);if(ex)ex.values=vals;else t.rows.push({row:o.row,values:vals})}
function docMsg(d){
  const first=String(d.Contact||"").split(" ")[0]||"";const code=codes[String(d["E-mail"]||"").toLowerCase()];
  return "Bonjour "+first+", c'est Hawa de SACKO CONCEPT. Voici votre "+(d.Type==="Facture"?"facture":"devis")+" "+d["Numéro"]+" ("+S.money(S.total(d),d.Devise)+") : "+docLink(d)+
    (d.Type==="Facture"?"\nVous pouvez la régler directement depuis ce lien.":"\nVous pouvez l'accepter directement depuis ce lien.")+
    (code?"\n\nVotre espace client : "+SITE+"espace-client.html\nE-mail : "+d["E-mail"]+"\nCode : "+code:"");
}
function openDoc(r){
  if(!r)return closeSheet();
  r=rowsOf("documents").find(x=>x._row===r._row)||r;
  const st=r.Statut||"Brouillon",wa=digits(r.WhatsApp),msg=docMsg(r),views=((data.stats||{}).documents||{})[r["Numéro"]]||0;
  notifs=notifs.filter(n=>!(n.k==="documents"&&n.r["Jeton"]===r["Jeton"]));updateBell();
  $("sheetTitle").textContent=r.Type+" "+r["Numéro"];
  const allowed=DOC_ST.filter(s=>r.Type==="Devis"?!["Paiement à vérifier","Payée","Livré"].includes(s):s!=="Accepté");
  const code=r["E-mail"]&&codes[String(r["E-mail"]).toLowerCase()];
  $("sheetBody").innerHTML=
    '<div class="acts">'+(wa?'<a class="btn dark" id="d_wa" href="https://wa.me/'+wa+'?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener">Envoyer par WhatsApp</a>':'')+(r["E-mail"]?'<a class="btn" id="d_mail" href="mailto:'+esc(r["E-mail"])+'?subject='+encodeURIComponent((r.Type==="Facture"?"Facture ":"Devis ")+r["Numéro"]+" – SACKO CONCEPT")+'&body='+encodeURIComponent(msg)+'">E-mail</a>':'')+'<button class="btn" id="d_copy">Copier le lien</button><a class="btn" href="'+esc(docLink(r))+'" target="_blank" rel="noopener">Voir comme le client</a><button class="btn" id="d_edit">Modifier</button>'+(r.Type==="Devis"?'<button class="btn gold" id="d_inv">Transformer en facture</button>':'')+'</div>'+
    '<div><div class="eyebrow" style="margin-bottom:8px">Statut</div><div class="status-row">'+allowed.map(s=>'<button type="button" data-s="'+esc(s)+'" aria-pressed="'+(s===st)+'">'+esc(s)+'</button>').join("")+'</div></div>'+
    (st==="Paiement à vérifier"?'<div class="note">Le client dit avoir payé. Vérifiez votre PayPal ou Mobile Money, puis touchez « Payée ».</div>':'')+
    (st==="Accepté"?'<div class="note">Le client a accepté ce devis. Touchez « Transformer en facture » pour lui envoyer la facture.</div>':'')+
    (st==="Payée"?'<div class="note">Payée. Quand l\'application est livrée au client, touchez « Livré ».</div>':'')+
    '<div class="muted small">'+(views?"Le client a ouvert ce lien "+views+" fois.":"Le client n'a pas encore ouvert ce lien.")+(code?' · Code espace client : <b style="font-family:var(--mono);color:var(--fg)">'+esc(code)+'</b>':'')+'</div>'+
    '<div class="docprev">'+S.render(r,V,{logo:"../assets/sacko-logo-512.png"})+'</div>';
  $("sheetBody").querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>setStatus("documents",r,b.dataset.s,()=>openDoc(r)));
  $("d_copy").onclick=async()=>{try{await navigator.clipboard.writeText(docLink(r));toast("Lien copié")}catch(e){toast(docLink(r))}};
  $("d_edit").onclick=()=>editDoc(Object.assign({},r,{row:r._row}));
  const inv=$("d_inv");if(inv)inv.onclick=()=>{const c=Object.assign({},r);["Numéro","Jeton","Date","Statut","Échéance","Payé","_row","_k","row"].forEach(k=>delete c[k]);c.Type="Facture";c.Origine=r["Numéro"];editDoc(c)};
  const markSent=()=>{if(st==="Brouillon")setStatus("documents",r,"Envoyé",null,true)};
  ["d_wa","d_mail"].forEach(id=>{const el=$(id);if(el)el.addEventListener("click",markSent)});
  openSheet();
}

/* ---------- Mes informations ---------- */
function openSettings(){
  $("sheetTitle").textContent="Mes informations";
  const ta=["Conditions","Virement bancaire","Adresse"];
  const help={"Numéro Mobile Money":"Ex. : MTN Bénin · 01 97 00 00 00 · Hawa Sacko. S'affiche sur les factures.","Lien Mobile Money par défaut":"Lien FedaPay, KKiaPay ou Chariow utilisé si la facture n'en a pas.","Virement bancaire":"Laissez vide si vous ne l'utilisez pas."};
  $("sheetBody").innerHTML='<form class="ed" id="sf"><div class="note">Ces informations apparaissent sur tous vos devis et factures, avec votre logo.</div>'+
    SETTINGS.map((k,i)=>'<label>'+esc(k)+(ta.includes(k)?'<textarea id="s'+i+'">'+esc(V[k]||"")+'</textarea>':'<input id="s'+i+'" value="'+esc(V[k]||"")+'">')+(help[k]?'<span class="muted xs" style="font-weight:400">'+esc(help[k])+'</span>':'')+'</label>').join("")+
    '<div class="acts"><button class="btn dark" type="submit" id="s_save">Enregistrer</button><button class="btn" type="button" id="s_out">Se déconnecter</button></div><div class="err" id="s_err"></div></form>';
  $("s_out").onclick=()=>{closeSheet();logout()};
  $("sf").onsubmit=async e=>{e.preventDefault();const vals={};SETTINGS.forEach((k,i)=>vals[k]=$("s"+i).value.trim());
    if(demo){Object.assign(V,vals);toast("Enregistré (exemple)");closeSheet();return}
    $("s_save").disabled=true;try{const j=await api({action:"parametres",data:JSON.stringify(vals)});if(!j.ok)throw 0;V=j.vendeur;toast("Informations enregistrées");closeSheet()}catch(err){$("s_save").disabled=false;$("s_err").textContent="L'enregistrement n'a pas abouti. Réessayez."}};
  openSheet();
}

/* ---------- coque ---------- */
function openSheet(){$("scrim").hidden=false;$("sheet").hidden=false;$("sheetBody").scrollTop=0}
function closeSheet(){$("scrim").hidden=true;$("sheet").hidden=true}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>setView(t.dataset.v));
$("close").onclick=closeSheet;$("scrim").onclick=closeSheet;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
$("refresh").onclick=()=>load(false);
$("settings").onclick=openSettings;
$("bell").onclick=()=>{const p=$("notifs");if(!p.hidden){p.hidden=true;return}
  p.innerHTML=notifs.length?notifs.slice(0,12).map((n,i)=>'<button data-i="'+i+'">'+esc(lab(n))+'<small>'+esc((n.r["Entreprise"]||n.r["Nom et prénom"]||n.r["Contact"]||"")+" · "+fmtDate(n.r.Date))+'</small></button>').join(""):'<div style="padding:14px" class="muted small">Aucune nouvelle notification.</div>';
  p.hidden=false;
  p.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{const n=notifs[+b.dataset.i];p.hidden=true;n.k==="documents"?openDoc(n.r):openReq(n.k,n.r)});
};
document.addEventListener("click",e=>{if(!e.target.closest("#notifs")&&!e.target.closest("#bell"))$("notifs").hidden=true});
function start(){
  $("login").hidden=true;$("app").hidden=false;$("demoBar").hidden=!demo;
  if("Notification" in window&&Notification.permission==="default"&&!demo)$("permBar").hidden=false;
  setView("home");load(true);clearInterval(timer);timer=setInterval(()=>load(false),60000);
}
function logout(){store.del("sc_key");key=null;demo=false;data=null;notifs=[];clearInterval(timer);$("app").hidden=true;$("login").hidden=false}
$("exitDemo").onclick=logout;
$("allow").onclick=async()=>{try{const p=await Notification.requestPermission();$("permBar").hidden=true;toast(p==="granted"?"Notifications activées":"Notifications refusées")}catch(e){$("permBar").hidden=true}};
$("loginForm").onsubmit=async e=>{
  e.preventDefault();$("loginErr").textContent="";
  const c=$("code").value.trim();if(!c){$("loginErr").textContent="Entrez votre code d'accès.";return}
  if(URL_API.startsWith("COLLER")){$("loginErr").textContent="L'application n'est pas encore reliée. Utilisez « Voir avec des exemples ».";return}
  key=c;demo=false;
  try{const j=await api();if(!j.ok){$("loginErr").textContent="Code d'accès incorrect.";key=null;return}store.set("sc_key",c);data=null;start()}
  catch(err){$("loginErr").textContent="Connexion impossible. Vérifiez votre réseau.";key=null}
};
$("demoBtn").onclick=()=>{demo=true;key=null;data=null;V={};store.del("sc_seen_demo");start();
  setTimeout(()=>{if(!demo||!data)return;data.inscriptions.rows.push({row:99,values:[new Date().toISOString(),"Ibrahim Sow","Sow Distribution","ibrahim@sowdistri.sn","+221 78 000 00 00","StockPro","À relancer"]});load(false)},7000)};
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{})}
const saved=store.get("sc_key");
if(saved&&!URL_API.startsWith("COLLER")){key=saved;start()}
