import type { ExperienceRanking } from "./types.js";

export class ExperienceRankingEngine {
  private rankings = new Map<string, ExperienceRanking>();

  record(ranking: ExperienceRanking): void {
    if (!ranking?.assetId) throw new Error("ExperienceRanking with assetId is required");
    ranking.overallRank = this.computeOverall(ranking);
    this.rankings.set(ranking.assetId, ranking);
  }

  get(assetId: string): ExperienceRanking | undefined {
    return this.rankings.get(assetId);
  }

  getTop(limit = 10): ExperienceRanking[] {
    return Array.from(this.rankings.values())
      .sort((a, b) => b.overallRank - a.overallRank)
      .slice(0, limit);
  }

  private computeOverall(r: ExperienceRanking): number {
    return (
      r.reuseFrequency * 0.25 +
      r.qualityScore * 0.25 +
      r.styleConsistency * 0.15 +
      r.timelineSuccess * 0.15 +
      r.promptReliability * 0.2
    );
  }
}
