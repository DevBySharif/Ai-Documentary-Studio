import { ValidationIssue } from "./reviewer-types";

/**
 * Timeline & Entity Continuity Auditor (Vol 04 Part 11 - Section 8, Section 9).
 * Audits chronological ordering, cause-and-effect progression, and character/entity naming consistency.
 */
export class TimelineContinuityAuditor {
  public auditContinuity(
    chronologicalErrorsCount = 0,
    inconsistentEntityNames: string[] = []
  ): ReadonlyArray<ValidationIssue> {
    const issues: ValidationIssue[] = [];

    if (chronologicalErrorsCount > 0) {
      issues.push({
        issueId: `iss_${Math.random().toString(36).substring(2, 7)}`,
        domain: "TimelineConsistency",
        severity: "Critical",
        title: "Anachronistic Timeline Sequence",
        description: `${chronologicalErrorsCount} chronological sequence error(s) detected in scene progression.`,
        affectedComponent: "Timeline",
        suggestedFix: "Reorder timeline clips according to historical event dates.",
        isIgnoredByUser: false,
      });
    }

    inconsistentEntityNames.forEach((ent) => {
      issues.push({
        issueId: `iss_${Math.random().toString(36).substring(2, 7)}`,
        domain: "EntityContinuity",
        severity: "Low",
        title: `Inconsistent Entity Terminology: ${ent}`,
        description: `Entity '${ent}' is named differently across script scenes.`,
        affectedComponent: "Script",
        suggestedFix: `Standardize name to primary dictionary term.`,
        isIgnoredByUser: false,
      });
    });

    return issues;
  }
}
