import type { DimensionScore, SimilarityWeights, ReuseRecommendation, SimilarityResult } from "./types.js";

interface ImageProfile {
  assetId: string;
  tags: string[];
  style: string;
  mood: string;
  camera: string;
  lighting: string;
  color: string;
  emotion: string;
  composition: string;
  objects: string[];
  characterStyle: string;
  aspectRatio: string;
  depth: string;
  embedding: number[];
  fingerprint: { perceptualHash: string; differenceHash: string; averageHash: string };
}

export class MultiDimensionSimilarity {
  compare(a: ImageProfile, b: ImageProfile, weights?: SimilarityWeights): SimilarityResult {
    if (!a || !b) throw new Error("Both ImageProfile arguments (a, b) are required");
    if (!a.tags || !b.tags) throw new Error("Each ImageProfile must have a tags array");
    if (!a.embedding || !b.embedding) throw new Error("Each ImageProfile must have an embedding vector");

    const w = weights ?? { semantic: 0.4, style: 0.2, composition: 0.15, emotion: 0.1, objects: 0.1, color: 0.05 };

    const semantic = this.semanticSimilarity(a, b);
    const visual = this.visualSimilarity(a, b);
    const style = this.styleSimilarity(a, b);
    const composition = this.compositionSimilarity(a, b);
    const emotion = this.emotionSimilarity(a, b);
    const character = this.characterSimilarity(a, b);
    const objects = this.objectSimilarity(a, b);
    const color = this.colorSimilarity(a, b);

    const dimensions: DimensionScore[] = [
      { dimension: "semantic", score: semantic, confidence: 0.8 },
      { dimension: "visual", score: visual, confidence: 0.7 },
      { dimension: "style", score: style, confidence: 0.85 },
      { dimension: "composition", score: composition, confidence: 0.75 },
      { dimension: "emotion", score: emotion, confidence: 0.7 },
      { dimension: "character", score: character, confidence: 0.8 },
      { dimension: "object", score: objects, confidence: 0.7 },
      { dimension: "color", score: color, confidence: 0.65 },
    ];

    const overallScore = Math.round(
      semantic * w.semantic + style * w.style + composition * w.composition +
      emotion * w.emotion + objects * w.objects + color * w.color
    );

    const clampedScore = Math.max(0, Math.min(100, overallScore));
    const recommendation = this.classifyScore(clampedScore);
    const confidence = dimensions.length > 0
      ? Math.round(dimensions.reduce((s, d) => s + d.confidence, 0) / dimensions.length * 100)
      : 0;

    const topDim = dimensions.sort((x, y) => y.score - x.score)[0];
    const reason = topDim ? `Dominant match: ${topDim.dimension} (${topDim.score}%)` : "No matching dimensions";

    return {
      sourceAssetId: a.assetId,
      targetAssetId: b.assetId,
      overallScore: clampedScore,
      dimensions,
      recommendation,
      confidence,
      reason,
    };
  }

  private semanticSimilarity(a: ImageProfile, b: ImageProfile): number {
    const aTags = a.tags ?? [];
    const bTags = b.tags ?? [];
    const sharedTags = aTags.filter((t) => bTags.includes(t));
    const allTags = new Set([...aTags, ...bTags]);
    return allTags.size > 0 ? Math.round((sharedTags.length / allTags.size) * 100) : 0;
  }

  private visualSimilarity(a: ImageProfile, b: ImageProfile): number {
    const dist = this.euclideanDistance(a.embedding ?? [], b.embedding ?? []);
    const embeddingLen = (a.embedding ?? []).length;
    return embeddingLen > 0
      ? Math.round(Math.max(0, Math.min(100, (1 - dist / Math.sqrt(embeddingLen)) * 100)))
      : 0;
  }

  private styleSimilarity(a: ImageProfile, b: ImageProfile): number {
    let score = 0;
    if (a.style && a.style === b.style) score += 60;
    if (a.lighting && a.lighting === b.lighting) score += 20;
    if (a.depth && a.depth === b.depth) score += 20;
    return score;
  }

  private compositionSimilarity(a: ImageProfile, b: ImageProfile): number {
    let score = 0;
    if (a.composition && a.composition === b.composition) score += 30;
    if (a.camera && a.camera === b.camera) score += 25;
    if (a.aspectRatio && a.aspectRatio === b.aspectRatio) score += 25;
    if (a.depth && a.depth === b.depth) score += 20;
    return score;
  }

  private emotionSimilarity(a: ImageProfile, b: ImageProfile): number {
    return a.emotion && a.emotion === b.emotion ? 100 : 0;
  }

  private characterSimilarity(a: ImageProfile, b: ImageProfile): number {
    return a.characterStyle && a.characterStyle === b.characterStyle ? 85 : 30;
  }

  private objectSimilarity(a: ImageProfile, b: ImageProfile): number {
    const aObjs = a.objects ?? [];
    const bObjs = b.objects ?? [];
    if (aObjs.length === 0 || bObjs.length === 0) return 0;
    const shared = aObjs.filter((o) => bObjs.includes(o));
    const all = new Set([...aObjs, ...bObjs]);
    return Math.round((shared.length / all.size) * 100);
  }

  private colorSimilarity(_a: ImageProfile, _b: ImageProfile): number {
    return _a.color && _a.color === _b.color ? 100 : Math.round(Math.random() * 30);
  }

  private classifyScore(score: number): ReuseRecommendation {
    if (score >= 95) return "reuse_immediately";
    if (score >= 90) return "reuse";
    if (score >= 80) return "suggest_reuse";
    if (score >= 65) return "manual_review";
    return "generate_new";
  }

  private euclideanDistance(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);
    if (len === 0) return 0;
    let sum = 0;
    for (let i = 0; i < len; i++) sum += (a[i] - b[i]) ** 2;
    return Math.sqrt(sum);
  }
}
