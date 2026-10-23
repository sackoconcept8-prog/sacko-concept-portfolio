/* Réglages publics seulement. Aucun secret ne doit être ajouté ici. */
window.SACKO_CONFIG = {
  brand: 'SACKO CONCEPT', email: 'contact@sackoconcept.com',
  website: 'https://www.sackoconcept.com', whatsapp: 'https://wa.me/15054642331',
  currency: 'XOF', depositPercent: null,
  // Laisser « demo » jusqu'à la mise en service du backend et des paiements.
  mode: 'demo',
  api: { verifyOrder: '', submitBrief: '' },
  terms: { timeline: '', revisions: '', logoConcepts: '', delivery: '' },
  packs: {
    essentiel: { price: null, paymentUrl: '', depositUrl: '' },
    business: { price: null, paymentUrl: '', depositUrl: '' },
    ultimate: { price: null, paymentUrl: '', depositUrl: '' }
  },
  // URLs de vos documents juridiques validés. Vide = information de préparation.
  legal: { mentions: '', privacy: '', terms: '', delivery: '' }
};
