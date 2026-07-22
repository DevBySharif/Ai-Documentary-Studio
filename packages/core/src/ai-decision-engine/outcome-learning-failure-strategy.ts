import { DecisionOutcomeType } from "./decision-types";

export interface OutcomeFeedback {
  readonly decisionId: string;
  readonly wasSuccessful: boolean;
  readonly requiredHumanCorrection: boolean;
  readonly userRegenerated: boolean;
}

/**
 * Outcome Analysis & Failure Strategy Selector (Vol 07 Part 08 - Section 13, Section 15).
 * Evaluates outcome feedback data and selects failure recovery strategies (`Retry`, `FallbackProvider`, `SimplifiedWorkflow`, `HumanIntervention`).
 */
export class OutcomeLearningFailureStrategy {
  private feedbackLog: OutcomeFeedback[] = [];

  public logOutcomeFeedback(feedback: OutcomeFeedback): void {
    this.feedbackLog.push(feedback);
  }

  public selectFailureRecoveryStrategy(failureReason: string): DecisionOutcomeType {
    if (failureReason.toLowerCase().includes("provider")) {
      return "SwitchProvider";
    }
    if (failureReason.toLowerCase().includes("context")) {
      return "ReduceContext";
    }
    return "EscalateToHumanReview";
  }
}
