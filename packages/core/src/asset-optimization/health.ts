import type { LibraryHealth } from "./types.js";

export class LibraryHealthAnalyzer {
  analyze(total: number, duplicates: number, unused: number, damaged: number, lowQuality: number, obsolete: number, frequentlyUsed: number): LibraryHealth {
    const penalty = (duplicates * 2 + unused * 3 + damaged * 5 + lowQuality * 4 + obsolete * 3);
    const bonus = frequentlyUsed * 2;
    const base = 100;
    const healthScore = Math.max(0, Math.min(100, base - penalty + bonus));

    return {
      totalAssets: total,
      duplicateAssets: duplicates,
      unusedAssets: unused,
      damagedAssets: damaged,
      lowQualityAssets: lowQuality,
      obsoleteAssets: obsolete,
      frequentlyUsedAssets: frequentlyUsed,
      healthScore
    };
  }

  getHealthLabel(score: number): string {
    if (score >= 90) return "excellent";
    if (score >= 75) return "good";
    if (score >= 50) return "fair";
    if (score >= 25) return "poor";
    return "critical";
  }
}
