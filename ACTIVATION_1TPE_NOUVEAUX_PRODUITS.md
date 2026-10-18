# Deux nouvelles pages 1TPE — état au 18 octobre 2026

Pages de présentation créées à partir des archives effectivement inspectées :

- `/vente-ia-au-bureau-1tpe.html` : cinq PDF en français (manuel de 80 pages, recueil de 100 prompts de 53 pages, missions de 23 pages, checklists de 8 pages et fiche d’une page), plus LISEZ_MOI. Aperçu public : huit premières pages du manuel.
- `/vente-pack-rh-documents-1tpe.html` : édition anglaise V3, 33 modèles Word et Company_Profile, trois systèmes Excel en BLANK + DEMO, six PDF et une vidéo sous-titrée de 76 secondes. Aperçu public fourni dans le pack : 15 pages.

La fiche du Pack RH V3 est intégralement en anglais, y compris ses boutons, sa FAQ, ses conditions et sa carte dans le catalogue. Son visuel principal est celui fourni par la vendeuse (« Pack RH et documents administratifs-21.png »), optimisé en WebP sans recadrage. Les extraits réels restent présentés séparément.

Les archives payantes et leurs liens de livraison ne sont pas publiés dans ce dépôt public. Seuls les aperçus destinés au public sont intégrés.

## Informations commerciales encore manquantes

Les prix en dollars évoqués pour les autres boutiques ne constituent pas des prix TTC en euros pour 1TPE. Aucun numéro de produit 1TPE supplémentaire n’a été confirmé. Ne pas déduire p=5 ou p=6 des quatre anciens produits.

Le fichier `1tpe-new-products.json` garde donc les prix, taux et liens de paiement à `null`, et `deliveryConfigured` à `false`. Les deux pages restent consultables, sans fausse commande, sans montant inventé et avec `noindex,follow`. Le catalogue propose leurs fiches avec la mention « Prochainement ».

## Activation après création des fiches dans 1TPE

Pour chaque produit :

1. Enregistrer la bonne URL de page de vente dans la fiche 1TPE.
2. Relever le lien de commande fourni par 1TPE, le titre exact, le prix TTC en euros pour la France et le taux effectivement appliqué. Le classement et le taux ne sont pas déduits de l’extension du fichier.
3. Configurer la livraison dans le compte 1TPE : page d’accès comportant confirmation, support et accès au bon ZIP. Ne pas mettre les fichiers payants dans ce dépôt public. Vérifier les téléchargements via la simulation officielle et conserver une copie accessible au client au-delà de la fenêtre de 48 heures.
4. Reporter dans `1tpe-new-products.json` les valeurs confirmées `priceTtcEur`, `vatFrancePercent` et `checkoutUrl`, puis positionner `deliveryConfigured: true` uniquement après configuration et contrôle effectifs.
5. Exécuter `npm run build`. Le rendu génère le même prix TTC et les bons boutons dans le HTML statique, ajoute les conditions de livraison et active les liens du catalogue. Les liens de paiement s’ouvrent sur 1TPE avec `target="_top"`, hors iframe.
6. Vérifier les URL publiques, prix, boutons, titres de commande, aperçu et livraison. Les contrôles de code ne remplacent pas le test dans 1TPE.
7. Demander la validation seulement après ces vérifications. Le fait de publier une page de présentation ne constitue pas une validation par 1TPE.

## Informations produit conservées

- Pack RH : anglais, 500 lignes préparées par registre, pas de synchronisation ou de relances automatiques. Tests Microsoft Excel de bureau et impressions non exécutés dans la préparation du pack. Documents sensibles à adapter et faire revoir localement.
- Licence RH : une organisation ; support `contact@sackoconcept.com` pendant 30 jours calendaires ; première réponse de fond sous trois jours ouvrés en UTC, hors jour de réception. Aucune garantie de délai de résolution.
- Guide IA : lecture et usage professionnel des méthodes par l’acheteur, prompts adaptables à ses propres tâches, sans redistribution du pack. Aucun abonnement d’IA ni classeur Excel inclus. Assistance de commande : `sackoconcept8@gmail.com`.

## Références

- FAQ officielle 1TPE, vendeurs 20–24 : https://www.1tpe.com/faq.php
- Conditions 1TPE : https://www.1tpe.com/CGV.pdf

Les deux sources ont été consultées le 18 octobre 2026. Les éléments de prix, TVA et paiement ne doivent pas être remplacés par des hypothèses.
