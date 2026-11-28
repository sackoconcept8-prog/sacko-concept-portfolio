/* Ilano — modèle École privée : écoles, collèges, lycées, centres de formation */
(window.ILANO_SECTEURS = window.ILANO_SECTEURS || {}).ecole = {
  code: 'ecole', nom: ['École privée', 'Private school'], icone: '🎓', gamme: 'standard',
  pages: ['co_accueil', 'co_clients', 'co_echeanciers', 'co_factures', 'co_prestations', 'co_agenda', 'co_depenses'],
  modules: { agenda: true, clients: true, prestations: true, factures: true, depenses: true, ressources: false, echeanciers: true, reservation: false },
  mots: {
    client: ['Élève', 'Student'], clients: ['Élèves', 'Students'],
    ressource: ['Salle', 'Room'], ressources: ['Salles', 'Rooms'],
    rdv: ['Rendez-vous', 'Meeting'], rdvs: ['Rendez-vous parents', 'Parent meetings'],
    prestation: ['Frais', 'Fee'], prestations: ['Frais de scolarité et services', 'Tuition & fees'],
    echeancier: ['Plan de paiement', 'Payment plan'], echeanciers: ['Frais par tranches', 'Fees by instalment'],
    facture: ['Avis de paiement', 'Payment notice'],
    membre: ['Enseignant / personnel', 'Teacher / staff'],
  },
  categoriesClient: [['eleve', 'Élève', 'Student']],
  champsClient: [
    { k: 'classe', l: ['Classe', 'Class'], liste: true, requis: true },
    { k: 'matricule', l: ['Matricule', 'Student ID'] },
    { k: 'date_naissance', l: ['Date de naissance', 'Date of birth'], t: 'date' },
    { k: 'parent_nom', l: ['Parent / tuteur', 'Parent / guardian'], liste: true },
    { k: 'parent_tel', l: ['Téléphone du parent', 'Parent’s phone'], t: 'tel' },
  ],
  telContact: 'parent_tel',
  echeancier: { mode: 'tranches', tranches: 3, libelle: ['Frais de scolarité', 'Tuition fees'], groupe: 'classe' },
  agenda: { mode: 'creneau', duree: 30, membre: true, ressource: false },
  depenses: ['Salaires', 'Fournitures scolaires', 'Électricité / eau', 'Loyer', 'Entretien', 'Transport scolaire', 'Cantine', 'Impôts et taxes', 'Autre'],
  kpis: (r, o) => [
    [o.L('Élèves à jour de paiement', 'Students up to date'), r.nb_clients ? Math.round(100 * r.clients_a_jour / r.nb_clients) + ' %' : '—', o.L(r.clients_a_jour + ' / ' + r.nb_clients + ' élèves', r.clients_a_jour + ' / ' + r.nb_clients + ' students'), true],
    [o.L('Encaissé ce mois', 'Collected this month'), o.fmt(r.encaisse_mois), o.L('Aujourd’hui : ', 'Today: ') + o.fmt(r.encaisse_jour)],
    [o.L('Impayés échus', 'Overdue fees'), o.fmt(r.en_retard), o.L(r.nb_retard + ' avis en retard', r.nb_retard + ' overdue notices')],
    [o.L('Tranches à venir', 'Upcoming instalments'), o.fmt(r.a_venir)],
  ],
  premiers: [
    ['co_clients', ['Ajoutez ou importez vos élèves (avec leur classe)', 'Add or import your students (with their class)']],
    ['co_echeanciers', ['Créez les frais de scolarité par tranches pour une classe', 'Create tuition instalments for a class']],
    ['co_factures', ['Encaissez et remettez les reçus', 'Collect payments and hand out receipts']],
  ],
  exemples: {
    clients: [['Aminata Koné', '', { classe: 'CM2', parent_nom: 'Mme Koné', parent_tel: '+223 70 00 00 01' }], ['Ibrahim Diallo', '', { classe: '6e', parent_nom: 'M. Diallo', parent_tel: '+223 70 00 00 02' }]],
    prestations: [['Frais d’inscription', 25000, 0], ['Scolarité annuelle', 150000, 0], ['Cantine (mois)', 10000, 0]],
  },
};
