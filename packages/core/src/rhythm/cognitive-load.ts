import type { CognitiveLoadEstimate } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";

export class CognitiveLoadEngine {
  estimate(segment: SemanticSegment, narrationSpeed: number): CognitiveLoadEstimate {
    const abstractScore = segment.complexity === "highly_abstract" ? 80 :
      segment.complexity === "complex" ? 60 :
      segment.complexity === "medium" ? 30 : 10;

    const speedScore = narrationSpeed > 180 ? 70 : narrationSpeed > 150 ? 40 : 20;

    const termCount = segment.concept.primary.split(/\s+/).length +
      segment.concept.secondary.length;
    const terminologyScore = Math.min(80, termCount * 15);

    const complexityScore = segment.complexity === "highly_abstract" ? 90 :
      segment.complexity === "complex" ? 70 : segment.complexity === "medium" ? 40 : 20;

    const load = Math.round((abstractScore + speedScore + terminologyScore + complexityScore) / 4);

    let recommendation: string;
    if (load >= 70) {
      recommendation = "Extend hold, reduce motion, simplify visual flow";
    } else if (load >= 50) {
      recommendation = "Maintain current hold, reduce motion intensity";
    } else {
      recommendation = "Standard pacing acceptable";
    }

    return {
      load,
      factors: { abstract: abstractScore, narrationSpeed: speedScore, terminology: terminologyScore, complexity: complexityScore },
      recommendation,
    };
  }
}
