// Objectif : vérifier les types publiés depuis un projet consommateur.
import { localFinanceCase, assessLocalFinanceNarrative, DECISIONS } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = localFinanceCase({
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
});
void DECISIONS;
void assessLocalFinanceNarrative(dossier, createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "supported_explanation", probabilities: { "supported_explanation": 0.82, "review_required": 0.06, "weak_explanation": 0.06, "no_peer": 0.06 }, confidence: 0.82 } } })));

// Ces erreurs attendues protègent le contrat des consommateurs TypeScript.
// @ts-expect-error — un fournisseur doit retourner une réponse Jev complète.
createFakeProvider(() => ({}));
const result = await assessLocalFinanceNarrative(dossier, createFakeProvider(() => ({ model: "jev-1.13.0", answers: {} })));
const review: boolean = result.review;
void review;
// @ts-expect-error — la revue humaine est un booléen.
const incorrect: string = result.review;
void incorrect;
