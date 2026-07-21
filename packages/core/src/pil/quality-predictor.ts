import type { PILPrediction, PILOptimization } from "./types.js";
import type { CategoryScore } from "../quality/types.js";

export class QualityPredictor {
  predict(scores: Record<string, CategoryScore>): { predictions: PILPrediction[]; optimizations: PILOptimization[] } {
    const predictions: PILPrediction[] = [];
    const optimizations: PILOptimization[] = [];

    let totalScore = 0;
    let categoryCount = 0;

    for (const [category, score] of Object.entries(scores)) {
      totalScore += score.score;
      categoryCount++;

      if (score.score < 50) {
        predictions.push({
          category: `${category}_failure`,
          risk: 85,
          recommendation: `${category} score is ${score.score}/100 — high risk of production failure`,
          automatic: false,
        });

        optimizations.push({
          target: category,
          originalValue: score.score,
          optimizedValue: Math.min(score.score + 30, 100),
          improvement: `Regenerate or repair ${category} before proceeding`,
          expectedGain: 30,
        });
      } else if (score.score < 70) {
        predictions.push({
          category: `${category}_warning`,
          risk: 40,
          recommendation: `${category} score is ${score.score}/100 — needs improvement before final approval`,
          automatic: false,
        });
      }
    }

    const avgScore = categoryCount > 0 ? totalScore / categoryCount : 0;
    const renderReady = avgScore >= 70;

    if (!renderReady) {
      predictions.push({
        category: "render_readiness",
        risk: 75,
        recommendation: `Average quality score ${Math.round(avgScore)}/100 — below render threshold`,
        automatic: false,
      });
    }

    return { predictions, optimizations };
  }
}
