import type { ReuseScoreResult, ImageMemoryEntry } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class ReuseScoreCalculator {
  calculate(segment: SemanticSegment, candidate: ImageMemoryEntry): ReuseScoreResult {
    const conceptMatch = segment.concept.primary.toLowerCase() === candidate.concept.toLowerCase() ? 1 : 0.2;
    const emotionMatch = segment.emotion === candidate.emotion ? 1 : 0.3;
    const cameraMatch = 0.5;
    const compositionMatch = candidate.composition ? 0.5 : 0.3;
    const intentMatch = segment.visualIntent === candidate.visualIntent ? 1 : 0.4;
    const continuityBonus = segment.continuityScore;

    const score = conceptMatch * 0.3 +
      emotionMatch * 0.2 +
      cameraMatch * 0.15 +
      compositionMatch * 0.1 +
      intentMatch * 0.1 +
      continuityBonus * 0.15;

    return {
      score: Math.round(score * 100) / 100,
      conceptMatch,
      emotionMatch,
      cameraMatch: Math.round(cameraMatch * 100) / 100,
      compositionMatch: Math.round(compositionMatch * 100) / 100,
      intentMatch,
      continuityBonus,
    };
  }
}
