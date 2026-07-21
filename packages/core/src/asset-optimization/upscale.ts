export interface UpscaleRecommendation {
  assetId: string;
  resolution: number;
  reuseFrequency: number;
  priority: number;
}

export class UpscaleRecommender {
  recommend(assets: Array<{ id: string; resolution: number; reuseFrequency: number; qualityScore: number }>, qualityThreshold = 70): UpscaleRecommendation[] {
    const recommendations: UpscaleRecommendation[] = [];

    for (const asset of assets) {
      if (asset.reuseFrequency >= 3 && asset.qualityScore >= qualityThreshold && asset.resolution < 72) {
        recommendations.push({
          assetId: asset.id,
          resolution: asset.resolution,
          reuseFrequency: asset.reuseFrequency,
          priority: Math.round((asset.reuseFrequency * 10 + asset.qualityScore) / 2)
        });
      }
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}
