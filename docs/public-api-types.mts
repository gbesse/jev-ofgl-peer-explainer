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
void assessLocalFinanceNarrative(dossier, createFakeProvider(() => ({})));
