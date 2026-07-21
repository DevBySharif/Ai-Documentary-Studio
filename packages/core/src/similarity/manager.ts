import type { SimilarityResult, SimilarityWeights, ReuseContext, ReuseDecision, PerceptualHashSet, HybridSimilarityInput, ReuseRecommendation } from "./types.js";
import { MultiDimensionSimilarity } from "./multi-dimension.js";
import { EmbeddingSearchEngine } from "./embedding-search.js";
import { PerceptualHashMatcher } from "./perceptual-hash.js";
import { HybridSimilarityAI } from "./hybrid-ai.js";
import { ContextAwareReuseEngine } from "./context-reuse.js";

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

export class VisualSimilarityEngine {
  private multiDimension: MultiDimensionSimilarity;
  private embeddingSearch: EmbeddingSearchEngine;
  private hashMatcher: PerceptualHashMatcher;
  private hybridAI: HybridSimilarityAI;
  private contextReuse: ContextAwareReuseEngine;

  constructor() {
    this.multiDimension = new MultiDimensionSimilarity();
    this.embeddingSearch = new EmbeddingSearchEngine();
    this.hashMatcher = new PerceptualHashMatcher();
    this.hybridAI = new HybridSimilarityAI();
    this.contextReuse = new ContextAwareReuseEngine();
  }

  compare(a: ImageProfile, b: ImageProfile, weights?: SimilarityWeights): SimilarityResult {
    return this.multiDimension.compare(a, b, weights);
  }

  embeddingSearchQuery(query: number[], topK = 10) {
    return this.embeddingSearch.search(query, topK);
  }

  indexEmbedding(assetId: string, embedding: number[], metadata?: Record<string, unknown>): void {
    if (!assetId) throw new Error("assetId is required");
    if (!embedding || embedding.length === 0) throw new Error("embedding vector is required");

    this.embeddingSearch.indexEntry({ assetId, embedding, metadata: metadata ?? {} });
  }

  registerHash(hashSet: PerceptualHashSet): void {
    if (!hashSet || !hashSet.assetId) throw new Error("PerceptualHashSet with assetId is required");
    this.hashMatcher.register(hashSet);
  }

  findDuplicate(hashSet: PerceptualHashSet): string | null {
    if (!hashSet) return null;
    return this.hashMatcher.findExactMatch(hashSet);
  }

  findNearDuplicates(hashSet: PerceptualHashSet, threshold = 90) {
    if (!hashSet) return [];
    return this.hashMatcher.findNearMatches(hashSet, threshold);
  }

  hybridScore(input: HybridSimilarityInput) {
    if (!input) throw new Error("HybridSimilarityInput is required");
    return this.hybridAI.combine(input);
  }

  evaluateReuse(context: ReuseContext): ReuseDecision {
    if (!context) throw new Error("ReuseContext is required");
    return this.contextReuse.evaluate(context);
  }

  findBestReuse(
    queryProfile: ImageProfile,
    candidates: ImageProfile[],
    context?: ReuseContext,
    weights?: SimilarityWeights
  ): { result: SimilarityResult; decision?: ReuseDecision } | null {
    if (!queryProfile) throw new Error("queryProfile is required");
    if (!candidates) throw new Error("candidates array is required");
    if (candidates.length === 0) return null;

    const scored = candidates
      .filter((c) => c != null)
      .map((c) => this.compare(queryProfile, c, weights))
      .sort((a, b) => b.overallScore - a.overallScore);

    const best = scored[0];
    if (!best) return null;

    if (context && best.overallScore >= 65) {
      const decision = this.contextReuse.evaluate(context);
      return { result: best, decision };
    }

    return { result: best };
  }
}
