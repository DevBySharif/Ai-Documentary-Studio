export type DecisionOutcomeType =
  | "AcceptOutput"
  | "RetryGeneration"
  | "SwitchProvider"
  | "ChangeModel"
  | "ReduceContext"
  | "RequestClarification"
  | "PauseWorkflow"
  | "EscalateToHumanReview";

export type PolicyPriorityType =
  | "Safety"
  | "Correctness"
  | "Quality"
  | "Reliability"
  | "UserPolicy"
  | "Cost"
  | "Speed";

export interface DecisionPolicyConfig {
  readonly preferQualityOverSpeed: boolean;
  readonly preferLowestCost: boolean;
  readonly preferLocalModels: boolean;
  readonly requireHumanApprovalForFacts: boolean;
  readonly allowExperimentalModels: boolean;
}

export interface DecisionInputsDescriptor {
  readonly qualityScore: number;
  readonly aiConfidence: number;
  readonly remainingBudgetUSD: number;
  readonly providerHealthStatus: "Healthy" | "Degraded" | "Outage";
  readonly isGPUAvailable: boolean;
  readonly isSensitiveHistoricalFact: boolean;
  readonly userPreference: "Quality" | "Speed" | "Cost";
}

export interface ConstraintAnalysisReport {
  readonly isBudgetExceeded: boolean;
  readonly isTokenLimitReached: boolean;
  readonly isProviderOutage: boolean;
  readonly activeConstraints: ReadonlyArray<string>;
}

export interface DecisionRecord {
  readonly decisionId: string;
  readonly selectedOutcome: DecisionOutcomeType;
  readonly decisionScore: number;
  readonly rationale: string;
  readonly rejectedAlternatives: ReadonlyArray<DecisionOutcomeType>;
  readonly activePolicies: ReadonlyArray<string>;
  readonly isHumanOverride: boolean;
  readonly timestamp: Date;
}
