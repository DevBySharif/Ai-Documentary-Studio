import type { CategoryScore, QualityScorecard, ProductionStatus } from "./types.js";

interface ScoreInput {
  story: CategoryScore;
  script: CategoryScore;
  prompt: CategoryScore;
  image: CategoryScore;
  visualContinuity: CategoryScore;
  audio: CategoryScore;
  synchronization: CategoryScore;
  motion: CategoryScore;
  timeline: CategoryScore;
}

export class ScorecardBuilder {
  build(scores: ScoreInput): QualityScorecard {
    const card: QualityScorecard = {
      story: scores.story,
      script: scores.script,
      prompt: scores.prompt,
      image: scores.image,
      visualContinuity: scores.visualContinuity,
      audio: scores.audio,
      synchronization: scores.synchronization,
      motion: scores.motion,
      timeline: scores.timeline,
      overall: 0,
      status: "minor_fix_needed",
    };

    const weighted = this.computeWeighted(card);
    card.overall = Math.round(weighted);
    card.status = this.determineStatus(card);

    return card;
  }

  private computeWeighted(card: QualityScorecard): number {
    const weights: Record<keyof Omit<QualityScorecard, "overall" | "status">, number> = {
      story: 0.15,
      script: 0.10,
      prompt: 0.15,
      image: 0.15,
      visualContinuity: 0.05,
      audio: 0.10,
      synchronization: 0.10,
      motion: 0.10,
      timeline: 0.10,
    };

    let total = 0;
    for (const [key, weight] of Object.entries(weights)) {
      total += (card[key as keyof typeof weights]?.score ?? 0) * weight;
    }
    return total;
  }

  private determineStatus(card: QualityScorecard): ProductionStatus {
    const categories = Object.entries(card).filter(
      ([key]) => key !== "overall" && key !== "status"
    ) as [string, CategoryScore][];

    const failedCount = categories.filter(([, c]) => !c.passed).length;
    const failureSeverity = categories.some(([, c]) => c.failures.length > 2);

    if (failedCount === 0) return "ready";
    if (failedCount <= 2 && !failureSeverity) return "minor_fix_needed";
    if (failedCount <= 4) return "major_revision_needed";
    return "rejected";
  }
}
