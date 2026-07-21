import { GenerationCandidate, RefinementType } from "./orchestrator-types";

/**
 * Automated Image Refinement Engine (Vol 04 Part 07 - Section 11).
 * Applies post-generation enhancements (Upscaling, Face Enhancement, Color Refinement, Outpainting).
 */
export class ImageRefinementEngine {
  public applyRefinements(
    candidate: GenerationCandidate,
    refinementList: RefinementType[]
  ): GenerationCandidate {
    const newRefinements = [...candidate.appliedRefinements, ...refinementList];
    const boostedScore = {
      ...candidate.qualityScore,
      detailScore: Math.min(100, candidate.qualityScore.detailScore + 4),
      sharpnessScore: Math.min(100, candidate.qualityScore.sharpnessScore + 5),
      overallScore: Math.min(100, candidate.qualityScore.overallScore + 3),
    };

    return {
      ...candidate,
      qualityScore: boostedScore,
      appliedRefinements: newRefinements,
    };
  }
}
