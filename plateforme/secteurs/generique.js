/* Ilano — modèle « Autre secteur » (générique) et valeurs par défaut de tous les modèles.
   Chaque fichier de ce dossier décrit un secteur : vocabulaire, champs, modules, indicateurs, exemples. */
(window.ILANO_SECTEURS = window.ILANO_SECTEURS || {}).generique = {
  code: 'generique', nom: ['Mon activité', 'My business'], icone: '✨', gamme: 'standard',
  pages: ['co_accueil', 'co_agenda', 'co_clients', 'co_prestations', 'co_factures', 'co_depenses'],
  modules: { agenda: true, clients: true, prestations: true, factures: true, depenses: true, ressources: false, echeanciers: false, reservation: false },
  mots: {
    client: ['Client', 'Customer'], clients: ['Clients', 'Customers'],
    ressource: ['Ressource', 'Resource'], ressources: ['Ressources', 'Resources'],
    rdv: ['Rendez-vous', 'Appointment'], rdvs: ['Agenda', 'Calendar'],
    prestation: ['Prestation', 'Service'], prestations: ['Prestations et tarifs', 'Services & prices'],
    echeancier: ['Échéancier', 'Payment plan'], echeanciers: ['Échéanciers', 'Payment plans'],
    membre: ['Collaborateur', 'Team member'],
  },
  categoriesClient: [['client', 'Client', 'Customer']],
  champsClient: [],
  champsRessource: [],
  statutsRessource: [['disponible', 'Disponible', 'Available', ''], ['indisponible', 'Indisponible', 'Unavailable', 'gris']],
  agenda: { mode: 'creneau', duree: 60, membre: true, ressource: false },
  depenses: ['Loyer', 'Salaires', 'Électricité / eau', 'Internet / téléphone', 'Transport', 'Fournitures', 'Marketing', 'Impôts et taxes', 'Autre'],
  kpis: (r, o) => [
    [o.L('Encaissé ce mois', 'Collected this month'), o.fmt(r.encaisse_mois), o.L('Aujourd’hui : ', 'Today: ') + o.fmt(r.encaisse_jour), true],
    [o.L('Facturé ce mois', 'Invoiced this month'), o.fmt(r.ca_mois)],
    [o.L('Reste à encaisser', 'Outstanding'), o.fmt(r.impayes), r.nb_retard ? o.L(r.nb_retard + ' en retard', r.nb_retard + ' overdue') : ''],
    [o.L('Rendez-vous cette semaine', 'Appointments this week'), r.rdv_semaine, o.L('Aujourd’hui : ', 'Today: ') + r.rdv_jour],
  ],
  premiers: [
    ['co_prestations', ['Ajoutez vos prestations et vos prix', 'Add your services and prices']],
    ['co_clients', ['Ajoutez ou importez vos clients', 'Add or import your customers']],
    ['co_factures', ['Créez votre premier devis ou votre première facture', 'Create your first quote or invoice']],
  ],
  exemples: {
    prestations: [['Prestation standard', 15000, 60], ['Prestation premium', 35000, 120], ['Déplacement', 5000, 30]],
    clients: [['Awa Traoré', '+229 97 00 00 01'], ['Koffi Mensah', '+228 90 00 00 02']],
  },
};
