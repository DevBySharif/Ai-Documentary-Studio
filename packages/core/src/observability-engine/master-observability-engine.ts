import { StructuredLogger } from "./structured-logger";
import { MetricsCollector } from "./metrics-collector";
import { HealthMonitor } from "./health-monitor";
import { CrashReporter } from "./crash-reporter";
import { TelemetryManager } from "./telemetry-manager";
import { SupportTooling } from "./support-tooling";

export interface ObservabilityOutputContract {
  correlationId: string;
  component: string;
  severity: string;
  event: string;
  durationMs: number;
}

export type AlertHookFn = (component: string, eventName: string, details?: string) => void;

/**
 * Master Observability Engine (IB Part 24).
 * Single unified Observability API coordinating logging, metrics, health, crashes, telemetry,
 * support tooling, alert hooks, and Section 19 Output Contract.
 */
export class MasterObservabilityEngine {
  public readonly logger = new StructuredLogger();
  public readonly metrics = new MetricsCollector();
  public readonly health = new HealthMonitor();
  public readonly crashReporter = new CrashReporter();
  public readonly telemetry = new TelemetryManager();
  public readonly support = new SupportTooling();

  private alertHooks: AlertHookFn[] = [];

  public registerAlertHook(hook: AlertHookFn): void {
    this.alertHooks.push(hook);
  }

  public logAndEmitEvent(
    component: string,
    eventName: string,
    durationMs: number,
    severity: "Info" | "Warning" | "Error" = "Info"
  ): ObservabilityOutputContract {
    const correlationId = this.logger.getCorrelationId();

    this.logger.log(severity, component, eventName, { durationMs });
    this.metrics.recordMetric("RenderDurationMs", durationMs, correlationId);

    if (severity === "Error") {
      this.alertHooks.forEach((hook) => hook(component, eventName));
    }

    return {
      correlationId,
      component,
      severity,
      event: eventName,
      durationMs,
    };
  }

  /**
   * Section 19 Output Contract Generator
   */
  public getOutputContract(
    component = "RenderEngine",
    eventName = "RenderCompleted",
    durationMs = 128942
  ): ObservabilityOutputContract {
    return {
      correlationId: this.logger.getCorrelationId() || "corr-5812",
      component,
      severity: "Info",
      event: eventName,
      durationMs,
    };
  }
}
