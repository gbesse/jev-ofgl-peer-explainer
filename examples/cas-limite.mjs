// Objectif : vérifier qu’une règle explicite évite un appel Jev inutile.
import assert from "node:assert/strict";
import { assessLocalFinanceNarrative } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-10-01"
  },
  "peers": []
};
const provider = createFakeProvider(() => { throw new Error("Jev ne doit pas être appelé"); });
const résultat = await assessLocalFinanceNarrative(dossier, provider);
assert.equal(résultat.decision, "no_peer");
assert.equal(résultat.deterministic, true);
assert.equal(provider.calls, 0);
console.log(`Décision : ${résultat.label} · appels Jev : ${provider.calls}`);
