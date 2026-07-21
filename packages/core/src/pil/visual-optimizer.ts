import type { PILPrediction, PILOptimization } from "./types.js";
import type { PromptPlan } from "../prompt/types.js";

export class VisualOptimizer {
  analyze(plan: PromptPlan): { predictions: PILPrediction[]; optimizations: PILOptimization[] } {
    const predictions: PILPrediction[] = [];
    const optimizations: PILOptimization[] = [];

    const total = plan.scenePrompts.length;
    const reused = plan.scenePrompts.filter((p) => p.reuse).length;
    const reuseRate = total > 0 ? (reused / total) * 100 : 0;

    if (reuseRate < 20) {
      predictions.push({
        category: "image_reuse",
        risk: 60,
        recommendation: "Low reuse rate increases generation time — try reusing more images",
        automatic: true,
      });

      optimizations.push({
        target: "reuse_rate",
        originalValue: Math.round(reuseRate),
        optimizedValue: Math.min(Math.round(reuseRate + 20), 80),
        improvement: "Increase reuse to reduce generation time by 20%",
        expectedGain: 20,
      });
    }

    const imageTypes = new Set(plan.scenePrompts.map((p) => p.image_type));
    if (!imageTypes.has("symbolic_visual")) {
      predictions.push({
        category: "visual_variety",
        risk: 30,
        recommendation: "No symbolic visuals — consider adding for metaphors",
        automatic: true,
      });
    }

    return { predictions, optimizations };
  }
}
