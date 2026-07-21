import { StructuredLogEntry, LogLevel } from "./observability-types";

/**
 * Central Structured Logging Service & Privacy Sanitizer (Vol 06 Part 09 - Section 4, Section 5, Section 6, Section 18).
 * Formats structured log entries and automatically masks sensitive keys/tokens/passwords.
 */
export class StructuredLoggerService {
  private activeLevel: LogLevel = "Info";
  private logsHistory: StructuredLogEntry[] = [];

  private levelPriority: Record<LogLevel, number> = {
    Trace: 1,
    Debug: 2,
    Info: 3,
    Warning: 4,
    Error: 5,
    Critical: 6,
  };

  public setLogLevel(level: LogLevel): void {
    this.activeLevel = level;
  }

  public log(
    level: LogLevel,
    component: string,
    event: string,
    message: string,
    correlationId = "corr_default",
    projectId?: string,
    rawContext: Record<string, unknown> = {}
  ): StructuredLogEntry | undefined {
    if (this.levelPriority[level] < this.levelPriority[this.activeLevel]) {
      return undefined;
    }

    const sanitizedContext = this.sanitizePrivacyContext(rawContext);
    const entry: StructuredLogEntry = {
      logId: `log_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
      level,
      component,
      event,
      message,
      correlationId,
      projectId,
      context: sanitizedContext,
    };
    this.logsHistory.push(entry);
    return entry;
  }

  private sanitizePrivacyContext(ctx: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const sensitiveKeys = ["apikey", "secret", "token", "password", "auth"];

    for (const [k, v] of Object.entries(ctx)) {
      if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
        sanitized[k] = "[MASKED_SENSITIVE_DATA]";
      } else {
        sanitized[k] = v;
      }
    }
    return sanitized;
  }

  public getRecentLogs(): ReadonlyArray<StructuredLogEntry> {
    return this.logsHistory;
  }
}
