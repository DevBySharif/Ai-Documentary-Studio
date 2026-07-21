import type { SemanticSegment } from "../segmentation/types.js";

export type ImageStrategy = "reuse" | "motion_only" | "word_insert" | "symbol_insert" | "new_image" | "split_scene" | "merge_scene" | "hold";

export interface ImageDecision {
  segment: number;
  strategy: ImageStrategy;
  imageId?: string;
  reuseCount?: number;
  screenTime?: number;
  motion?: string;
  transition?: string;
  confidence: number;
  reason: string;
  opportunityScore: number;
}

export interface ReuseScoreResult {
  score: number;
  conceptMatch: number;
  emotionMatch: number;
  cameraMatch: number;
  compositionMatch: number;
  intentMatch: number;
  continuityBonus: number;
}

export interface ImageMemoryEntry {
  imageId: string;
  concept: string;
  emotion: string;
  camera: string;
  composition: string;
  visualIntent: string;
  reuseCount: number;
  totalScreenTime: number;
  lastUsedScene: number;
  environment: string;
  character: string;
}

export interface ImageCostEstimate {
  generationCost: number;
  reuseCost: number;
  timeCost: number;
  memoryCost: number;
  recommended: ImageStrategy;
}

export interface DecisionTreeResult {
  meaningChanged: boolean;
  emotionChanged: boolean;
  imageMatches: boolean;
  symbolAvailable: boolean;
  finalStrategy: ImageStrategy;
  path: string[];
}

export interface OpportunityEvaluation {
  score: number;
  canExplainWithCurrent: boolean;
  canCameraMoveReplace: boolean;
  canCropReveal: boolean;
  canWordInsertReplace: boolean;
  canCombineImages: boolean;
  recommendation: ImageStrategy;
}
