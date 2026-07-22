import { MaintenanceModeState, HealthRemediationStage } from "./operational-support-types";

/**
 * Maintenance Mode Controller & 6-Stage Health Remediation Coordinator (Vol 09 Part 08 - Section 8, Section 12).
 * Controls maintenance windows (read-only access, session blocking) and manages 6-stage health transitions (`Healthy → Warning → Degraded → Critical → Recovery → Healthy`).
 */
export class MaintenanceModeRemediationCoordinator {
  private maintenanceState: MaintenanceModeState = {
    isActive: false,
    isReadOnlyAccessAllowed: true,
    noticeMessage: "System operating normally.",
  };

  private currentStage: HealthRemediationStage = "Healthy";

  public enableMaintenanceMode(notice: string, allowReadOnly = true): MaintenanceModeState {
    this.maintenanceState = {
      isActive: true,
      isReadOnlyAccessAllowed: allowReadOnly,
      noticeMessage: notice,
      scheduledEndTimestamp: new Date(Date.now() + 2 * 3600 * 1000), // 2 hours
    };
    return this.maintenanceState;
  }

  public disableMaintenanceMode(): MaintenanceModeState {
    this.maintenanceState = {
      isActive: false,
      isReadOnlyAccessAllowed: true,
      noticeMessage: "System operating normally.",
    };
    return this.maintenanceState;
  }

  public updateHealthStage(targetStage: HealthRemediationStage): HealthRemediationStage {
    this.currentStage = targetStage;
    return this.currentStage;
  }
}
