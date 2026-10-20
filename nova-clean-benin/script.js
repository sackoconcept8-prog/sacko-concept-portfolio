// Ajouter ici 5 à 10 captures réelles, dans l’ordre souhaité.
// src est un chemin relatif, par exemple assets/images/01-tableau-de-bord.png.
const captures = [
  {
    "title": "Un planning à votre image",
    "format": "Excel",
    "src": "assets/images/01-planning.png",
    "caption": "Accueil du classeur de planning, personnalisé avec le nom et le logo NOVA CLEAN BENIN."
  },
  {
    "title": "Le suivi du personnel",
    "format": "Excel",
    "src": "assets/images/02-personnel.png",
    "caption": "Tableau de bord de la version vierge : agents actifs, documents et candidatures."
  },
  {
    "title": "Une fiche client personnalisée",
    "format": "Word",
    "src": "assets/images/03-fiche-client.png",
    "caption": "Modèle de fiche client et aperçu du dossier commercial et administratif."
  },
  {
    "title": "Les demandes d’explication",
    "format": "Word",
    "src": "assets/images/04-explications.png",
    "caption": "Dossier de 15 documents : demandes d’explication, réponse du salarié, entretien et projet d’avertissement à valider."
  },
  {
    "title": "Les documents de terrain",
    "format": "Word",
    "src": "assets/images/05-operations.png",
    "caption": "Dossier de 15 modèles : interventions, checklists, rapports spécialisés, matériel et consommables."
  },
  {
    "title": "Les six classeurs Excel",
    "format": "Contenu du pack",
    "src": "assets/images/06-classeurs.png",
    "caption": "Personnel, planning, présences et congés, stocks et équipements, qualité et satisfaction, interventions spécialisées."
  },
  {
    "title": "Un pack organisé par usage",
    "format": "Organisation",
    "src": "assets/images/07-dossiers.png",
    "caption": "Arborescence : Excel vierges et démos, Word RH, opérations, commercial et guides."
  },
  {
    "title": "Des repères pour démarrer",
    "format": "Guide Excel",
    "src": "assets/images/08-guide.png",
    "caption": "Consignes de saisie, capacité initiale des tableaux et fonctionnement indépendant des classeurs."
  }
];
const gallery=document.querySelector('#gallery');
const dialog=document.querySelector('#lightbox');
const fullImage=document.querySelector('#full-image');
let trigger=null,scale=1;
function setZoom(next){scale=Math.min(3,Math.max(.5,next));fullImage.style.width=`${scale*100}%`;document.querySelector('#zoom-label').textContent=`${Math.round(scale*100)} %`;}
for(const item of captures){
 const figure=document.createElement('figure');figure.className='capture';
 if(item.src){
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Agrandir : '+item.title);
  const img=document.createElement('img');img.src=item.src;img.alt=item.title;img.loading='lazy';button.append(img);
  button.addEventListener('click',()=>{trigger=button;document.querySelector('#lightbox-title').textContent=item.title;fullImage.src=item.src;fullImage.alt=item.title;document.querySelector('#image-caption').textContent=item.caption;setZoom(1);dialog.showModal()});figure.append(button);
 }else{
  const pending=document.createElement('div');pending.className='pending';const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent='▧';const text=document.createElement('p');text.textContent='Capture à venir';pending.append(icon,text);figure.append(pending);
 }
 const caption=document.createElement('figcaption');const title=document.createElement('h3');title.textContent=item.title;const format=document.createElement('small');format.textContent=item.format;caption.append(title,format);figure.append(caption);const description=document.createElement("p");description.className="capture-description";description.textContent=item.caption;figure.append(description);gallery.append(figure);
}
document.querySelector('#close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>trigger?.focus());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});document.querySelector('#zoom-in').addEventListener('click',()=>setZoom(scale+.25));document.querySelector('#zoom-out').addEventListener('click',()=>setZoom(scale-.25));document.querySelector('#zoom-reset').addEventListener('click',()=>setZoom(1));

// Échéance fixe : ne se réinitialise pas lors des visites suivantes.
const offerEndsAt=Date.parse('2026-10-23T12:50:00Z');
const baseOrderUrl='mailto:contact@sackoconcept.com?subject=Commande+du+pack+NOVA+CLEAN+BENIN&body=Bonjour+SACKO+CONCEPT%2C%0A%0AJe+souhaite+commander+le+pack+personnalis%C3%A9+NOVA+CLEAN+BENIN+%C3%A0+71+000+F+CFA.+Merci+de+m%E2%80%99indiquer+les+modalit%C3%A9s+de+paiement+et+de+remise+des+fichiers.';
const offerOrderUrl='mailto:contact@sackoconcept.com?subject=Offre+72+h+%E2%80%94+Pack+NOVA+CLEAN+BENIN&body=Bonjour+SACKO+CONCEPT%2C%0A%0AJe+souhaite+b%C3%A9n%C3%A9ficier+de+l%E2%80%99offre+%C3%A0+60+350+F+CFA+pour+le+pack+NOVA+CLEAN+BENIN%2C+valable+jusqu%E2%80%99au+23+octobre+2026+%C3%A0+13+h+50+%28B%C3%A9nin%29.+Merci+de+m%E2%80%99indiquer+les+modalit%C3%A9s+de+paiement+et+de+remise+des+fichiers.';
const offerDialog=document.querySelector('#offer-dialog');
function offerState(now=Date.now()){const remaining=Math.max(0,offerEndsAt-now);return {active:remaining>0,remaining,price:remaining>0?'60 350':'71 000'};}
let previousOfferState;
function updateOffer(){
 const state=offerState();
 if(previousOfferState!==state.active){
  document.querySelectorAll('[data-current-price]').forEach(el=>el.textContent=state.price);
  document.querySelectorAll('[data-order-link]').forEach(el=>el.href=state.active?offerOrderUrl:baseOrderUrl);
  document.querySelector('[data-offer-label]').textContent=state.active?'15 % supplémentaires : économisez encore 10 650 F CFA.':'Offre de 72 heures terminée. Tarif du pack : 71 000 F CFA.';
  document.querySelector('[data-offer-short]').textContent=state.active?'15 % supplémentaires pendant l’offre de 72 h':'Votre tarif personnalisé';
  document.querySelector('[data-countdown-box]').hidden=!state.active;
  if(!state.active&&offerDialog.open)offerDialog.close();
  previousOfferState=state.active;
 }
 const seconds=Math.floor(state.remaining/1000),hours=Math.floor(seconds/3600),minutes=Math.floor((seconds%3600)/60),rest=seconds%60;
 document.querySelectorAll('[data-countdown]').forEach(el=>el.textContent=`${String(hours).padStart(2,'0')} h ${String(minutes).padStart(2,'0')} min ${String(rest).padStart(2,'0')} s`);
}
function dismissOffer(){offerDialog.close();try{sessionStorage.setItem('nova-offer-20261023','dismissed')}catch{}}
document.querySelector('#close-offer').addEventListener('click',dismissOffer);document.querySelector('#later-offer').addEventListener('click',dismissOffer);
offerDialog.addEventListener('cancel',()=>{try{sessionStorage.setItem('nova-offer-20261023','dismissed')}catch{}});
updateOffer();setInterval(updateOffer,1000);
setTimeout(()=>{let dismissed=false;try{dismissed=sessionStorage.getItem('nova-offer-20261023')==='dismissed'}catch{}if(offerState().active&&!dismissed&&!document.querySelector('dialog[open]'))offerDialog.showModal();},12000);
