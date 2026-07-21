import type { QAEffectReport, QAIssue } from "./types.js";

export class QAEffectQA {
  analyze(bloom: number, grain: number, blur: number, fog: number, glow: number, transitions: number): QAEffectReport {
    const issues: QAIssue[] = [];
    const subtletyThreshold = 0.3;

    if (bloom > 0.8) issues.push({ type: "bloom_excessive", severity: "warning", description: "Bloom effect too strong", autoFixable: true, autoFixed: false, suggestedFix: "Reduce bloom intensity" });
    if (grain > 0.7) issues.push({ type: "grain_excessive", severity: "info", description: "Film grain may be distracting", autoFixable: true, autoFixed: false, suggestedFix: "Reduce grain amount" });

    const overall = Math.round(((1 - Math.abs(bloom - subtletyThreshold)) + (1 - Math.abs(grain - subtletyThreshold)) + (1 - Math.abs(blur - subtletyThreshold)) + (1 - Math.abs(fog - subtletyThreshold)) + (1 - Math.abs(glow - subtletyThreshold)) + transitions) / 6 * 100) / 100;
    return { bloom, grain, blur, fog, glow, transitions, overall: Math.round(overall * 100), issues };
  }
}
