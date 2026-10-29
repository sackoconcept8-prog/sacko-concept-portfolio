# SACKO CONCEPT — Pages premium et affiliation

## Première page livrée : Pack Nettoyage

- FR : https://www.sackoconcept.com/produits/nettoyage/fr/
- EN : https://www.sackoconcept.com/produits/nettoyage/
- Paiement propriétaire actuellement configuré : https://shop.sackoconcept.com/prd_4u3c2pr3
- Les pages comprennent un explorateur de cas d'usage, 12 aperçus des véritables fichiers, la démo Excel, les FAQ et un accès rapide à l'offre sur mobile.

## Règle critique

Le paramètre `?partner=identifiant` ne constitue PAS un suivi de commission. Le site **ne calcule pas** les commissions.
Seule la plateforme d'affiliation peut confirmer l'attribution d'une vente.

À la date de mise en place, le produit Pack Nettoyage ne figure pas parmi les 8 offres d'affiliation Chariow actives du compte vérifié. **Aucun identifiant partenaire n'est activé sur cette page.** Le bouton Acheter reste le bouton normal de la boutique.

## Activation d'un partenaire Chariow (après décision commerciale)

1. Activer une véritable offre d'affiliation pour **ce produit précis** dans le compte Chariow, en fixant explicitement une commission acceptable.
2. Faire générer par l'affilié, dans Chariow > Mes liens, son **lien de paiement affilié officiel (Checkout)** du Pack Nettoyage. Ne pas prendre le lien non affilié de la boutique.
3. Récupérer ce lien, vérifier qu'il pointe vers le bon produit, que l'offre d'affiliation est active et que le lien a été généré pour cet affilié.
4. Dans `produits/affiliate-routing.js`, ajouter pour `nettoyage` une entrée du type `"partenaire-001": "https://chariow.ly/LIEN_OFFICIEL_REEL"`. Les liens ne sont acceptés que sur les hôtes HTTPS autorisés par le code.
5. Partager ensuite l'URL premium `https://www.sackoconcept.com/produits/nettoyage/fr/?partner=partenaire-001`. Sur ce parcours, le bouton d'achat ouvre le lien de paiement personnel renseigné. Le changement FR/EN conserve cet identifiant uniquement s'il est validé.
6. Tester avec la personne affiliée, en utilisant la procédure et les outils Chariow prévus à cet effet : vérifier le bon produit, le checkout, l'identification de l'affilié et l'attribution après une opération autorisée, avant toute diffusion massive.

Ne jamais ajouter un code de partenaire sans URL affiliée officielle correspondante. Ne jamais remplacer un lien affilié par un lien générique lors de son achat. Ne jamais générer de fausses preuves sociales ou de faux chiffres de ventes.

## Hotmart et 1TPE

Les parcours Hotmart et 1TPE demandent leur propre configuration officielle (Hotlinks et pages de vente autorisées, liens de commande et cookies d'affiliation). Ne PAS supposer qu'un paramètre maison `partner` agit à leur place. Tester chaque tunnel sur sa plateforme.

## Maintenance du contenu

- HTML FR / EN : `produits/nettoyage/fr/index.html` et `produits/nettoyage/index.html`
- Styles : `produits/nettoyage/cleaning.css`
- Interactions : `produits/nettoyage/cleaning.js`
- Routage de liens vérifiés : `produits/affiliate-routing.js`
- Galerie et fichiers existants : `pack-nettoyage/assets/previews/`

Les captures de fichiers montrent les véritables outils. Conserver le statut "illustration" sur les photos de mise en situation. Réviser le prix affiché si le prix Chariow change. Vérifier les pages sur mobile et les boutons d'achat après chaque modification.
