let lang = 'en';
try { lang = localStorage.getItem('sacko-language') === 'fr' ? 'fr' : 'en'; } catch {}
function render() { document.documentElement.lang=lang; document.querySelectorAll('[data-fr][data-en]').forEach(node=>node.textContent=node.dataset[lang]); document.querySelector('.language-toggle').textContent=lang==='fr'?'EN':'FR'; document.querySelector('.language-toggle').setAttribute('aria-label',lang==='fr'?'Switch to English':'Passer en français'); document.title=lang==='fr'?'Sacko Concept — Mentions légales & confidentialité':'Sacko Concept — Legal & privacy'; document.querySelector('meta[name="description"]').content=lang==='fr'?'Informations commerciales, confidentialité et conditions de collaboration Sacko Concept.':'Sacko Concept business information, privacy and project terms.'; }
document.querySelector('.language-toggle').addEventListener('click',()=>{lang=lang==='fr'?'en':'fr';try{localStorage.setItem('sacko-language',lang);}catch{}render();});
render();
