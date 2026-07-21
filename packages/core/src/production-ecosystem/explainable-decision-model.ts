export interface AlternativeOption {
  readonly optionId: string;
  readonly label: string;
  readonly description: string;
}

/**
 * Explainable Decision Model (Vol 04 Part 01 - Section 8, Section 9).
 * Every AI recommendation contains recommendation, clear reason, confidence, alternatives, and expected impact.
 */
export interface AiDecisionRecommendation {
  readonly recommendationId: string;
  readonly actionType: string;
  readonly recommendation: string;
  readonly reason: string; // Transparent explanation
  readonly confidence: number; // 0.0 to 1.0
  readonly alternatives: ReadonlyArray<AlternativeOption>;
  readonly expectedImpact: string; // e.g. "Improves narrative pacing by 15%"
  readonly isApproved: boolean;
}

export function createExplainableDecision(
  actionType: string,
  recommendation: string,
  reason: string,
  confidence: number,
  expectedImpact: string,
  alternatives: AlternativeOption[] = []
): AiDecisionRecommendation {
  return {
    recommendationId: `rec_${Math.random().toString(36).substring(2, 9)}`,
    actionType,
    recommendation,
    reason,
    confidence: Math.min(1.0, Math.max(0.0, confidence)),
    alternatives,
    expectedImpact,
    isApproved: false,
  };
}
