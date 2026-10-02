// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";
export const DECISIONS = Object.freeze({
  "supported_explanation": "explication_etayee",
  "review_required": "revue_requise",
  "weak_explanation": "explication_fragile",
  "no_peer": "aucun_comparable_fourni"
});
const CRITERIA = Object.freeze({
  "supported_explanation": "explication etayee",
  "review_required": "revue requise",
  "weak_explanation": "explication fragile",
  "no_peer": "aucun comparable fourni"
});
export function localFinanceCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}
export async function assessLocalFinanceNarrative(input, provider) {
  const record = localFinanceCase(input);
  if (Array.isArray(record.peers) && record.peers.length === 0) return { decision: "no_peer", label: DECISIONS["no_peer"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce dossier à partir des seuls éléments sourcés. Évaluez les écarts calculés, les postes documentés et les caractéristiques explicites du groupe comparable, sans attribuer de causalité non démontrée. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni règle applicable, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}
export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-ofgl-peer-explainer <dossier.json>");
  const dossier = localFinanceCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier, prochaineÉtape: "Transmettez ce dossier à assessLocalFinanceNarrative avec un fournisseur Jev configuré." }, null, 2));
}
