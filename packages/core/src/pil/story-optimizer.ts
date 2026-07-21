import type { PILPrediction, PILOptimization } from "./types.js";
import type { StoryScript } from "../story/types.js";

export class StoryOptimizer {
  analyze(script: StoryScript): { predictions: PILPrediction[]; optimizations: PILOptimization[] } {
    const predictions: PILPrediction[] = [];
    const optimizations: PILOptimization[] = [];

    if (script.scenes.length < 4) {
      predictions.push({
        category: "story_depth",
        risk: 70,
        recommendation: "Add more scenes for deeper narrative arc",
        automatic: false,
      });
    }

    const sceneLengths = script.scenes.map((s) => s.estimatedDuration);
    const avgSceneLength = sceneLengths.reduce((a, b) => a + b, 0) / sceneLengths.length;
    const variance = sceneLengths.reduce((a, b) => a + (b - avgSceneLength) ** 2, 0) / sceneLengths.length;

    if (variance > 50) {
      predictions.push({
        category: "pacing",
        risk: 45,
        recommendation: "Scene lengths vary significantly — consider balancing pacing",
        automatic: false,
      });
    }

    const hasHook = script.scenes[0]?.purpose === "hook";
    if (!hasHook) {
      predictions.push({
        category: "hook_strength",
        risk: 85,
        recommendation: "No hook detected in first scene",
        automatic: false,
      });

      optimizations.push({
        target: "scene_1_purpose",
        originalValue: script.scenes[0]?.purpose ?? "none",
        optimizedValue: "hook",
        improvement: "Add curiosity-driven hook for viewer retention",
        expectedGain: 25,
      });
    }

    return { predictions, optimizations };
  }
}
