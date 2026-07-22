export type TaskComplexityLevel = "Trivial" | "Simple" | "Moderate" | "Complex" | "Expert";

export interface ContextBudgetAllocation {
  readonly maxTotalTokens: number;
  readonly systemInstructionsTokens: number;
  readonly projectContextTokens: number;
  readonly knowledgeRetrievalTokens: number;
  readonly userRequestTokens: number;
  readonly examplesTokens: number;
  readonly constraintsTokens: number;
}

export interface CostForecastDescriptor {
  readonly forecastId: string;
  readonly estimatedTokens: number;
  readonly estimatedApiCostUSD: number;
  readonly estimatedGpuMinutes: number;
  readonly estimatedTotalWorkflowCostUSD: number;
}

export interface ProjectBudgetLimits {
  readonly dailyLimitUSD: number;
  readonly monthlyLimitUSD: number;
  readonly perWorkflowLimitUSD: number;
  readonly maxCostPerTaskUSD: number;
}

export interface CacheHitDescriptor {
  readonly isCacheHit: boolean;
  readonly cacheKey: string;
  readonly cachedContent?: string;
  readonly tokensSaved: number;
  readonly costSavedUSD: number;
}

export interface EfficiencyMetricsRecord {
  readonly costPerCompletedTaskUSD: number;
  readonly tokensPerAcceptedOutput: number;
  readonly cacheHitRatePercent: number;
  readonly averageRetryCostUSD: number;
  readonly costPerProductionMinuteUSD: number;
}
