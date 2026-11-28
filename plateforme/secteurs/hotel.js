/* Ilano — modèle Hôtellerie : hôtels, résidences, auberges */
(window.ILANO_SECTEURS = window.ILANO_SECTEURS || {}).hotel = {
  code: 'hotel', nom: ['Hôtellerie', 'Hospitality'], icone: '🏨', gamme: 'standard',
  pages: ['co_accueil', 'co_agenda', 'co_ressources', 'co_clients', 'co_prestations', 'co_factures', 'co_depenses'],
  modules: { agenda: true, clients: true, prestations: true, factures: true, depenses: true, ressources: true, echeanciers: false, reservation: true },
  mots: {
    client: ['Client de l’hôtel', 'Hotel guest'], clients: ['Clients de l’hôtel', 'Hotel guests'],
    ressource: ['Chambre', 'Room'], ressources: ['Chambres', 'Rooms'],
    rdv: ['Réservation', 'Booking'], rdvs: ['Réservations', 'Bookings'],
    prestation: ['Service', 'Extra'], prestations: ['Services et extras', 'Services & extras'],
    membre: ['Collaborateur', 'Team member'],
  },
  categoriesClient: [['client', 'Client', 'Guest'], ['entreprise', 'Entreprise', 'Company']],
  champsClient: [
    { k: 'piece', l: ['Pièce d’identité (n°)', 'ID document (no.)'] },
    { k: 'nationalite', l: ['Nationalité', 'Nationality'] },
    { k: 'provenance', l: ['Provenance', 'Coming from'] },
  ],
  champsRessource: [
    { k: 'prix_haute', l: ['Prix haute saison / nuit', 'High-season price / night'], t: 'number' },
    { k: 'etage', l: ['Étage', 'Floor'] },
    { k: 'equipements', l: ['Équipements (clim, TV, balcon…)', 'Amenities (A/C, TV, balcony…)'] },
  ],
  typeRessource: 'chambre', categoriesRessource: ['Simple', 'Double', 'Twin', 'Suite', 'Appartement'],
  statutsRessource: [['propre', 'Propre', 'Clean', ''], ['a_nettoyer', 'À nettoyer', 'To clean', 'orange'], ['maintenance', 'En maintenance', 'Maintenance', 'rouge']],
  libPrixRessource: ['Prix par nuit', 'Price per night'],
  agenda: { mode: 'sejour', ressource: true, membre: false },
  reglagesDefaut: { haute_saison: [7, 8, 12] },
  depenses: ['Salaires', 'Électricité / eau', 'Blanchisserie', 'Produits d’accueil', 'Restaurant / bar', 'Entretien / réparations', 'Commissions (Booking…)', 'Impôts et taxes', 'Autre'],
  kpis: (r, o) => [
    [o.L('Taux d’occupation', 'Occupancy rate'), r.nb_ressources ? Math.round(100 * r.ressources_occupees / r.nb_ressources) + ' %' : '—', o.L(r.ressources_occupees + ' / ' + r.nb_ressources + ' chambres occupées', r.ressources_occupees + ' / ' + r.nb_ressources + ' rooms occupied'), true],
    [o.L('Encaissé ce mois', 'Collected this month'), o.fmt(r.encaisse_mois), o.L('Aujourd’hui : ', 'Today: ') + o.fmt(r.encaisse_jour)],
    [o.L('Chambres à nettoyer', 'Rooms to clean'), (r.ressources_statut || {}).a_nettoyer || 0],
    [o.L('Arrivées / séjours du jour', 'Today’s stays'), r.rdv_jour, r.rdv_demandes ? o.L(r.rdv_demandes + ' demande(s) en ligne', r.rdv_demandes + ' online request(s)') : ''],
  ],
  premiers: [
    ['co_ressources', ['Ajoutez vos chambres et leurs prix', 'Add your rooms and prices']],
    ['co_agenda', ['Enregistrez vos réservations', 'Record your bookings']],
    ['co_modules', ['Partagez votre lien de réservation en ligne', 'Share your online booking link']],
  ],
  exemples: {
    ressources: [['Chambre 101', 'Simple', 25000], ['Chambre 102', 'Double', 35000], ['Chambre 201', 'Suite', 60000]],
    prestations: [['Petit-déjeuner', 3000, 0], ['Navette aéroport', 10000, 0], ['Blanchisserie (pièce)', 1000, 0]],
  },
};
