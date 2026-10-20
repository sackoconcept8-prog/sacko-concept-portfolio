const offerEndsAt=Date.parse('2026-10-23T12:50:00Z');
const baseOrderUrl='https://wa.me/15054642331?text=Bonjour%20SACKO%20CONCEPT%2C%20je%20souhaite%20commander%20le%20pack%20personnalis%C3%A9%20NOVA%20CLEAN%20BENIN%20%C3%A0%2071%20000%20F%20CFA.%20Pouvez-vous%20me%20transmettre%20les%20modalit%C3%A9s%20de%20paiement%20et%20de%20remise%20des%20fichiers%20%3F';
const offerOrderUrl='https://wa.me/15054642331?text=Bonjour%20SACKO%20CONCEPT%2C%20je%20souhaite%20profiter%20de%20l%E2%80%99offre%20%C3%A0%2060%20350%20F%20CFA%20pour%20le%20pack%20personnalis%C3%A9%20NOVA%20CLEAN%20BENIN%2C%20valable%20jusqu%E2%80%99au%2023%20octobre%202026%20%C3%A0%2013%20h%2050%20%28B%C3%A9nin%29.%20Pouvez-vous%20me%20transmettre%20les%20modalit%C3%A9s%20de%20paiement%20et%20de%20remise%20des%20fichiers%20%3F';
function offerState(now=Date.now()){const remaining=Math.max(0,offerEndsAt-now);return {active:remaining>0,remaining,price:remaining>0?'60 350':'71 000'};}

let refreshTimer;
function updateOffer(){
 const state=offerState();
 document.querySelectorAll('[data-current-price]').forEach(el=>el.textContent=state.price);
 document.querySelectorAll('[data-order-link]').forEach(el=>el.href=state.active?offerOrderUrl:baseOrderUrl);
 document.querySelector('[data-offer-label]').textContent=state.active?'15 % supplémentaires : économisez encore 10 650 F CFA.':'Offre de 72 heures terminée. Tarif du pack : 71 000 F CFA.';
 document.querySelector('[data-countdown-box]').hidden=!state.active;
 const seconds=Math.floor(state.remaining/1000),hours=Math.floor(seconds/3600),minutes=Math.floor((seconds%3600)/60),rest=seconds%60;
 document.querySelectorAll('[data-countdown]').forEach(el=>el.textContent=`${String(hours).padStart(2,'0')} h ${String(minutes).padStart(2,'0')} min ${String(rest).padStart(2,'0')} s`);
}
const revealButton=document.querySelector('#reveal-offer');
revealButton.addEventListener('click',()=>{
 updateOffer();if(!refreshTimer)refreshTimer=setInterval(updateOffer,1000);
 const section=document.querySelector('#mon-offre');section.hidden=false;
 revealButton.setAttribute('aria-expanded','true');revealButton.textContent='Revoir mon offre personnalisée ↓';
 section.focus({preventScroll:true});section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});
