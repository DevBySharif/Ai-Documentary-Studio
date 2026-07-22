export type LogLevelSeverity =
  | "Trace"
  | "Debug"
  | "Information"
  | "Warning"
  | "Error"
  | "Critical";

export type HealthCategoryType =
  | "Liveness"
  | "Readiness"
  | "DependencyHealth"
  | "ConfigValidity";

export type SliSloMetricType = "Availability" | "Latency" | "SuccessRate" | "ErrorRate";

export interface StructuredLogEntry {
  readonly logId: string;
  readonly timestamp: Date;
  readonly service: string;
  readonly component: string;
  readonly severity: LogLevelSeverity;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly userId?: string;
  readonly message: string;
  readonly metadataJson: string;
}

export interface DistributedTraceSpan {
  readonly spanId: string;
  readonly traceId: string;
  readonly parentSpanId?: string;
  readonly serviceName: string;
  readonly operationName: string;
  readonly durationMs: number;
  readonly timestamp: Date;
}

export interface HealthStatusReport {
  readonly serviceName: string;
  readonly category: HealthCategoryType;
  readonly isHealthy: boolean;
  readonly details: string;
  readonly checkedAt: Date;
}

export interface DiagnosticBundleDescriptor {
  readonly bundleId: string;
  readonly generatedAt: Date;
  readonly logCount: number;
  readonly metricsSnapshotJson: string;
  readonly healthReports: ReadonlyArray<HealthStatusReport>;
  readonly isSanitized: boolean;
}
