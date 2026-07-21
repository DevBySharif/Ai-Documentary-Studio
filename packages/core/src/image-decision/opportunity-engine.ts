import type { OpportunityEvaluation, ImageStrategy } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class ImageOpportunityEngine {
  evaluate(segment: SemanticSegment, previousSegment: SemanticSegment | null): OpportunityEvaluation {
    const canExplainWithCurrent = previousSegment !== null &&
      segment.concept.primary === previousSegment.concept.primary &&
      segment.continuityScore >= 0.7;

    const canCameraMoveReplace = previousSegment !== null &&
      segment.continuityScore >= 0.5 &&
      segment.emotion === previousSegment.emotion;

    const canCropReveal = segment.isReveal && previousSegment !== null &&
      segment.concept.primary === previousSegment.concept.primary;

    const canWordInsertReplace = segment.importance >= 7 &&
      segment.visualIntent === "emphasize";

    const canCombineImages = previousSegment !== null &&
      segment.concept.secondary.some((c) => c === previousSegment.concept.primary);

    let score = 0;
    if (canExplainWithCurrent) score += 35;
    if (canCameraMoveReplace) score += 25;
    if (canCropReveal) score += 15;
    if (canWordInsertReplace) score += 10;
    if (canCombineImages) score += 15;

    let recommendation: ImageStrategy;
    if (score >= 90) {
      recommendation = "hold";
    } else if (score >= 70) {
      recommendation = "motion_only";
    } else if (score >= 50) {
      recommendation = segment.isMetaphor ? "symbol_insert" : "word_insert";
    } else {
      recommendation = "new_image";
    }

    return {
      score: Math.min(100, score),
      canExplainWithCurrent,
      canCameraMoveReplace,
      canCropReveal,
      canWordInsertReplace,
      canCombineImages,
      recommendation,
    };
  }
}
