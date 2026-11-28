/* Ilano — Commerce (StockPro) et Services / RH (RH Pro) : modules existants, inchangés.
   Le socle (clients, factures, agenda, dépenses) peut y être activé depuis « Modules ». */
(window.ILANO_SECTEURS = window.ILANO_SECTEURS || {}).commerce = {
  code: 'commerce', nom: ['Commerce', 'Retail'], icone: '🛍️', gamme: 'standard', existant: 'stockpro',
  pages: ['co_factures', 'co_agenda', 'co_depenses'],
  modules: { factures: false, agenda: false, depenses: false, clients: false, prestations: false },
};
window.ILANO_SECTEURS.rh = {
  code: 'rh', nom: ['Services / RH', 'Services / HR'], icone: '👥', gamme: 'standard', existant: 'rhpro',
  pages: ['co_clients', 'co_factures', 'co_agenda', 'co_depenses', 'co_prestations'],
  modules: { factures: false, agenda: false, depenses: false, clients: false, prestations: false },
};
