// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessLocalFinanceNarrative } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessLocalFinanceNarrative({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
