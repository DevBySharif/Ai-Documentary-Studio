import type { PILPrediction, PILOptimization } from "./types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { StoryScript } from "../story/types.js";

export class RenderOptimizer {
  analyze(script: StoryScript, promptPlan: PromptPlan): { predictions: PILPrediction[]; optimizations: PILOptimization[] } {
    const predictions: PILPrediction[] = [];
    const optimizations: PILOptimization[] = [];

    const newImages = promptPlan.scenePrompts.filter((p) => !p.reuse).length;
    const estimatedRenderMs = newImages * 15000 + script.totalDuration * 500;

    if (estimatedRenderMs > 300000) {
      predictions.push({
        category: "render_time",
        risk: 50,
        recommendation: `Estimated render time ${Math.round(estimatedRenderMs / 1000)}s — consider increasing reuse`,
        automatic: true,
      });

      const reused = promptPlan.scenePrompts.filter((p) => p.reuse).length;
      const targetReuse = Math.min(reused + Math.ceil(newImages * 0.3), promptPlan.scenePrompts.length);
      const newReuseRate = targetReuse / promptPlan.scenePrompts.length;

      optimizations.push({
        target: "render_efficiency",
        originalValue: Math.round(promptPlan.scenePrompts.length > 0 ? (reused / promptPlan.scenePrompts.length) * 100 : 0),
        optimizedValue: Math.round(newReuseRate * 100),
        improvement: "Increase image reuse to reduce render time",
        expectedGain: 30,
      });
    }

    const runtime = script.totalDuration;
    if (runtime < 60) {
      predictions.push({
        category: "short_runtime",
        risk: 25,
        recommendation: `Runtime ${runtime}s is very short — consider expanding content`,
        automatic: false,
      });
    } else if (runtime > 600) {
      predictions.push({
        category: "long_runtime",
        risk: 40,
        recommendation: `Runtime ${runtime}s is very long — viewer retention may drop`,
        automatic: false,
      });
    }

    return { predictions, optimizations };
  }
}
