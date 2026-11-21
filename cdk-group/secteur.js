/* Moteur commun des logiciels de département CDK GROUP (démonstration).
   Chaque département déclare window.SECTEUR = () => ({...}) : ses postes, ses modules et ses données d'exemple. */
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const AUJ=iso(new Date());
const J=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const HM=(h,m=0)=>String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
const maintenant=()=>{const d=new Date();return HM(d.getHours(),d.getMinutes())};
const nf=n=>Number(n||0).toLocaleString("fr-FR");
const fcfa=n=>nf(n)+" F CFA";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fd=s=>s?new Date(s+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}):"—";
const uid=()=>Math.random().toString(36).slice(2,9);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const somme=(l,k)=>l.reduce((t,x)=>t+(+x[k]||0),0);
let S,D,role=null,moi=null,vue="dash",filtres={};

function charger(){S=window.SECTEUR();const k="cdk-secteur-"+S.id+"-v1";let d=null;try{d=JSON.parse(localStorage.getItem(k))}catch(e){}
  if(!d){d={};Object.entries(S.collections).forEach(([c,def])=>d[c]=(def.seed||[]).map(r=>({id:r.id||uid(),...r})))}
  Object.keys(S.collections).forEach(c=>{if(!d[c])d[c]=[]});D=d;S._cle=k}
function save(){try{localStorage.setItem(S._cle,JSON.stringify(D));if(S.kpisGroupe)localStorage.setItem("cdk-kpi-"+S.id,JSON.stringify({maj:new Date().toISOString(),kpis:S.kpisGroupe(D)}))}catch(e){}}
let tT;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(tT);tT=setTimeout(()=>t.classList.remove("on"),2600)}
function modal(t,b,f){$("#box").innerHTML=`<div class="box-h"><h3 class="grow">${t}</h3><button class="x" id="mx">×</button></div><div class="box-b">${b}</div>${f?`<div class="box-f">${f}</div>`:""}`;$("#modal").classList.add("on");$("#mx").onclick=fermer}
function fermer(){$("#modal").classList.remove("on")}
const membre=id=>(D.equipe||[]).find(x=>x.id===id);
const nomDe=(c,id)=>{const r=(D[c]||[]).find(x=>x.id===id);if(!r)return "—";const t=S.collections[c].titreDe;return t?t(r):(r.nom||r.titre||r.id)};

/* ---------- page ---------- */
function squelette(){document.body.innerHTML=`<div class="ribbon">Démonstration · ${esc(S.nom)} — logiciel du département, données d'exemple</div>
<section id="login"><p style="margin:0"><a class="back" href="../">← Plateforme du groupe CDK GROUP</a></p>
<div class="brand-top"><img src="../logo-cdk-512.png" alt="CDK GROUP" style="width:96px;height:96px"><h1>${S.ico} ${esc(S.nom)}</h1><p class="muted">${esc(S.sous)}</p></div>
<div class="sec-t">Choisissez votre poste</div><div class="esp-grid" id="postes"></div>
<p class="muted xs" style="text-align:center;margin-top:30px"><button class="btn sm" id="reset">Réinitialiser ce département</button></p></section>
<div id="app" class="hide"><header class="top"><div class="top-in"><button class="btn sm" id="menu-btn">☰</button><img src="../logo-cdk-96.png" alt=""><div class="who grow"><b id="who-poste"></b><span id="who-dept"></span></div><button class="btn sm" id="switch">Changer de poste</button></div></header>
<div class="layout"><aside id="side"></aside><main id="main"></main></div></div>
<div id="modal"><div class="box" id="box"></div></div><div id="toast"></div>`;
  document.documentElement.style.setProperty("--p",S.c);document.documentElement.style.setProperty("--p-l",S.c+"18");
  document.title=S.nom+" · CDK GROUP";
  $("#postes").innerHTML=S.roles.map(r=>`<button class="esp" data-r="${r.id}"><span class="ico" style="background:${S.c}18;color:${S.c}">${r.ico||S.ico}</span><span class="grow"><b>${esc(r.poste)}</b><span>${esc(r.desc)}</span></span></button>`).join("");
  $$("[data-r]").forEach(b=>b.onclick=()=>choisir(b.dataset.r));
  $("#reset").onclick=()=>{if(confirm("Remettre les données d'exemple de ce département ?")){localStorage.removeItem(S._cle);charger();save();toast("Département réinitialisé")}};
  $("#switch").onclick=()=>{role=null;moi=null;$("#app").classList.add("hide");$("#login").classList.remove("hide");window.scrollTo(0,0)};
  $("#menu-btn").onclick=()=>$("#side").classList.toggle("open");
  $("#modal").onclick=e=>{if(e.target.id==="modal")fermer()};
}
function choisir(id){const r=S.roles.find(x=>x.id===id);
  if(r.personne){const l=(D.equipe||[]).filter(m=>[].concat(r.personne).includes(m.fonction)&&m.statut!=="Sorti");
    if(!l.length)return toast("Aucun membre de l'équipe à ce poste");
    modal("Qui êtes-vous ?",`<div class="field"><label class="f">${esc(r.poste)}</label><select class="input" id="qui">${l.map(m=>`<option value="${m.id}">${esc(m.nom)}${m.matricule?" · "+esc(m.matricule):""}</option>`).join("")}</select></div>`,`<button class="btn pri" id="qok">Ouvrir mon espace</button>`);
    $("#qok").onclick=()=>{moi=membre($("#qui").value);fermer();entrer(r)};return}
  moi=null;entrer(r)}
function entrer(r){role=r;$("#login").classList.add("hide");$("#app").classList.remove("hide");
  $("#who-poste").textContent=r.poste+(moi?" · "+moi.nom:"");$("#who-dept").textContent=S.nom+" · CDK GROUP";filtres={};ouvrir("dash")}
const ctx=()=>({D,moi,role,save,toast,modal,fermer,ouvrir,nouveau,maj});

/* ---------- navigation ---------- */
function items(){return [["dash","🏠 Tableau de bord"],...role.menu.map(m=>[m.c,m.l])]}
function menu(){const b={};role.menu.forEach(m=>{if(m.badge)b[m.c]=m.badge(D,ctx())});
  $("#side").innerHTML=`<div class="grp">${esc(role.poste)}</div>`+items().map(([k,l])=>`<button data-t="${k}" class="${vue===k?"on":""}">${l}${b[k]?`<span class="bdg">${b[k]}</span>`:""}</button>`).join("")+`<div class="grp">Groupe</div><button onclick="location.href='../'">↩ Plateforme du groupe</button>`;
  $$("#side [data-t]").forEach(x=>x.onclick=()=>{$("#side").classList.remove("open");ouvrir(x.dataset.t)})}
function ouvrir(v){vue=v;menu();window.scrollTo(0,0);if(v==="dash")return vDash();vListe(role.menu.find(m=>m.c===v))}
const head=(t,s,a="")=>`<div class="head"><div><h1>${t}</h1>${s?`<p class="muted sm" style="margin:4px 0 0">${s}</p>`:""}</div><div class="row">${a}</div></div>`;

/* ---------- tableau de bord ---------- */
function vDash(){const d=role.dash||{},c=ctx();
  const k=(d.kpis?d.kpis(D,c):[]);const a=d.actions||[];const l=d.listes||[];
  $("#main").innerHTML=head(`${role.ico||S.ico} ${esc(role.poste)}`,moi?`Bonjour ${esc(moi.nom)} · ${fd(AUJ)}`:`${esc(S.nom)} · ${fd(AUJ)}`)+
  (d.info?`<div class="idbox sm">${d.info}</div>`:"")+
  (a.length?`<div class="quick">${a.map((x,i)=>`<button data-qa="${i}" class="${x.danger?"danger":""}"><span>${x.ico}</span>${esc(x.l)}</button>`).join("")}</div>`:"")+
  (k.length?`<div class="tiles">${k.map(([lab,val,col])=>`<div class="tile"><b style="${col?"color:"+col:""}">${val}</b><span class="muted sm">${lab}</span></div>`).join("")}</div>`:"")+
  l.map((x,i)=>{const def=S.collections[x.c],rows=D[x.c].filter(r=>!x.filtre||x.filtre(r,c)).slice(0,x.max||6);
    return `<div class="card"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:6px"><h2 style="margin:0">${x.titre}</h2>${role.menu.some(m=>m.c===x.c)?`<button class="btn sm" data-go="${x.c}">Tout voir</button>`:""}</div>${rows.length?rows.map(r=>`<div class="line click" data-fi="${x.c}|${r.id}"><div class="grow"><b>${esc(def.titreDe?def.titreDe(r):r.nom||r.titre)}</b><div class="muted xs">${esc((def.sousDe?def.sousDe(r):""))}</div></div>${pillStatut(x.c,r)}</div>`).join(""):'<p class="muted sm" style="margin:0">Rien à afficher.</p>'}</div>`}).join("");
  $$("[data-qa]").forEach(b=>b.onclick=()=>a[+b.dataset.qa].run(ctx()));
  $$("[data-go]").forEach(b=>b.onclick=()=>ouvrir(b.dataset.go));
  $$("[data-fi]").forEach(b=>b.onclick=()=>{const [cc,id]=b.dataset.fi.split("|");fiche(cc,id,role.menu.find(m=>m.c===cc)||{})})}
function pillStatut(c,r){const def=S.collections[c];if(!def.statut)return "";const v=r[def.statut.k];const col=(def.statut.couleurs||{})[v]||"p-grey";return `<span class="pill ${col}">${esc(v)}</span>`}

/* ---------- listes ---------- */
function valeur(c,ch,r){const v=r[ch.k];if(v==null||v==="")return "—";
  if(ch.type==="membre")return esc((membre(v)||{}).nom||"—");if(ch.type==="ref")return esc(nomDe(ch.ref,v));
  if(ch.type==="money")return fcfa(v);if(ch.type==="number")return nf(v);if(ch.type==="date")return fd(v);if(ch.type==="bool")return v?"Oui":"Non";return esc(v)}
function vListe(m){const def=S.collections[m.c],c=ctx(),st=def.statut;let rows=D[m.c].filter(r=>!m.filtre||m.filtre(r,c));
  const f=filtres[m.c]||"";if(f&&st)rows=rows.filter(r=>r[st.k]===f);
  if(def.tri)rows=[...rows].sort(def.tri);
  const cols=(m.cols||def.cols).map(k=>def.champs.find(x=>x.k===k)).filter(Boolean);
  $("#main").innerHTML=head(m.l.replace(/^\S+\s/,""),m.aide||def.aide||"",(m.can||[]).includes("add")?`<button class="btn pri" id="add">+ ${esc(def.ajout||"Ajouter")}</button>`:"")+
  (st?`<div class="tabs"><button data-f="" class="${f?"":"on"}">Tout (${D[m.c].filter(r=>!m.filtre||m.filtre(r,c)).length})</button>${st.options.map(o=>`<button data-f="${esc(o)}" class="${f===o?"on":""}">${esc(o)}</button>`).join("")}</div>`:"")+
  `<div class="card scroll" style="padding:6px 10px">${rows.length?`<table class="tbl"><thead><tr>${cols.map(x=>`<th>${esc(x.l)}</th>`).join("")}${st?"<th></th>":""}</tr></thead><tbody>${rows.map(r=>`<tr class="click" data-id="${r.id}">${cols.map(x=>`<td>${valeur(m.c,x,r)}</td>`).join("")}${st?`<td>${pillStatut(m.c,r)}</td>`:""}</tr>`).join("")}</tbody></table>`:'<p class="muted sm" style="padding:14px">Aucun élément.</p>'}</div>`;
  $$("[data-f]").forEach(b=>b.onclick=()=>{filtres[m.c]=b.dataset.f;vListe(m)});
  $$("[data-id]").forEach(t=>t.onclick=()=>fiche(m.c,t.dataset.id,m));
  const a=$("#add");if(a)a.onclick=()=>nouveau(m.c,m.preset?m.preset(ctx()):{},m)}
function fiche(c,id,m){const def=S.collections[c],r=D[c].find(x=>x.id===id);if(!r)return;const st=def.statut,can=m.can||[];
  const etapes=(m.etapes||[]).filter(e=>!st||r[st.k]!==e);
  modal(esc(def.titreDe?def.titreDe(r):r.nom||r.titre),`<dl class="fiche">${def.champs.map(ch=>`<dt>${esc(ch.l)}</dt><dd>${valeur(c,ch,r)}</dd>`).join("")}</dl>`,
   `${etapes.map(e=>`<button class="btn sm" data-et="${esc(e)}">${esc(e)}</button>`).join("")}${can.includes("edit")?`<button class="btn sm pri" id="ed">Modifier</button>`:""}${can.includes("del")?`<button class="btn sm ko" id="dl">Supprimer</button>`:""}<button class="btn sm" id="fx">Fermer</button>`);
  $("#fx").onclick=fermer;
  $$("[data-et]").forEach(b=>b.onclick=()=>{r[st.k]=b.dataset.et;if(m.apresEtape)m.apresEtape(r,b.dataset.et,ctx());save();fermer();toast(def.sing+" : "+b.dataset.et.toLowerCase());rafraichir()});
  const e=$("#ed");if(e)e.onclick=()=>formulaire(c,r,m);
  const d=$("#dl");if(d)d.onclick=()=>{if(!confirm("Supprimer ?"))return;D[c]=D[c].filter(x=>x.id!==id);save();fermer();toast("Supprimé");rafraichir()}}
function rafraichir(){ouvrir(vue)}
function champHTML(ch,v){const id="fc-"+ch.k,val=v??"";
  if(ch.type==="select")return `<select class="input" id="${id}">${ch.options.map(o=>`<option ${o===val?"selected":""}>${esc(o)}</option>`).join("")}</select>`;
  if(ch.type==="membre"){const l=(D.equipe||[]).filter(x=>!ch.fonction||[].concat(ch.fonction).includes(x.fonction));return `<select class="input" id="${id}"><option value="">—</option>${l.map(x=>`<option value="${x.id}" ${x.id===val?"selected":""}>${esc(x.nom)}</option>`).join("")}</select>`}
  if(ch.type==="ref")return `<select class="input" id="${id}"><option value="">—</option>${D[ch.ref].map(x=>`<option value="${x.id}" ${x.id===val?"selected":""}>${esc(nomDe(ch.ref,x.id))}</option>`).join("")}</select>`;
  if(ch.type==="textarea")return `<textarea class="input" id="${id}">${esc(val)}</textarea>`;
  if(ch.type==="bool")return `<select class="input" id="${id}"><option value="1" ${val?"selected":""}>Oui</option><option value="" ${val?"":"selected"}>Non</option></select>`;
  const t={number:"number",money:"number",date:"date",time:"time"}[ch.type]||"text";return `<input class="input" type="${t}" id="${id}" value="${esc(val)}"${t==="number"?' min="0"':""}>`}
function lire(ch){const e=$("#fc-"+ch.k);if(!e)return undefined;let v=e.value;if(["number","money"].includes(ch.type))return v===""?"":+v;if(ch.type==="bool")return !!v;return v.trim?v.trim():v}
function formulaire(c,r,m,preset){const def=S.collections[c],neuf=!r,base=r||{...preset};
  const champs=def.champs.filter(ch=>!(neuf&&ch.auto));
  modal((neuf?"Nouveau · ":"Modifier · ")+esc(def.sing),`<div class="row">${champs.map(ch=>`<div class="field" style="${ch.type==="textarea"?"flex-basis:100%":""}"><label class="f">${esc(ch.l)}${ch.req?" *":""}</label>${champHTML(ch,base[ch.k]??(ch.defaut!=null?(typeof ch.defaut==="function"?ch.defaut(ctx()):ch.defaut):""))}</div>`).join("")}</div>`,
  `<button class="btn" id="fn">Annuler</button><button class="btn pri" id="fk">Enregistrer</button>`);
  $("#fn").onclick=fermer;
  $("#fk").onclick=()=>{const o={};for(const ch of champs){const v=lire(ch);if(ch.req&&(v===""||v==null))return toast("Champ obligatoire : "+ch.l);o[ch.k]=v}
    if(neuf){const rec={id:uid(),...preset,...o};def.champs.filter(ch=>ch.auto).forEach(ch=>{if(rec[ch.k]==null)rec[ch.k]=typeof ch.auto==="function"?ch.auto(ctx()):ch.auto});D[c].unshift(rec);if(m&&m.apresAjout)m.apresAjout(rec,ctx())}else Object.assign(r,o);
    save();fermer();toast(neuf?def.sing+" enregistré(e)":"Modifications enregistrées");rafraichir()}}
function nouveau(c,preset,m){formulaire(c,null,m||{},preset||{})}
function maj(c,id,o){const r=D[c].find(x=>x.id===id);if(r)Object.assign(r,o);save()}

/* ---------- aides pour les fichiers de département ---------- */
function genEquipe(prefixe,spec){const out=[];let n=1;spec.forEach(([fonction,nb,libelle])=>{for(let i=1;i<=nb;i++){out.push({id:prefixe+"-"+n,nom:libelle+" "+String(i).padStart(2,"0"),matricule:prefixe.toUpperCase()+"-"+String(100+n),fonction,tel:"+228 90 "+String(10+n).padStart(2,"0")+" "+String(20+n*3).slice(-2)+" "+String(40+n).slice(-2),statut:i===nb&&nb>3?"En congé":"Actif"});n++}});return out}
function colEquipe(fonctions,seed){return {sing:"Membre",ajout:"Nouveau membre",champs:[{k:"nom",l:"Nom",req:1},{k:"matricule",l:"Matricule"},{k:"fonction",l:"Fonction",type:"select",options:fonctions},{k:"tel",l:"Téléphone"},{k:"statut",l:"Statut",type:"select",options:["Actif","En congé","Sorti"]}],cols:["nom","matricule","fonction","tel"],statut:{k:"statut",options:["Actif","En congé","Sorti"],couleurs:{Actif:"p-green","En congé":"p-amber",Sorti:"p-grey"}},titreDe:r=>r.nom,sousDe:r=>r.fonction,seed}}
const ST=(options,couleurs)=>({k:"statut",options,couleurs});
const actifs=(f)=>D.equipe.filter(m=>m.statut==="Actif"&&(!f||[].concat(f).includes(m.fonction)));
const pick=(l,i)=>l[i%l.length];

window.addEventListener("DOMContentLoaded",()=>{charger();save();squelette()});
