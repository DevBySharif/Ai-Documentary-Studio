import { PolicyFrameworkEvaluator } from "./policy-framework-evaluator";
import { ConstraintScoringMatrix } from "./constraint-scoring-matrix";
import { ExplainableDecisionHistoryVault } from "./explainable-decision-history-vault";
import { OutcomeLearningFailureStrategy } from "./outcome-learning-failure-strategy";
import { DecisionInputsDescriptor, DecisionRecord } from "./decision-types";

/**
 * Master AI Decision Engine (Main Vol 07 Part 08).
 * Core entry point for policy-driven autonomous decision making. Drives 5-stage decision pipeline (`Inputs → Policy → Constraints → Scoring → Instruction`).
 */
export class MasterAiDecisionEngine {
  public readonly policyEvaluator = new PolicyFrameworkEvaluator();
  public readonly constraintScorer = new ConstraintScoringMatrix();
  public readonly historyVault = new ExplainableDecisionHistoryVault();
  public readonly failureStrategy = new OutcomeLearningFailureStrategy();

  public makeAutonomousDecision(inputs: DecisionInputsDescriptor): DecisionRecord {
    // 1. Policy Evaluation & Priority Hierarchy
    this.policyEvaluator.getActivePolicy();
    this.policyEvaluator.getPriorityHierarchy();

    // 2. Constraint Analysis
    const constraints = this.constraintScorer.analyzeConstraints(inputs);

    // 3. Decision Scoring & Selection
    const { bestOutcome, score, rejected } = this.constraintScorer.scoreDecisionOutcomes(inputs, constraints);

    const rationale = `Selected ${bestOutcome} with score ${score}. Active constraints: [${constraints.activeConstraints.join(", ")}].`;

    // 4. Record Decision
    return this.historyVault.recordDecision(
      bestOutcome,
      score,
      rationale,
      rejected,
      ["SafetyFirstPolicy", "QualityPreference"],
      false
    );
  }
}
