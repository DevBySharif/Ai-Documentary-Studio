import type { CharacterValidationResult, CharacterDNAProfile } from "./types.js";
import { CharacterDNAProfileBuilder } from "./character-dna.js";

export class CharacterValidator {
  private builder: CharacterDNAProfileBuilder;

  constructor() {
    this.builder = new CharacterDNAProfileBuilder();
  }

  validate(detected: Partial<CharacterDNAProfile>, reference: CharacterDNAProfile): CharacterValidationResult {
    if (!detected) throw new Error("Detected CharacterDNAProfile is required");
    if (!reference) throw new Error("Reference CharacterDNAProfile is required");

    const silhouetteMatch = detected.silhouette && detected.silhouette === reference.silhouette ? 95 : 30;
    const proportionMatch = typeof detected.limbLength === "number" && typeof detected.headRatio === "number"
      ? (Math.abs(detected.limbLength - reference.limbLength) < 0.1 && Math.abs(detected.headRatio - reference.headRatio) < 0.1 ? 90 : 40)
      : 50;
    const identityMatch = detected.identity && detected.identity === reference.identity ? 100 : 30;
    const poseMatch = detected.poseRules ? this.poseSimilarity(detected.poseRules, reference.poseRules) : 50;
    const expressionMatch = detected.emotionRules
      ? this.emotionSimilarity(detected.emotionRules, reference.emotionRules)
      : 50;
    const accessoryMatch = detected.accessories
      ? this.accessorySimilarity(detected.accessories, reference.accessories)
      : 50;

    const overallScore = Math.round(
      silhouetteMatch * 0.25 + proportionMatch * 0.2 + identityMatch * 0.2 +
      poseMatch * 0.15 + expressionMatch * 0.1 + accessoryMatch * 0.1
    );

    const issues: string[] = [];
    if (silhouetteMatch < 60) issues.push("Silhouette does not match reference character");
    if (proportionMatch < 60) issues.push("Body proportions deviate from reference");
    if (identityMatch < 60) issues.push("Character identity does not match");
    if (overallScore < 60) issues.push("Character validation failed");

    return {
      silhouetteMatch,
      proportionMatch,
      identityMatch,
      poseMatch,
      expressionMatch,
      accessoryMatch,
      overallScore,
      passed: overallScore >= 70,
      issues,
    };
  }

  private poseSimilarity(detected: string[], reference: string[]): number {
    const d = detected ?? [];
    const r = reference ?? [];
    const shared = d.filter((p) => r.includes(p));
    return r.length > 0 ? Math.round((shared.length / Math.max(d.length, r.length)) * 100) : 50;
  }

  private emotionSimilarity(detected: Record<string, string>, reference: Record<string, string>): number {
    const d = detected ?? {};
    const r = reference ?? {};
    let matches = 0;
    let total = 0;
    for (const [key, val] of Object.entries(d)) {
      if (r[key]) {
        total++;
        if (r[key] === val) matches++;
      }
    }
    return total > 0 ? Math.round((matches / total) * 100) : 50;
  }

  private accessorySimilarity(detected: string[], reference: string[]): number {
    const d = detected ?? [];
    const r = reference ?? [];
    if (d.length === 0 && r.length === 0) return 100;
    const shared = d.filter((a) => r.includes(a));
    const all = new Set([...d, ...r]);
    return all.size > 0 ? Math.round((shared.length / all.size) * 100) : 100;
  }
}
