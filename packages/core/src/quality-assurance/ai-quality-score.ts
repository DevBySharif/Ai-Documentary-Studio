import type { QAScore } from "./types.js";

export class QAAIQualityScore {
  compute(visual: number, audio: number, subtitle: number, motion: number, consistency: number): QAScore {
    const overall = Math.round((visual + audio + subtitle + motion + consistency) / 5 * 10) / 10;
    return { visual, audio, subtitle, motion, consistency, overall };
  }

  isPassing(score: QAScore, threshold: number): boolean {
    return score.overall >= threshold;
  }

  getGrade(score: number): string {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "Needs Review";
  }
}
