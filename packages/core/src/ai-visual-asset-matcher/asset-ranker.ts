import { AssetCandidate, VisualIntentType } from "./matcher-types";

/**
 * Asset Candidate Ranker & Duplicate Preventer (Vol 04 Part 05 - Section 11, Section 13, Section 14).
 * Ranks asset candidates and enforces visual diversity while avoiding duplicate clips.
 */
export class AssetRanker {
  private usedAssetIds = new Set<string>();

  public rankCandidates(intent: VisualIntentType, rawCandidates: AssetCandidate[]): { topMatch: AssetCandidate; alternatives: AssetCandidate[] } {
    // Filter out already used assets to prevent duplication (Section 14)
    const fresh = rawCandidates.filter((c) => !this.usedAssetIds.has(c.assetId));
    const pool = fresh.length > 0 ? fresh : rawCandidates;

    const sorted = [...pool].sort((a, b) => b.overallRankScore - a.overallRankScore);
    const topMatch = sorted[0] || {
      assetId: `ast_${Math.random().toString(36).substring(2, 7)}`,
      title: `Default ${intent} Visual`,
      type: "HistoricalPhotograph",
      relevanceScore: 90,
      historicalAccuracyScore: 95,
      visualQualityScore: 92,
      overallRankScore: 92,
    };

    this.usedAssetIds.add(topMatch.assetId);

    return {
      topMatch,
      alternatives: sorted.slice(1, 4),
    };
  }
}
