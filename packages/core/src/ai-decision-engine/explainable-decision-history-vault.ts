import { DecisionRecord, DecisionOutcomeType } from "./decision-types";

/**
 * Explainable Decision Audit Trail & Human Override Vault (Vol 07 Part 08 - Section 10, Section 11, Section 12).
 * Records transparent decision rationale, history logs, and supports human override recording.
 */
export class ExplainableDecisionHistoryVault {
  private history: DecisionRecord[] = [];

  public recordDecision(
    selectedOutcome: DecisionOutcomeType,
    score: number,
    rationale: string,
    rejectedAlternatives: DecisionOutcomeType[],
    activePolicies: string[],
    isHumanOverride = false
  ): DecisionRecord {
    const record: DecisionRecord = {
      decisionId: `dec_${Math.random().toString(36).substring(2, 7)}`,
      selectedOutcome,
      decisionScore: score,
      rationale,
      rejectedAlternatives,
      activePolicies,
      isHumanOverride,
      timestamp: new Date(),
    };

    this.history.push(record);
    return record;
  }

  public getHistory(): ReadonlyArray<DecisionRecord> {
    return this.history;
  }
}
