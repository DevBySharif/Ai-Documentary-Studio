import { LogLevelSeverity, StructuredLogEntry, DistributedTraceSpan } from "./observability-types";

/**
 * Structured Logger & Correlation Tracer (Vol 09 Part 05 - Section 4, Section 5, Section 7, Section 8).
 * Generates structured logs across 6 severity levels (`Trace`, `Debug`, `Information`, `Warning`, `Error`, `Critical`) and tracks correlation IDs.
 */
export class StructuredLoggerCorrelationTracer {
  private logs: StructuredLogEntry[] = [];
  private spans: DistributedTraceSpan[] = [];

  public logMessage(
    service: string,
    component: string,
    severity: LogLevelSeverity,
    correlationId: string,
    message: string,
    metadataObj: unknown = {},
    requestId?: string,
    userId?: string
  ): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      logId: `log_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date(),
      service,
      component,
      severity,
      correlationId,
      requestId,
      userId,
      message,
      metadataJson: JSON.stringify(metadataObj),
    };

    this.logs.push(entry);
    return entry;
  }

  public recordSpan(traceId: string, serviceName: string, operationName: string, durationMs: number, parentSpanId?: string): DistributedTraceSpan {
    const span: DistributedTraceSpan = {
      spanId: `spn_${Math.random().toString(36).substring(2, 7)}`,
      traceId,
      parentSpanId,
      serviceName,
      operationName,
      durationMs,
      timestamp: new Date(),
    };

    this.spans.push(span);
    return span;
  }
}
