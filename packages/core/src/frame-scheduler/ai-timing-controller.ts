import type { FSAITimingDecision } from "./types.js";

export class FSAITimingController {
  evaluate(sceneEmotion: string, sceneComplexity: number, remainingDuration: number, narrationIntensity: number, hasSilence: boolean): FSAITimingDecision {
    const decision: FSAITimingDecision = {
      extendHold: 0,
      delayTransition: 0,
      accelerateScenes: [],
      emotionalPeaks: [],
      durationPreserved: true
    };

    const lower = sceneEmotion.toLowerCase();

    if (lower === "reflection" || hasSilence) {
      decision.extendHold = 500;
    }

    if (lower === "revelation" || lower === "discovery") {
      decision.delayTransition = 300;
    }

    if (sceneComplexity < 0.3 && remainingDuration > 10000) {
      decision.accelerateScenes.push("low_information_scene");
    }

    if (narrationIntensity > 0.7) {
      decision.emotionalPeaks.push({ frame: 0, intensity: narrationIntensity });
    }

    return decision;
  }

  applyHoldDuration(originalDuration: number, emotion: string): number {
    const holdMultipliers: Record<string, number> = {
      reflection: 1.5, calm: 1.3, wonder: 1.2,
      tension: 0.9, urgency: 0.8, fear: 0.9
    };
    const multiplier = holdMultipliers[emotion] ?? 1;
    return Math.round(originalDuration * multiplier);
  }

  shouldDelayTransition(emotion: string): boolean {
    return ["reflection", "revelation", "discovery"].includes(emotion);
  }

  suggestAcceleration(complexity: number, durationMs: number): number {
    if (complexity < 0.3) return Math.round(durationMs * 0.8);
    if (complexity > 0.7) return Math.round(durationMs * 1.1);
    return durationMs;
  }
}
