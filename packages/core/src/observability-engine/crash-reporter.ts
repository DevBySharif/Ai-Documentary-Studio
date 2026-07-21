export interface CrashReport {
  readonly reportId: string;
  readonly stackTrace: string;
  readonly appVersion: string;
  readonly activeWorkflowId?: string;
  readonly loadedPlugins: ReadonlyArray<string>;
  readonly timestamp: Date;
}

export interface DiagnosticBundle {
  readonly bundleId: string;
  readonly logsCount: number;
  readonly metricsCount: number;
  readonly systemHealthSummary: string;
  readonly exportedAt: Date;
}

/**
 * Crash Reporter & Diagnostic Bundler (IB Part 24 - Section 8, Section 11).
 * Anonymizes sensitive project data and exports diagnostic bundles.
 */
export class CrashReporter {
  private reports: CrashReport[] = [];

  public captureCrash(stackTrace: string, activeWorkflowId?: string, plugins: string[] = []): CrashReport {
    const report: CrashReport = {
      reportId: `crash_${Math.random().toString(36).substring(2, 9)}`,
      stackTrace: this.anonymizeStackTrace(stackTrace),
      appVersion: "2.0.0",
      activeWorkflowId,
      loadedPlugins: plugins,
      timestamp: new Date(),
    };
    this.reports.push(report);
    return report;
  }

  private anonymizeStackTrace(rawTrace: string): string {
    // Strip user home directory paths for privacy
    return rawTrace.replace(/([C-Z]:\\[^\\]+\\[^\\]+\\)/g, "<user_home>\\");
  }

  public createDiagnosticBundle(logsCount: number, metricsCount: number, healthSummary: string): DiagnosticBundle {
    return {
      bundleId: `bundle_${Math.random().toString(36).substring(2, 9)}`,
      logsCount,
      metricsCount,
      systemHealthSummary: healthSummary,
      exportedAt: new Date(),
    };
  }
}
