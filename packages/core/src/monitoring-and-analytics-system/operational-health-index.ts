import { HardwareMetrics } from './types';
import { AlertSystem } from './alert-system';

export class OperationalHealthIndex {
  constructor(private alertSystem: AlertSystem) {}

  calculateHealthScore(metrics: HardwareMetrics, crashFrequency: number): { score: number, status: string } {
    let score = 100;

    // Deduct for hardware strain
    if (metrics.cpuUsagePct > 90) score -= 5;
    if (metrics.gpuUsagePct > 95) score -= 5;
    if (metrics.ramUsageMB > 30000) score -= 5;

    // Deduct for active critical alerts
    const alerts = this.alertSystem.getActiveAlerts();
    const criticalAlerts = alerts.filter(a => a.severity === "Critical").length;
    const warningAlerts = alerts.filter(a => a.severity === "Warning").length;

    score -= (criticalAlerts * 10);
    score -= (warningAlerts * 3);

    // Deduct for crashes
    score -= (crashFrequency * 15);

    score = Math.max(0, score);

    let status = "Excellent";
    if (score < 50) status = "Critical";
    else if (score < 80) status = "Warning";
    else if (score < 90) status = "Good";

    return { score, status };
  }
}
