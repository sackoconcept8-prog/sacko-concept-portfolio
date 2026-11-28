/* =====================================================================
   Ilano — module RH Pro (vraies données Supabase, tables rh_*)
   Chargé AVANT le script principal de index.html : toutes les fonctions
   utilisent au moment de l'appel les outils globaux (sb, CTX, C, E, entete,
   modale, verif, toast, esc, tr, L, LOC, fmt…).
   ===================================================================== */

/* ---------- Traductions (ajoutées à la couche I18N existante) ---------- */
window.RH_I18N = {
"Tableau de bord RH":"HR dashboard","Employés":"Employees","Congés et absences":"Leave & absences","Pointage":"Time clock",
"Salaires et paie":"Salaries & payroll","Courriers officiels":"Official letters","Candidatures":"Applications","Signalements":"Reports",
"Mon espace RH":"My HR space","Mes congés":"My leave","Mes documents":"My documents","Signaler":"Report","Plus":"More","Menu":"Menu",
"Effectif":"Headcount","Présents aujourd'hui":"Present today","En congé aujourd'hui":"On leave today","Masse salariale / mois":"Monthly payroll",
"Première étape :":"First step:","ajoutez vos employés (ou importez votre fichier Excel).":"add your employees (or import your Excel file).",
"Ajouter mes employés":"Add my employees","Demandes de congé à traiter":"Leave requests to review","Aucune demande en attente ✓":"No pending requests ✓",
"Approuver":"Approve","Refuser":"Decline","Signalements ouverts":"Open reports","Aucun signalement ✓":"No open reports ✓","Répondre":"Reply",
"Réponses aux demandes d'explication":"Replies to explanation requests","Aucune réponse à examiner ✓":"No replies to review ✓","Examiner":"Review",
"Fins de contrat (45 jours)":"Contracts ending (45 days)","Aucune fin de contrat proche":"No contracts ending soon","Nouvelles candidatures":"New applications",
"Voir":"View","+ Employé":"+ Employee","Préparer la paie":"Prepare payroll","Importer (Excel/CSV)":"Import (Excel/CSV)","Badges":"Badges","+ Ajouter":"+ Add",
"Actifs":"Active","Sortis":"Former","Tous":"All","Employé":"Employee","Matricule":"Staff ID","Poste":"Job title","Service":"Department","Contrat":"Contract",
"Salaire de base":"Base salary","Accès":"Access","Fiche":"Profile","Badge":"Badge","Compte actif":"Account active","Pas de compte":"No account",
"Aucun employé. Cliquez sur « + Ajouter » ou importez votre fichier Excel.":"No employees yet. Click “+ Add” or import your Excel file.",
"Nouvel employé":"New employee","Modifier l'employé":"Edit employee","Photo (reprise sur le badge)":"Photo (used on the badge)",
"Touchez pour ajouter une photo":"Tap to add a photo","Prénom":"First name","Nom":"Last name","Type de contrat":"Contract type",
"Date d'embauche":"Hire date","Fin de contrat":"Contract end","Jours de congé par an":"Leave days per year","Téléphone":"Phone","E-mail":"Email",
"Adresse":"Address","Date de naissance":"Date of birth","N° sécurité sociale (CNSS)":"Social security no.","Contact d'urgence":"Emergency contact",
"Mode de paiement du salaire":"Salary payment method","N° Mobile Money ou IBAN":"Mobile Money no. or IBAN","Statut":"Status","Actif":"Active",
"Sorti de l'entreprise":"Left the company","Date de sortie":"Leaving date","Employé enregistré":"Employee saved",
"Stage":"Internship","Prestataire":"Contractor","Journalier / temporaire":"Daily / temporary","Virement":"Bank transfer","Espèces":"Cash","Chèque":"Cheque",
"Modifier":"Edit","Créer son accès employé":"Create employee access","Générer un document":"Create a document","Demande d'explication":"Explanation request",
"Solde de congés":"Leave balance","Droits annuels":"Annual entitlement","Pris":"Taken","En attente":"Pending","Restant":"Remaining","jours":"days",
"Historique des congés":"Leave history","Aucun congé":"No leave","Documents":"Documents","Aucun document":"No documents","Fermer":"Close",
"Accès employé":"Employee access","L'employé pourra pointer, demander ses congés, voir ses documents et fiches de paie.":"The employee will be able to clock in, request leave and see their documents and payslips.",
"Mode de connexion":"Sign-in method","Identifiant + code PIN (sans e-mail)":"Username + PIN (no email)","E-mail + mot de passe":"Email + password",
"Identifiant":"Username","Code PIN (6 chiffres)":"PIN (6 digits)","Mot de passe provisoire (8 caractères min.)":"Temporary password (min. 8 characters)",
"Importer vos employés":"Import your employees","Fichier CSV (Excel : « Enregistrer sous » → CSV) avec les colonnes :":"CSV file (Excel: “Save as” → CSV) with the columns:",
"Type":"Type","Du":"From","Au":"To","Jours":"Days","Motif":"Reason","À traiter":"To review","À venir / en cours":"Upcoming / ongoing","Historique":"History","Soldes":"Balances",
"+ Enregistrer un congé ou une absence":"+ Record leave or absence","Congé payé":"Paid leave","Maladie":"Sick leave","Maternité / paternité":"Maternity / paternity",
"Permission":"Permission","Congé sans solde":"Unpaid leave","Absence":"Absence","Autre":"Other","Approuvé":"Approved","Refusé":"Declined","Annulé":"Cancelled",
"Aucune demande":"No requests","Aucun congé enregistré":"No leave recorded","Enregistrer un congé ou une absence":"Record leave or absence",
"Date de début":"Start date","Date de fin":"End date","Motif (facultatif)":"Reason (optional)","Congé enregistré":"Leave recorded",
"Décision enregistrée":"Decision saved","Refuser la demande":"Decline the request","Motif du refus (facultatif)":"Reason for declining (optional)",
"Date":"Date","Arrivée":"Arrival","Départ":"Departure","Durée":"Hours","Présent":"Present","Absent":"Absent","En congé":"On leave","Parti":"Left",
"Exporter le mois (Excel)":"Export month (Excel)","Pointer l'arrivée":"Clock in","Pointer le départ":"Clock out","Aucun employé actif":"No active employees",
"Période":"Period","Primes":"Bonuses","Heures sup.":"Overtime","Retenues":"Deductions","Avances":"Advances","Cotisations":"Contributions","Net à payer":"Net pay",
"Brouillon":"Draft","Validée":"Approved","Payée":"Paid","Tout valider":"Approve all","Exporter (Excel)":"Export (Excel)","Payer":"Pay","Bulletin":"Payslip",
"Préparer la paie du mois":"Prepare this month's payroll","Aucune fiche de paie pour ce mois.":"No payslips for this month yet.",
"Fiche de paie":"Payslip","Mode de paiement":"Payment method","Date de paiement":"Payment date","Note":"Note","Total":"Total",
"Paie marquée comme payée":"Payroll marked as paid","Fiches validées : elles sont visibles dans l'espace de chaque employé.":"Payslips approved: employees can now see them in their space.",
"Documents officiels":"Official documents","Demandes d'explication":"Explanation requests","+ Nouveau document":"+ New document","+ Demande d'explication":"+ Explanation request",
"N°":"No.","Titre":"Title","Visible par l'employé":"Visible to employee","Oui":"Yes","Non":"No","Imprimer":"Print","Supprimer":"Delete",
"Nouveau document":"New document","Attestation de travail":"Employment certificate","Certificat de travail":"Certificate of employment","Contrat de travail":"Employment contract",
"Avenant au contrat":"Contract amendment","Avertissement":"Warning","Convocation à un entretien":"Meeting notice","Note de service (tout le personnel)":"Staff memo (all staff)",
"Autre document":"Other document","Note de service":"Staff memo","Contenu (modifiable)":"Content (editable)","Rendre visible dans l'espace de l'employé":"Show in the employee's space",
"Document enregistré":"Document saved","Tout le personnel":"All staff","Faits":"Facts","Date des faits":"Date of the facts","Faits constatés":"Facts observed",
"Délai de réponse":"Response deadline","24 heures":"24 hours","48 heures":"48 hours","72 heures":"72 hours","5 jours":"5 days","À répondre":"Awaiting reply","Répondu":"Replied","Clos":"Closed",
"Demande envoyée à l'employé":"Request sent to the employee","Réponse de l'employé":"Employee's reply","Pas encore de réponse.":"No reply yet.","Décision / suite donnée":"Decision / follow-up",
"Clore le dossier":"Close the case","Notifier un avertissement":"Issue a warning","Dossier clos":"Case closed","Aucune demande d'explication":"No explanation requests",
"Lien de candidature spontanée de votre entreprise :":"Your company's open application link:","Copier":"Copy","Ouvrir":"Open","Partager sur WhatsApp":"Share on WhatsApp",
"Candidat":"Candidate","Poste visé":"Position","Contact":"Contact","CV":"CV","Nouvelle":"New","Entretien":"Interview","Retenue":"Shortlisted","Refusée":"Rejected",
"Embaucher":"Hire","Aucune candidature pour le moment. Partagez votre lien !":"No applications yet. Share your link!","Lien copié":"Link copied",
"Catégorie":"Category","Sujet":"Subject","Message":"Message","Ouvert":"Open","Traité":"Resolved","Aucun signalement":"No reports","Votre réponse":"Your reply",
"Marquer comme traité":"Mark as resolved","Réponse envoyée":"Reply sent",
"Votre fiche employé n'est pas encore liée à votre compte. Contactez votre responsable RH.":"Your employee profile is not linked to your account yet. Please contact your HR manager.",
"Pointage du jour":"Today's time clock","Pointer mon arrivée":"Clock in","Pointer mon départ":"Clock out","Journée terminée ✓":"Day completed ✓",
"Mes informations":"My details","Voir mon badge":"View my badge","Demandes d'explication à répondre":"Explanation requests to answer",
"+ Demander un congé":"+ Request leave","Demander un congé":"Request leave","Demande envoyée ✓":"Request sent ✓","Annuler la demande":"Cancel request",
"Fiches de paie":"Payslips","Aucune fiche de paie":"No payslips","Répondre à la demande":"Answer the request","Vos explications":"Your explanation",
"Envoyer ma réponse":"Send my reply","Réponse envoyée ✓":"Reply sent ✓","Signaler un problème":"Report an issue",
"Votre message est transmis à la direction / aux RH.":"Your message goes to management / HR.","Conditions de travail":"Working conditions","Paie":"Pay",
"Matériel / sécurité":"Equipment / safety","Relations de travail":"Workplace relations","Envoyer":"Send","Signalement envoyé ✓":"Report sent ✓",
"Mes signalements":"My reports","Réponse :":"Reply:","Badge employé":"Employee badge","Imprimer les badges":"Print badges",
"Carte professionnelle":"Employee ID card","Mot de passe":"Password","Code PIN":"PIN","Annuler":"Cancel","Enregistrer":"Save",
"🔒 Lecture seule":"🔒 Read-only","Renouveler le forfait":"Renew the plan","Voir les formules":"See plans",
"Maintenance et hébergement":"Maintenance & hosting","Licence achetée":"Purchased licence","Renouveler 12 mois":"Renew for 12 months",
"Forfait annuel de maintenance et d'hébergement":"Annual maintenance & hosting plan","/an":"/year",
"Votre espace démarre avec":"Your workspace starts with","RH Pro":"HR Pro","Stock & Ventes":"Inventory & Sales",
"(employés, congés, pointage, paie, documents officiels, badges).":"(employees, leave, time clock, payroll, official letters, badges).",
"Gérez vos employés simplement. Tout est prêt.":"Manage your team with ease. You’re all set.",
"Ajoutez votre logo : vos couleurs s'appliquent partout. Employés, congés, pointage, paie et documents officiels, sur ordinateur et téléphone.":"Add your logo and your colors apply everywhere. Employees, leave, time clock, payroll and official letters — on computer and phone.",
"Vos employés ont leur propre espace : congés, pointage, fiches de paie":"Your employees get their own space: leave, time clock, payslips",
"Gérant / RH":"Manager / HR","Votre espace est prêt ! Commencez par ajouter vos employés.":"Your workspace is ready! Start by adding your employees.",
"Logiciel :":"App:","Modifier la photo":"Change photo","Photo trop lourde (5 Mo maximum)":"Photo too large (5 MB max)",
"Préparer":"Prepare","Absences non payées déduites automatiquement.":"Unpaid absences are deducted automatically.",
"Valider":"Approve","Marquer payée":"Mark as paid","Paie préparée":"Payroll prepared","Enregistré ✓":"Saved ✓",
"Dirigeant / RH":"Manager / HR","Candidature retenue : complétez la fiche de l'employé.":"Candidate hired: complete the employee profile.",
"Aucun compte lié":"No linked account","Accès créé et lié à la fiche":"Access created and linked to the profile",
"Supprimer ce document ?":"Delete this document?","Valider toutes les fiches en brouillon ? Elles deviendront visibles par les employés.":"Approve all draft payslips? Employees will be able to see them.",
"Relancer":"Remind","Accueil":"Home","Congés":"Leave","Rappeler":"Remind","Lire":"Read","Département":"Department","Aucun":"None","Matériel":"Equipment","Sorti":"Former"
};
window.RH_I18P = [
 [/^Bonjour (.+) 👋$/,(m,a)=>'Hello '+a+' 👋'],
 [/^(\d+) employés?$/,(m,n)=>n+(n==='1'?' employee':' employees')],
 [/^(\d+) \/ (\d+) employés$/,(m,a,b)=>a+' / '+b+' employees'],
 [/^(\d+(?:[.,]\d+)?) jours?$/,(m,n)=>n+(n==='1'?' day':' days')],
 [/^(\d+) demande\(s\)$/,(m,n)=>n+' request(s)']
];

/* ---------- Styles propres au module ---------- */
(function(){const s=document.createElement('style');s.textContent=`
.rh-av{display:inline-grid;place-items:center;border-radius:50%;background:var(--p2);color:var(--p);font-weight:800;flex:none;overflow:hidden}
.rh-av img{width:100%;height:100%;object-fit:cover}
.rh-emp{display:flex;gap:10px;align-items:center}.rh-emp small{display:block;color:var(--mut);font-size:12px}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.chips button{border:1px solid var(--bord);background:#fff;border-radius:20px;padding:7px 14px;font-weight:600;color:#475467;cursor:pointer}
.chips button.on{background:var(--p);border-color:var(--p);color:#fff}
.rh-liste{display:grid;gap:0}.rh-liste>div{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #f2f4f7}
.rh-liste>div:last-child{border-bottom:0}.rh-liste small{color:var(--mut)}
.rh-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.rh-pointer{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.rh-pointer .btn{padding:16px;font-size:16px}
.rh-info{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:14px}.rh-info span{color:var(--mut)}
.rh-solde{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center}.rh-solde div{background:var(--fond);border-radius:10px;padding:10px 4px}
.rh-solde b{display:block;font-size:20px}.rh-solde small{color:var(--mut);font-size:12px}
.rh-photo{width:96px;height:96px;border-radius:50%;margin:0 auto 6px;display:grid;place-items:center;background:var(--fond);border:2px dashed #d0d5dd;cursor:pointer;overflow:hidden;color:var(--mut);font-size:12px;text-align:center}
.rh-photo img{width:100%;height:100%;object-fit:cover}
.modale.large{max-width:640px}
.rh-compact th,.rh-compact td{padding:10px 7px}
.rh-lien{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:14px;word-break:break-all}
.rh-bandeau{border-radius:12px;padding:10px 14px;font-size:13px;margin-bottom:14px;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.rh-bandeau.ro{background:#fef3f2;border:1px solid #fecdca;color:#912018}.rh-bandeau.rap{background:#fffaeb;border:1px solid #fedf89;color:#93370d}
.rh-texte{white-space:pre-wrap;background:var(--fond);border-radius:10px;padding:12px;font-size:14px;line-height:1.5}
.rh-plus{display:grid;gap:6px}.rh-plus button{display:flex;gap:10px;align-items:center;border:1px solid var(--bord);background:#fff;border-radius:12px;padding:12px;font-weight:600;color:var(--txt);cursor:pointer;text-align:left}
.rh-plus svg{width:20px;height:20px}
.app>main{min-width:0}.entete>div{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
@media(max-width:900px){.rh-solde{grid-template-columns:1fr 1fr}.entete>div{justify-content:flex-start}.entete .btn{padding:9px 13px;font-size:14px}.rh-hide-m{display:none}.kpis[style]{grid-template-columns:1fr!important}}
`;document.head.appendChild(s)})();

/* ---------- Outils ---------- */
const RH_NOMS={stockpro:'Stock & Ventes',rhpro:'RH Pro',securipro:'SécuriPro',nettopro:'NettoPro',btppro:'BTP Pro',phonepro:'PhonePro'};
const RH_IC={
 rh_accueil:'<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
 rh_employes:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M17 11a3 3 0 100-6M22 21c0-3-2-5-4-5.5"/>',
 rh_conges:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>',
 rh_pointage:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
 rh_salaires:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
 rh_courriers:'<path d="M4 4h16v16H4z"/><path d="M4 7l8 6 8-6"/>',
 rh_candidatures:'<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
 rh_signalements:'<path d="M4 22V4a1 1 0 011-1h12l-2 5 2 5H5"/>',
 rh_moi:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
 rh_mes_conges:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 rh_mes_docs:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
 rh_signaler:'<path d="M4 22V4a1 1 0 011-1h12l-2 5 2 5H5"/>',
 plus:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'
};
const rhAuj=()=>new Date().toISOString().slice(0,10);
const rhDj=d=>d?new Date(String(d).slice(0,10)+'T12:00:00').toLocaleDateString(LOC(),{day:'2-digit',month:'short',year:'numeric'}):'—';
const rhDl=d=>d?new Date(String(d).slice(0,10)+'T12:00:00').toLocaleDateString(LOC(),{day:'numeric',month:'long',year:'numeric'}):'';
const rhHm=d=>d?new Date(d).toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'}):'—';
const rhNom=e=>e?(e.prenom+' '+e.nom):'—';
const rhRO=()=>(CTX?.lecture_seule||[]).includes('rhpro');
const rhJ=n=>{n=+n||0;return L(`${n} jour${n>1?'s':''}`,`${n} day${n>1?'s':''}`)};
function rhAv(e,s=38){const ini=((e?.prenom||'?')[0]+(e?.nom||'')[0]||'').toUpperCase();
  return`<span class="rh-av" style="width:${s}px;height:${s}px;font-size:${Math.round(s/2.8)}px">${e?.photo_url?`<img src="${esc(e.photo_url)}" alt="">`:esc(ini)}</span>`}
function rhCellE(e,sous){return`<div class="rh-emp">${rhAv(e)}<div><b>${esc(rhNom(e))}</b><small>${esc(sous??e?.poste??'')}</small></div></div>`}
let RH_EMPS=null,RH_EMPS_E=null;
async function rhEmps(force){if(force||!RH_EMPS||RH_EMPS_E!==E()){RH_EMPS=verif(await sb.from('rh_employes').select('*').eq('espace_id',E()).order('nom'));RH_EMPS_E=E()}return RH_EMPS}
const rhEmp=id=>(RH_EMPS||[]).find(x=>x.id===id);
function rhTag(t,c=''){return`<span class="tag ${c}">${t}</span>`}
const RH_TC={conge_paye:'Congé payé',maladie:'Maladie',maternite:'Maternité / paternité',permission:'Permission',sans_solde:'Congé sans solde',absence:'Absence',autre:'Autre'};
const RH_SC={en_attente:['En attente','orange'],approuve:['Approuvé',''],refuse:['Refusé','rouge'],annule:['Annulé','gris']};
const RH_CONTRATS=['CDI','CDD','Stage','Prestataire','Journalier / temporaire'];
const RH_PAIE_MODES=['Virement','Mobile Money','Espèces','Chèque'];
function rhOpts(liste,sel){return liste.map(v=>Array.isArray(v)?`<option value="${esc(v[0])}" ${v[0]===sel?'selected':''}>${esc(v[1])}</option>`:`<option ${v===sel?'selected':''}>${esc(v)}</option>`).join('')}
function rhChips(id,items,actif){return`<div class="chips" id="${id}">${items.map(([k,t])=>`<button type="button" data-chip="${k}" class="${k===actif?'on':''}">${t}</button>`).join('')}</div>`}
function rhNbJours(d1,d2){let n=0;const a=new Date(d1+'T12:00:00'),b=new Date(d2+'T12:00:00');for(let d=a;d<=b;d.setDate(d.getDate()+1))if(d.getDay()!==0)n++;return n}
function rhSolde(emp,conges){const an=String(new Date().getFullYear());
  const l=conges.filter(c=>c.employe_id===emp.id&&c.type==='conge_paye'&&String(c.date_debut).startsWith(an));
  const pris=l.filter(c=>c.statut==='approuve').reduce((a,c)=>a+(+c.nb_jours||0),0);const att=l.filter(c=>c.statut==='en_attente').reduce((a,c)=>a+(+c.nb_jours||0),0);
  return{droits:+emp.jours_conges_an||0,pris,att,reste:(+emp.jours_conges_an||0)-pris}}
function rhSoldeHTML(s){return`<div class="rh-solde"><div><b>${s.droits}</b><small>Droits annuels</small></div><div><b>${s.pris}</b><small>Pris</small></div><div><b>${s.att}</b><small>En attente</small></div><div><b style="color:var(--p)">${s.reste}</b><small>Restant</small></div></div>`}
function rhCouleur(){return getComputedStyle(document.documentElement).getPropertyValue('--p').trim()||'#13734B'}
function rhCsv(nom,lignes){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+lignes.map(l=>l.map(v=>String(v??'').replace(/[;\n]/g,' ')).join(';')).join('\n')],{type:'text/csv'}));a.download=nom;a.click()}
function rhModaleLarge(){const m=document.querySelector('#modale-zone .modale');if(m)m.classList.add('large')}
async function rhPhotoBlob(f){return new Promise((ok,ko)=>{const img=new Image();img.onload=()=>{const k=Math.min(1,600/Math.max(img.width,img.height));const c=document.createElement('canvas');
  c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):ko(new Error('Image')),'image/jpeg',.88)};img.onerror=()=>ko(new Error('Image invalide'));img.src=URL.createObjectURL(f)})}

/* ---------- Intégration au menu de la plateforme ---------- */
const RH_COURT={rh_accueil:'Accueil',rh_employes:'Employés',rh_conges:'Congés',rh_pointage:'Pointage',rh_moi:'Accueil',rh_mes_conges:'Congés',rh_mes_docs:'Documents',rh_signaler:'Signaler'};
function rhPages(g){Object.assign(IC,RH_IC);
  return g?[['rh_accueil','Tableau de bord RH'],['rh_employes','Employés'],['rh_conges','Congés et absences'],['rh_pointage','Pointage'],['rh_salaires','Salaires et paie'],
    ['rh_courriers','Courriers officiels'],['rh_candidatures','Candidatures'],['rh_signalements','Signalements']]
   :[['rh_moi','Mon espace RH'],['rh_mes_conges','Mes congés'],['rh_mes_docs','Mes documents'],['rh_signaler','Signaler']]}
function vueDepart(){const s=CTX.logiciels.includes('stockpro'),r=CTX.logiciels.includes('rhpro');
  if(r&&(!s||CTX.membre.role==='employe'))return estGerant()?'rh_accueil':'rh_moi';return estGerant()?'accueil':'caisse'}
function menuPlus(){Object.assign(IC,RH_IC);
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale"><h3 style="margin-bottom:12px">Menu</h3><div class="rh-plus">${pages().map(([k,t])=>`<button data-plus="${k}">${svg(k)}${tr(t)}</button>`).join('')}</div>
   <div class="actions"><button class="btn sec" onclick="fermer()">Fermer</button></div></div></div>`;
  document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{fermer();aller(b.dataset.plus)});
  $('.voile').onclick=e=>{if(e.target.classList.contains('voile'))fermer()}}
/* Bandeaux licence (tous logiciels) : lecture seule, échéances proches */
function bandeauxLicence(){if(!estGerant()||!CTX?.licences)return'';let h='';
  for(const l of CTX.licences.filter(x=>!x.inclus_dans)){const nm=RH_NOMS[l.logiciel]||l.logiciel;
    if(l.statut==='lecture_seule'){h+=`<div class="rh-bandeau ro"><span><b>🔒 Lecture seule</b> — ${esc(L(`${nm} : le forfait de maintenance et d'hébergement a expiré le ${rhDl(l.maintenance_fin)}. Vos données restent visibles, mais l'ajout et la modification sont bloqués.`,`${tr(nm)}: the maintenance & hosting plan expired on ${rhDl(l.maintenance_fin)}. Your data is still visible, but adding and editing are blocked.`))}</span><button class="btn pt" onclick="window._abLog='${l.logiciel}';aller('abonnement')">Renouveler le forfait</button></div>`;continue}
    if(l.type==='achat'&&l.maintenance_fin){const j=Math.ceil((new Date(l.maintenance_fin+'T23:59:59')-Date.now())/864e5);
      if(j>=0&&j<=30)h+=`<div class="rh-bandeau rap"><span>${esc(L(`⏰ Le forfait de maintenance et d'hébergement de ${nm} arrive à échéance le ${rhDl(l.maintenance_fin)} (dans ${j} jour${j>1?'s':''}). Renouvelez-le pour garder l'accès complet.`,`⏰ The maintenance & hosting plan for ${tr(nm)} ends on ${rhDl(l.maintenance_fin)} (in ${j} day${j>1?'s':''}). Renew it to keep full access.`))}</span><button class="btn pt" onclick="window._abLog='${l.logiciel}';aller('abonnement')">Renouveler le forfait</button></div>`}
    else if(l.type!=='achat'&&l.statut==='actif'&&l.date_fin){const j=Math.ceil((new Date(l.date_fin+'T23:59:59')-Date.now())/864e5);
      if(j>=0&&j<=7)h+=`<div class="rh-bandeau rap"><span>${esc(L(`⏰ Votre abonnement ${nm} se termine le ${rhDl(l.date_fin)}. Renouvelez-le pour éviter la suspension.`,`⏰ Your ${tr(nm)} subscription ends on ${rhDl(l.date_fin)}. Renew it to avoid suspension.`))}</span><button class="btn pt" onclick="window._abLog='${l.logiciel}';aller('abonnement')">Voir les formules</button></div>`}}
  return h}

/* ---------- Inscription : secteur RH => RH Pro automatiquement ---------- */
function rhInscriptionInit(){
  const opt=[...$('#i-sect').options].find(o=>o.dataset.logiciel==='rhpro');
  if(params.get('logiciel')==='rhpro'){ if(opt)opt.selected=true;
    $('#auth-titre').textContent='Gérez vos employés simplement. Tout est prêt.';
    $('#auth-texte').textContent="Ajoutez votre logo : vos couleurs s'appliquent partout. Employés, congés, pointage, paie et documents officiels, sur ordinateur et téléphone.";
    const li=document.querySelectorAll('.auth-g li');if(li[2])li[2].innerHTML='<b>✓</b> Vos employés ont leur propre espace : congés, pointage, fiches de paie';
    if(typeof majSecteur==='function')majSecteur();appliquerLangue();}
}
function rhLogicielInscription(){return params.get('logiciel')||$('#i-sect').selectedOptions[0]?.dataset.logiciel||'stockpro'}

/* ======================================================================
   ESPACE DIRIGEANT / RH
   ====================================================================== */
async function rhAccueil(){
  C().innerHTML=entete('Bonjour '+esc(CTX.membre.nom_complet.split(' ')[0])+' 👋')+'<div class="vide">Chargement…</div>';
  const r=verif(await sb.rpc('rh_resume',{p_espace:E()}));const emps=await rhEmps(true);
  const dem=verif(await sb.from('rh_conges').select('*').eq('espace_id',E()).eq('statut','en_attente').order('date_debut'));
  const sig=verif(await sb.from('rh_signalements').select('*').eq('espace_id',E()).eq('statut','ouvert').order('created_at',{ascending:false}).limit(6));
  const exp=verif(await sb.from('rh_explications').select('*').eq('espace_id',E()).eq('statut','repondu').order('repondu_le',{ascending:false}));
  const ro=rhRO();
  C().innerHTML=entete('Bonjour '+esc(CTX.membre.nom_complet.split(' ')[0])+' 👋',ro?'':`<button class="btn sec" onclick="aller('rh_salaires')">Préparer la paie</button> <button class="btn" onclick="rhFormEmploye()">+ Employé</button>`)+`
  <div class="kpis">
    <div class="kpi p"><small>Effectif</small><div>${r.effectif}${r.employes_max?`<small style="font-size:13px"> / ${r.employes_max}</small>`:''}</div></div>
    <div class="kpi"><small>Présents aujourd'hui</small><div>${r.presents}</div></div>
    <div class="kpi"><small>En congé aujourd'hui</small><div>${r.absents}</div></div>
    <div class="kpi"><small>Masse salariale / mois</small><div>${fmt(r.masse_salariale)}</div></div>
  </div>
  ${r.effectif===0&&!ro?`<div class="carte" style="margin-bottom:14px"><b>Première étape :</b> <span>ajoutez vos employés (ou importez votre fichier Excel).</span> <button class="btn pt" style="margin-left:8px" onclick="aller('rh_employes')">Ajouter mes employés</button></div>`:''}
  <div class="deux">
    <div class="carte"><h3 style="margin-top:0">Demandes de congé à traiter</h3><div class="rh-liste">${dem.length?dem.map(c=>{const e=rhEmp(c.employe_id);return`<div>${rhCellE(e,tr(RH_TC[c.type])+' · '+rhDj(c.date_debut)+' → '+rhDj(c.date_fin)+' · '+rhJ(c.nb_jours))}
      ${ro?'':`<div class="rh-actions"><button class="btn pt" data-ok="${c.id}">Approuver</button><button class="btn pt rouge" data-no="${c.id}">Refuser</button></div>`}</div>`}).join(''):'<div class="vide">Aucune demande en attente ✓</div>'}</div></div>
    <div class="carte"><h3 style="margin-top:0">Signalements ouverts</h3><div class="rh-liste">${sig.length?sig.map(s=>`<div>${rhCellE(rhEmp(s.employe_id),s.sujet)}<button class="btn pt sec" data-sig="${s.id}">Répondre</button></div>`).join(''):'<div class="vide">Aucun signalement ✓</div>'}</div></div>
    <div class="carte"><h3 style="margin-top:0">Réponses aux demandes d'explication</h3><div class="rh-liste">${exp.length?exp.map(x=>`<div>${rhCellE(rhEmp(x.employe_id),x.numero+' · '+rhDj(x.repondu_le))}<button class="btn pt sec" data-exp="${x.id}">Examiner</button></div>`).join(''):'<div class="vide">Aucune réponse à examiner ✓</div>'}</div></div>
    <div class="carte"><h3 style="margin-top:0">Fins de contrat (45 jours)</h3><div class="rh-liste">${r.fins_contrat.length?r.fins_contrat.map(f=>`<div>${rhCellE(rhEmp(f.id))}<span class="tag orange">${rhDj(f.date)}</span></div>`).join(''):'<div class="vide">Aucune fin de contrat proche</div>'}</div>
      ${r.candidatures?`<p style="margin:14px 0 0"><b>${r.candidatures}</b> <span>Nouvelles candidatures</span> <button class="btn pt lien" onclick="aller('rh_candidatures')">Voir</button></p>`:''}</div>
  </div>`;
  document.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>rhDecider(b.dataset.ok,'approuve'));
  document.querySelectorAll('[data-no]').forEach(b=>b.onclick=()=>rhRefuser(b.dataset.no));
  document.querySelectorAll('[data-sig]').forEach(b=>b.onclick=()=>rhRepondreSignalement(sig.find(s=>s.id===b.dataset.sig)));
  document.querySelectorAll('[data-exp]').forEach(b=>b.onclick=()=>rhVoirExplication(exp.find(x=>x.id===b.dataset.exp)));
}
async function rhDecider(id,statut,reponse=null){verif(await sb.from('rh_conges').update({statut,reponse,decide_par:CTX.membre.id,decide_le:new Date().toISOString()}).eq('id',id));toast('Décision enregistrée');aller(VUE)}
function rhRefuser(id){modale(`<h3>Refuser la demande</h3><label>Motif du refus (facultatif)</label><textarea name="r" rows="3"></textarea>`,async f=>{await rhDecider(id,'refuse',f.r.value||null)})}

/* ---------- Employés ---------- */
let RH_FILTRE='actif';
async function rhEmployes(){
  const emps=await rhEmps(true);const ro=rhRO();
  C().innerHTML=entete('Employés',ro?'':`<button class="btn sec" id="e-imp">Importer (Excel/CSV)</button> <button class="btn sec" id="e-bdg">Badges</button> <button class="btn" id="e-new">+ Ajouter</button>`)+`
   ${rhChips('e-f',[['actif','Actifs'],['sorti','Sortis'],['tous','Tous']],RH_FILTRE)}
   <input class="recherche" id="e-rech" placeholder="🔍 Rechercher" style="margin-bottom:12px">
   <div class="carte tab-scroll"><table id="e-tab"></table></div>`;
  const dess=()=>{const q=$('#e-rech').value.toLowerCase();
    const l=emps.filter(e=>(RH_FILTRE==='tous'||e.statut===RH_FILTRE)&&(!q||[e.prenom,e.nom,e.poste,e.departement,e.matricule].join(' ').toLowerCase().includes(q)));
    $('#e-tab').innerHTML=l.length?`<tr><th>Employé</th><th class="rh-hide-m">Matricule</th><th class="rh-hide-m">Service</th><th class="rh-hide-m">Contrat</th><th>Salaire de base</th><th class="rh-hide-m">Accès</th><th></th></tr>`+l.map(e=>`<tr>
      <td>${rhCellE(e)}</td><td class="rh-hide-m">${esc(e.matricule||'')}</td><td class="rh-hide-m">${esc(e.departement||'—')}</td><td class="rh-hide-m">${esc(e.type_contrat||'')}${e.statut==='sorti'?' '+rhTag('Sorti','gris'):''}</td>
      <td>${fmt(e.salaire_base)}</td><td class="rh-hide-m">${e.membre_id?rhTag('Compte actif'):rhTag('Pas de compte','gris')}</td>
      <td style="white-space:nowrap"><button class="btn pt sec" data-fiche="${e.id}">Fiche</button> <button class="btn pt lien" data-badge="${e.id}">Badge</button></td></tr>`).join('')
      :`<tr><td class="vide">Aucun employé. Cliquez sur « + Ajouter » ou importez votre fichier Excel.</td></tr>`;
    document.querySelectorAll('[data-fiche]').forEach(b=>b.onclick=()=>rhFiche(b.dataset.fiche));
    document.querySelectorAll('[data-badge]').forEach(b=>b.onclick=()=>rhBadges([rhEmp(b.dataset.badge)]));};
  document.querySelectorAll('#e-f [data-chip]').forEach(b=>b.onclick=()=>{RH_FILTRE=b.dataset.chip;document.querySelectorAll('#e-f button').forEach(x=>x.classList.toggle('on',x===b));dess()});
  $('#e-rech').oninput=dess;dess();
  if(!ro){$('#e-new').onclick=()=>rhFormEmploye();$('#e-imp').onclick=rhImporter;$('#e-bdg').onclick=()=>rhBadges(emps.filter(e=>e.statut==='actif'))}
}
function rhFormEmploye(e={},pre={}){
  e={...pre,...e};let photo=null;
  modale(`<h3>${e.id?"Modifier l'employé":'Nouvel employé'}</h3>
   <div class="rh-photo" id="ef-ph">${e.photo_url?`<img src="${esc(e.photo_url)}" alt="">`:'<span>Touchez pour ajouter une photo</span>'}</div>
   <div style="text-align:center;font-size:12px;color:var(--mut)">Photo (reprise sur le badge)</div><input type="file" id="ef-f" accept="image/*" class="cache">
   <div class="grille2"><div><label>Prénom</label><input name="prenom" required value="${esc(e.prenom)}"></div><div><label>Nom</label><input name="nom" required value="${esc(e.nom)}"></div>
   <div><label>Poste</label><input name="poste" value="${esc(e.poste)}"></div><div><label>Service</label><input name="departement" value="${esc(e.departement)}"></div>
   <div><label>Type de contrat</label><select name="type_contrat">${rhOpts(RH_CONTRATS,e.type_contrat||'CDI')}</select></div><div><label>Matricule</label><input name="matricule" value="${esc(e.matricule)}" placeholder="EMP-0001"></div>
   <div><label>Date d'embauche</label><input type="date" name="date_embauche" value="${esc(e.date_embauche||'')}"></div><div><label>Fin de contrat</label><input type="date" name="date_fin_contrat" value="${esc(e.date_fin_contrat||'')}"></div>
   <div><label>Salaire de base</label><input type="number" min="0" step="any" name="salaire_base" value="${e.salaire_base??0}"></div><div><label>Jours de congé par an</label><input type="number" min="0" step="any" name="jours_conges_an" value="${e.jours_conges_an??24}"></div>
   <div><label>Téléphone</label><input name="telephone" inputmode="tel" value="${esc(e.telephone)}"></div><div><label>E-mail</label><input type="email" name="email" value="${esc(e.email)}"></div>
   <div><label>Date de naissance</label><input type="date" name="date_naissance" value="${esc(e.date_naissance||'')}"></div><div><label>N° sécurité sociale (CNSS)</label><input name="num_securite_sociale" value="${esc(e.num_securite_sociale)}"></div>
   <div><label>Mode de paiement du salaire</label><select name="mode_paiement">${rhOpts(RH_PAIE_MODES,e.mode_paiement||'Virement')}</select></div><div><label>N° Mobile Money ou IBAN</label><input name="numero_paiement" value="${esc(e.numero_paiement)}"></div></div>
   <label>Adresse</label><input name="adresse" value="${esc(e.adresse)}"><label>Contact d'urgence</label><input name="contact_urgence" value="${esc(e.contact_urgence)}">
   ${e.id?`<div class="grille2"><div><label>Statut</label><select name="statut">${rhOpts([['actif','Actif'],['sorti',"Sorti de l'entreprise"]],e.statut)}</select></div><div><label>Date de sortie</label><input type="date" name="date_sortie" value="${esc(e.date_sortie||'')}"></div></div>`:''}`,
  async f=>{const v=Object.fromEntries(new FormData(f));const nul=x=>(x===''||x==null)?null:x;
    let photo_url=e.photo_url||null;
    if(photo){const ch=`${E()}/emp-${Date.now()}.jpg`;verif(await sb.storage.from('photos').upload(ch,photo,{upsert:true,contentType:'image/jpeg'}));photo_url=sb.storage.from('photos').getPublicUrl(ch).data.publicUrl}
    const row={prenom:v.prenom.trim(),nom:v.nom.trim(),poste:nul(v.poste),departement:nul(v.departement),type_contrat:v.type_contrat,matricule:nul(v.matricule?.trim()),
      date_embauche:nul(v.date_embauche),date_fin_contrat:nul(v.date_fin_contrat),salaire_base:+v.salaire_base||0,jours_conges_an:+v.jours_conges_an||0,
      telephone:nul(v.telephone),email:nul(v.email),date_naissance:nul(v.date_naissance),num_securite_sociale:nul(v.num_securite_sociale),
      mode_paiement:v.mode_paiement,numero_paiement:nul(v.numero_paiement),adresse:nul(v.adresse),contact_urgence:nul(v.contact_urgence),photo_url};
    if(e.id){row.statut=v.statut;row.date_sortie=nul(v.date_sortie);verif(await sb.from('rh_employes').update(row).eq('id',e.id))}
    else verif(await sb.from('rh_employes').insert({...row,espace_id:E()}));
    RH_EMPS=null;toast('Employé enregistré');if(e._cand)verif(await sb.from('rh_candidatures').update({statut:'retenue'}).eq('id',e._cand));aller(VUE==='rh_accueil'?'rh_employes':VUE)});
  rhModaleLarge();
  $('#ef-ph').onclick=()=>$('#ef-f').click();
  $('#ef-f').onchange=async ev=>{const fl=ev.target.files[0];if(!fl)return;if(fl.size>5e6){toast('Photo trop lourde (5 Mo maximum)');return}
    try{photo=await rhPhotoBlob(fl);$('#ef-ph').innerHTML=`<img src="${URL.createObjectURL(photo)}" alt="">`}catch(er){toast(erreurMsg(er))}};
}
async function rhFiche(id){
  const e=rhEmp(id)||verif(await sb.from('rh_employes').select('*').eq('id',id).single());
  const cg=verif(await sb.from('rh_conges').select('*').eq('employe_id',id).order('date_debut',{ascending:false}));
  const docs=verif(await sb.from('rh_documents').select('id,numero,titre,created_at').eq('employe_id',id).order('created_at',{ascending:false}));
  const ro=rhRO();const s=rhSolde(e,cg);
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale large">
   <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">${rhAv(e,64)}<div><h3 style="margin:0">${esc(rhNom(e))}</h3><div style="color:var(--mut)">${esc(e.poste||'')}${e.departement?' · '+esc(e.departement):''}</div>
    <div style="margin-top:4px">${rhTag(esc(e.matricule||''),'gris')} ${e.statut==='sorti'?rhTag('Sorti','gris'):''} ${e.membre_id?rhTag('Compte actif'):rhTag('Pas de compte','gris')}</div></div></div>
   <div class="rh-actions" style="justify-content:flex-start;margin-bottom:14px">${ro?'':`<button class="btn pt" id="fi-mod">Modifier</button>`}<button class="btn pt sec" id="fi-bdg">Badge</button>
    ${!ro&&!e.membre_id&&e.statut==='actif'?`<button class="btn pt sec" id="fi-acc">Créer son accès employé</button>`:''}
    ${ro?'':`<button class="btn pt sec" id="fi-doc">Générer un document</button><button class="btn pt sec" id="fi-exp">Demande d'explication</button>`}</div>
   <div class="rh-info"><span>Contrat</span><b>${esc(e.type_contrat||'—')}</b><span>Date d'embauche</span><b>${rhDj(e.date_embauche)}</b>
    ${e.date_fin_contrat?`<span>Fin de contrat</span><b>${rhDj(e.date_fin_contrat)}</b>`:''}<span>Salaire de base</span><b>${fmt(e.salaire_base)}</b>
    <span>Téléphone</span><b>${esc(e.telephone||'—')}</b><span>E-mail</span><b>${esc(e.email||'—')}</b><span>Mode de paiement du salaire</span><b>${esc(e.mode_paiement||'—')} ${esc(e.numero_paiement||'')}</b>
    <span>N° sécurité sociale (CNSS)</span><b>${esc(e.num_securite_sociale||'—')}</b><span>Contact d'urgence</span><b>${esc(e.contact_urgence||'—')}</b></div>
   <h4 style="margin:18px 0 8px">Solde de congés</h4>${rhSoldeHTML(s)}
   <h4 style="margin:18px 0 8px">Historique des congés</h4><div class="rh-liste">${cg.length?cg.slice(0,8).map(c=>`<div><span>${tr(RH_TC[c.type])} · ${rhDj(c.date_debut)} → ${rhDj(c.date_fin)}</span>${rhTag(tr(RH_SC[c.statut][0]),RH_SC[c.statut][1])}</div>`).join(''):'<div class="vide">Aucun congé</div>'}</div>
   <h4 style="margin:18px 0 8px">Documents</h4><div class="rh-liste">${docs.length?docs.map(d=>`<div><span>${esc(d.numero)} · ${esc(d.titre)}</span><small>${rhDj(d.created_at)}</small></div>`).join(''):'<div class="vide">Aucun document</div>'}</div>
   <div class="actions"><button class="btn sec" onclick="fermer()">Fermer</button></div></div></div>`;
  $('.voile').onclick=ev=>{if(ev.target.classList.contains('voile'))fermer()};
  $('#fi-bdg').onclick=()=>rhBadges([e]);
  if($('#fi-mod'))$('#fi-mod').onclick=()=>rhFormEmploye(e);
  if($('#fi-acc'))$('#fi-acc').onclick=()=>rhCreerAcces(e);
  if($('#fi-doc'))$('#fi-doc').onclick=()=>rhFormDocument({employe_id:e.id});
  if($('#fi-exp'))$('#fi-exp').onclick=()=>rhFormExplication(e.id);
}
function rhCreerAcces(e){
  const lien=location.origin+location.pathname+'?e='+CTX.espace.slug;
  const idf=(e.prenom+'.'+e.nom).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9.]/g,'').slice(0,24);
  modale(`<h3>Accès employé</h3><p style="color:var(--mut);font-size:14px">L'employé pourra pointer, demander ses congés, voir ses documents et fiches de paie.</p>
   <label>Mode de connexion</label><select name="mode" id="ac-mode"><option value="pin">Identifiant + code PIN (sans e-mail)</option><option value="email">E-mail + mot de passe</option></select>
   <div id="ac-pin"><div class="grille2"><div><label>Identifiant</label><input name="identifiant" value="${esc(idf)}"></div><div><label>Code PIN (6 chiffres)</label><input name="pin" inputmode="numeric" pattern="\\d{6}" value="${String(Math.floor(1e5+Math.random()*9e5))}"></div></div></div>
   <div id="ac-mail" class="cache"><label>E-mail</label><input name="email" type="email" value="${esc(e.email||'')}"><label>Mot de passe provisoire (8 caractères min.)</label><input name="mdp"></div>`,
  async f=>{const v=Object.fromEntries(new FormData(f));
    const j=await appelMembres({action:'creer',espace_id:E(),nom_complet:rhNom(e),role:'employe',poste:e.poste,telephone:e.telephone,
      ...(v.mode==='pin'?{identifiant:v.identifiant,mot_de_passe:v.pin}:{email:v.email,mot_de_passe:v.mdp})});
    verif(await sb.from('rh_employes').update({membre_id:j.membre.id}).eq('id',e.id));RH_EMPS=null;
    const msg=LANG==='en'?(v.mode==='pin'?`Hello ${rhNom(e)}, here is your access to ${CTX.espace.nom}:\n${lien}\nUsername: ${j.connexion.identifiant}\nPIN: ${v.pin}`:`Hello ${rhNom(e)}, here is your access to ${CTX.espace.nom}:\n${lien}\nEmail: ${v.email}\nTemporary password: ${v.mdp}`)
      :(v.mode==='pin'?`Bonjour ${rhNom(e)}, voici votre accès à ${CTX.espace.nom} :\n${lien}\nIdentifiant : ${j.connexion.identifiant}\nCode PIN : ${v.pin}`:`Bonjour ${rhNom(e)}, voici votre accès à ${CTX.espace.nom} :\n${lien}\nE-mail : ${v.email}\nMot de passe provisoire : ${v.mdp}`);
    toast('Accès créé et lié à la fiche');setTimeout(()=>partagerAcces(msg,e.telephone),50);if(VUE==='rh_employes')rhEmployes()});
  $('#ac-mode').onchange=ev=>{$('#ac-pin').classList.toggle('cache',ev.target.value!=='pin');$('#ac-mail').classList.toggle('cache',ev.target.value==='pin')};
}
function rhImporter(){
  modale(`<h3>Importer vos employés</h3><p style="color:var(--mut);font-size:14px">Fichier CSV (Excel : « Enregistrer sous » → CSV) avec les colonnes :<br><b>prenom ; nom ; poste ; service ; contrat ; date_embauche ; salaire ; telephone ; email</b></p><input type="file" name="f" accept=".csv,text/csv" required>`,
  async f=>{const txt=await f.f.files[0].text();const lignes=txt.replace(/^﻿/,'').split(/\r?\n/).filter(l=>l.trim());
    const sep=lignes[0].includes(';')?';':',';const ent=lignes[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').split(sep).map(s=>s.trim().replace(/"/g,''));
    const ix=k=>ent.findIndex(h=>h.startsWith(k));const num=s=>+String(s||'0').replace(/\s/g,'').replace(',','.')||0;
    const dte=s=>{s=(s||'').trim();let m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(m)return`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;return /^\d{4}-\d{2}-\d{2}$/.test(s)?s:null};
    const rows=[];for(const l of lignes.slice(1)){const c=l.split(sep).map(s=>s.trim().replace(/^"|"$/g,''));const g=k=>ix(k)>=0?c[ix(k)]:'';
      if(!g('prenom')&&!g('nom'))continue;
      rows.push({espace_id:E(),prenom:g('prenom')||'-',nom:g('nom')||'-',poste:g('poste')||null,departement:(g('service')||g('depart'))||null,type_contrat:g('contrat')||'CDI',
        date_embauche:dte(g('date')),salaire_base:num(g('salaire')),telephone:g('tel')||null,email:g('email')||g('e-mail')||null})}
    for(const r of rows)verif(await sb.from('rh_employes').insert(r));
    RH_EMPS=null;toast(L(`${rows.length} employé(s) importé(s)`,`${rows.length} employee(s) imported`));rhEmployes()});
}

/* ---------- Badge employé (photo, logo, prêt à imprimer) ---------- */
function rhBadgeHTML(e){const es=CTX.espace,p=rhCouleur();const an=new Date().getFullYear();
  const ini=((e.prenom||'?')[0]+(e.nom||'')[0]).toUpperCase();
  return`<div class="badge-c" style="width:85.6mm;height:54mm;border-radius:3.2mm;overflow:hidden;background:#fff;border:.3mm solid #d0d5dd;font-family:Arial,Helvetica,sans-serif;color:#1B2A4A;display:flex;flex-direction:column;-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box;break-inside:avoid">
   <div style="background:${p};height:13mm;display:flex;align-items:center;gap:2.5mm;padding:0 3.5mm;color:#fff">
    ${es.logo_url?`<span style="width:9mm;height:9mm;border-radius:2mm;background:#fff;display:grid;place-items:center;overflow:hidden;flex:none"><img src="${esc(es.logo_url)}" style="max-width:8mm;max-height:8mm;object-fit:contain"></span>`:''}
    <b style="font-size:3.6mm;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(es.nom)}</b></div>
   <div style="flex:1;display:flex;gap:3.5mm;padding:3mm 3.5mm;align-items:center">
    <div style="width:20mm;height:24mm;border-radius:2mm;overflow:hidden;background:#EAF6EF;flex:none;display:grid;place-items:center;border:.4mm solid ${p}">${e.photo_url?`<img src="${esc(e.photo_url)}" style="width:100%;height:100%;object-fit:cover">`:`<b style="font-size:7mm;color:${p}">${esc(ini)}</b>`}</div>
    <div style="min-width:0"><div style="font-size:4.2mm;font-weight:800;line-height:1.1">${esc(e.prenom)}<br>${esc((e.nom||'').toUpperCase())}</div>
     <div style="font-size:3mm;margin-top:1.4mm;color:#475467">${esc(e.poste||'')}</div>${e.departement?`<div style="font-size:2.6mm;color:#667085">${esc(e.departement)}</div>`:''}
     <div style="font-size:2.7mm;margin-top:1.6mm"><b>${esc(e.matricule||'')}</b></div></div></div>
   <div style="background:${p}1f;color:${p};font-size:2.4mm;font-weight:700;letter-spacing:.3mm;text-transform:uppercase;padding:1.4mm 3.5mm;display:flex;justify-content:space-between"><span>${esc(L('Carte professionnelle','Employee ID card'))}</span><span>${an}</span></div></div>`}
function rhBadges(liste){liste=liste.filter(Boolean);if(!liste.length){toast(tr('Aucun employé actif'));return}
  $('#modale-zone').innerHTML=`<div class="voile"><div class="modale large"><h3>Badge employé</h3><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:14px 0;max-height:60vh;overflow:auto">${liste.map(rhBadgeHTML).join('')}</div>
   <div class="actions"><button class="btn sec" onclick="fermer()">Fermer</button><button class="btn" id="bd-imp">Imprimer les badges</button></div></div></div>`;
  $('#bd-imp').onclick=()=>rhFenetre(tr('Badges'),`<style>@page{size:A4;margin:10mm}body{margin:0}.g{display:grid;grid-template-columns:repeat(2,85.6mm);gap:6mm;justify-content:center}</style><div class="g">${liste.map(rhBadgeHTML).join('')}</div>`)}
function rhFenetre(titre,corps){
  const html=`<!DOCTYPE html><html lang="${LANG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titre)}</title></head><body style="margin:0;font-family:Arial,Helvetica,sans-serif">${corps}<script>window.onload=function(){setTimeout(function(){window.print()},500)}<\/script></body></html>`;
  const w=window.open('','_blank');
  if(w){w.document.open();w.document.write(html);w.document.close();return}
  const fr=document.createElement('iframe');fr.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(fr);
  fr.contentDocument.open();fr.contentDocument.write(html.replace(/<script>[\s\S]*<\/script>/,''));fr.contentDocument.close();setTimeout(()=>{fr.contentWindow.print();setTimeout(()=>fr.remove(),2000)},600)}
/* Papier à en-tête de l'entreprise */
function rhPapier(titre,corpsHTML){const es=CTX.espace,p=rhCouleur();
  rhFenetre(titre,`<style>@page{size:A4;margin:16mm}body{color:#1B2A4A;font-size:12pt;line-height:1.6}.t{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid ${p};padding-bottom:10px;margin-bottom:24px}
   .t img{max-height:60px;max-width:160px}.t b{font-size:15pt}.t small{color:#667085;display:block;font-size:9.5pt}h1{font-size:15pt;text-align:center;letter-spacing:.5px;margin:10px 0 22px;color:${p}}
   table{width:100%;border-collapse:collapse;font-size:10.5pt}td,th{border:1px solid #d0d5dd;padding:6px 8px;text-align:left}th{background:#f7f8fa}.r{text-align:right}.sig{margin-top:46px;display:flex;justify-content:space-between}
   .pied{margin-top:40px;border-top:1px solid #e6e8ec;padding-top:6px;font-size:8.5pt;color:#98a2b3;text-align:center}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>
   <div class="t"><div>${es.logo_url?`<img src="${esc(es.logo_url)}" alt="">`:''}</div><div style="text-align:right"><b>${esc(es.nom)}</b>${es.adresse?`<small>${esc(es.adresse)}</small>`:''}${es.telephone?`<small>${esc(es.telephone)}</small>`:''}${es.pays?`<small>${esc(es.pays)}</small>`:''}</div></div>
   ${corpsHTML}<div class="pied">${esc(es.nom)} — ${esc(L('Document généré avec Ilano','Document generated with Ilano'))}</div>`)}
const rhParas=t=>esc(t).split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('');

/* ---------- Congés et absences ---------- */
let RH_CTAB='attente';
async function rhConges(){
  const emps=await rhEmps();const ro=rhRO();
  const cg=verif(await sb.from('rh_conges').select('*').eq('espace_id',E()).order('date_debut',{ascending:false}).limit(500));
  C().innerHTML=entete('Congés et absences',ro?'':`<button class="btn" id="c-new">+ Enregistrer un congé ou une absence</button>`)+rhChips('c-t',[['attente','À traiter'],['cours','À venir / en cours'],['histo','Historique'],['soldes','Soldes']],RH_CTAB)+`<div class="carte tab-scroll" id="c-zone"></div>`;
  const dess=()=>{const z=$('#c-zone');const auj=rhAuj();
    if(RH_CTAB==='soldes'){z.innerHTML=`<table><tr><th>Employé</th><th>Droits annuels</th><th>Pris</th><th>En attente</th><th>Restant</th></tr>${emps.filter(e=>e.statut==='actif').map(e=>{const s=rhSolde(e,cg);return`<tr><td>${rhCellE(e)}</td><td>${s.droits}</td><td>${s.pris}</td><td>${s.att}</td><td><b style="color:${s.reste<0?'var(--rouge)':'var(--p)'}">${s.reste}</b></td></tr>`}).join('')||'<tr><td class="vide">Aucun employé actif</td></tr>'}</table>`;return}
    const l=cg.filter(c=>RH_CTAB==='attente'?c.statut==='en_attente':RH_CTAB==='cours'?(c.statut==='approuve'&&c.date_fin>=auj):true);
    z.innerHTML=l.length?`<table><tr><th>Employé</th><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th class="rh-hide-m">Motif</th><th>Statut</th><th></th></tr>${l.map(c=>`<tr><td>${rhCellE(rhEmp(c.employe_id))}</td><td>${tr(RH_TC[c.type])}</td><td>${rhDj(c.date_debut)}</td><td>${rhDj(c.date_fin)}</td><td>${c.nb_jours}</td>
      <td class="rh-hide-m">${esc(c.motif||'')}${c.reponse?`<br><small style="color:var(--mut)">${esc(c.reponse)}</small>`:''}</td><td>${rhTag(tr(RH_SC[c.statut][0]),RH_SC[c.statut][1])}</td>
      <td style="white-space:nowrap">${!ro&&c.statut==='en_attente'?`<button class="btn pt" data-ok="${c.id}">Approuver</button> <button class="btn pt rouge" data-no="${c.id}">Refuser</button>`:''}${!ro&&c.statut==='approuve'&&c.date_debut>auj?`<button class="btn pt lien" data-an="${c.id}">Annuler</button>`:''}</td></tr>`).join('')}</table>`
      :`<div class="vide">${RH_CTAB==='attente'?tr('Aucune demande en attente ✓'):tr('Aucun congé enregistré')}</div>`;
    document.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>rhDecider(b.dataset.ok,'approuve'));
    document.querySelectorAll('[data-no]').forEach(b=>b.onclick=()=>rhRefuser(b.dataset.no));
    document.querySelectorAll('[data-an]').forEach(b=>b.onclick=()=>rhDecider(b.dataset.an,'annule'));};
  document.querySelectorAll('#c-t [data-chip]').forEach(b=>b.onclick=()=>{RH_CTAB=b.dataset.chip;document.querySelectorAll('#c-t button').forEach(x=>x.classList.toggle('on',x===b));dess()});
  dess();if(!ro)$('#c-new').onclick=()=>rhFormConge(emps);
}
function rhFormConge(emps){const act=emps.filter(e=>e.statut==='actif');if(!act.length){toast(tr('Aucun employé actif'));return}
  modale(`<h3>Enregistrer un congé ou une absence</h3><label>Employé</label><select name="e">${act.map(e=>`<option value="${e.id}">${esc(rhNom(e))}</option>`).join('')}</select>
   <label>Type</label><select name="t">${Object.entries(RH_TC).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
   <div class="grille2"><div><label>Date de début</label><input type="date" name="d" required value="${rhAuj()}"></div><div><label>Date de fin</label><input type="date" name="f" required value="${rhAuj()}"></div></div>
   <label>Motif (facultatif)</label><input name="m">`,
  async f=>{const v=Object.fromEntries(new FormData(f));if(v.f<v.d)throw new Error(L('La date de fin doit être après la date de début','End date must be after start date'));
    verif(await sb.from('rh_conges').insert({espace_id:E(),employe_id:v.e,type:v.t,date_debut:v.d,date_fin:v.f,motif:v.m||null,statut:'approuve',decide_par:CTX.membre.id,decide_le:new Date().toISOString()}));
    toast('Congé enregistré');aller(VUE)})}

/* ---------- Pointage ---------- */
let RH_PJOUR=null;
async function rhPointage(){
  const emps=(await rhEmps()).filter(e=>e.statut==='actif');const ro=rhRO();const jour=RH_PJOUR||rhAuj();const estAuj=jour===rhAuj();
  const pt=verif(await sb.from('rh_pointages').select('*').eq('espace_id',E()).eq('jour',jour));
  const cg=verif(await sb.from('rh_conges').select('employe_id,type').eq('espace_id',E()).eq('statut','approuve').lte('date_debut',jour).gte('date_fin',jour));
  C().innerHTML=entete('Pointage',`<button class="btn sec" id="p-exp">Exporter le mois (Excel)</button>`)+`
   <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><input type="date" id="p-j" value="${jour}" max="${rhAuj()}" style="max-width:200px"></div>
   <div class="carte tab-scroll">${emps.length?`<table><tr><th>Employé</th><th>Arrivée</th><th>Départ</th><th>Durée</th><th>Statut</th>${estAuj&&!ro?'<th></th>':''}</tr>${emps.map(e=>{const p=pt.find(x=>x.employe_id===e.id);const c=cg.find(x=>x.employe_id===e.id);
     const du=p?.arrivee&&p?.depart?((new Date(p.depart)-new Date(p.arrivee))/36e5):null;
     const st=c?rhTag(tr(RH_TC[c.type]),'orange'):p?.depart?rhTag('Parti','gris'):p?.arrivee?rhTag('Présent'):rhTag('Absent','rouge');
     return`<tr><td>${rhCellE(e)}</td><td>${rhHm(p?.arrivee)}</td><td>${rhHm(p?.depart)}</td><td>${du!=null?du.toFixed(1)+' h':'—'}</td><td>${st}</td>
     ${estAuj&&!ro?`<td style="white-space:nowrap">${!p?.arrivee?`<button class="btn pt" data-arr="${e.id}">Arrivée</button>`:!p?.depart?`<button class="btn pt sec" data-dep="${e.id}">Départ</button>`:''}</td>`:''}</tr>`}).join('')}</table>`:'<div class="vide">Aucun employé actif</div>'}</div>`;
  $('#p-j').onchange=ev=>{RH_PJOUR=ev.target.value||null;rhPointage()};
  const pointer=async(id,s)=>{verif(await sb.rpc('rh_pointer',{p_espace:E(),p_sens:s,p_employe:id}));rhPointage()};
  document.querySelectorAll('[data-arr]').forEach(b=>b.onclick=()=>pointer(b.dataset.arr,'arrivee'));
  document.querySelectorAll('[data-dep]').forEach(b=>b.onclick=()=>pointer(b.dataset.dep,'depart'));
  $('#p-exp').onclick=async()=>{const m=jour.slice(0,7);const all=verif(await sb.from('rh_pointages').select('*').eq('espace_id',E()).gte('jour',m+'-01').lte('jour',m+'-31').order('jour'));
    rhCsv(`pointage-${m}-${CTX.espace.slug}.csv`,[[tr('Date'),tr('Employé'),tr('Matricule'),tr('Arrivée'),tr('Départ'),tr('Durée')],...all.map(p=>{const e=rhEmp(p.employe_id);const du=p.arrivee&&p.depart?((new Date(p.depart)-new Date(p.arrivee))/36e5).toFixed(2):'';
      return[p.jour,rhNom(e),e?.matricule,rhHm(p.arrivee),rhHm(p.depart),du]})])};
}

/* ---------- Salaires et paie ---------- */
let RH_PERIODE=null;
const rhMoisLabel=p=>new Date(p+'-15T12:00:00').toLocaleDateString(LOC(),{month:'long',year:'numeric'});
const RH_PS={brouillon:['Brouillon','gris'],valide:['Validée','orange'],paye:['Payée','']};
async function rhSalaires(){
  const emps=await rhEmps();const ro=rhRO();const per=RH_PERIODE||rhAuj().slice(0,7);
  const pa=verif(await sb.from('rh_paies').select('*').eq('espace_id',E()).eq('periode',per));
  const tot=k=>pa.reduce((a,x)=>a+(+x[k]||0),0);
  C().innerHTML=entete('Salaires et paie',pa.length?`<button class="btn sec" id="s-exp">Exporter (Excel)</button>${ro?'':` <button class="btn" id="s-val">Tout valider</button>`}`:'')+`
   <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap"><label style="margin:0">Période</label><input type="month" id="s-per" value="${per}" style="max-width:200px">
    ${!ro&&emps.some(e=>e.statut==='actif'&&!pa.find(x=>x.employe_id===e.id))?`<button class="btn sec" id="s-prep">Préparer la paie du mois</button>`:''}</div>
   <div class="carte tab-scroll">${pa.length?`<table class="rh-compact"><tr><th>Employé</th><th>Salaire de base</th><th class="rh-hide-m">Primes</th><th class="rh-hide-m">Heures sup.</th><th class="rh-hide-m">Retenues</th><th class="rh-hide-m">Avances</th><th class="rh-hide-m">Cotisations</th><th>Net à payer</th><th>Statut</th><th></th></tr>
    ${pa.map(x=>`<tr><td>${rhCellE(rhEmp(x.employe_id))}</td><td>${fmt(x.salaire_base)}</td><td class="rh-hide-m">${fmt(x.primes)}</td><td class="rh-hide-m">${fmt(x.heures_sup)}</td><td class="rh-hide-m">${fmt(x.retenues)}</td><td class="rh-hide-m">${fmt(x.avances)}</td><td class="rh-hide-m">${fmt(x.cotisations)}</td>
     <td><b>${fmt(x.net)}</b></td><td>${rhTag(tr(RH_PS[x.statut][0]),RH_PS[x.statut][1])}</td><td style="white-space:nowrap">${!ro&&x.statut!=='paye'?`<button class="btn pt sec" data-mod="${x.id}">Modifier</button> `:''}${!ro&&x.statut==='valide'?`<button class="btn pt" data-pay="${x.id}">Payer</button> `:''}<button class="btn pt lien" data-bul="${x.id}">Bulletin</button></td></tr>`).join('')}
    <tr><td><b>Total</b></td><td>${fmt(tot('salaire_base'))}</td><td class="rh-hide-m">${fmt(tot('primes'))}</td><td class="rh-hide-m">${fmt(tot('heures_sup'))}</td><td class="rh-hide-m">${fmt(tot('retenues'))}</td><td class="rh-hide-m">${fmt(tot('avances'))}</td><td class="rh-hide-m">${fmt(tot('cotisations'))}</td><td><b>${fmt(tot('net'))}</b></td><td></td><td></td></tr></table>
    <p style="font-size:13px;color:var(--mut);margin:12px 4px 0">${esc(L("Validez les fiches pour les rendre visibles dans l'espace de chaque employé. Les absences et congés sans solde du mois sont déduits automatiquement à la préparation.","Approve payslips to make them visible in each employee's space. Unpaid absences and unpaid leave are deducted automatically when payroll is prepared."))}</p>`
    :`<div class="vide">Aucune fiche de paie pour ce mois.</div>`}</div>`;
  $('#s-per').onchange=ev=>{RH_PERIODE=ev.target.value||null;rhSalaires()};
  if($('#s-prep'))$('#s-prep').onclick=async()=>{
    const d1=per+'-01',fin=new Date(+per.slice(0,4),+per.slice(5,7),0).getDate(),d2=per+'-'+String(fin).padStart(2,'0');
    const abs=verif(await sb.from('rh_conges').select('*').eq('espace_id',E()).eq('statut','approuve').in('type',['sans_solde','absence']).lte('date_debut',d2).gte('date_fin',d1));
    const rows=emps.filter(e=>e.statut==='actif'&&!pa.find(x=>x.employe_id===e.id)).map(e=>{
      const j=abs.filter(a=>a.employe_id===e.id).reduce((s,a)=>s+rhNbJours(a.date_debut>d1?a.date_debut:d1,a.date_fin<d2?a.date_fin:d2),0);
      return{espace_id:E(),employe_id:e.id,periode:per,salaire_base:+e.salaire_base||0,retenues:Math.round((+e.salaire_base||0)/26*j),mode_paiement:e.mode_paiement||null,note:j?L(`${j} jour(s) d'absence non payée`,`${j} unpaid day(s) of absence`):null}});
    if(rows.length)verif(await sb.from('rh_paies').insert(rows));toast('Paie préparée');rhSalaires()};
  if($('#s-val'))$('#s-val').onclick=async()=>{if(!confirm('Valider toutes les fiches en brouillon ? Elles deviendront visibles par les employés.'))return;
    verif(await sb.from('rh_paies').update({statut:'valide'}).eq('espace_id',E()).eq('periode',per).eq('statut','brouillon'));toast("Fiches validées : elles sont visibles dans l'espace de chaque employé.");rhSalaires()};
  if($('#s-exp'))$('#s-exp').onclick=()=>rhCsv(`paie-${per}-${CTX.espace.slug}.csv`,[[tr('Matricule'),tr('Employé'),tr('Salaire de base'),tr('Primes'),tr('Heures sup.'),tr('Retenues'),tr('Avances'),tr('Cotisations'),tr('Net à payer'),tr('Mode de paiement'),tr('N° Mobile Money ou IBAN'),tr('Statut')],
    ...pa.map(x=>{const e=rhEmp(x.employe_id);return[e?.matricule,rhNom(e),x.salaire_base,x.primes,x.heures_sup,x.retenues,x.avances,x.cotisations,x.net,x.mode_paiement||e?.mode_paiement,e?.numero_paiement,tr(RH_PS[x.statut][0])]})]);
  document.querySelectorAll('[data-mod]').forEach(b=>b.onclick=()=>{const x=pa.find(y=>y.id===b.dataset.mod);
    modale(`<h3>Fiche de paie</h3><p style="color:var(--mut);margin:2px 0">${esc(rhNom(rhEmp(x.employe_id)))} · ${esc(rhMoisLabel(per))}</p><div class="grille2">
     ${[['salaire_base','Salaire de base'],['primes','Primes'],['heures_sup','Heures sup.'],['retenues','Retenues'],['avances','Avances'],['cotisations','Cotisations']].map(([k,t])=>`<div><label>${t}</label><input type="number" min="0" step="any" name="${k}" value="${x[k]}"></div>`).join('')}</div>
     <label>Note</label><input name="note" value="${esc(x.note||'')}"><label>Statut</label><select name="statut">${rhOpts([['brouillon','Brouillon'],['valide','Validée']],x.statut)}</select>`,
    async f=>{const v=Object.fromEntries(new FormData(f));const row={note:v.note||null,statut:v.statut};for(const k of['salaire_base','primes','heures_sup','retenues','avances','cotisations'])row[k]=+v[k]||0;
      verif(await sb.from('rh_paies').update(row).eq('id',x.id));toast('Enregistré ✓');rhSalaires()})});
  document.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>{const x=pa.find(y=>y.id===b.dataset.pay);const e=rhEmp(x.employe_id);
    modale(`<h3>Marquer payée</h3><p style="color:var(--mut)">${esc(rhNom(e))} · <b>${fmt(x.net)}</b></p><label>Mode de paiement</label><select name="m">${rhOpts(RH_PAIE_MODES,x.mode_paiement||e?.mode_paiement||'Virement')}</select><label>Date de paiement</label><input type="date" name="d" value="${rhAuj()}">`,
    async f=>{verif(await sb.from('rh_paies').update({statut:'paye',mode_paiement:f.m.value,paye_le:f.d.value||rhAuj()}).eq('id',x.id));toast('Paie marquée comme payée');rhSalaires()})});
  document.querySelectorAll('[data-bul]').forEach(b=>b.onclick=()=>{const x=pa.find(y=>y.id===b.dataset.bul);rhBulletin(x,rhEmp(x.employe_id))});
}
function rhBulletin(x,e){const brut=(+x.salaire_base)+(+x.primes)+(+x.heures_sup);
  const li=(t,v,neg)=>`<tr><td>${esc(t)}</td><td class="r">${neg&&+v?'− ':''}${fmt(v)}</td></tr>`;
  rhPapier(L('Bulletin de paie','Payslip'),`<h1>${esc(L('BULLETIN DE PAIE','PAYSLIP'))} — ${esc(rhMoisLabel(x.periode).toUpperCase())}</h1>
   <table style="margin-bottom:18px"><tr><th>${esc(L('Employé','Employee'))}</th><td>${esc(rhNom(e))}</td><th>${esc(L('Matricule','Staff ID'))}</th><td>${esc(e?.matricule||'')}</td></tr>
    <tr><th>${esc(L('Poste','Job title'))}</th><td>${esc(e?.poste||'')}</td><th>${esc(L('Service','Department'))}</th><td>${esc(e?.departement||'')}</td></tr>
    <tr><th>${esc(L("Date d'embauche",'Hire date'))}</th><td>${rhDj(e?.date_embauche)}</td><th>${esc(L('N° sécurité sociale','Social security no.'))}</th><td>${esc(e?.num_securite_sociale||'')}</td></tr></table>
   <table><tr><th>${esc(L('Rubrique','Item'))}</th><th class="r">${esc(L('Montant','Amount'))}</th></tr>
    ${li(L('Salaire de base','Base salary'),x.salaire_base)}${li(L('Primes et indemnités','Bonuses & allowances'),x.primes)}${li(L('Heures supplémentaires','Overtime'),x.heures_sup)}
    <tr><th>${esc(L('Salaire brut','Gross salary'))}</th><th class="r">${fmt(brut)}</th></tr>
    ${li(L('Cotisations sociales salariales','Employee social contributions'),x.cotisations,1)}${li(L('Retenues (absences, autres)','Deductions (absences, other)'),x.retenues,1)}${li(L('Avances sur salaire','Salary advances'),x.avances,1)}
    <tr><th style="font-size:12.5pt">${esc(L('NET À PAYER','NET PAY'))}</th><th class="r" style="font-size:12.5pt">${fmt(x.net)}</th></tr></table>
   <p style="font-size:10.5pt;margin-top:14px">${esc(L('Mode de paiement','Payment method'))} : ${esc(tr(x.mode_paiement||e?.mode_paiement||'—'))}${x.paye_le?` · ${esc(L('payé le','paid on'))} ${rhDl(x.paye_le)}`:''}${x.note?`<br>${esc(x.note)}`:''}</p>
   <div class="sig"><span>${esc(L("Signature de l'employeur","Employer's signature"))}</span><span>${esc(L("Signature de l'employé","Employee's signature"))}</span></div>`)}

/* ---------- Courriers officiels : documents + demandes d'explication (séparés) ---------- */
let RH_DTAB='docs';
const RH_DT={attestation:['Attestation de travail','ATT'],certificat:['Certificat de travail','CERT'],contrat:['Contrat de travail','CTR'],avenant:['Avenant au contrat','AVN'],
  avertissement:['Avertissement','AVT'],convocation:['Convocation à un entretien','CONV'],note:['Note de service','NS'],autre:['Autre document','DOC']};
const RH_XS={a_repondre:['À répondre','orange'],repondu:['Répondu',''],clos:['Clos','gris']};
async function rhCourriers(){
  const emps=await rhEmps();const ro=rhRO();
  const docs=verif(await sb.from('rh_documents').select('*').eq('espace_id',E()).order('created_at',{ascending:false}));
  const exps=verif(await sb.from('rh_explications').select('*').eq('espace_id',E()).order('created_at',{ascending:false}));
  C().innerHTML=entete('Courriers officiels',ro?'':(RH_DTAB==='docs'?`<button class="btn" id="d-new">+ Nouveau document</button>`:`<button class="btn" id="x-new">+ Demande d'explication</button>`))
   +rhChips('d-t',[['docs','Documents officiels'],['exp',"Demandes d'explication"]],RH_DTAB)+`<div class="carte tab-scroll" id="d-zone"></div>`;
  const z=$('#d-zone');
  if(RH_DTAB==='docs'){z.innerHTML=docs.length?`<table><tr><th>N°</th><th>Type</th><th>Employé</th><th class="rh-hide-m">Date</th><th class="rh-hide-m">Visible par l'employé</th><th></th></tr>${docs.map(d=>`<tr><td><b>${esc(d.numero)}</b></td><td>${tr(RH_DT[d.type][0])}</td>
     <td>${d.employe_id?esc(rhNom(rhEmp(d.employe_id))):tr('Tout le personnel')}</td><td class="rh-hide-m">${rhDj(d.created_at)}</td><td class="rh-hide-m">${d.visible_employe?tr('Oui'):tr('Non')}</td>
     <td style="white-space:nowrap"><button class="btn pt sec" data-imp="${d.id}">Imprimer</button>${ro?'':` <button class="btn pt lien" data-sup="${d.id}">Supprimer</button>`}</td></tr>`).join('')}</table>`:'<div class="vide">Aucun document</div>';
    document.querySelectorAll('[data-imp]').forEach(b=>b.onclick=()=>rhImprimerDoc(docs.find(d=>d.id===b.dataset.imp)));
    document.querySelectorAll('[data-sup]').forEach(b=>b.onclick=async()=>{if(!confirm('Supprimer ce document ?'))return;verif(await sb.from('rh_documents').delete().eq('id',b.dataset.sup));rhCourriers()});
    if(!ro)$('#d-new').onclick=()=>rhFormDocument({},docs);
  }else{z.innerHTML=exps.length?`<table><tr><th>N°</th><th>Employé</th><th>Date des faits</th><th>Statut</th><th></th></tr>${exps.map(x=>`<tr><td><b>${esc(x.numero)}</b></td><td>${rhCellE(rhEmp(x.employe_id))}</td><td>${rhDj(x.date_faits)}</td>
     <td>${rhTag(tr(RH_XS[x.statut][0]),RH_XS[x.statut][1])}</td><td><button class="btn pt sec" data-vx="${x.id}">${tr('Voir')}</button></td></tr>`).join('')}</table>`:"<div class=\"vide\">Aucune demande d'explication</div>";
    document.querySelectorAll('[data-vx]').forEach(b=>b.onclick=()=>rhVoirExplication(exps.find(x=>x.id===b.dataset.vx)));
    if(!ro)$('#x-new').onclick=()=>rhFormExplication(null,exps);
  }
  document.querySelectorAll('#d-t [data-chip]').forEach(b=>b.onclick=()=>{RH_DTAB=b.dataset.chip;rhCourriers()});
}
function rhModele(type,e){const es=CTX.espace,sign=CTX.membre.nom_complet,n=rhNom(e),auj=rhDl(rhAuj());const en=LANG==='en';
  const M={
   attestation:en?`I, the undersigned, ${sign}, acting on behalf of ${es.nom}, hereby certify that ${n}, staff ID ${e?.matricule||''}, has been employed by our company since ${rhDl(e?.date_embauche)||'…'} as ${e?.poste||'…'}, under a ${e?.type_contrat||''} contract.\n\nThis certificate is issued at the request of the person concerned for all legal purposes.`
     :`Je soussigné(e), ${sign}, agissant pour le compte de ${es.nom}, atteste que ${n}, matricule ${e?.matricule||''}, est employé(e) au sein de notre entreprise depuis le ${rhDl(e?.date_embauche)||'…'} en qualité de ${e?.poste||'…'}, sous contrat ${e?.type_contrat||''}.\n\nLa présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.`,
   certificat:en?`I, the undersigned, ${sign}, acting on behalf of ${es.nom}, certify that ${n} was employed by our company from ${rhDl(e?.date_embauche)||'…'} to ${rhDl(e?.date_sortie)||auj} as ${e?.poste||'…'}.\n\n${n} leaves our company free of any commitment.\n\nThis certificate is issued for all legal purposes.`
     :`Je soussigné(e), ${sign}, agissant pour le compte de ${es.nom}, certifie que ${n} a été employé(e) au sein de notre entreprise du ${rhDl(e?.date_embauche)||'…'} au ${rhDl(e?.date_sortie)||auj} en qualité de ${e?.poste||'…'}.\n\n${n} nous quitte libre de tout engagement.\n\nLe présent certificat est délivré pour servir et valoir ce que de droit.`,
   avertissement:en?`Subject: Warning\n\nDear ${n},\n\nWe have noted the following facts: [describe the facts, date and time].\n\nThese facts are a breach of your professional obligations. We hereby give you a warning, which will be placed in your personnel file. We trust that such facts will not happen again; otherwise, further disciplinary action may be taken.`
     :`Objet : Avertissement\n\n${n},\n\nNous avons constaté les faits suivants : [décrire les faits, la date et l'heure].\n\nCes faits constituent un manquement à vos obligations professionnelles. Par la présente, nous vous notifions un avertissement qui sera versé à votre dossier. Nous comptons sur vous pour que de tels faits ne se reproduisent pas ; à défaut, d'autres mesures disciplinaires pourraient être prises.`,
   convocation:en?`Subject: Meeting notice\n\nDear ${n},\n\nYou are requested to attend a meeting on [date] at [time] at [place] regarding [subject].\n\nYou may be accompanied by a person of your choice from the company.`
     :`Objet : Convocation à un entretien\n\n${n},\n\nNous vous prions de vous présenter le [date] à [heure] à [lieu] pour un entretien concernant [objet].\n\nVous pouvez vous faire assister par une personne de votre choix appartenant au personnel de l'entreprise.`,
   note:en?`Subject: [subject]\n\nTo all staff,\n\n[Message]\n\nThank you for your cooperation.`:`Objet : [objet]\n\nÀ l'attention de l'ensemble du personnel,\n\n[Message]\n\nNous vous remercions de votre collaboration.`,
   contrat:en?`Between ${es.nom}, represented by ${sign}, hereinafter "the Employer",\nand ${n}, hereinafter "the Employee",\n\nArticle 1 – Position: ${e?.poste||'…'}\nArticle 2 – Start date: ${rhDl(e?.date_embauche)||'…'}\nArticle 3 – Type of contract: ${e?.type_contrat||''}\nArticle 4 – Salary: ${fmt(e?.salaire_base)} per month\nArticle 5 – Working hours: […]\nArticle 6 – Leave: ${e?.jours_conges_an??24} days per year`
     :`Entre ${es.nom}, représentée par ${sign}, ci-après « l'Employeur »,\net ${n}, ci-après « le Salarié »,\n\nArticle 1 – Poste : ${e?.poste||'…'}\nArticle 2 – Date de prise de fonction : ${rhDl(e?.date_embauche)||'…'}\nArticle 3 – Type de contrat : ${e?.type_contrat||''}\nArticle 4 – Rémunération : ${fmt(e?.salaire_base)} par mois\nArticle 5 – Horaires de travail : […]\nArticle 6 – Congés : ${e?.jours_conges_an??24} jours par an`,
   avenant:en?`Amendment to the employment contract of ${n}\n\nThe parties agree to amend the employment contract as follows, effective [date]:\n\n[Changes]\n\nAll other clauses of the contract remain unchanged.`:`Avenant au contrat de travail de ${n}\n\nLes parties conviennent de modifier le contrat de travail comme suit, à compter du [date] :\n\n[Modifications]\n\nToutes les autres clauses du contrat restent inchangées.`,
   autre:''};return M[type]??''}
async function rhFormDocument(pre={},docs=null){
  const emps=(await rhEmps()).filter(e=>e.statut==='actif'||e.id===pre.employe_id);
  if(!docs)docs=verif(await sb.from('rh_documents').select('type,created_at').eq('espace_id',E()));
  modale(`<h3>Nouveau document</h3><label>Type</label><select name="type" id="df-t">${Object.entries(RH_DT).map(([k,v])=>`<option value="${k}" ${k===(pre.type||'attestation')?'selected':''}>${k==='note'?tr('Note de service (tout le personnel)'):tr(v[0])}</option>`).join('')}</select>
   <div id="df-ez"><label>Employé</label><select name="employe_id" id="df-e">${emps.map(e=>`<option value="${e.id}" ${e.id===pre.employe_id?'selected':''}>${esc(rhNom(e))}</option>`).join('')}</select></div>
   <label>Titre</label><input name="titre" id="df-ti" required><label>Contenu (modifiable)</label><textarea name="contenu" id="df-c" rows="11" required></textarea>
   <label style="display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" name="visible" checked style="width:auto"> <span>Rendre visible dans l'espace de l'employé</span></label>`,
  async f=>{const v=Object.fromEntries(new FormData(f));const an=new Date().getFullYear();const pf=RH_DT[v.type][1];
    const n=docs.filter(d=>d.type===v.type&&String(d.created_at).startsWith(an)).length+1;
    const row={espace_id:E(),employe_id:v.type==='note'?null:v.employe_id,type:v.type,numero:`${pf}-${an}-${String(n).padStart(3,'0')}`,titre:v.titre,contenu:v.contenu,visible_employe:!!v.visible,created_by:CTX.membre.id};
    if(row.type!=='note'&&!row.employe_id)throw new Error(tr('Aucun employé actif'));
    const d=verif(await sb.from('rh_documents').insert(row).select().single());toast('Document enregistré');RH_DTAB='docs';
    if(VUE==='rh_courriers')rhCourriers();setTimeout(()=>rhImprimerDoc(d),300)});
  rhModaleLarge();
  const maj=()=>{const t=$('#df-t').value;$('#df-ez').classList.toggle('cache',t==='note');const e=rhEmp($('#df-e').value);
    $('#df-ti').value=tr(RH_DT[t][0])+(t!=='note'&&e?' — '+rhNom(e):'');$('#df-c').value=rhModele(t,e)};
  $('#df-t').onchange=maj;$('#df-e').onchange=maj;maj();
  if(pre.contenu)$('#df-c').value=pre.contenu;
}
function rhImprimerDoc(d){const e=d.employe_id?rhEmp(d.employe_id):null;const es=CTX.espace;
  rhPapier(d.titre,`<p style="text-align:right;font-size:10.5pt">${esc(L('Réf.','Ref.'))} ${esc(d.numero)}<br>${esc(es.pays||'')}${es.pays?', ':''}${esc(L('le','on'))} ${rhDl(d.created_at)}</p>
   ${e?`<p style="text-align:right"><b>${esc(rhNom(e))}</b><br>${esc(e.poste||'')}${e.matricule?' · '+esc(e.matricule):''}</p>`:''}
   <h1>${esc(tr(RH_DT[d.type][0]).toUpperCase())}</h1>${rhParas(d.contenu)}
   <div class="sig"><span></span><span>${esc(CTX.membre.nom_complet)}<br><small>${esc(L('Pour la direction','For management'))}</small></span></div>`)}
async function rhFormExplication(empId,exps=null){
  const emps=(await rhEmps()).filter(e=>e.statut==='actif');if(!emps.length){toast(tr('Aucun employé actif'));return}
  if(!exps)exps=verif(await sb.from('rh_explications').select('created_at').eq('espace_id',E()));
  modale(`<h3>Demande d'explication</h3><label>Employé</label><select name="e">${emps.map(e=>`<option value="${e.id}" ${e.id===empId?'selected':''}>${esc(rhNom(e))}</option>`).join('')}</select>
   <label>Date des faits</label><input type="date" name="d" value="${rhAuj()}" max="${rhAuj()}" required>
   <label>Faits constatés</label><textarea name="f" rows="5" required></textarea>
   <label>Délai de réponse</label><select name="h"><option value="24">24 heures</option><option value="48">48 heures</option><option value="72" selected>72 heures</option><option value="120">5 jours</option></select>`,
  async f=>{const v=Object.fromEntries(new FormData(f));const an=new Date().getFullYear();const n=exps.filter(x=>String(x.created_at).startsWith(an)).length+1;
    verif(await sb.from('rh_explications').insert({espace_id:E(),employe_id:v.e,numero:`DEX-${an}-${String(n).padStart(3,'0')}`,date_faits:v.d,faits:v.f,delai_heures:+v.h,created_by:CTX.membre.id}));
    toast("Demande envoyée à l'employé");RH_DTAB='exp';aller('rh_courriers')});
}
function rhExplicationPapier(x){const e=rhEmp(x.employe_id);const lim=new Date(new Date(x.created_at).getTime()+x.delai_heures*36e5);
  rhPapier(x.numero,`<p style="text-align:right;font-size:10.5pt">${esc(L('Réf.','Ref.'))} ${esc(x.numero)} · ${rhDl(x.created_at)}</p><p style="text-align:right"><b>${esc(rhNom(e))}</b><br>${esc(e?.poste||'')}</p>
   <h1>${esc(L("DEMANDE D'EXPLICATION",'REQUEST FOR EXPLANATION'))}</h1>
   <p>${esc(L(`Le ${rhDl(x.date_faits)}, les faits suivants ont été constatés :`,`On ${rhDl(x.date_faits)}, the following facts were observed:`))}</p><div style="border-left:3px solid #d0d5dd;padding-left:12px">${rhParas(x.faits)}</div>
   <p>${esc(L(`Nous vous demandons de fournir vos explications écrites au plus tard le ${lim.toLocaleString(LOC(),{dateStyle:'long',timeStyle:'short'})}.`,`Please provide your written explanation no later than ${lim.toLocaleString(LOC(),{dateStyle:'long',timeStyle:'short'})}.`))}</p>
   ${x.reponse?`<h3 style="margin-top:24px">${esc(L("Réponse de l'employé",'Employee reply'))} — ${rhDl(x.repondu_le)}</h3>${rhParas(x.reponse)}`:''}
   ${x.decision?`<h3>${esc(L('Décision','Decision'))}</h3>${rhParas(x.decision)}`:''}
   <div class="sig"><span>${esc(L("L'employé","The employee"))}</span><span>${esc(L('La direction','Management'))}</span></div>`)}
function rhVoirExplication(x){const e=rhEmp(x.employe_id);const ro=rhRO();
  $('#modale-zone').innerHTML=`<div class="voile"><form class="modale large"><h3>${esc(x.numero)} — ${esc(rhNom(e))}</h3><div style="margin:6px 0 12px">${rhTag(tr(RH_XS[x.statut][0]),RH_XS[x.statut][1])}</div>
   <label>Faits constatés</label><div class="rh-texte">${esc(x.faits)}</div><small style="color:var(--mut)">${rhDj(x.date_faits)}</small>
   <label>Réponse de l'employé</label><div class="rh-texte">${x.reponse?esc(x.reponse):tr('Pas encore de réponse.')}</div>
   <label>Décision / suite donnée</label><textarea name="dec" rows="3" ${x.statut==='clos'||ro?'readonly':''}>${esc(x.decision||'')}</textarea>
   <div class="err" id="m-err"></div>
   <div class="actions" style="flex-wrap:wrap"><button type="button" class="btn sec" onclick="fermer()">Fermer</button><button type="button" class="btn sec" id="xv-imp">Imprimer</button>
    ${!ro&&x.statut==='repondu'?`<button type="button" class="btn sec" id="xv-avt">Notifier un avertissement</button>`:''}${!ro&&x.statut!=='clos'?`<button class="btn" id="xv-clo">Clore le dossier</button>`:''}</div></form></div>`;
  $('#xv-imp').onclick=()=>rhExplicationPapier(x);
  if($('#xv-avt'))$('#xv-avt').onclick=()=>rhFormDocument({type:'avertissement',employe_id:x.employe_id});
  $('#modale-zone form').onsubmit=async ev=>{ev.preventDefault();try{verif(await sb.from('rh_explications').update({statut:'clos',decision:ev.target.dec.value||null}).eq('id',x.id));fermer();toast('Dossier clos');aller(VUE)}catch(er){$('#m-err').textContent=erreurMsg(er)}};
}

/* ---------- Candidatures spontanées ---------- */
const RH_CS={nouvelle:['Nouvelle','orange'],entretien:['Entretien',''],retenue:['Retenue',''],refusee:['Refusée','gris']};
function rhLienCandidature(){return location.origin+location.pathname.replace(/[^/]*$/,'')+'candidature.html?e='+CTX.espace.slug}
async function rhCandidatures(){
  const ca=verif(await sb.from('rh_candidatures').select('*').eq('espace_id',E()).order('created_at',{ascending:false}));const ro=rhRO();const lien=rhLienCandidature();
  C().innerHTML=entete('Candidatures')+`<div class="carte" style="margin-bottom:14px"><div style="font-size:14px;margin-bottom:8px">Lien de candidature spontanée de votre entreprise :</div>
   <div class="rh-lien"><b>${esc(lien)}</b></div><div class="rh-actions" style="justify-content:flex-start;margin-top:10px"><button class="btn pt sec" id="ca-cp">Copier</button><a class="btn pt sec" target="_blank" href="${esc(lien)}">Ouvrir</a>
   <a class="btn pt" target="_blank" href="https://wa.me/?text=${encodeURIComponent(L(`${CTX.espace.nom} recrute ! Déposez votre candidature ici : `,`${CTX.espace.nom} is hiring! Apply here: `)+lien)}">Partager sur WhatsApp</a></div></div>
   <div class="carte tab-scroll">${ca.length?`<table><tr><th>Candidat</th><th>Poste visé</th><th class="rh-hide-m">Contact</th><th class="rh-hide-m">Date</th><th>Statut</th><th></th></tr>${ca.map(c=>`<tr><td><b>${esc(c.nom)}</b>${c.message?`<br><small style="color:var(--mut)">${esc(c.message.slice(0,140))}${c.message.length>140?'…':''}</small>`:''}</td>
    <td>${esc(c.poste_vise||'—')}</td><td class="rh-hide-m">${c.telephone?`<a href="https://wa.me/${esc(c.telephone.replace(/\D/g,''))}" target="_blank">${esc(c.telephone)}</a><br>`:''}${esc(c.email||'')}</td><td class="rh-hide-m">${rhDj(c.created_at)}</td>
    <td>${ro?rhTag(tr(RH_CS[c.statut][0]),RH_CS[c.statut][1]):`<select data-st="${c.id}" style="padding:6px 8px;min-width:120px">${rhOpts(Object.entries(RH_CS).map(([k,v])=>[k,v[0]]),c.statut)}</select>`}</td>
    <td style="white-space:nowrap">${c.cv_chemin?`<button class="btn pt sec" data-cv="${esc(c.cv_chemin)}">CV</button> `:''}${!ro&&c.statut!=='refusee'?`<button class="btn pt" data-emb="${c.id}">Embaucher</button>`:''}</td></tr>`).join('')}</table>`:'<div class="vide">Aucune candidature pour le moment. Partagez votre lien !</div>'}</div>`;
  $('#ca-cp').onclick=()=>{navigator.clipboard?.writeText(lien);toast('Lien copié')};
  document.querySelectorAll('[data-st]').forEach(s=>s.onchange=async()=>{verif(await sb.from('rh_candidatures').update({statut:s.value}).eq('id',s.dataset.st));toast('Enregistré ✓')});
  document.querySelectorAll('[data-cv]').forEach(b=>b.onclick=async()=>{const w=window.open('','_blank');const{data,error}=await sb.storage.from('rh-cv').createSignedUrl(b.dataset.cv,600);
    if(error){w&&w.close();toast(erreurMsg(error));return}if(w)w.location=data.signedUrl;else location.href=data.signedUrl});
  document.querySelectorAll('[data-emb]').forEach(b=>b.onclick=()=>{const c=ca.find(x=>x.id===b.dataset.emb);const p=c.nom.trim().split(/\s+/);
    toast('Candidature retenue : complétez la fiche de l\'employé.');rhFormEmploye({},{prenom:p[0],nom:p.slice(1).join(' ')||p[0],poste:c.poste_vise,email:c.email,telephone:c.telephone,date_embauche:rhAuj(),_cand:c.id})});
}

/* ---------- Signalements (côté dirigeant) ---------- */
async function rhSignalements(){
  await rhEmps();const sg=verif(await sb.from('rh_signalements').select('*').eq('espace_id',E()).order('created_at',{ascending:false}));const ro=rhRO();
  C().innerHTML=entete('Signalements')+`<div class="carte tab-scroll">${sg.length?`<table><tr><th>Employé</th><th>Catégorie</th><th>Sujet</th><th class="rh-hide-m">Date</th><th>Statut</th><th></th></tr>${sg.map(s=>`<tr><td>${rhCellE(rhEmp(s.employe_id))}</td><td>${tr(RH_CAT[s.categorie]||s.categorie)}</td>
   <td><b>${esc(s.sujet)}</b><br><small style="color:var(--mut)">${esc(s.message.slice(0,160))}</small></td><td class="rh-hide-m">${rhDj(s.created_at)}</td><td>${s.statut==='ouvert'?rhTag('Ouvert','orange'):rhTag('Traité')}</td>
   <td><button class="btn pt sec" data-rs="${s.id}">${ro||s.statut!=='ouvert'?tr('Voir'):tr('Répondre')}</button></td></tr>`).join('')}</table>`:'<div class="vide">Aucun signalement</div>'}</div>`;
  document.querySelectorAll('[data-rs]').forEach(b=>b.onclick=()=>rhRepondreSignalement(sg.find(s=>s.id===b.dataset.rs)));
}
const RH_CAT={conditions:'Conditions de travail',paie:'Paie',securite:'Matériel / sécurité',relations:'Relations de travail',autre:'Autre'};
function rhRepondreSignalement(s){const e=rhEmp(s.employe_id);
  modale(`<h3>${esc(s.sujet)}</h3><p style="color:var(--mut);margin:2px 0 8px">${esc(rhNom(e))} · ${rhDj(s.created_at)}</p><div class="rh-texte">${esc(s.message)}</div>
   <label>Votre réponse</label><textarea name="r" rows="4" ${rhRO()?'readonly':''}>${esc(s.reponse||'')}</textarea>`,
  async f=>{if(rhRO())return;verif(await sb.from('rh_signalements').update({reponse:f.r.value||null,statut:'traite',repondu_le:new Date().toISOString()}).eq('id',s.id));toast('Réponse envoyée');aller(VUE)});
  $('#m-ok').textContent=tr('Marquer comme traité')}

/* ======================================================================
   ESPACE EMPLOYÉ
   ====================================================================== */
async function rhMaFiche(){return verif(await sb.from('rh_employes').select('*').eq('espace_id',E()).eq('membre_id',CTX.membre.id).maybeSingle())}
function rhSansFiche(t){C().innerHTML=entete(t)+`<div class="carte">Votre fiche employé n'est pas encore liée à votre compte. Contactez votre responsable RH.</div>`}
async function rhMoi(){
  C().innerHTML=entete('Bonjour '+esc(CTX.membre.nom_complet.split(' ')[0])+' 👋')+'<div class="vide">Chargement…</div>';
  const e=await rhMaFiche();if(!e)return rhSansFiche('Bonjour '+esc(CTX.membre.nom_complet.split(' ')[0])+' 👋');
  RH_EMPS=[e];RH_EMPS_E=null;
  const p=verif(await sb.from('rh_pointages').select('*').eq('employe_id',e.id).eq('jour',rhAuj()).maybeSingle());
  const cg=verif(await sb.from('rh_conges').select('*').eq('employe_id',e.id));
  const xs=verif(await sb.from('rh_explications').select('id').eq('employe_id',e.id).eq('statut','a_repondre'));const ro=rhRO();
  C().innerHTML=entete('Bonjour '+esc(e.prenom)+' 👋')+`
   ${xs.length?`<div class="rh-bandeau rap"><span><b>${xs.length}</b> <span>Demandes d'explication à répondre</span></span><button class="btn pt" onclick="aller('rh_mes_docs')">Répondre</button></div>`:''}
   <div class="deux">
    <div class="carte"><h3 style="margin-top:0">Pointage du jour</h3><div class="rh-info"><span>Arrivée</span><b>${rhHm(p?.arrivee)}</b><span>Départ</span><b>${rhHm(p?.depart)}</b></div>
     ${ro?'':p?.depart?`<div class="vide" style="padding:14px">Journée terminée ✓</div>`:`<div class="rh-pointer">${!p?.arrivee?`<button class="btn" data-pt="arrivee" style="grid-column:1/-1">Pointer mon arrivée</button>`:`<button class="btn sec" data-pt="depart" style="grid-column:1/-1">Pointer mon départ</button>`}</div>`}</div>
    <div class="carte"><h3 style="margin-top:0">Solde de congés</h3>${rhSoldeHTML(rhSolde(e,cg))}${ro?'':`<button class="btn sec" style="width:100%;margin-top:12px" onclick="aller('rh_mes_conges')">+ Demander un congé</button>`}</div>
    <div class="carte"><div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">${rhAv(e,56)}<div><h3 style="margin:0">${esc(rhNom(e))}</h3><small style="color:var(--mut)">${esc(e.poste||'')}</small></div></div>
     <div class="rh-info"><span>Matricule</span><b>${esc(e.matricule||'')}</b><span>Service</span><b>${esc(e.departement||'—')}</b><span>Contrat</span><b>${esc(e.type_contrat||'')}</b><span>Date d'embauche</span><b>${rhDj(e.date_embauche)}</b></div>
     <button class="btn sec" style="margin-top:12px" id="mo-bdg">Voir mon badge</button></div>
   </div>`;
  document.querySelectorAll('[data-pt]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{verif(await sb.rpc('rh_pointer',{p_espace:E(),p_sens:b.dataset.pt}));toast('Enregistré ✓');rhMoi()}catch(er){toast(erreurMsg(er));b.disabled=false}});
  $('#mo-bdg').onclick=()=>rhBadges([e]);
}
async function rhMesConges(){
  const e=await rhMaFiche();if(!e)return rhSansFiche('Mes congés');const ro=rhRO();
  const cg=verif(await sb.from('rh_conges').select('*').eq('employe_id',e.id).order('date_debut',{ascending:false}));
  C().innerHTML=entete('Mes congés',ro?'':`<button class="btn" id="mc-new">+ Demander un congé</button>`)+`<div class="carte" style="margin-bottom:14px">${rhSoldeHTML(rhSolde(e,cg))}</div>
   <div class="carte tab-scroll">${cg.length?`<table><tr><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th><th></th></tr>${cg.map(c=>`<tr><td>${tr(RH_TC[c.type])}</td><td>${rhDj(c.date_debut)}</td><td>${rhDj(c.date_fin)}</td><td>${c.nb_jours}</td>
    <td>${rhTag(tr(RH_SC[c.statut][0]),RH_SC[c.statut][1])}${c.reponse?`<br><small style="color:var(--mut)">${esc(c.reponse)}</small>`:''}</td><td>${!ro&&c.statut==='en_attente'?`<button class="btn pt lien" data-an="${c.id}">Annuler la demande</button>`:''}</td></tr>`).join('')}</table>`:'<div class="vide">Aucun congé</div>'}</div>`;
  document.querySelectorAll('[data-an]').forEach(b=>b.onclick=async()=>{verif(await sb.rpc('rh_annuler_ma_demande',{p_conge:b.dataset.an}));rhMesConges()});
  if(!ro)$('#mc-new').onclick=()=>modale(`<h3>Demander un congé</h3><label>Type</label><select name="t">${Object.entries(RH_TC).filter(([k])=>k!=='absence').map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
   <div class="grille2"><div><label>Date de début</label><input type="date" name="d" required min="${rhAuj()}"></div><div><label>Date de fin</label><input type="date" name="f" required min="${rhAuj()}"></div></div><label>Motif (facultatif)</label><input name="m">`,
   async f=>{const v=Object.fromEntries(new FormData(f));if(v.f<v.d)throw new Error(L('La date de fin doit être après la date de début','End date must be after start date'));
     verif(await sb.rpc('rh_demander_conge',{p_espace:E(),p_type:v.t,p_debut:v.d,p_fin:v.f,p_motif:v.m||null}));toast('Demande envoyée ✓');rhMesConges()});
}
async function rhMesDocs(){
  const e=await rhMaFiche();if(!e)return rhSansFiche('Mes documents');RH_EMPS=[e];RH_EMPS_E=null;const ro=rhRO();
  const xs=verif(await sb.from('rh_explications').select('*').eq('employe_id',e.id).order('created_at',{ascending:false}));
  const pa=verif(await sb.from('rh_paies').select('*').eq('employe_id',e.id).order('periode',{ascending:false}));
  const docs=verif(await sb.from('rh_documents').select('*').eq('espace_id',E()).order('created_at',{ascending:false}));
  C().innerHTML=entete('Mes documents')+`
   <div class="carte" style="margin-bottom:14px"><h3 style="margin-top:0">Demandes d'explication</h3><div class="rh-liste">${xs.length?xs.map(x=>`<div><span><b>${esc(x.numero)}</b> · ${rhDj(x.date_faits)}</span>
     <span class="rh-actions">${rhTag(tr(RH_XS[x.statut][0]),RH_XS[x.statut][1])}<button class="btn pt ${x.statut==='a_repondre'&&!ro?'':'sec'}" data-x="${x.id}">${x.statut==='a_repondre'&&!ro?tr('Répondre'):tr('Voir')}</button></span></div>`).join(''):"<div class=\"vide\">Aucune demande d'explication</div>"}</div></div>
   <div class="carte" style="margin-bottom:14px"><h3 style="margin-top:0">Fiches de paie</h3><div class="rh-liste">${pa.length?pa.map(x=>`<div><span><b>${esc(rhMoisLabel(x.periode))}</b> · ${fmt(x.net)}</span><span class="rh-actions">${rhTag(tr(RH_PS[x.statut][0]),RH_PS[x.statut][1])}<button class="btn pt sec" data-b="${x.id}">Bulletin</button></span></div>`).join(''):'<div class="vide">Aucune fiche de paie</div>'}</div></div>
   <div class="carte"><h3 style="margin-top:0">Documents</h3><div class="rh-liste">${docs.length?docs.map(d=>`<div><span><b>${esc(d.titre)}</b><br><small>${esc(d.numero)} · ${rhDj(d.created_at)}</small></span><button class="btn pt sec" data-d="${d.id}">Lire</button></div>`).join(''):'<div class="vide">Aucun document</div>'}</div></div>`;
  document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>rhBulletin(pa.find(x=>x.id===b.dataset.b),e));
  document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>rhImprimerDoc(docs.find(x=>x.id===b.dataset.d)));
  document.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{const x=xs.find(y=>y.id===b.dataset.x);const lim=new Date(new Date(x.created_at).getTime()+x.delai_heures*36e5);
    if(x.statut!=='a_repondre'||ro){rhExplicationPapier(x);return}
    modale(`<h3>Répondre à la demande</h3><p style="color:var(--mut);margin:2px 0 8px">${esc(x.numero)} · ${esc(L('Réponse attendue avant le','Reply expected by'))} ${lim.toLocaleString(LOC(),{dateStyle:'medium',timeStyle:'short'})}</p>
     <label>Faits constatés</label><div class="rh-texte">${esc(x.faits)}</div><label>Vos explications</label><textarea name="r" rows="6" required minlength="5"></textarea>`,
    async f=>{verif(await sb.rpc('rh_repondre_explication',{p_id:x.id,p_reponse:f.r.value}));toast('Réponse envoyée ✓');rhMesDocs()});$('#m-ok').textContent=tr('Envoyer ma réponse')});
}
async function rhSignaler(){
  const e=await rhMaFiche();if(!e)return rhSansFiche('Signaler');const ro=rhRO();
  const sg=verif(await sb.from('rh_signalements').select('*').eq('employe_id',e.id).order('created_at',{ascending:false}));
  C().innerHTML=entete('Signaler un problème')+`<div class="deux">${ro?'':`<form class="carte" id="sg-f"><p style="color:var(--mut);margin-top:0;font-size:14px">Votre message est transmis à la direction / aux RH.</p>
    <label>Catégorie</label><select name="c">${rhOpts(Object.entries(RH_CAT),'autre')}</select><label>Sujet</label><input name="s" maxlength="150" required><label>Message</label><textarea name="m" rows="5" required></textarea>
    <div class="err" id="sg-err"></div><button class="btn" style="width:100%">Envoyer</button></form>`}
    <div class="carte"><h3 style="margin-top:0">Mes signalements</h3><div class="rh-liste">${sg.length?sg.map(s=>`<div style="display:block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(s.sujet)}</b>${s.statut==='ouvert'?rhTag('Ouvert','orange'):rhTag('Traité')}</div>
     <small>${rhDj(s.created_at)}</small>${s.reponse?`<div class="rh-texte" style="margin-top:6px"><b>${tr('Réponse :')}</b> ${esc(s.reponse)}</div>`:''}</div>`).join(''):'<div class="vide">Aucun signalement</div>'}</div></div></div>`;
  if(!ro)$('#sg-f').onsubmit=async ev=>{ev.preventDefault();const f=ev.target;try{verif(await sb.rpc('rh_signaler',{p_espace:E(),p_categorie:f.c.value,p_sujet:f.s.value,p_message:f.m.value}));toast('Signalement envoyé ✓');rhSignaler()}catch(er){$('#sg-err').textContent=erreurMsg(er)}};
}

/* ---------- Table des vues ---------- */
window.RH_VUES={rh_accueil:rhAccueil,rh_employes:rhEmployes,rh_conges:rhConges,rh_pointage:rhPointage,rh_salaires:rhSalaires,rh_courriers:rhCourriers,
  rh_candidatures:rhCandidatures,rh_signalements:rhSignalements,rh_moi:rhMoi,rh_mes_conges:rhMesConges,rh_mes_docs:rhMesDocs,rh_signaler:rhSignaler};
