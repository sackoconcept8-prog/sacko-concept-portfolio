/* Ilano — modèle Clinique : cliniques, cabinets médicaux, centres de santé */
(window.ILANO_SECTEURS = window.ILANO_SECTEURS || {}).clinique = {
  code: 'clinique', nom: ['Clinique', 'Clinic'], icone: '🩺', gamme: 'sante',
  pages: ['co_accueil', 'co_agenda', 'co_clients', 'co_prestations', 'co_factures', 'co_depenses'],
  modules: { agenda: true, clients: true, prestations: true, factures: true, depenses: true, ressources: false, echeanciers: false, reservation: true, stock: true },
  mots: {
    client: ['Patient', 'Patient'], clients: ['Patients', 'Patients'],
    ressource: ['Salle', 'Room'], ressources: ['Salles', 'Rooms'],
    rdv: ['Consultation', 'Consultation'], rdvs: ['Consultations', 'Consultations'],
    prestation: ['Acte', 'Procedure'], prestations: ['Actes et tarifs', 'Procedures & prices'],
    membre: ['Médecin / soignant', 'Doctor / carer'],
  },
  renommer: { articles: ['Pharmacie', 'Pharmacy'], caisse: ['Caisse pharmacie', 'Pharmacy checkout'] },
  categoriesClient: [['patient', 'Patient', 'Patient']],
  champsClient: [
    { k: 'date_naissance', l: ['Date de naissance', 'Date of birth'], t: 'date' },
    { k: 'sexe', l: ['Sexe', 'Sex'], t: 'select', o: [['', '—', '—'], ['F', 'Femme', 'Female'], ['M', 'Homme', 'Male']] },
    { k: 'groupe_sanguin', l: ['Groupe sanguin', 'Blood group'] },
    { k: 'allergies', l: ['Allergies', 'Allergies'], t: 'textarea', alerte: true },
    { k: 'antecedents', l: ['Antécédents', 'Medical history'], t: 'textarea' },
    { k: 'assurance', l: ['Assurance / mutuelle', 'Insurance'], liste: true },
    { k: 'taux_assurance', l: ['Prise en charge assurance (%)', 'Insurance coverage (%)'], t: 'number' },
  ],
  facture: { assurance: true },
  notesRdv: ['Notes de consultation (motif, examen, diagnostic, traitement)', 'Consultation notes (reason, exam, diagnosis, treatment)'],
  agenda: { mode: 'creneau', duree: 20, membre: true, ressource: false },
  depenses: ['Salaires', 'Médicaments / consommables', 'Laboratoire', 'Électricité / eau', 'Loyer', 'Entretien du matériel', 'Impôts et taxes', 'Autre'],
  kpis: (r, o) => [
    [o.L('Consultations aujourd’hui', 'Consultations today'), r.rdv_jour, r.rdv_demandes ? o.L(r.rdv_demandes + ' demande(s) en ligne', r.rdv_demandes + ' online request(s)') : o.L('Cette semaine : ', 'This week: ') + r.rdv_semaine, true],
    [o.L('Encaissé ce mois', 'Collected this month'), o.fmt(r.encaisse_mois), o.L('Aujourd’hui : ', 'Today: ') + o.fmt(r.encaisse_jour)],
    [o.L('Reste à payer (patients)', 'Outstanding (patients)'), o.fmt(r.impayes)],
    [o.L('Patients suivis', 'Patients'), r.nb_clients],
  ],
  premiers: [
    ['co_prestations', ['Ajoutez vos actes et leurs tarifs', 'Add your procedures and prices']],
    ['co_clients', ['Enregistrez vos patients', 'Register your patients']],
    ['articles', ['Ajoutez les médicaments de la pharmacie', 'Add your pharmacy stock']],
  ],
  exemples: {
    prestations: [['Consultation générale', 10000, 20], ['Consultation spécialisée', 20000, 30], ['Pansement', 3000, 15], ['Échographie', 15000, 30]],
  },
};
