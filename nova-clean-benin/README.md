# Présentation du projet NOVA CLEAN BENIN
Une page courte signée SACKO CONCEPT : introduction, galerie de 5 à 10 captures, démonstration vidéo et contact.

Les captures et la vidéo ne sont pas encore fournies. Aucun aperçu fictif n’est présenté comme réel.

## Ajouter les médias
Déposer les captures dans `assets/images/`. Dans `script.js`, renseigner les champs `src`, `title`, `format` et `caption` du tableau `captures`. Ajouter ou retirer des entrées pour conserver 5 à 10 images. Chaque image réelle pourra s’agrandir, avec zoom et fermeture par Échap. Les images sont affichées sans recadrage.

Pour la vidéo, créer `assets/video/`, y déposer le MP4 puis renseigner `presentationVideo.src`. Le lecteur propose lecture, volume et plein écran via les commandes natives du navigateur. Ajouter éventuellement une affiche dans `poster` et des sous-titres VTT français dans `captions`.

Le logo affiché est celui de SACKO CONCEPT. NOVA CLEAN BENIN est le destinataire du projet.

## Publication existante
URL : https://www.sackoconcept.com/nova-clean-benin/
Dépôt : https://github.com/sackoconcept8-prog/sacko-concept-portfolio
Le dossier `nova-clean-benin/` est copié dans `dist/` par `scripts/build.mjs`. Le workflow GitHub Pages publie les modifications de `main`.

La police est chargée depuis `../assets/manrope.woff2`, déjà fournie par le site parent. Sans elle, la page utilise Arial. Pour un hébergement indépendant, utiliser Arial ou embarquer la police autorisée.
