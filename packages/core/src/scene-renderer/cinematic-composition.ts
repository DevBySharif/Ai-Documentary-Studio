import type { CinematicCompositionScore, RuleOfThirdsResult } from "./types.js";
import { RuleOfThirdsEngine } from "./rule-of-thirds.js";

export class CinematicCompositionAI {
  private thirds = new RuleOfThirdsEngine();

  evaluate(subjectX: number, subjectY: number, frameWidth: number, frameHeight: number, hasLeadingLines: boolean, hasMotion: boolean): CinematicCompositionScore {
    const thirdsResult: RuleOfThirdsResult = this.thirds.evaluate(subjectX, subjectY, frameWidth, frameHeight);
    const negativeSpace = this.evaluateNegativeSpace(subjectX, subjectY, frameWidth, frameHeight);
    const balance = this.evaluateBalance(subjectX, frameWidth);

    const overall = Math.round(
      thirdsResult.compositionScore * 0.3 +
      balance * 0.25 +
      (hasLeadingLines ? 90 : 50) * 0.15 +
      negativeSpace * 0.15 +
      (hasMotion ? 70 : 50) * 0.15
    );

    return {
      ruleOfThirds: thirdsResult.compositionScore,
      visualBalance: balance,
      leadingLines: hasLeadingLines ? 85 : 40,
      negativeSpace,
      cameraWeight: 60,
      motionDirection: hasMotion ? 75 : 50,
      overall
    };
  }

  private evaluateNegativeSpace(sx: number, sy: number, w: number, h: number): number {
    const margin = 0.2;
    const inMargin = sx < w * margin || sx > w * (1 - margin) || sy < h * margin || sy > h * (1 - margin);
    return inMargin ? 80 : 60;
  }

  private evaluateBalance(sx: number, frameWidth: number): number {
    const center = frameWidth / 2;
    const offset = Math.abs(sx - center) / center;
    return Math.round(Math.max(0, 100 - offset * 50));
  }

  suggestImprovement(score: CinematicCompositionScore): string[] {
    const tips: string[] = [];
    if (score.ruleOfThirds < 60) tips.push("Move subject to a rule-of-thirds intersection");
    if (score.visualBalance < 60) tips.push("Adjust horizontal position for better visual balance");
    if (score.negativeSpace < 50) tips.push("Increase negative space around the subject");
    if (score.leadingLines < 50) tips.push("Incorporate leading lines to guide viewer attention");
    return tips;
  }
}
