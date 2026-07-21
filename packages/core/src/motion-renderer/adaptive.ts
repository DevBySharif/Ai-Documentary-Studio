import type { MRAdaptiveComplexity } from "./types.js";

export class MRAdaptiveMotionIntelligence {
  calculate(sceneDuration: number, subjectCount: number, visualDensity: number, emotionLevel: number, narrationSpeed: number, subtitleDensity: number): MRAdaptiveComplexity {
    const score = (
      sceneDuration * 0.05 +
      subjectCount * 15 +
      visualDensity * 20 +
      emotionLevel * 15 +
      narrationSpeed * 20 +
      subtitleDensity * 10
    );

    const complexityScore = Math.min(100, Math.round(score));

    let recommendation: MRAdaptiveComplexity["recommendation"];
    if (complexityScore > 80) recommendation = "reduce_motion";
    else if (complexityScore > 65) recommendation = "extend_holds";
    else if (complexityScore > 50) recommendation = "simplify_parallax";
    else if (complexityScore > 30) recommendation = "allow_richer";
    else recommendation = "normal";

    return {
      sceneDuration,
      subjectCount,
      visualDensity,
      emotionLevel,
      narrationSpeed,
      subtitleDensity,
      complexityScore,
      recommendation
    };
  }
}
