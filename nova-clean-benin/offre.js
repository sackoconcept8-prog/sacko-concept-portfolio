const offerEndsAt=Date.parse('2026-10-23T12:50:00Z');
const baseOrderUrl='mailto:contact@sackoconcept.com?subject=Commande+du+pack+NOVA+CLEAN+BENIN&body=Bonjour+SACKO+CONCEPT%2C%0A%0AJe+souhaite+commander+le+pack+personnalis%C3%A9+NOVA+CLEAN+BENIN+%C3%A0+71+000+F+CFA.+Merci+de+m%E2%80%99indiquer+les+modalit%C3%A9s+de+paiement+et+de+remise+des+fichiers.';
const offerOrderUrl='mailto:contact@sackoconcept.com?subject=Offre+72+h+%E2%80%94+Pack+NOVA+CLEAN+BENIN&body=Bonjour+SACKO+CONCEPT%2C%0A%0AJe+souhaite+b%C3%A9n%C3%A9ficier+de+l%E2%80%99offre+%C3%A0+60+350+F+CFA+pour+le+pack+NOVA+CLEAN+BENIN%2C+valable+jusqu%E2%80%99au+23+octobre+2026+%C3%A0+13+h+50+%28B%C3%A9nin%29.+Merci+de+m%E2%80%99indiquer+les+modalit%C3%A9s+de+paiement+et+de+remise+des+fichiers.';
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
