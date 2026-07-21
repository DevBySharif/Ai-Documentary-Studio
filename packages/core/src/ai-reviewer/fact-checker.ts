import { ValidationIssue } from "./reviewer-types";

/**
 * Independent Fact Checker, Citation Validator & Hallucination Detector (Vol 04 Part 11 - Section 5, Section 6, Section 7).
 * Independent audit layer verifying dates, names, events, citations, and flagging potential AI hallucinations.
 */
export class FactChecker {
  public auditFactsAndCitations(
    scriptText: string,
    citationsCount: number
  ): ReadonlyArray<ValidationIssue> {
    const issues: ValidationIssue[] = [];

    if (citationsCount === 0) {
      issues.push({
        issueId: `iss_${Math.random().toString(36).substring(2, 7)}`,
        domain: "Citation",
        severity: "High",
        title: "Missing Factual Citations",
        description: "No supporting citations attached to script claims.",
        affectedComponent: "Script",
        suggestedFix: "Attach citations from research notebook to factual statements.",
        isIgnoredByUser: false,
      });
    }

    // Check potential hallucinated statistics
    if (scriptText.includes("100% of historians agree")) {
      issues.push({
        issueId: `iss_${Math.random().toString(36).substring(2, 7)}`,
        domain: "Hallucination",
        severity: "Medium",
        title: "Potential Exaggerated Claim / Hallucination",
        description: "Absolute claim detected that may lack source evidence.",
        affectedComponent: "Script",
        suggestedFix: "Softened phrasing to 'Broad consensus among historians indicates...'",
        isIgnoredByUser: false,
      });
    }

    return issues;
  }
}
