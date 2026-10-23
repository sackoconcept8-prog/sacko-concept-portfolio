# SACKO CONCEPT — Branding & marketing immobilier

Page commerciale HTML/CSS/JavaScript en français, compatible GitHub Pages. Aucun outil de compilation ni abonnement n’est nécessaire pour consulter la démonstration.

## Ouvrir la page

1. Décompresser le ZIP.
2. Ouvrir `APERÇU.html` dans un navigateur pour une version autonome avec images et code intégrés.
3. Pour modifier le projet, travailler sur `index.html`, `style.css`, `script.js`, `config.js` et `assets/`.
4. Pour servir les fichiers localement : `python -m http.server 8000`, puis ouvrir `http://localhost:8000`.

La version autonome est une photographie de la version livrée. Après des modifications, utiliser le projet normal ou relancer `python build_preview.py` pour la régénérer.

## Ce qui fonctionne immédiatement

- Navigation, menu mobile, FAQ et détails de chaque pack.
- Dix aperçus HTML/CSS, galerie filtrable et agrandissements.
- Cinq vues illustratives des outils administratifs : planning, tâches, dépenses, commissions, activité.
- Comparatif avec mise en évidence d’une offre.
- Sélection du pack, récapitulatif, calcul du prix et de l’acompte quand ils sont renseignés.
- Demande de devis par email : ouvre le logiciel de messagerie du visiteur ; ne prétend pas envoyer un email automatiquement.
- Brief en six étapes : validation, palettes, aperçu de couleurs, préférences selon le pack, références de fichiers et résumé.
- Export texte du brief en mode démonstration. Aucun envoi réseau des réponses ; les pièces jointes ne sont pas exportées, seuls leurs noms sont listés.
- Bouton WhatsApp avec icône lorsque le lien réel est renseigné.

Le projet n’inclut pas les futurs livrables commerciaux Excel/Word/PowerPoint des packs. Les tableaux et documents présentés sont des aperçus de prestations.

## Paramètres à renseigner — config.js

- `packs.essentiel.price`, `packs.business.price`, `packs.ultimate.price` : nombres positifs ou `null`. Aucune conversion automatique entre devises.
- `currency` : code ISO, par exemple `XOF`, `EUR`, `USD`.
- `depositPercent` : pourcentage compris strictement entre 0 et 100, ou `null`.
- `paymentUrl` et `depositUrl` par pack : liens HTTPS de paiement effectivement créés auprès de votre prestataire. Chaque lien doit correspondre exactement au pack, à la devise, au montant et à l’acompte affichés.
- `email`, `website`, `whatsapp` : coordonnées réelles. Exemple de format WhatsApp : `https://wa.me/NUMERO_INTERNATIONAL_SANS_PLUS`. Le bouton reste masqué si le lien manque.
- `terms` : délais, corrections, nombre de propositions et conditions de livraison convenus. Tant qu’ils ne sont pas fixés, la page renvoie au devis sans inventer d’engagement.
- `legal` : URLs HTTPS des documents finalisés. Les fenêtres actuellement affichées sont des notices de préparation et une information exacte sur le fonctionnement de la démonstration, pas des CGV prêtes à vendre.

Le logo officiel SACKO CONCEPT, doré avec une flèche rouge, est intégré dans l’en-tête, le pied de page et l’icône du navigateur. La transparence de votre fichier original est conservée.

## Déployer sur GitHub Pages

1. Ajouter au dépôt `index.html`, `style.css`, `script.js`, `config.js` et le dossier `assets/`, à la racine ou dans un sous-dossier choisi.
2. Dans les réglages Pages du dépôt, sélectionner la branche et le dossier contenant `index.html`.
3. Conserver les noms et les chemins relatifs. Le projet fonctionne sous un sous-chemin.
4. Vérifier l’adresse finale et les liens de contact sur ordinateur et smartphone.

La page est publiée dans le dossier `branding-immobilier/` du dépôt `sackoconcept8-prog/sacko-concept-portfolio`. Il n’y a pas de clé API ni de secret dans les fichiers.

## Activer les paiements et le formulaire en production

La partie statique est terminée. Le service serveur, le compte de paiement, le stockage et les notifications ne sont pas provisionnés. **Le mode livré est `demo`.** Un simple retour vers votre page ne valide jamais une commande.

Étapes d’activation :

1. Finaliser prix, devis, délais, corrections et documents de confidentialité/vente.
2. Créer les liens de paiement et d’acompte auprès du prestataire de votre choix ; mettre les URLs et montants cohérents dans `config.js`.
3. Mettre en place un backend HTTPS séparé de GitHub Pages. Il doit recevoir les événements de paiement du prestataire, vérifier leur signature avec un secret serveur et confirmer le statut réel, le montant, la devise, le pack et l’absence de remboursement avant de donner accès au brief.
4. Après vérification, le serveur émet un lien avec un jeton opaque, aléatoire, limité dans le temps et lié à la commande : `https://VOTRE_PAGE/#brief_token=JETON`. Le jeton est placé dans le fragment pour éviter sa transmission au serveur statique ; le JavaScript le retire immédiatement de l’adresse. Ne pas ajouter de scripts tiers sur cette page.
5. Implémenter les deux endpoints ci-dessous. Le frontend refuse les commandes non vérifiées ; le backend doit appliquer les mêmes règles indépendamment du frontend.
6. Renseigner `api.verifyOrder`, `api.submitBrief`, puis passer `mode` à `production` uniquement après les tests d’intégration.

### Vérification — `api.verifyOrder`

Requête `POST` JSON :

```json
{"token":"jeton reçu dans le lien sécurisé"}
```

Réponse HTTP 200 après vérification réelle côté serveur :

```json
{"paid":true,"pack":"business","reference":"REFERENCE_REELLE","briefToken":"JETON_COURTE_DUREE"}
```

`pack` vaut `essentiel`, `business` ou `ultimate`. `paid:true` peut autoriser un acompte effectivement encaissé et accepté pour démarrer selon le devis. Le serveur décide, jamais un paramètre de redirection. Jeton expiré, inconnu ou commande impayée : réponse 401/403 sans jeton de brief. Pas de données personnelles dans les journaux. Prévoir la révocation et une nouvelle émission sécurisée de lien si nécessaire.

### Réception — `api.submitBrief`

Requête `POST multipart/form-data` :

- En-tête `Authorization: Bearer JETON_COURTE_DUREE`.
- En-tête `Idempotency-Key: REFERENCE_REELLE` pour les nouvelles tentatives.
- Champ texte `brief` : objet JSON contenant les réponses, le pack et les consentements.
- Champs répétés `attachments` : octets des pièces jointes.

Le serveur authentifie le jeton, recharge la commande, impose son pack et vérifie les droits et champs requis. Il applique également les limites de taille et de nombre de fichiers, les types réels (pas uniquement l’extension ou le MIME fourni par le navigateur), le contrôle des archives Office, le nettoyage ou le refus des SVG actifs, la détection de fichiers malveillants et les protections contre l’abus. Conserver les fichiers dans un espace privé, avec noms aléatoires, accès authentifié et durée de conservation définie. Ne pas les publier sous une URL publique ni les rendre directement dans une interface d’administration sans traitement adapté.

Enregistrer le brief et les fichiers de manière durable et atomique ; gérer les répétitions de la référence sans doublons ; placer une notification destinée à SACKO CONCEPT dans une file durable. Réponse HTTP 200/201 uniquement après cette prise en charge :

```json
{"received":true,"reference":"REFERENCE_REELLE"}
```

Le frontend confirme la réception uniquement sur cette réponse. Un échec laisse les données en mémoire pour permettre une nouvelle tentative. Un retour du prestataire de paiement ou une réussite d’export local ne produit jamais une confirmation de paiement ou de réception en ligne.

Pour un backend sur un domaine différent, CORS doit autoriser uniquement l’origine réelle de votre page et les méthodes/en-têtes utilisés, dont `Authorization`, `Content-Type` et `Idempotency-Key`. Gérer les requêtes OPTIONS. Clés de paiement, d’envoi d’email et de stockage exclusivement dans les secrets serveur. HTTPS obligatoire, limitation des tentatives et taille maximale du corps de requête adaptées aux 15 Mo de fichiers.

### Tests d’intégration avant vente

- Paiement refusé, en attente, annulé, remboursé : aucun accès indu.
- Paiement réel ou acompte accepté : accès uniquement au pack acheté.
- Jeton invalide/expiré et falsification du pack : refus serveur.
- Double clic et nouvelle tentative après interruption : une seule réception enregistrée.
- Pièces jointes valides, interdites, trop grandes et malveillantes : traitement conforme.
- Stockage privé, notification durable et retour de référence réelle.

Ces intégrations ne sont pas incluses ou simulées comme actives dans le ZIP. Les contrats d’API décrivent précisément le raccordement attendu pour votre développeur.

## Images et typographies

- `assets/hero.webp` : mise en situation AUREL générée pour cette page (outil de génération d’images intégré).
- `assets/property.webp` : propriété contemporaine fictive générée pour la galerie.
- La même propriété est volontairement utilisée dans les aperçus brochure, publication et flyer : cela illustre la cohérence d’une campagne sur plusieurs supports.
- AUREL n’est pas une référence client réelle. Les données des tableaux sont fictives.
- Manrope et Cormorant Garamond via Google Fonts, avec alternatives système si hors connexion. Pour supprimer toute requête externe, retirer la ligne `@import` de `style.css` ou héberger localement les polices sous leur licence.
- Les aperçus de supports sont créés en HTML/CSS ; ils ne sont pas des fichiers de marque prêts à imprimer.

Prompts employés pour les deux images : voir `assets/PROMPTS.md`.

## Vérification à la livraison

- Syntaxe JavaScript contrôlée avec Node.
- Rendu de la page et fonctionnement des principaux contrôles vérifiés dans un navigateur de bureau.
- Vérification du parcours de brief et des paramètres de palettes.
- Styles responsive prévus aux paliers 1100, 800 et 520 px ; vérification sur appareils physiques restant à effectuer avant lancement.
- Paiement, backend, réception des fichiers et notifications non testés en réel car non configurés.

## Arborescence

```
index.html
style.css
script.js
config.js
APERÇU.html
build_preview.py
README.md
assets/
  favicon.svg
  hero.webp
  property.webp
  PROMPTS.md
```
