// Objectif : décrire les types de l’API métier publique.
import type { JevProvider, JevUsage } from "./jev.mjs";
export type SourceRecord = { id: string; text: string; source: { url: string; date: string; [key: string]: unknown }; peers?: unknown[]; [key: string]: unknown };
export type Decision = "supported_explanation" | "review_required" | "weak_explanation" | "no_peer";
export type DecisionResult = { decision: Decision; label: string; probability: number; confidence?: number; review: boolean; deterministic: boolean; usage?: JevUsage };
export const DECISIONS: Readonly<Record<Decision, string>>;
export function localFinanceCase(input: unknown): SourceRecord;
export function assessLocalFinanceNarrative(input: unknown, provider: JevProvider): Promise<DecisionResult>;
export function runCli(argv: string[], io?: { log(value: string): void }): Promise<void>;
