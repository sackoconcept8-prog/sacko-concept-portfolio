const previewFilters=[...document.querySelectorAll('[data-preview-filter]')];
function showPreviews(kind){
 previewFilters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewFilter===kind)));
 document.querySelectorAll('[data-preview-kind]').forEach(card=>{card.hidden=kind!=='all'&&card.dataset.previewKind!==kind;});
}
previewFilters.forEach(button=>button.addEventListener('click',()=>showPreviews(button.dataset.previewFilter)));
document.querySelectorAll('[data-show-preview]').forEach(link=>link.addEventListener('click',()=>showPreviews(link.dataset.showPreview)));

/* SC cleaning v2 — accessible cases and preview keyboard navigation */
(() => {
  const tabs=[...document.querySelectorAll('[data-case-tab]')];
  const panels=[...document.querySelectorAll('[data-case-panel]')];
  if (!tabs.length || !panels.length) return;
  function activate(index, shouldFocus=false) {
    tabs.forEach((tab,i)=>{
      const active=i===index;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    panels.forEach((panel,i)=>{panel.hidden=i!==index;});
    if (shouldFocus) tabs[index].focus();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(i));
    tab.addEventListener('keydown',event=>{
      const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next=i;
      if (event.key==='Home') next=0;
      else if (event.key==='End') next=tabs.length-1;
      else if (event.key==='ArrowRight'||event.key==='ArrowDown') next=(i+1)%tabs.length;
      else next=(i-1+tabs.length)%tabs.length;
      activate(next,true);
    });
  });
  const dialog=document.querySelector('#preview');
  const fileButtons=[...document.querySelectorAll('.file-preview button[data-image]')];
  if (!dialog || !fileButtons.length) return;
  dialog.addEventListener('keydown',event=>{
    if (event.key!=='ArrowLeft'&&event.key!=='ArrowRight') return;
    const visible=fileButtons.filter(btn=>!btn.closest('.file-preview').hidden);
    if (!visible.length) return;
    const current=dialog.querySelector('img').getAttribute('src');
    let index=visible.findIndex(btn=>btn.dataset.image===current);
    if (index<0) index=0;
    index=(index+(event.key==='ArrowRight'?1:-1)+visible.length)%visible.length;
    const btn=visible[index];
    const img=dialog.querySelector('img');
    img.src=btn.dataset.image;
    img.alt=btn.dataset.caption||'';
    dialog.querySelector('p').textContent=btn.dataset.caption||'';
    event.preventDefault();
  });
})();
