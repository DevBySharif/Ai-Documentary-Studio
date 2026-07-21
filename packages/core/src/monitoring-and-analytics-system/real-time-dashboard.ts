import { TelemetryCollector } from './telemetry-collector';
import { CostAnalytics } from './cost-analytics';
import { AlertSystem } from './alert-system';
import { HardwareMetrics, CostData, Alert } from './types';

export class RealTimeDashboard {
  constructor(
    private telemetry: TelemetryCollector,
    private costAnalytics: CostAnalytics,
    private alertSystem: AlertSystem
  ) {}

  getDashboardData(): {
    hardware: HardwareMetrics;
    costs: CostData;
    activeAlerts: Alert[];
    activeJobs: number; // Mocked
  } {
    return {
      hardware: this.telemetry.getLatestMetrics(),
      costs: this.costAnalytics.getTotalCost() > 0 ? this.costAnalytics.getCostBreakdown() : { aiCosts: 0, imageCosts: 0, voiceCosts: 0, renderingCosts: 0, storageCosts: 0 },
      activeAlerts: this.alertSystem.getActiveAlerts(),
      activeJobs: Math.floor(Math.random() * 10) // Mock
    };
  }
}
