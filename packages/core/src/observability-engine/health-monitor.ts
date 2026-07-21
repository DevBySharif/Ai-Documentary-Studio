export type HealthStatus = "Healthy" | "Degraded" | "Unavailable";

export type SubsystemName =
  | "Database"
  | "AIProviders"
  | "RenderEngine"
  | "PlaybackEngine"
  | "Storage"
  | "PluginHost";

export interface SubsystemHealthReport {
  readonly subsystem: SubsystemName;
  readonly status: HealthStatus;
  readonly latencyMs: number;
  readonly lastChecked: Date;
  readonly details?: string;
}

/**
 * Health Monitoring System (IB Part 24 - Section 7).
 * Tracks operational health across core subsystems.
 */
export class HealthMonitor {
  private reports = new Map<SubsystemName, SubsystemHealthReport>();

  constructor() {
    this.initDefaultHealth();
  }

  private initDefaultHealth(): void {
    const subsystems: SubsystemName[] = [
      "Database",
      "AIProviders",
      "RenderEngine",
      "PlaybackEngine",
      "Storage",
      "PluginHost",
    ];

    subsystems.forEach((sub) => {
      this.reports.set(sub, {
        subsystem: sub,
        status: "Healthy",
        latencyMs: 5,
        lastChecked: new Date(),
      });
    });
  }

  public updateSubsystemHealth(subsystem: SubsystemName, status: HealthStatus, latencyMs = 5, details?: string): void {
    this.reports.set(subsystem, {
      subsystem,
      status,
      latencyMs,
      lastChecked: new Date(),
      details,
    });
  }

  public getSystemHealth(): ReadonlyArray<SubsystemHealthReport> {
    return Array.from(this.reports.values());
  }

  public isOverallHealthy(): boolean {
    return Array.from(this.reports.values()).every((r) => r.status !== "Unavailable");
  }
}
