import type { ProductionSuccessScore } from "./types.js";

export class ProductionSuccessScorer {
  score(projectId: string, metrics: Omit<ProductionSuccessScore, "projectId" | "overall">): ProductionSuccessScore {
    const overall = (
      metrics.visualQuality * 0.25 +
      metrics.promptQuality * 0.2 +
      metrics.styleConsistency * 0.2 +
      metrics.timelineQuality * 0.15 +
      metrics.motionQuality * 0.1 +
      metrics.reuseEfficiency * 0.1
    );
    return { projectId, ...metrics, overall: Math.round(overall * 100) / 100 };
  }

  compare(a: ProductionSuccessScore, b: ProductionSuccessScore): ProductionSuccessScore {
    return a.overall >= b.overall ? a : b;
  }
}
