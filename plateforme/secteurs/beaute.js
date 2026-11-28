/* Ilano — modèle Salon de beauté : coiffure, instituts, onglerie, spa */
(window.ILANO_SECTEURS = window.ILANO_SECTEURS || {}).beaute = {
  code: 'beaute', nom: ['Salon de beauté', 'Beauty salon'], icone: '💇🏾‍♀️', gamme: 'standard',
  pages: ['co_accueil', 'co_agenda', 'co_clients', 'co_prestations', 'co_factures', 'co_depenses'],
  modules: { agenda: true, clients: true, prestations: true, factures: true, depenses: true, ressources: false, echeanciers: false, reservation: true },
  mots: {
    client: ['Cliente', 'Client'], clients: ['Clientes', 'Clients'],
    ressource: ['Poste', 'Station'], ressources: ['Postes', 'Stations'],
    rdv: ['Rendez-vous', 'Appointment'], rdvs: ['Rendez-vous', 'Appointments'],
    prestation: ['Prestation', 'Service'], prestations: ['Prestations et tarifs', 'Services & prices'],
    facture: ['Ticket', 'Ticket'],
    membre: ['Employée', 'Stylist'],
  },
  categoriesClient: [['client', 'Cliente', 'Client']],
  champsClient: [
    { k: 'anniversaire', l: ['Anniversaire', 'Birthday'], t: 'date' },
    { k: 'preferences', l: ['Préférences (produits, coiffeuse…)', 'Preferences (products, stylist…)'], t: 'textarea' },
  ],
  fidelite: true,
  agenda: { mode: 'creneau', duree: 60, membre: true, ressource: false },
  depenses: ['Produits / mèches', 'Salaires et commissions', 'Loyer', 'Électricité / eau', 'Matériel', 'Publicité', 'Autre'],
  kpis: (r, o) => [
    [o.L('Rendez-vous aujourd’hui', 'Appointments today'), r.rdv_jour, r.rdv_demandes ? o.L(r.rdv_demandes + ' demande(s) en ligne', r.rdv_demandes + ' online request(s)') : o.L('Cette semaine : ', 'This week: ') + r.rdv_semaine, true],
    [o.L('Encaissé aujourd’hui', 'Collected today'), o.fmt(r.encaisse_jour)],
    [o.L('Encaissé ce mois', 'Collected this month'), o.fmt(r.encaisse_mois)],
    [o.L('Clientes', 'Clients'), r.nb_clients],
  ],
  premiers: [
    ['co_prestations', ['Ajoutez vos prestations, prix et durées', 'Add your services, prices and durations']],
    ['co_modules', ['Partagez votre lien de rendez-vous en ligne', 'Share your online booking link']],
    ['equipe', ['Ajoutez vos employées pour leur assigner des rendez-vous', 'Add your staff to assign appointments']],
  ],
  exemples: { prestations: [['Tresses (simples)', 8000, 180], ['Brushing', 5000, 45], ['Manucure', 4000, 45], ['Soin du visage', 10000, 60]] },
};
