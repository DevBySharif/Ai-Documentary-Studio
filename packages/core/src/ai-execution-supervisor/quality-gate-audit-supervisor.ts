export interface QualityGateResult {
  readonly gateName: string; // e.g. "Script Coherence", "Visual Consistency", "Voice Pronunciation"
  readonly passed: boolean;
  readonly scorePercent: number;
  readonly thresholdPercent: number;
}

export interface ExecutionAuditLogEntry {
  readonly auditId: string;
  readonly planId: string;
  readonly taskId: string;
  readonly actionName: string;
  readonly timestamp: Date;
}

/**
 * Quality Gate & Execution Audit Supervisor (Vol 07 Part 04 - Section 14, Section 16).
 * Pauses execution if quality gates fall below threshold and records complete execution audit trails for replayability.
 */
export class QualityGateAuditSupervisor {
  private auditLogs: ExecutionAuditLogEntry[] = [];

  public evaluateQualityGate(gateName: string, scorePercent: number, thresholdPercent = 80): QualityGateResult {
    return {
      gateName,
      passed: scorePercent >= thresholdPercent,
      scorePercent,
      thresholdPercent,
    };
  }

  public logExecutionAction(planId: string, taskId: string, actionName: string): ExecutionAuditLogEntry {
    const entry: ExecutionAuditLogEntry = {
      auditId: `aud_exec_${Math.random().toString(36).substring(2, 7)}`,
      planId,
      taskId,
      actionName,
      timestamp: new Date(),
    };
    this.auditLogs.push(entry);
    return entry;
  }
}
