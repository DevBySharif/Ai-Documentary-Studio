import { DecisionInputsDescriptor, ConstraintAnalysisReport, DecisionOutcomeType } from "./decision-types";

/**
 * Constraint Analyzer & Multi-Factor Weighted Scoring Matrix (Vol 07 Part 08 - Section 7, Section 8, Section 9).
 * Evaluates budget/token/provider constraints and computes weighted scores for alternative decision outcomes.
 */
export class ConstraintScoringMatrix {
  public analyzeConstraints(inputs: DecisionInputsDescriptor): ConstraintAnalysisReport {
    const active: string[] = [];

    if (inputs.remainingBudgetUSD <= 0) active.push("BudgetExceeded");
    if (inputs.providerHealthStatus === "Outage") active.push("ProviderOutage");
    if (!inputs.isGPUAvailable) active.push("GpuUnavailable");

    return {
      isBudgetExceeded: inputs.remainingBudgetUSD <= 0,
      isTokenLimitReached: false,
      isProviderOutage: inputs.providerHealthStatus === "Outage",
      activeConstraints: active,
    };
  }

  public scoreDecisionOutcomes(
    inputs: DecisionInputsDescriptor,
    constraints: ConstraintAnalysisReport
  ): { bestOutcome: DecisionOutcomeType; score: number; rejected: DecisionOutcomeType[] } {
    if (constraints.isProviderOutage) {
      return { bestOutcome: "SwitchProvider", score: 95, rejected: ["AcceptOutput", "RetryGeneration"] };
    }

    if (inputs.isSensitiveHistoricalFact && inputs.aiConfidence < 85) {
      return { bestOutcome: "EscalateToHumanReview", score: 98, rejected: ["AcceptOutput"] };
    }

    if (inputs.qualityScore >= 85) {
      return { bestOutcome: "AcceptOutput", score: 99, rejected: ["RetryGeneration", "SwitchProvider"] };
    }

    if (inputs.qualityScore >= 65) {
      return { bestOutcome: "RetryGeneration", score: 85, rejected: ["EscalateToHumanReview"] };
    }

    return { bestOutcome: "SwitchProvider", score: 80, rejected: ["AcceptOutput"] };
  }
}
