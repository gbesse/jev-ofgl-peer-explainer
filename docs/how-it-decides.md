# Comment la décision est prise

Explique les écarts financiers d’une collectivité face à un groupe comparable calculé de façon déterministe.

Le code normalise la source et applique d’abord le cas déterministe documenté dans `src/index.mjs`. Pour les autres dossiers, Jev choisit la catégorie la plus prudente selon les écarts calculés, les postes documentés et les caractéristiques explicites du groupe comparable, sans attribuer de causalité non démontrée. Une confiance inférieure à `0.8`, la catégorie `review_required` ou une absence de données choisie par le modèle marque le résultat pour revue humaine. Une collection vide explicitement fournie reste un résultat déterministe sans appel Jev.

La sélection des pairs, les ratios, millésimes et calculs comptables restent déterministes.

Les démonstrations ne contiennent que des probabilités synthétiques. Constituez un corpus français annoté, mesurez les erreurs par catégorie et fixez vos propres seuils avant un usage opérationnel.
