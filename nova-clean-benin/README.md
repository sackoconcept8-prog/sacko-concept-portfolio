# NOVA CLEAN BENIN — Mini-site vitrine

Proposition commerciale conçue par SACKO CONCEPT. Site statique autonome, sans dépendance ni suivi publicitaire.

## Ouvrir le site
Ouvrir `index.html` dans un navigateur récent. Les filtres et fenêtres modales fonctionnent sans serveur. Les boutons de contact ouvrent le logiciel de messagerie configuré sur l’appareil.

## Contenu livré
- `index.html` : page française et structure des 11 sections.
- `style.css` : présentation responsive et styles accessibles.
- `script.js` : catalogue, filtres, menu mobile et aperçu avec zoom pour les futures captures.
- `assets/logo/nova-clean-benin.png` : logo fourni, conservé intégralement.
- `assets/excel/`, `assets/word/`, `assets/images/` : emplacements des visuels.

## État des aperçus
Seuls le cahier des charges et le logo ont été fournis. Aucun Excel, Word, capture réelle ni image du modèle visuel validé n’est inclus dans les pièces jointes de cette réalisation. Les 6 outils Excel et 15 documents Word sont donc présentés comme un périmètre proposé, avec la mention « Aperçu en préparation ». Les cartes et illustrations de formats ne sont pas des captures de fichiers. Les fonctionnalités définitives restent à confirmer. Le site n’inclut pas les fichiers métier eux-mêmes.

## Ajouter les vraies captures
1. Exporter des captures lisibles depuis les modèles de démonstration en masquant toute donnée personnelle réelle. Utiliser des données fictives et les identifier dans la capture.
2. Enregistrer les images dans `assets/excel/` ou `assets/word/`, avec des noms simples sans espaces.
3. Dans le tableau `previews` au début de `script.js`, remplacer `image: ""` de chaque élément par le chemin relatif, par exemple `assets/excel/suivi-personnel.png`.
4. Dans `index.html`, remplacer l’emplacement `.placeholder` de la carte correspondante par une image avec un texte alternatif descriptif, par exemple `<img src="assets/excel/suivi-personnel.png" alt="Suivi du personnel — données fictives de démonstration" loading="lazy">`.
5. Actualiser la notice générale dès que les captures sont intégrées. Le zoom devient disponible automatiquement dans les modales disposant d’une image. Vérifier les fonctions décrites contre les fichiers réels et ajuster les mentions de proposition après validation.

## Publication sur GitHub Pages
Le site est prêt pour un hébergement statique. Aucune publication n’a été effectuée dans cette livraison.

### Dans un sous-dossier de www.sackoconcept.com
1. Ouvrir le dépôt GitHub qui héberge le domaine `www.sackoconcept.com`.
2. Dans le dossier effectivement publié par GitHub Pages (racine, `docs/` ou sortie de workflow), créer `nova-clean-benin/`.
3. Y copier `index.html`, `style.css`, `script.js` et `assets/` en conservant leur arborescence. Ne pas modifier le fichier `CNAME` du site existant.
4. Valider les modifications sur la branche de publication configurée. Si le dépôt utilise GitHub Actions, s’assurer que ce dossier est inclus dans la sortie publiée.
5. Attendre la réussite du déploiement Pages. La page sera accessible à `https://www.sackoconcept.com/nova-clean-benin/` si le domaine et ce dépôt sont déjà correctement configurés.
6. Vérifier les images, les filtres, le menu mobile et les liens de contact sur le site publié.

### Sur un dépôt indépendant
Déposer le contenu à la racine d’un nouveau dépôt. Dans Settings > Pages, choisir la branche et le dossier qui contiennent `index.html`. GitHub fournira l’URL du site. Aucun nouveau domaine n’est requis.

Tous les chemins d’assets sont relatifs pour prendre en charge les sous-dossiers. Le site ne possède aucun formulaire serveur ni envoi automatique d’e-mail.

## Identité et contact
Destinataire commercial : NOVA CLEAN BENIN. Concepteur et destinataire des demandes : `contact@sackoconcept.com`. Aucun numéro client n’est utilisé comme contact de SACKO CONCEPT.
