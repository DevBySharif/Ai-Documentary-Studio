export type SimilarityDimension =
  | "semantic" | "visual" | "style" | "composition"
  | "emotion" | "character" | "object" | "color";

export type ReuseRecommendation = "reuse_immediately" | "reuse" | "suggest_reuse" | "manual_review" | "generate_new";

export interface SimilarityWeights {
  semantic: number;
  style: number;
  composition: number;
  emotion: number;
  objects: number;
  color: number;
}

export interface DimensionScore {
  dimension: SimilarityDimension;
  score: number;
  confidence: number;
}

export interface SimilarityResult {
  sourceAssetId: string;
  targetAssetId: string;
  overallScore: number;
  dimensions: DimensionScore[];
  recommendation: ReuseRecommendation;
  confidence: number;
  reason: string;
}

export interface EmbeddingIndexEntry {
  assetId: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

export interface NearestNeighborResult {
  assetId: string;
  similarity: number;
  distance: number;
}

export interface PerceptualHashSet {
  assetId: string;
  perceptualHash: string;
  differenceHash: string;
  averageHash: string;
}

export interface HybridSimilarityInput {
  embeddingScore: number;
  perceptualHashScore: number;
  objectOverlap: number;
  dnaMatch: number;
  promptSimilarity: number;
}

export interface HybridSimilarityResult {
  combinedScore: number;
  embeddingWeight: number;
  hashWeight: number;
  objectWeight: number;
  dnaWeight: number;
  promptWeight: number;
  breakdown: string;
}

export interface ReuseContext {
  assetId: string;
  shownRecently: boolean;
  lastShownTime: number | null;
  timeSinceLastShow: number;
  narrationText: string;
  narrationTheme: string;
  hasCameraMotion: boolean;
  wouldImproveContinuity: boolean;
  wouldCauseFatigue: boolean;
  isSymbolicInsert: boolean;
}

export interface ReuseDecision {
  shouldReuse: boolean;
  confidence: number;
  reason: string;
  suggestedMotion?: string;
  suggestedDuration?: number;
}

export const DEFAULT_SIMILARITY_WEIGHTS: SimilarityWeights = {
  semantic: 0.4,
  style: 0.2,
  composition: 0.15,
  emotion: 0.1,
  objects: 0.1,
  color: 0.05,
};
