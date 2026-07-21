export interface ReusePriority {
  assetId: string;
  reuseFrequency: number;
  qualityScore: number;
  styleConsistency: number;
  semanticValue: number;
  productionSuccess: number;
  overall: number;
}

export class ReusePriorityEngine {
  rank(assets: Array<{ id: string; reuseFrequency: number; qualityScore: number; styleConsistency: number; semanticValue: number; productionSuccess: number }>): ReusePriority[] {
    return assets
      .map((a) => {
        const overall = Math.round(
          a.reuseFrequency * 0.2 +
          a.qualityScore * 0.25 +
          a.styleConsistency * 0.2 +
          a.semanticValue * 0.15 +
          a.productionSuccess * 0.2
        );
        return {
          assetId: a.id,
          reuseFrequency: a.reuseFrequency,
          qualityScore: a.qualityScore,
          styleConsistency: a.styleConsistency,
          semanticValue: a.semanticValue,
          productionSuccess: a.productionSuccess,
          overall
        };
      })
      .sort((a, b) => b.overall - a.overall);
  }

  getTop(ranked: ReusePriority[], limit = 10): ReusePriority[] {
    return ranked.slice(0, limit);
  }
}
