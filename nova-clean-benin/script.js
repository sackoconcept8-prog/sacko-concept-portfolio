// Ajouter ici 5 à 10 captures réelles, dans l’ordre souhaité.
// src est un chemin relatif, par exemple assets/images/01-tableau-de-bord.png.
const captures = [
 {title:'Vue d’ensemble du projet',format:'Excel',src:'',caption:''},
 {title:'Suivi du personnel',format:'Excel',src:'',caption:''},
 {title:'Planning et interventions',format:'Excel',src:'',caption:''},
 {title:'Présences et absences',format:'Excel',src:'',caption:''},
 {title:'Documents RH personnalisés',format:'Word',src:'',caption:''},
 {title:'Demandes d’explication',format:'Word',src:'',caption:''}
];
// Renseigner le fichier MP4 lorsque la vidéo est disponible.
const presentationVideo = {src:'',poster:'',captions:''};
const gallery=document.querySelector('#gallery');
const dialog=document.querySelector('#lightbox');
const fullImage=document.querySelector('#full-image');
let trigger=null,scale=1;
function setZoom(next){scale=Math.min(3,Math.max(.5,next));fullImage.style.width=`${scale*100}%`;document.querySelector('#zoom-label').textContent=`${Math.round(scale*100)} %`;}
for(const item of captures.slice(0,10)){
 const figure=document.createElement('figure');figure.className='capture';
 if(item.src){
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Agrandir : '+item.title);
  const img=document.createElement('img');img.src=item.src;img.alt=item.title;img.loading='lazy';button.append(img);
  button.addEventListener('click',()=>{trigger=button;document.querySelector('#lightbox-title').textContent=item.title;fullImage.src=item.src;fullImage.alt=item.title;document.querySelector('#image-caption').textContent=item.caption;setZoom(1);dialog.showModal()});figure.append(button);
 }else{
  const pending=document.createElement('div');pending.className='pending';const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent='▧';const text=document.createElement('p');text.textContent='Capture à venir';pending.append(icon,text);figure.append(pending);
 }
 const caption=document.createElement('figcaption');const title=document.createElement('h3');title.textContent=item.title;const format=document.createElement('small');format.textContent=item.format;caption.append(title,format);figure.append(caption);gallery.append(figure);
}
document.querySelector('#pending-note').hidden=captures.length>0&&captures.every(item=>item.src);
if(presentationVideo.src){
 const video=document.createElement('video');video.controls=true;video.preload='metadata';video.playsInline=true;video.src=presentationVideo.src;video.setAttribute('aria-label','Présentation du projet NOVA CLEAN BENIN par SACKO CONCEPT');
 if(presentationVideo.poster)video.poster=presentationVideo.poster;
 if(presentationVideo.captions){const track=document.createElement('track');track.kind='captions';track.src=presentationVideo.captions;track.srclang='fr';track.label='Français';track.default=true;video.append(track)}
 document.querySelector('#video-container').replaceChildren(video);
}
document.querySelector('#close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>trigger?.focus());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});document.querySelector('#zoom-in').addEventListener('click',()=>setZoom(scale+.25));document.querySelector('#zoom-out').addEventListener('click',()=>setZoom(scale-.25));document.querySelector('#zoom-reset').addEventListener('click',()=>setZoom(1));
