import type { PredictiveAssetValue } from "./types.js";

export class PredictiveAssetValueAI {
  estimate(
    assetId: string,
    factors: Omit<PredictiveAssetValue, "assetId" | "futureValueScore">
  ): PredictiveAssetValue {
    const score = Math.round(
      factors.expectedReuseFrequency * 0.25 +
      factors.topicPopularity * 0.2 +
      factors.visualUniqueness * 0.2 +
      factors.symbolicFlexibility * 0.15 +
      factors.motionCompatibility * 0.1 +
      factors.styleStability * 0.1
    );

    return { assetId, ...factors, futureValueScore: Math.min(100, score) };
  }

  prioritize(assets: PredictiveAssetValue[], limit = 5): PredictiveAssetValue[] {
    return assets.sort((a, b) => b.futureValueScore - a.futureValueScore).slice(0, limit);
  }
}
