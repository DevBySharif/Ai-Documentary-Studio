import { ValidationIssue } from "./reviewer-types";

export interface AutomatedCorrectionPlan {
  readonly issueId: string;
  readonly targetComponent: string;
  readonly proposedAction: string;
}

/**
 * Automated Correction Suggester (Vol 04 Part 11 - Section 16).
 * Proposes actionable fixes (script revisions, asset replacements, timeline adjustments, pronunciation fixes).
 */
export class CorrectionSuggester {
  public generateCorrectionPlans(issues: ReadonlyArray<ValidationIssue>): ReadonlyArray<AutomatedCorrectionPlan> {
    return issues.map((iss) => ({
      issueId: iss.issueId,
      targetComponent: iss.affectedComponent,
      proposedAction: iss.suggestedFix || `Auto-remediate ${iss.domain} error.`,
    }));
  }
}
