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

Exemple d'un url avec une limite à 300 caractères : `https://demo.fr/calibre/?limite=300`

## Architecture et stockage

### Stockage localStorage
Les textes sont stockés dans le localStorage avec le format suivant :
```json
{
  "content": "Le contenu du texte",
  "limite": 150,
  "lastModified": 1234567890
}
```

Clé de stockage : `calibre_text_{token}`

### Migration automatique
L'application migre automatiquement les anciennes données (format `txt_{token}` et `limit_{token}`) vers le nouveau format unifié au démarrage.

### Source de vérité
- **Limite** : le localStorage est la source de vérité, avec fallback sur l'URL
- **Token** : géré centralement dans le composable `useTextStorage`
- **URL** : synchronisée avec le localStorage pour permettre le partage de liens

## Améliorations récentes (2025-01-15)
* Refonte du modèle de stockage avec un seul objet JSON par texte
* Centralisation de la gestion des tokens dans le composable
* Clarification de la source de vérité pour la limite de caractères
* Nettoyage de l'interface `StoredText` pour refléter les données réelles
* Encapsulation des manipulations d'URL dans `urlUtils`
* Migration automatique des anciennes données

## Améliorations possibles
* Ajout d'un mode "expert" pour afficher le nombre de mots



