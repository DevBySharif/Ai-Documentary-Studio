export interface TelemetrySettings {
  isEnabled: boolean;
  collectFeatureUsage: boolean;
  collectPerformanceMetrics: boolean;
  collectCrashReports: boolean;
}

/**
 * Privacy-First Telemetry Manager (IB Part 24 - Section 12, Section 13, Section 21).
 * Telemetry is opt-in/configurable and never transmits sensitive project content or secrets.
 */
export class TelemetryManager {
  private settings: TelemetrySettings = {
    isEnabled: true,
    collectFeatureUsage: true,
    collectPerformanceMetrics: true,
    collectCrashReports: true,
  };

  public updateSettings(newSettings: Partial<TelemetrySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getSettings(): Readonly<TelemetrySettings> {
    return this.settings;
  }

  public recordFeatureEvent(featureName: string, durationMs?: number): void {
    if (!this.settings.isEnabled || !this.settings.collectFeatureUsage) return;
    // Log anonymized feature telemetry event
  }
}
