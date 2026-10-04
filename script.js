import { SITE } from './site-config.js';
import { projects, packages, briefs } from './catalog.js';

let language = 'fr';
try { language = localStorage.getItem('sacko-language') === 'en' ? 'en' : 'fr'; } catch {}
let category = 'all';
let activePack = 'impact';
let activeProject = null;
const text = value => typeof value === 'string' ? value : value[language];
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const tr = (fr, en) => language === 'fr' ? fr : en;
const safeUrl = raw => { try { const url = new URL(raw); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };

const icons = {
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
  dribbble:'<circle cx="12" cy="12" r="9"/><path d="M6 5c6 5 9 10 11 15M3 11c8 0 12-2 15-5M5 19c3-6 9-9 16-6"/>',
  facebook:'<path d="M14 21V12h3l.6-4H14V6c0-1 .4-2 2-2h2V1h-3c-4 0-5 2-5 5v2H7v4h3v9"/>',
  pinterest:'<circle cx="12" cy="12" r="9"/><path d="m9 21 3-12m-1 8c-4-2-5-8 0-10 5-2 7 3 5 6-1 3-4 3-5 1"/>',
  x:'<path d="m4 3 16 18h-4L4 3h4l12 18M20 3 4 21"/>',
  github:'<path d="M8 21v-3c-4 1-4-2-6-3m14 6v-3c0-1-.3-2-.8-2.5 4-.5 5-2 5-5 0-1-.4-2-1-3 0-1 0-2-.3-3-2-.2-3 .7-4 1a14 14 0 0 0-6 0c-1-.3-2-1.2-4-1-.3 1-.3 2-.3 3-.6 1-1 2-1 3 0 3 1 4.5 5 5-.5.5-.6 1.5-.6 2.5v3"/>',
  link:'<path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 2 1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.link}</svg>`;

function renderProjects() {
  const visible = projects.filter(project => category === 'all' || project.categories.includes(category));
  document.querySelector('#portfolio-grid').innerHTML = visible.map((project, index) => `<article class="project-card"><button class="project-image" type="button" data-project="${escape(project.id)}" aria-label="${escape(tr('Découvrir ', 'Explore ') + project.name)}"><img src="./assets/${escape(project.image)}" alt="${escape(project.name + ' — ' + text(project.label))}" loading="lazy" width="1200" height="900"><span class="project-view">${tr('Explorer le projet','Explore the project')} ${icon('link')}</span></button><div class="project-meta"><div><p>${escape(text(project.label))}</p><h3><button type="button" data-project="${escape(project.id)}">${escape(project.name)}</button></h3></div><span class="project-number">${String(projects.indexOf(project)+1).padStart(2,'0')}</span></div></article>`).join('');
}

function renderPacks() {
  document.querySelector('#pack-grid').setAttribute('aria-labelledby', `tab-${activePack}`);
  document.querySelector('#pack-grid').innerHTML = packages[activePack].map(pack => {
    const form = safeUrl(SITE.forms[pack.form]);
    const payment = safeUrl(SITE.payments[pack.id]);
    const invoice = `mailto:${SITE.paypalEmail}?subject=${encodeURIComponent(tr('Demande de facture PayPal — ', 'PayPal invoice request — ') + pack.name)}&body=${encodeURIComponent(tr('Bonjour Hawa, je souhaite une facture PayPal pour le pack ', 'Hello Hawa, I would like a PayPal invoice for ') + pack.name + ` (${pack.price} USD).\n` + tr('Mon nom :\nMon adresse e-mail :\nRéférence du brief (si disponible) :', 'My name:\nMy email address:\nBrief reference (if available):'))}`;
    return `<article class="pack-card ${pack.featured ? 'featured' : ''}">${pack.featured ? `<span class="pack-highlight">${tr('LE CHOIX ÉQUILIBRÉ','THE BALANCED CHOICE')}</span>` : ''}<p class="pack-tag">${escape(text(pack.tag))}</p><h3>${escape(pack.name)}</h3><div class="pack-price"><span>${pack.price}</span><span class="currency">$ <small>USD</small></span></div><p class="pack-description">${escape(text(pack.desc))}</p><p class="pack-timeline">${escape(text(pack.timeline))}</p><ul>${pack.items.map(item => `<li>${escape(text(item))}</li>`).join('')}</ul><a class="button ${pack.featured?'light':''}" href="${escape(form)}" target="_blank" rel="noopener noreferrer" data-order="${escape(pack.id)}">${tr('Commander ce pack','Order this package')}</a><a class="invoice-link" href="${escape(payment||invoice)}" ${payment?'target="_blank" rel="noopener noreferrer"':''}>${payment?tr('Régler ce pack','Pay for this package'):tr('Demander une facture PayPal','Request a PayPal invoice')}</a></article>`;
  }).join('');
}

function renderBriefs() {
  document.querySelector('#brief-grid').innerHTML = briefs.map(brief => `<a class="brief-card" data-form="${brief.key}" href="${escape(safeUrl(SITE.forms[brief.key]))}" target="_blank" rel="noopener noreferrer"><span class="brief-number">${brief.number}</span><div><h3>${escape(text(brief.title))}</h3><p>${escape(text(brief.description))}</p><span class="brief-open">${tr('Ouvrir le formulaire','Open the brief')}</span></div><span class="brief-icon">${icon('link')}</span></a>`).join('');
}

function renderSocial() {
  document.querySelector('#social-links').innerHTML = SITE.social.filter(link=>safeUrl(link.url)).map(link=>`<a href="${escape(safeUrl(link.url))}" target="_blank" rel="noopener noreferrer">${icon(link.icon)}<span>${escape(link.name)}</span></a>`).join('');
}

function translatePage() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-fr][data-en]').forEach(node => { node.textContent = node.dataset[language]; });
  document.title = tr('SACKO CONCEPT — Design, identité & contenu', 'SACKO CONCEPT — Brand, design & content studio');
  document.querySelector('meta[name="description"]').content = tr('Sacko Concept, le studio créatif de Hawa Sacko. Identités visuelles, contenu social, sites web et ressources pour designers. Découvrez les packs Impact à partir de 15 $.','Sacko Concept, the creative studio of Hawa Sacko. Brand identities, social content, websites and resources for designers. Explore Impact packages from $15.');
  const toggle = document.querySelector('.language-toggle');
  toggle.textContent = language === 'fr' ? 'EN' : 'FR';
  toggle.setAttribute('aria-label', tr('Switch to English', 'Passer en français'));
  document.querySelector('.menu-toggle').setAttribute('aria-label', tr('Ouvrir le menu','Open the menu'));
  document.querySelector('.dialog-close').setAttribute('aria-label',tr('Fermer','Close'));
  document.querySelector('.whatsapp-float').setAttribute('aria-label',tr('Discuter avec Sacko Concept sur WhatsApp','Message Sacko Concept on WhatsApp'));
  renderProjects(); renderPacks(); renderBriefs(); renderSocial();
  if (activeProject) renderProjectDialog(activeProject);
}

function renderProjectDialog(project) {
  document.querySelector('#project-dialog-content').innerHTML = `<img src="./assets/${escape(project.image)}" alt="${escape(project.name)}"><div class="dialog-copy"><p class="eyebrow">${tr('ÉTUDE INDÉPENDANTE DU STUDIO','INDEPENDENT STUDIO STUDY')}</p><h2 id="dialog-title">${escape(project.name)}</h2><p>${escape(text(project.description))}</p><a class="text-link" href="${escape(safeUrl(project.url))}" target="_blank" rel="noopener noreferrer">${tr('Voir l’étude complète sur Dribbble','View the full study on Dribbble')}</a></div>`;
}

const dialog = document.querySelector('#project-dialog');
document.addEventListener('click', event => {
  const projectButton = event.target.closest('[data-project]');
  if (projectButton) { activeProject = projects.find(project => project.id === projectButton.dataset.project); renderProjectDialog(activeProject); dialog.showModal(); }
  const filter = event.target.closest('[data-filter]');
  if (filter) { category = filter.dataset.filter; document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed',String(button===filter)));renderProjects(); }
  const tab = event.target.closest('[data-pack-tab]');
  if (tab) selectPackTab(tab);
});
function selectPackTab(tab) {
  activePack = tab.dataset.packTab;
  document.querySelectorAll('[data-pack-tab]').forEach(button=>{button.setAttribute('aria-selected',String(button===tab));button.tabIndex=button===tab?0:-1;});
  renderPacks();
}
document.querySelector('.pack-tabs').addEventListener('keydown',event=>{
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault(); const tabs=[...document.querySelectorAll('[data-pack-tab]')]; let i=tabs.indexOf(event.target);
  i=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  selectPackTab(tabs[i]); tabs[i].focus();
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{ if(event.target===dialog) {const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();} });
dialog.addEventListener('close',()=>{activeProject=null;});
document.querySelector('.language-toggle').addEventListener('click',()=>{language=language==='fr'?'en':'fr';try{localStorage.setItem('sacko-language',language);}catch{}translatePage();});
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#primary-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open');}
menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(expanded));navigation.classList.toggle('open',expanded);});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-form]').forEach(link=>{if(SITE.forms[link.dataset.form])link.href=SITE.forms[link.dataset.form];});
document.querySelectorAll('[data-resource="launchvault"]').forEach(link=>{link.href=SITE.store;});

// A payment provider may return to ?brief=impact-profile. Show the brief path,
// while leaving payment verification with the payment provider and studio.
const returnedPack = new URLSearchParams(location.search).get('brief');
if (returnedPack) {
  for (const [group,list] of Object.entries(packages)) if(list.some(pack=>pack.id===returnedPack)) activePack=group;
  selectPackTab(document.querySelector(`[data-pack-tab="${activePack}"]`));
}
translatePage();
if (returnedPack && Object.values(packages).flat().some(pack=>pack.id===returnedPack)) {
  const note=document.createElement('div');note.className='return-brief';note.setAttribute('role','status');
  const pack=Object.values(packages).flat().find(pack=>pack.id===returnedPack);
  note.innerHTML=`<p>${escape(tr('Complétez le brief de votre projet : ', 'Complete your project brief: ')+pack.name)}</p><a class="text-link" href="${escape(safeUrl(SITE.forms[pack.form]))}" target="_blank" rel="noopener noreferrer">${tr('Ouvrir le formulaire','Open the form')}</a><button type="button" aria-label="${tr('Fermer','Close')}">×</button>`;
  note.querySelector('button').addEventListener('click',()=>note.remove());document.querySelector('main').prepend(note);
  document.querySelector('#packs').scrollIntoView();
}
