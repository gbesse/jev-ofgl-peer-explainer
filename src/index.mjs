// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";
import { validateChoiceResponse } from "./jev.mjs";
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
  const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  if (!object(input) || !object(input.source)) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  for (const value of [input.id, input.text, input.source.url, input.source.date]) {
    if (typeof value !== "string" || !value.trim()) throw new TypeError("Le dossier exige des chaînes non vides pour id, text, source.url et source.date");
  }
  const rawDate = input.source.date.trim();
  const calendar = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(rawDate);
  const date = new Date(rawDate);
  if (!calendar || Number.isNaN(date.valueOf()) || new Date(rawDate.slice(0, 10) + "T00:00:00.000Z").toISOString().slice(0, 10) !== rawDate.slice(0, 10)) throw new TypeError("source.date doit être une date ISO valide");
  let url;
  try { url = new URL(input.source.url.trim()); } catch { throw new TypeError("source.url doit être une URL HTTP(S) valide"); }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new TypeError("source.url doit être une URL HTTP(S) sans identifiants");
  if (input.peers !== undefined && !Array.isArray(input.peers)) throw new TypeError("peers doit être un tableau lorsqu’il est fourni");
  return { ...input, id: input.id.trim(), text: input.text.trim(), source: { ...input.source, url: url.href, date: date.toISOString() } };
}
export async function assessLocalFinanceNarrative(input, provider) {
  const record = localFinanceCase(input);
  if (Array.isArray(record.peers) && record.peers.length === 0) return { decision: "no_peer", label: DECISIONS["no_peer"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce dossier à partir des seuls éléments sourcés. Évaluez les écarts calculés, les postes documentés et les caractéristiques explicites du groupe comparable, sans attribuer de causalité non démontrée. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni règle applicable, ni garantie.", criteria: CRITERIA } },
  });
  const answer = validateChoiceResponse(response, { decision: { type: "choice", instructions: "Validation métier", criteria: CRITERIA } }).answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8 || answer.choice === "review_required" || answer.choice === "no_peer", deterministic: false, usage: response.usage };
}
export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-ofgl-peer-explainer <dossier.json>");
  const dossier = localFinanceCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier, prochaineÉtape: "Transmettez ce dossier à assessLocalFinanceNarrative avec un fournisseur Jev configuré." }, null, 2));
}
