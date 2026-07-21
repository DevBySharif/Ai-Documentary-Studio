import type { HoldRecommendation, CognitiveLoadEstimate } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class HoldRhythmEngine {
  recommend(segment: SemanticSegment, cognitiveLoad: CognitiveLoadEstimate, baseDuration: number): HoldRecommendation {
    const difficultyMultiplier = 1 + (segment.importance >= 7 ? 0.3 : 0) +
      (segment.complexity === "highly_abstract" || segment.complexity === "complex" ? 0.4 : 0);

    const emotionMultiplier = this.getEmotionMultiplier(segment.emotion);
    const cognitiveMultiplier = 1 + (cognitiveLoad.load >= 70 ? 0.5 : cognitiveLoad.load >= 50 ? 0.25 : 0);

    const recommended = Math.round(baseDuration * difficultyMultiplier * emotionMultiplier * cognitiveMultiplier * 10) / 10;

    let reason: string;
    if (recommended > baseDuration * 1.5) {
      reason = `High complexity (${segment.complexity}) + cognitive load (${cognitiveLoad.load}) requires extended hold`;
    } else if (recommended > baseDuration * 1.2) {
      reason = `Moderate adjustments for ${segment.emotion} emotion + cognitive load`;
    } else {
      reason = "Standard hold duration adequate";
    }

    return {
      currentDuration: baseDuration,
      recommendedDuration: Math.min(recommended, 15),
      reason,
    };
  }

  private getEmotionMultiplier(emotion: string): number {
    const map: Record<string, number> = {
      reflection: 1.4, wonder: 1.3, calm: 1.2, curiosity: 1.1,
      suspense: 1.0, hope: 1.0, surprise: 0.9, urgency: 0.7,
      fear: 0.8, awe: 1.3, mystery: 1.1,
    };
    return map[emotion] ?? 1.0;
  }
}
