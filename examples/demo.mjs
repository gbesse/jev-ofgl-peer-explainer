// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { assessLocalFinanceNarrative } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "exemple-1",
  "text": "Données synthétiques : l’investissement par habitant augmente tandis qu’une opération d’équipement identifiée apparaît dans les comptes de l’exercice.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-10-01"
  },
  "details": {
    "territoire": "France — cas synthétique",
    "origine": "donnée synthétique"
  }
};
const provider = createFakeProvider(() => ({
  "model": "jev-1.13.0",
  "answers": {
    "decision": {
      "type": "choice",
      "choice": "supported_explanation",
      "probabilities": {
        "supported_explanation": 0.82,
        "review_required": 0.06,
        "weak_explanation": 0.06,
        "no_peer": 0.06
      },
      "confidence": 0.82
    }
  },
  "usage": {
    "input_tokens": 120,
    "output_tokens": 0
  }
}));
const résultat = await assessLocalFinanceNarrative(dossier, provider);
assert.equal(résultat.decision, "supported_explanation");
assert.equal(résultat.review, false);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
