import { TestReport } from './types';

export class TestReports {
  private reports: TestReport[] = [];

  storeReport(report: TestReport): void {
    this.reports.push(report);
    // Write to disk
  }

  getLatestReport(suiteName: string): TestReport | undefined {
    return this.reports.find(r => r.suiteName.includes(suiteName));
  }

  generateSummary(): string {
    const totalPassed = this.reports.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.reports.reduce((sum, r) => sum + r.failed, 0);
    return `Summary: ${totalPassed} Passed, ${totalFailed} Failed.`;
  }
}
