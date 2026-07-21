import type { RhythmValidation, RhythmBlock } from "./types.js";

export class RhythmValidator {
  validate(blocks: RhythmBlock[], totalDuration: number): RhythmValidation {
    const warnings: string[] = [];

    const cutCount = blocks.length;
    const holdCount = blocks.filter((b) => b.tempo === "slow").length;
    const durationMinutes = Math.max(1, totalDuration / 60);
    const cutsPerMinute = cutCount / durationMinutes;

    const tooManyCuts = cutsPerMinute > 12;
    const tooManyHolds = holdCount / blocks.length > 0.8 && blocks.length > 5;
    const motionOverload = blocks.filter((b) => b.motionDensity > 0.7).length > blocks.length * 0.3;
    const emptyTimeline = blocks.length === 0;

    let abruptTempoChanges = false;
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].tempo !== blocks[i - 1].tempo &&
          Math.abs(this.tempoScore(blocks[i].tempo) - this.tempoScore(blocks[i - 1].tempo)) >= 2) {
        abruptTempoChanges = true;
        break;
      }
    }

    const viewerFatigueRisk = tooManyCuts || motionOverload || abruptTempoChanges;

    if (tooManyCuts) warnings.push(`Too many cuts: ${Math.round(cutsPerMinute)}/min (max 12)`);
    if (tooManyHolds) warnings.push("Too many slow segments — pace may drag");
    if (motionOverload) warnings.push("Motion density too high in 30%+ of blocks");
    if (emptyTimeline) warnings.push("Timeline is empty");
    if (abruptTempoChanges) warnings.push("Abrupt tempo changes detected");
    if (viewerFatigueRisk) warnings.push("Viewer fatigue risk elevated");

    return {
      tooManyCuts, tooManyHolds, motionOverload, emptyTimeline,
      abruptTempoChanges, viewerFatigueRisk,
      passed: warnings.length === 0,
      warnings,
    };
  }

  private tempoScore(tempo: string): number {
    const scores: Record<string, number> = { slow: 1, medium: 2, fast: 3, dynamic: 4 };
    return scores[tempo] ?? 2;
  }
}
