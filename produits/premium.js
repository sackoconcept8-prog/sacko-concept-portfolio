const modal=document.querySelector('#preview');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{modal.querySelector('img').src=button.dataset.image;modal.querySelector('img').alt=button.dataset.caption;modal.querySelector('p').textContent=button.dataset.caption;modal.showModal();}));
modal?.addEventListener('click',event=>{if(event.target===modal)modal.close();});
document.querySelectorAll('[data-lang-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-lang-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.collection-card').forEach(card=>{card.hidden=button.dataset.langFilter!=='all'&&card.dataset.lang!==button.dataset.langFilter;});}));
