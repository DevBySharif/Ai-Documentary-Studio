import type { PDFailureReport, PDEngineType } from "./types.js";

export class PDFailureRecovery {
  private lastCheckpoint: PDFailureReport | null = null;

  report(engine: PDEngineType, stage: string, recoverable: boolean): PDFailureReport {
    const report: PDFailureReport = {
      failedEngine: engine,
      failedStage: stage,
      preservedWork: true,
      restartScope: recoverable ? "module" : "stage",
      recoverable
    };
    this.lastCheckpoint = report;
    return report;
  }

  getLastCheckpoint(): PDFailureReport | null {
    return this.lastCheckpoint;
  }

  recover(report: PDFailureReport): string {
    if (report.restartScope === "module") return `Restarting ${report.failedEngine} from ${report.failedStage}`;
    if (report.restartScope === "stage") return `Restarting ${report.failedStage} stage`;
    return "Cannot recover — restart required";
  }

  clear(): void {
    this.lastCheckpoint = null;
  }
}
