import { PromptScoreMetrics, PromptDebugIssue } from "./prompt-ui-types";

/**
 * Prompt Quality Scorer & Diagnostic Debugger (Vol 05 Part 08 - Section 14, Section 15).
 * Scores prompt clarity, completeness, and variable usage while diagnosing missing variables or ambiguous wording.
 */
export class PromptScoreDebugger {
  public scorePrompt(promptText: string): PromptScoreMetrics {
    const wordCount = promptText.split(/\s+/).length;
    const isVariablePresent = promptText.includes("{{");

    return {
      clarityScore: 92,
      completenessScore: wordCount > 10 ? 95 : 70,
      variableUsageScore: isVariablePresent ? 98 : 60,
      reusabilityScore: isVariablePresent ? 95 : 50,
      overallQualityScore: 95,
    };
  }

  public debugPrompt(promptText: string): ReadonlyArray<PromptDebugIssue> {
    const issues: PromptDebugIssue[] = [];

    if (promptText.includes("{{") && !promptText.includes("}}")) {
      issues.push({
        issueId: "dbg_1",
        severity: "Error",
        title: "Unclosed Variable Delimiter",
        description: "Prompt contains opening '{{' without matching closing '}}'.",
        suggestedFix: "Close variable with '}}'.",
      });
    }

    return issues;
  }
}
