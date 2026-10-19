'use strict';
const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu(){ nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';nav.classList.toggle('open',!expanded);menu.setAttribute('aria-expanded',String(!expanded));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const viewer=document.querySelector('#viewer');
document.querySelectorAll('.preview').forEach(button=>button.addEventListener('click',()=>{const img=document.querySelector('#viewer-image');img.src=button.dataset.src;img.alt=button.dataset.caption;document.querySelector('#viewer-caption').textContent=button.dataset.caption;viewer.showModal();}));
viewer.addEventListener('click',event=>{if(event.target===viewer){const rect=viewer.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)viewer.close();}});
function revealHash(){const target=document.getElementById(location.hash.slice(1));if(target?.tagName==='DETAILS')target.open=true;}
window.addEventListener('hashchange',revealHash);revealHash();
// Integration hook: no persistence, network calls, third-party SDK or personal data.
// An optional analytics adapter must obtain appropriate consent before forwarding.
document.querySelectorAll('.buy').forEach(link=>link.addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('sacko:purchase-click',{detail:{edition:link.dataset.edition,placement:link.closest('.mobile-buy')?'mobile':link.closest('.closing')?'closing':link.closest('.hero-purchase')?'hero':'product'}}));}));

const previewLanguageButtons = document.querySelectorAll('[data-preview-language]');
function selectPreview(language){
  for(const choice of ['fr','en'])document.getElementById('preview-'+choice).hidden=choice!==language;
  previewLanguageButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewLanguage===language)));
}
previewLanguageButtons.forEach(button=>button.addEventListener('click',()=>selectPreview(button.dataset.previewLanguage)));
selectPreview(document.documentElement.lang==='en'?'en':'fr');
