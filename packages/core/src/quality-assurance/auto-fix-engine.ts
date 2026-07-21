import type { QAIssue, QAAutoFix } from "./types.js";

export class QAAutoFixEngine {
  private fixes: QAAutoFix[] = [];

  apply(issue: QAIssue): boolean {
    if (!issue.autoFixable) return false;

    const fix: QAAutoFix = { issueType: issue.type, correction: issue.suggestedFix, applied: true };
    this.fixes.push(fix);
    return true;
  }

  applyAll(issues: QAIssue[]): { fixed: number; failed: number } {
    let fixed = 0;
    let failed = 0;

    for (const issue of issues) {
      if (issue.autoFixable && this.apply(issue)) {
        issue.autoFixed = true;
        fixed++;
      } else {
        failed++;
      }
    }

    return { fixed, failed };
  }

  isSafeCorrection(issue: QAIssue): boolean {
    return issue.severity !== "critical" && issue.autoFixable;
  }

  getAppliedFixes(): QAAutoFix[] {
    return [...this.fixes];
  }

  clear(): void {
    this.fixes = [];
  }

  getFixCount(): number {
    return this.fixes.length;
  }
}
