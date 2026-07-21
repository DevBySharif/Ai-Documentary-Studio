export interface AssetOptimizationReport {
  libraryHealth: number;
  archiveCount: number;
  regenerateCount: number;
  upscaleCount: number;
  keepCount: number;
  reusePriorityUpdated: boolean;
}

export interface AssetQuality {
  assetId: string;
  resolution: number;
  sharpness: number;
  styleConsistency: number;
  composition: number;
  promptQuality: number;
  motionCompatibility: number;
  reuseValue: number;
  overall: number;
}

export interface LibraryHealth {
  totalAssets: number;
  duplicateAssets: number;
  unusedAssets: number;
  damagedAssets: number;
  lowQualityAssets: number;
  obsoleteAssets: number;
  frequentlyUsedAssets: number;
  healthScore: number;
}

export interface RegenerationQueueItem {
  assetId: string;
  reason: string;
  priority: number;
}

export interface RedundancyCluster {
  clusterId: string;
  assetIds: string[];
  type: "image" | "prompt" | "concept" | "motion";
  recommendedAction: "merge" | "archive" | "keep_best";
}

export interface PromptReview {
  promptId: string;
  prompt: string;
  classification: "excellent" | "good" | "average" | "weak" | "obsolete";
  score: number;
}

export interface PredictiveAssetValue {
  assetId: string;
  expectedReuseFrequency: number;
  topicPopularity: number;
  visualUniqueness: number;
  symbolicFlexibility: number;
  motionCompatibility: number;
  styleStability: number;
  futureValueScore: number;
}

export interface AssetLifecycle {
  assetId: string;
  stage: "new" | "growing" | "frequently_used" | "mature" | "archive_candidate";
  daysInStage: number;
  reuseTrend: "increasing" | "stable" | "decreasing";
}
