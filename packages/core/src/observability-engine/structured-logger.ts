export type LogLevel = "Trace" | "Debug" | "Info" | "Warning" | "Error" | "Critical";

export interface LogEntry {
  readonly timestamp: Date;
  readonly severity: LogLevel;
  readonly component: string;
  readonly correlationId: string;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
  readonly thread: string;
  readonly version: string;
}

/**
 * Structured Logger & Correlation Engine (IB Part 24 - Section 4, 5, 10, 22).
 * Formats every log entry as a structured, correlatable record.
 */
export class StructuredLogger {
  private logs: LogEntry[] = [];
  private activeCorrelationId = `corr_${Math.floor(Math.random() * 9000 + 1000)}`;

  public setCorrelationId(id: string): void {
    this.activeCorrelationId = id;
  }

  public getCorrelationId(): string {
    return this.activeCorrelationId;
  }

  public log(
    severity: LogLevel,
    component: string,
    message: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date(),
      severity,
      component,
      correlationId: this.activeCorrelationId,
      message,
      metadata,
      thread: "MainLoop",
      version: "2.0.0",
    };
    this.logs.push(entry);
    return entry;
  }

  public info(component: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return this.log("Info", component, message, metadata);
  }

  public error(component: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return this.log("Error", component, message, metadata);
  }

  public getLogs(): ReadonlyArray<LogEntry> {
    return this.logs;
  }
}
