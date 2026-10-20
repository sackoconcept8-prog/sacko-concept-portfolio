const previews = [
  {
    "title": "Suivi du personnel",
    "description": "Retrouvez les informations utiles de chaque agent dans un registre commun.",
    "features": [
      "Fiches agents",
      "Équipes et affectations",
      "Coordonnées professionnelles",
      "Statuts du personnel"
    ],
    "type": "Excel",
    "image": ""
  },
  {
    "title": "Planning des interventions",
    "description": "Organisez les prestations par site, équipe et créneau.",
    "features": [
      "Dates et horaires",
      "Sites clients",
      "Agents affectés",
      "Statut des missions"
    ],
    "type": "Excel",
    "image": ""
  },
  {
    "title": "Présences et absences",
    "description": "Structurez le suivi quotidien et les demandes de congé.",
    "features": [
      "Pointage",
      "Retards et absences",
      "Demandes de congé",
      "Synthèse par agent"
    ],
    "type": "Excel",
    "image": ""
  },
  {
    "title": "Gestion des stocks",
    "description": "Suivez les consommables et le matériel de nettoyage.",
    "features": [
      "Catalogue produits",
      "Entrées et sorties",
      "Seuils de réapprovisionnement",
      "Affectation par site"
    ],
    "type": "Excel",
    "image": ""
  },
  {
    "title": "Contrôle qualité",
    "description": "Centralisez les contrôles et les actions à suivre.",
    "features": [
      "Critères de contrôle",
      "Observations terrain",
      "Actions correctives",
      "Suivi par site"
    ],
    "type": "Excel",
    "image": ""
  },
  {
    "title": "Suivi des interventions spécialisées",
    "description": "Documentez les prestations nécessitant un suivi spécifique.",
    "features": [
      "Désinfection",
      "Désinsectisation",
      "Dératisation",
      "Historique des opérations"
    ],
    "type": "Excel",
    "image": ""
  },
  {
    "title": "Fiche de poste d’agent de nettoyage",
    "description": "Clarifier les missions, les responsabilités et les consignes du poste.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Fiche d’intégration",
    "description": "Accompagner l’arrivée d’un agent et les étapes de son intégration.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Demande de congé",
    "description": "Formaliser les dates demandées et la décision du responsable.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Demande d’explication pour retard",
    "description": "Recueillir les observations du salarié sur un retard signalé.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Demande d’explication pour absence injustifiée présumée",
    "description": "Présenter les faits observés et permettre au salarié d’y répondre.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Demande d’explication pour non-respect des consignes",
    "description": "Décrire précisément une situation et solliciter les explications du salarié.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Modèle général de demande d’explication",
    "description": "Adapter une trame aux faits et au contexte de l’entreprise.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Fiche de réponse du salarié",
    "description": "Consigner les observations et les pièces éventuellement fournies.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Fiche d’intervention",
    "description": "Renseigner le site, l’équipe et les prestations réalisées.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Checklist de contrôle qualité",
    "description": "Vérifier les points de contrôle avant validation de la prestation.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Rapport de désinfection",
    "description": "Documenter les zones traitées et les observations de l’équipe.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Rapport de dératisation",
    "description": "Consigner les actions réalisées et le suivi à prévoir.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Rapport journalier d’équipe",
    "description": "Résumer les missions, les difficultés et les suites à donner.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Devis de prestation",
    "description": "Présenter le périmètre, les quantités et les conditions proposées.",
    "features": [],
    "type": "Word",
    "image": ""
  },
  {
    "title": "Formulaire de satisfaction client",
    "description": "Recueillir les retours après une prestation de nettoyage.",
    "features": [],
    "type": "Word",
    "image": ""
  }
];
const menu=document.querySelector('#menu-toggle'),nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Ouvrir le menu':'Fermer le menu');nav.classList.toggle('open',!expanded)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++});document.querySelector('#filter-count').textContent=count+' documents proposés'}));
const dialog=document.querySelector('#preview-dialog'),stage=document.querySelector('#preview-stage'),controls=document.querySelector('#zoom-controls');let lastTrigger,scale=1;
function zoom(value){scale=Math.min(3,Math.max(.5,value));const img=stage.querySelector('img');if(img)img.style.width=(scale*100)+'%';document.querySelector('#zoom-level').textContent=Math.round(scale*100)+' %'}
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{lastTrigger=button;const item=previews[Number(button.dataset.preview)];document.querySelector('#preview-title').textContent=item.title;document.querySelector('#preview-type').textContent=item.type+' · Présentation du périmètre proposé';document.querySelector('#preview-description').textContent=item.description;stage.replaceChildren();controls.hidden=!item.image;if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='Capture réelle de démonstration : '+item.title;stage.append(img);zoom(1)}else{const box=document.createElement('div');box.className='empty-preview';const title=document.createElement('strong');title.textContent='Aperçu en préparation';const text=document.createElement('p');text.textContent='La capture réelle de ce fichier sera intégrée dès que le modèle de démonstration sera disponible.';box.append(title,text);stage.append(box)}dialog.showModal()}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()});dialog.addEventListener('close',()=>lastTrigger?.focus());
document.querySelector('#zoom-in').addEventListener('click',()=>zoom(scale+.25));document.querySelector('#zoom-out').addEventListener('click',()=>zoom(scale-.25));document.querySelector('#zoom-reset').addEventListener('click',()=>zoom(1));
