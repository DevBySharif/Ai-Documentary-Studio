import type { CognitiveCameraTarget, CameraTarget } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class CognitiveCameraEngine {
  evaluateTargets(segment: SemanticSegment): CognitiveCameraTarget[] {
    const targets: CognitiveCameraTarget[] = [];

    const narrativeImportance = segment.importance * 10;
    const visualImportance = this.calculateVisualImportance(segment);
    const voiceEmphasis = segment.importance >= 7 ? 80 : 30;
    const emotionScore = this.calculateEmotionScore(segment);

    targets.push({
      target: "main_object",
      label: segment.concept.primary,
      narrativeImportance,
      visualImportance,
      voiceEmphasis,
      emotion: emotionScore,
      totalScore: (narrativeImportance + visualImportance + voiceEmphasis + emotionScore) / 4,
    });

    if (segment.isMetaphor && segment.metaphorSymbol) {
      targets.push({
        target: "symbol",
        label: segment.metaphorSymbol,
        narrativeImportance: narrativeImportance * 1.2,
        visualImportance: 90,
        voiceEmphasis: 60,
        emotion: emotionScore * 1.1,
        totalScore: 0,
      });
      targets[targets.length - 1].totalScore =
        (targets[targets.length - 1].narrativeImportance +
         targets[targets.length - 1].visualImportance +
         targets[targets.length - 1].voiceEmphasis +
         targets[targets.length - 1].emotion) / 4;
    }

    if (segment.concept.secondary.length > 0) {
      for (const concept of segment.concept.secondary.slice(0, 2)) {
        targets.push({
          target: "environment",
          label: concept,
          narrativeImportance: narrativeImportance * 0.5,
          visualImportance: 40,
          voiceEmphasis: 20,
          emotion: emotionScore * 0.5,
          totalScore: 0,
        });
        targets[targets.length - 1].totalScore =
          (targets[targets.length - 1].narrativeImportance +
           targets[targets.length - 1].visualImportance +
           targets[targets.length - 1].voiceEmphasis +
           targets[targets.length - 1].emotion) / 4;
      }
    }

    return targets;
  }

  private calculateVisualImportance(segment: SemanticSegment): number {
    switch (segment.complexity) {
      case "highly_abstract": return 95;
      case "complex": return 75;
      case "medium": return 50;
      case "simple": return 25;
    }
  }

  private calculateEmotionScore(segment: SemanticSegment): number {
    const scores: Record<string, number> = {
      curiosity: 70, surprise: 85, wonder: 90, reflection: 60,
      urgency: 80, suspense: 85, hope: 65, awe: 95, fear: 70,
      calm: 30, mystery: 75,
    };
    return scores[segment.emotion] ?? 50;
  }
}
