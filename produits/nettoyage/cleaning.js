const previewFilters=[...document.querySelectorAll('[data-preview-filter]')];
function showPreviews(kind){
 previewFilters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewFilter===kind)));
 document.querySelectorAll('[data-preview-kind]').forEach(card=>{card.hidden=kind!=='all'&&card.dataset.previewKind!==kind;});
}
previewFilters.forEach(button=>button.addEventListener('click',()=>showPreviews(button.dataset.previewFilter)));
document.querySelectorAll('[data-show-preview]').forEach(link=>link.addEventListener('click',()=>showPreviews(link.dataset.showPreview)));
