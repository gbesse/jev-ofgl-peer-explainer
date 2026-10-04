// Objectif : produire un rapport hors ligne comparant les trois chemins de décision.
import assert from "node:assert/strict";
import { assessLocalFinanceNarrative } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const principal = {
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
const limite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-10-01"
  },
  "peers": []
};
const revue = {
  "id": "revue-1",
  "text": "Un ratio d’endettement diffère de la médiane, mais le périmètre consolidé et les caractéristiques du groupe comparable ne sont pas fournis.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-10-01"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const réponses = [{
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
}, {
  "model": "jev-1.13.0",
  "answers": {
    "decision": {
      "type": "choice",
      "choice": "review_required",
      "probabilities": {
        "supported_explanation": 0.1267,
        "review_required": 0.62,
        "weak_explanation": 0.1267,
        "no_peer": 0.1267
      },
      "confidence": 0.62
    }
  },
  "usage": {
    "input_tokens": 140,
    "output_tokens": 0
  }
}];
const provider = createFakeProvider(() => réponses.shift());
const résultats = [];
for (const [scénario, dossier] of [["principal", principal], ["limite déterministe", limite], ["revue humaine", revue]]) {
  const résultat = await assessLocalFinanceNarrative(dossier, provider);
  résultats.push({ scénario, décision: résultat.label, revueHumaine: résultat.review, déterministe: résultat.deterministic });
}
assert.deepEqual(résultats.map((r) => [r.décision, r.revueHumaine, r.déterministe]), [
  ["explication_etayee", false, false],
  ["aucun_comparable_fourni", false, true],
  ["revue_requise", true, false],
]);
assert.equal(provider.calls, 2);
console.log(JSON.stringify({ dépôt: "jev-ofgl-peer-explainer", résultats }, null, 2));
