export type ModelProfileType =
  | "HighestQuality"
  | "Balanced"
  | "LowestCost"
  | "Fastest"
  | "Experimental";

export interface ModelPerformanceMetricsRecord {
  readonly recordId: string;
  readonly modelId: string;
  readonly capability: string;
  readonly latencyMs: number;
  readonly success: boolean;
  readonly qualityScore: number;
  readonly humanCorrectionRequired: boolean;
  readonly tokensConsumed: number;
  readonly costUSD: number;
  readonly timestamp: Date;
}

export interface ModelScorecardDescriptor {
  readonly modelId: string;
  readonly modelName: string;
  readonly overallRating: number; // 0 - 100
  readonly reliabilityIndex: number;
  readonly averageLatencyMs: number;
  readonly averageCostUSD: number;
  readonly humanAcceptanceRatePercent: number;
  readonly capabilityScores: Record<string, number>;
  readonly lastBenchmarkDate: Date;
}

export interface CapabilityRankingItem {
  readonly rank: number;
  readonly modelId: string;
  readonly capability: string;
  readonly score: number;
  readonly recommendedProfile: ModelProfileType;
}

export interface AbExperimentRecord {
  readonly experimentId: string;
  readonly capability: string;
  readonly modelIdA: string;
  readonly modelIdB: string;
  readonly winnerModelId: string;
  readonly scoreA: number;
  readonly scoreB: number;
  readonly timestamp: Date;
}

export interface RegressionAlertDescriptor {
  readonly alertId: string;
  readonly modelId: string;
  readonly capability: string;
  readonly regressionType: "IncreasedFailures" | "LowerQuality" | "HigherLatency" | "RisingCosts";
  readonly degradationPercent: number;
  readonly timestamp: Date;
}
