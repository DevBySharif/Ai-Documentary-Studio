import { StructuredLoggerCorrelationTracer } from "./structured-logger-correlation-tracer";
import { MetricsSamplerHealthChecker } from "./metrics-sampler-health-checker";
import { DiagnosticBundleGeneratorPrivacyMasker } from "./diagnostic-bundle-generator-privacy-masker";
import { SliSloAlertingFramework } from "./sli-slo-alerting-framework";

/**
 * Master Platform Observability Diagnostics Engine (Main Vol 09 Part 05).
 * Core entry point for 5-layer observability architecture (`Application Events → Logs/Metrics/Traces → Observability Platform → Dashboards/Alerts/Diagnostics`).
 */
export class MasterPlatformObservabilityDiagnostics {
  public readonly loggerTracer = new StructuredLoggerCorrelationTracer();
  public readonly metricsHealth = new MetricsSamplerHealthChecker();
  public readonly bundleGenerator = new DiagnosticBundleGeneratorPrivacyMasker();
  public readonly sliSloAlerts = new SliSloAlertingFramework();

  public recordOperationalEvent(
    service: string,
    component: string,
    message: string,
    correlationId = "corr_default"
  ): ReturnType<StructuredLoggerCorrelationTracer["logMessage"]> {
    return this.loggerTracer.logMessage(service, component, "Information", correlationId, message);
  }
}
