# Calibré

CC0 - Pôle digital ISAGRI 2025 / sdegliame[at]isagri.fr

Ce petit utilitaire permet une saisie calibrée de texte afin de servir dans un flux de travail de type webmastering où la quantité de texte est limitée pour des raison de mise en page et/ou de SEO.

## Technos utilisées
* Vue 3 + TypeScript + Vite
* PrimeVue
* TailwindCSS


## Mise en oeuvre
Après le build (`npm run build`) le contenu du dossier `dist` peut être déployé sur un serveur web.

## Paramètres d'url
* `limite=xxx` pour modifier la limite de caractères par défaut (150)

Un paramètre `id` est automatiquement ajouté dès la saise de texte à l'url lors de la sauvegarde du texte dans le localStorage afin de permettre de récupérer le texte sauvegardé.

## Améliorations possibles
* [ ] Afficher le nombre de mots
* [x] Ajout du mode Markdown 2025-10-17

