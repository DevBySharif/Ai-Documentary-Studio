export interface PrivacySettings {
  telemetryEnabled: boolean;
  crashReportingEnabled: boolean;
  anonymousAnalyticsEnabled: boolean;
}

export class PrivacyControls {
  private settings: PrivacySettings = {
    telemetryEnabled: false,
    crashReportingEnabled: false,
    anonymousAnalyticsEnabled: false
  };

  updateConsent(newSettings: Partial<PrivacySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    // Persist to local config
  }

  getConsent(): PrivacySettings {
    return this.settings;
  }

  canSendTelemetry(): boolean {
    return this.settings.telemetryEnabled;
  }
}
