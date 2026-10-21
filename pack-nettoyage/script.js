'use strict';
const $ = s => document.querySelector(s);
const menu = $('#menu-toggle');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#navigation').classList.toggle('open',open)});
$('#navigation').addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');$('#navigation').classList.remove('open')}});
const preview=$('#preview-dialog'), image=$('#preview-image'), stage=$('.preview-stage');
let zoom=100,lastTrigger;
function setZoom(n){zoom=Math.min(400,Math.max(100,n));image.style.width=zoom+'%';$('#zoom-value').value=zoom+' %';$('#zoom-out').disabled=zoom===100;$('#zoom-in').disabled=zoom===400;}
document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{lastTrigger=btn;image.src=btn.dataset.preview;image.alt='Aperçu réel : '+btn.dataset.title;$('#preview-title').textContent=btn.dataset.title;setZoom(100);preview.showModal();stage.scrollTop=0;stage.scrollLeft=0;document.body.style.overflow='hidden'}));
$('#zoom-in').addEventListener('click',()=>setZoom(zoom+50));$('#zoom-out').addEventListener('click',()=>setZoom(zoom-50));$('#zoom-reset').addEventListener('click',()=>{setZoom(100);stage.scrollTo(0,0)});$('#close-preview').addEventListener('click',()=>preview.close());
preview.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus()});
const filters=document.querySelectorAll('[data-filter]');filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter;if(!card.hidden)count++});$('#filter-status').textContent=count+' aperçus affichés'}));
preview.addEventListener('click',e=>{if(e.target===preview){const b=preview.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)preview.close()}});
