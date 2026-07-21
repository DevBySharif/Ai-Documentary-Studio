import { StructuredLoggerService } from "./structured-logger-service";
import { CorrelationTracer } from "./correlation-tracer";
import { PerformanceMetricsCollector } from "./performance-metrics-collector";
import { HealthMonitoringChecker } from "./health-monitoring-checker";
import { CrashReporterAuditVault } from "./crash-reporter-audit-vault";

/**
 * Master Observability Framework Engine (Main Vol 06 Part 09).
 * Core entry point for logging, metrics, correlation tracing, health checks, diagnostic bundle generation, crash reports, and audit logs.
 */
export class MasterObservabilityFramework {
  public readonly logger = new StructuredLoggerService();
  public readonly tracer = new CorrelationTracer();
  public readonly metricsCollector = new PerformanceMetricsCollector();
  public readonly healthChecker = new HealthMonitoringChecker();
  public readonly crashAuditVault = new CrashReporterAuditVault();

  public generateFullDiagnostics(): ReturnType<HealthMonitoringChecker["generateDiagnosticBundle"]> {
    return this.healthChecker.generateDiagnosticBundle(this.logger.getRecentLogs());
  }
}
