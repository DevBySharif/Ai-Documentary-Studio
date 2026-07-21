import { Anomaly, CostData, HardwareMetrics } from './types';
import { AlertSystem } from './alert-system';

export class AnomalyDetectionEngine {
  constructor(private alertSystem: AlertSystem) {}

  detectAnomalies(metrics: HardwareMetrics, costs: CostData, previousCosts: CostData): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Example 1: Sudden spike in AI costs (e.g. > 500% increase compared to previous period)
    if (previousCosts.aiCosts > 0 && costs.aiCosts > previousCosts.aiCosts * 5) {
      anomalies.push(this.createAnomaly("Cost Spike", "Sudden spike in AI costs detected.", 95));
      this.alertSystem.dispatchAlert("Warning", "Sudden spike in AI costs detected.", "AnomalyDetector");
    }

    // Example 2: Unusual memory consumption without corresponding worker activity
    if (metrics.ramUsageMB > 30000 && metrics.workerUtilizationPct < 10) {
      anomalies.push(this.createAnomaly("Memory Leak", "Unusual memory consumption with low worker activity.", 85));
    }

    return anomalies;
  }

  private createAnomaly(category: string, description: string, confidence: number): Anomaly {
    return {
      id: `anom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      category,
      description,
      confidence
    };
  }
}
