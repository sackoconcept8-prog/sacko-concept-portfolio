# SACKO CONCEPT — Pack Professionnel de Gestion

Mini-site statique en français, compatible avec GitHub Pages. HTML, CSS et JavaScript sans installation de dépendances ni compilation. Prix public : 119 USD.

## Ouvrir le site

Décompressez l’archive puis ouvrez `pack-nettoyage/index.html` dans un navigateur récent. Gardez tous les sous-dossiers ensemble. Les images sont incluses localement : aucune requête à une photothèque, police externe ou service de suivi n’est nécessaire.

## Configurer le paiement avant publication commerciale

Ouvrez `config.js`. Remplacez uniquement la chaîne vide de `chariowCheckoutUrl` par le lien HTTPS exact de la fiche/paiement Chariow correspondant à ce pack à 119 USD. Exemple de structure, sans URL fictive :

```js
window.SACKO_CONFIG = Object.freeze({
  chariowCheckoutUrl: ""
});
```

Conservez les guillemets et n’ajoutez aucune clé secrète. Rechargez ensuite le site : les deux boutons de commande doivent conduire à la vraie page Chariow. Vérifiez le nom du produit, le montant et les modalités de livraison sur cette page. Aucune donnée bancaire n’est demandée sur le mini-site.

Tant que la valeur reste vide ou invalide, les boutons ouvrent une fenêtre expliquant que le paiement sera bientôt disponible, avec un lien de contact. Ce comportement est volontaire. Aucun paiement réel ne peut être testé sans le lien.

## Publication à www.sackoconcept.com/pack-nettoyage/

1. Dans le dépôt GitHub qui publie déjà www.sackoconcept.com, ajoutez le dossier `pack-nettoyage` et son contenu à la racine de la source publiée (ou dans `docs/` si cette branche utilise `docs/`).
2. Vérifiez que `index.html`, `styles.css`, `config.js`, `script.js` et le dossier `assets` sont tous directement dans `pack-nettoyage/`. Évitez un double dossier `pack-nettoyage/pack-nettoyage/`.
3. Enregistrez les changements et laissez le déploiement GitHub Pages se terminer. Si le site utilise un workflow de compilation, assurez-vous qu’il copie ce dossier dans son résultat final.
4. Ouvrez https://www.sackoconcept.com/pack-nettoyage/ et vérifiez les images, la navigation, les filtres Word, le zoom, la FAQ et les deux liens de commande.
5. Vérifiez également l’affichage sur votre téléphone. Le code prévoit les petites tailles d’écran et la préférence de réduction des animations.

Ne modifiez pas le fichier CNAME existant du domaine principal. Ne remplacez pas la page d’accueil existante. Cette livraison ne publie pas automatiquement dans votre dépôt GitHub.

## Arborescence

- `index.html` : page et métadonnées SEO.
- `styles.css` : identité visuelle, responsive et accessibilité.
- `script.js` : menu mobile, filtres, modales et zoom de 100 à 400 %.
- `config.js` : lien Chariow, un seul emplacement à modifier.
- `assets/images/` : logo et photographies optimisées WebP.
- `assets/previews/excel/` : six aperçus réels.
- `assets/previews/word/` : quatre extraits réels.
- `SOURCES_VISUELLES.md` : provenance des photographies et aperçus.

## Remplacer ou enrichir les aperçus

Les six images Excel proviennent du dossier 08_APERCUS_VISUELS de l’archive fournie. Elles montrent les tableaux de bord de démonstration avec données fictives. Elles ont été converties en WebP sans modifier les valeurs ni la présentation.

Les quatre images Word sont des extraits recadrés des aperçus réellement fournis : DE01, RH01, OP08 et CA03. Le cadrage retire l’en-tête de l’entreprise de démonstration. Le site le précise. Aucun faux document n’a été créé pour simuler un aperçu. Aucun logo NOVA CLEAN BENIN n’est intégré au mini-site.

Pour remplacer un aperçu, gardez son nom de fichier et son emplacement. Pour ajouter une carte Word, reprenez une carte existante dans `index.html`, ajustez son titre, le texte alternatif, `data-preview`, `data-title` et `data-category` (`rh`, `operations` ou `admin`). Le filtre et la fenêtre de zoom fonctionneront automatiquement.

Le site contient uniquement les aperçus publics, pas les 77 fichiers Word ni les classeurs vendus. N’ajoutez pas l’archive du produit dans un dépôt public : la livraison des fichiers payants se configure dans Chariow.

## Points à finaliser

- Ajouter le vrai lien Chariow dans `config.js`.
- Vérifier que le produit Chariow livre bien le pack annoncé et sa version générale, avec les modalités commerciales appropriées.
- Les aperçus proviennent d’un pack adapté à une entreprise de démonstration ; la préparation des fichiers vendus sous une version générale reste distincte de ce mini-site.
- La personnalisation avancée est indiquée comme prestation complémentaire sur devis.
- Les modèles RH doivent être adaptés et validés localement lorsqu’ils concernent des obligations juridiques ou disciplinaires.

## Vérifications réalisées

Syntaxe JavaScript contrôlée ; ressources et liens internes vérifiés ; galerie Excel, zoom à 150 %, filtre RH (2 aperçus) et message de commande sans lien contrôlés dans le navigateur. Le paiement réel reste à vérifier après configuration. La publication sur le domaine n’a pas été effectuée.
