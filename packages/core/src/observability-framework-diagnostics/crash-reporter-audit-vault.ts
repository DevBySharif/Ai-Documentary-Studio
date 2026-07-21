import { ErrorCategory } from "./observability-types";

export interface CrashReportItem {
  readonly reportId: string;
  readonly category: ErrorCategory;
  readonly exceptionMessage: string;
  readonly stackTrace: string;
  readonly activeModuleName: string;
  readonly timestamp: Date;
}

export interface ImmutableAuditLogRecord {
  readonly auditLogId: string;
  readonly actionName: string;
  readonly actor: string;
  readonly detailsJson: string;
  readonly timestamp: Date;
}

/**
 * Crash Reporter Engine & Immutable Audit Log Vault (Vol 06 Part 09 - Section 11, Section 12, Section 13).
 * Captures unexpected crash exception details and maintains immutable audit logs for critical project operations.
 */
export class CrashReporterAuditVault {
  private crashReports: CrashReportItem[] = [];
  private auditLogs: ImmutableAuditLogRecord[] = [];

  public captureCrash(category: ErrorCategory, exceptionMessage: string, stackTrace: string, activeModuleName: string): CrashReportItem {
    const report: CrashReportItem = {
      reportId: `crash_${Math.random().toString(36).substring(2, 7)}`,
      category,
      exceptionMessage,
      stackTrace,
      activeModuleName,
      timestamp: new Date(),
    };
    this.crashReports.push(report);
    return report;
  }

  public recordImmutableAudit(actionName: string, actor: string, detailsObj: unknown): ImmutableAuditLogRecord {
    const record: ImmutableAuditLogRecord = {
      auditLogId: `aud_imm_${Math.random().toString(36).substring(2, 7)}`,
      actionName,
      actor,
      detailsJson: JSON.stringify(detailsObj),
      timestamp: new Date(),
    };
    this.auditLogs.push(record);
    return record;
  }

  public getAuditLogs(): ReadonlyArray<ImmutableAuditLogRecord> {
    return this.auditLogs;
  }
}
