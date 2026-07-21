import type { AssetRecord, AssetRecommendation, RecommendationFactor } from "./types.js";

export class SmartAssetRecommender {
  private defaultConfidenceThreshold = 90;

  setThreshold(threshold: number): void {
    if (typeof threshold !== "number" || threshold < 0 || threshold > 100) {
      throw new Error(`Threshold must be a number between 0 and 100, got ${threshold}`);
    }
    this.defaultConfidenceThreshold = threshold;
  }

  recommend(
    concept: string,
    emotion: string,
    style: string,
    assets: AssetRecord[],
    threshold?: number
  ): AssetRecommendation | null {
    if (!assets) throw new Error("Assets array is required");
    if (!concept || !emotion || !style) throw new Error("concept, emotion, and style strings are required");

    const minConfidence = threshold ?? this.defaultConfidenceThreshold;

    const scored = assets
      .map((asset) => this.evaluate(asset, concept, emotion, style))
      .filter((r) => r.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);

    return scored[0] ?? null;
  }

  recommendTopK(
    concept: string,
    emotion: string,
    style: string,
    assets: AssetRecord[],
    k = 3
  ): AssetRecommendation[] {
    if (!assets) throw new Error("Assets array is required");
    if (!concept || !emotion || !style) throw new Error("concept, emotion, and style strings are required");

    return assets
      .map((asset) => this.evaluate(asset, concept, emotion, style))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, k);
  }

  private evaluate(asset: AssetRecord, concept: string, emotion: string, style: string): AssetRecommendation {
    const factors: RecommendationFactor[] = [];
    const lowerConcept = (concept ?? "").toLowerCase();
    const lowerEmotion = (emotion ?? "").toLowerCase();
    const lowerStyle = (style ?? "").toLowerCase();
    const tags = asset.tags ?? [];
    const metadata = asset.metadata ?? {} as AssetRecord["metadata"];

    const semanticScore = tags.some((t) => (t ?? "").toLowerCase().includes(lowerConcept)) ? 85 : 20;
    factors.push({ factor: "semantic_similarity", score: semanticScore, weight: 0.25, weightedScore: semanticScore * 0.25 });

    const dnaStyle = (asset.visualDNA?.style ?? "").toLowerCase();
    const metaStyle = (metadata.style ?? "").toLowerCase();
    const dnaMatch = dnaStyle === lowerStyle ? 95 : metaStyle === lowerStyle ? 80 : 30;
    factors.push({ factor: "visual_dna_match", score: dnaMatch, weight: 0.2, weightedScore: dnaMatch * 0.2 });

    const characterMatch = 70;
    factors.push({ factor: "character_consistency", score: characterMatch, weight: 0.1, weightedScore: characterMatch * 0.1 });

    const styleMatch = metaStyle === lowerStyle ? 90 : 30;
    factors.push({ factor: "style_consistency", score: styleMatch, weight: 0.15, weightedScore: styleMatch * 0.15 });

    const dnaEmotion = (asset.visualDNA?.emotion ?? "").toLowerCase();
    const emotionMatch = dnaEmotion === lowerEmotion ? 85 : 20;
    factors.push({ factor: "emotion_match", score: emotionMatch, weight: 0.1, weightedScore: emotionMatch * 0.1 });

    const reuseCount = typeof asset.reuseCount === "number" ? asset.reuseCount : 0;
    const reuseScore = Math.min(100, (reuseCount / Math.max(1, reuseCount + 5)) * 100);
    factors.push({ factor: "reuse_history", score: reuseScore, weight: 0.1, weightedScore: reuseScore * 0.1 });

    const qualityScore = typeof metadata.qualityScore === "number" ? metadata.qualityScore : 50;
    factors.push({ factor: "image_quality", score: qualityScore, weight: 0.1, weightedScore: qualityScore * 0.1 });

    const totalWeighted = factors.reduce((s, f) => s + f.weightedScore, 0);
    const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
    const confidence = totalWeight > 0 ? Math.round(totalWeighted / totalWeight) : 0;

    const topFactor = factors.sort((a, b) => b.score - a.score)[0];
    const reason = topFactor ? `Best match: ${topFactor.factor} (${topFactor.score}%)` : "No strong match";

    return { asset, confidence, factors, reason };
  }
}
