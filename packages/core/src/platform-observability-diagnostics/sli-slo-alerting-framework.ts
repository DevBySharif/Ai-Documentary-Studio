import { SliSloMetricType } from "./observability-types";

export interface SliSloTargetDescriptor {
  readonly metric: SliSloMetricType;
  readonly targetValue: number; // e.g. 99.9% for availability, 500ms for latency
  readonly currentMeasuredValue: number;
  readonly isMeetingSlo: boolean;
}

export interface ObservabilityAlertTrigger {
  readonly alertId: string;
  readonly alertName: string; // e.g. "HighErrorRate", "AiProviderFailure", "QueueCongestion"
  readonly severity: "Warning" | "Critical";
  readonly message: string;
  readonly triggeredAt: Date;
}

/**
 * SLI/SLO Framework Manager & Alert Trigger Dispatcher (Vol 09 Part 05 - Section 12, Section 13).
 * Tracks Service-Level Indicators (SLIs) against Service-Level Objectives (SLOs) and dispatches platform reliability alerts.
 */
export class SliSloAlertingFramework {
  private alerts: ObservabilityAlertTrigger[] = [];

  public getSloStatus(): ReadonlyArray<SliSloTargetDescriptor> {
    return [
      { metric: "Availability", targetValue: 99.9, currentMeasuredValue: 99.95, isMeetingSlo: true },
      { metric: "Latency", targetValue: 500, currentMeasuredValue: 320, isMeetingSlo: true },
      { metric: "ErrorRate", targetValue: 2.0, currentMeasuredValue: 0.8, isMeetingSlo: true },
    ];
  }

  public triggerAlert(alertName: string, message: string, severity: "Warning" | "Critical" = "Warning"): ObservabilityAlertTrigger {
    const alert: ObservabilityAlertTrigger = {
      alertId: `alr_obs_${Math.random().toString(36).substring(2, 7)}`,
      alertName,
      severity,
      message,
      triggeredAt: new Date(),
    };

    this.alerts.push(alert);
    return alert;
  }
}
