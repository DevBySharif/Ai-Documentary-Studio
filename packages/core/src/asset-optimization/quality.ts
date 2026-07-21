import type { AssetQuality } from "./types.js";

export class QualityEvaluator {
  evaluate(assetId: string, metrics: Omit<AssetQuality, "assetId" | "overall">): AssetQuality {
    const overall = (
      metrics.resolution * 0.15 +
      metrics.sharpness * 0.15 +
      metrics.styleConsistency * 0.2 +
      metrics.composition * 0.15 +
      metrics.promptQuality * 0.15 +
      metrics.motionCompatibility * 0.1 +
      metrics.reuseValue * 0.1
    );
    return { assetId, ...metrics, overall: Math.round(overall * 100) / 100 };
  }

  isLowQuality(quality: AssetQuality, threshold = 50): boolean {
    return quality.overall < threshold;
  }

  needsRegeneration(quality: AssetQuality): string | null {
    if (quality.styleConsistency < 40) return "poor_style_match";
    if (quality.resolution < 30) return "low_resolution";
    if (quality.composition < 35) return "weak_composition";
    return null;
  }
}
