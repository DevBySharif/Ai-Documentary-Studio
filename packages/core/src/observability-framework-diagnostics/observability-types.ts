export type LogLevel = "Trace" | "Debug" | "Info" | "Warning" | "Error" | "Critical";

export type ErrorCategory =
  | "Validation"
  | "Network"
  | "Storage"
  | "AiProvider"
  | "Rendering"
  | "Configuration"
  | "InternalLogic"
  | "Unknown";

export interface StructuredLogEntry {
  readonly logId: string;
  readonly timestamp: Date;
  readonly level: LogLevel;
  readonly component: string;
  readonly event: string;
  readonly message: string;
  readonly correlationId: string;
  readonly projectId?: string;
  readonly context: Record<string, unknown>;
}

export interface PerformanceMetricRecord {
  readonly metricName: string; // e.g. "AiRequestDurationMs", "ExportDurationSecs"
  readonly value: number;
  readonly unit: "ms" | "secs" | "bytes" | "percent" | "count";
  readonly timestamp: Date;
  readonly tags: Record<string, string>;
}

export interface HealthCheckReport {
  readonly isHealthy: boolean;
  readonly databaseOk: boolean;
  readonly storageOk: boolean;
  readonly queueOk: boolean;
  readonly aiProvidersOk: boolean;
  readonly workerPoolsOk: boolean;
  readonly cacheIntegrityOk: boolean;
  readonly timestamp: Date;
}

export interface DiagnosticBundle {
  readonly bundleId: string;
  readonly appVersion: string;
  readonly environment: string;
  readonly recentLogEntries: ReadonlyArray<StructuredLogEntry>;
  readonly healthReport: HealthCheckReport;
  readonly systemInfo: Record<string, string>;
  readonly generatedAt: Date;
}
