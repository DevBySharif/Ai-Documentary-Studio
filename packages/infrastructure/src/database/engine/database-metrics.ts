/**
 * Operational metrics emitted by the database engine.
 * Integrates with the application observability subsystem.
 */
export interface DatabaseMetrics {
  connectionUptimeMs: number;
  activeTransactionCount: number;
  totalQueriesExecuted: number;
  averageQueryDurationMs: number;
  lastWalCheckpointDurationMs: number;
  lastBackupDurationMs: number;
  lastIntegrityCheckDurationMs: number;
  schemaVersion: number;
}

export class DatabaseMetricsCollector {
  private startTime = Date.now();
  private queryCount = 0;
  private totalQueryDurationMs = 0;
  private activeTransactions = 0;
  private lastCheckpointMs = 0;
  private lastBackupMs = 0;
  private lastIntegrityMs = 0;
  private currentSchemaVersion = 0;

  public recordQuery(durationMs: number): void {
    this.queryCount++;
    this.totalQueryDurationMs += durationMs;
  }

  public recordTransactionStart(): void {
    this.activeTransactions++;
  }

  public recordTransactionEnd(): void {
    this.activeTransactions = Math.max(0, this.activeTransactions - 1);
  }

  public recordWalCheckpoint(durationMs: number): void {
    this.lastCheckpointMs = durationMs;
  }

  public recordBackup(durationMs: number): void {
    this.lastBackupMs = durationMs;
  }

  public recordIntegrityCheck(durationMs: number): void {
    this.lastIntegrityMs = durationMs;
  }

  public setSchemaVersion(version: number): void {
    this.currentSchemaVersion = version;
  }

  public collect(): DatabaseMetrics {
    return {
      connectionUptimeMs: Date.now() - this.startTime,
      activeTransactionCount: this.activeTransactions,
      totalQueriesExecuted: this.queryCount,
      averageQueryDurationMs:
        this.queryCount > 0 ? this.totalQueryDurationMs / this.queryCount : 0,
      lastWalCheckpointDurationMs: this.lastCheckpointMs,
      lastBackupDurationMs: this.lastBackupMs,
      lastIntegrityCheckDurationMs: this.lastIntegrityMs,
      schemaVersion: this.currentSchemaVersion,
    };
  }
}
