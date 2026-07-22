import { AbExperimentRecord, RegressionAlertDescriptor } from "./benchmarking-types";

/**
 * Controlled A/B Experiment Runner & Performance Regression Detector (Vol 07 Part 09 - Section 10, Section 11).
 * Executes blind A/B model comparisons and detects performance degradation (increased failure rates, higher latency, lower quality).
 */
export class AbTestingRegressionDetector {
  private experiments: AbExperimentRecord[] = [];
  private regressionAlerts: RegressionAlertDescriptor[] = [];

  public runBlindAbExperiment(
    capability: string,
    modelIdA: string,
    modelIdB: string,
    scoreA: number,
    scoreB: number
  ): AbExperimentRecord {
    const winner = scoreA >= scoreB ? modelIdA : modelIdB;
    const record: AbExperimentRecord = {
      experimentId: `exp_${Math.random().toString(36).substring(2, 7)}`,
      capability,
      modelIdA,
      modelIdB,
      winnerModelId: winner,
      scoreA,
      scoreB,
      timestamp: new Date(),
    };
    this.experiments.push(record);
    return record;
  }

  public checkForPerformanceRegression(
    modelId: string,
    capability: string,
    recentQualityScore: number,
    baselineQualityScore = 90
  ): RegressionAlertDescriptor | undefined {
    if (recentQualityScore < baselineQualityScore - 10) {
      const alert: RegressionAlertDescriptor = {
        alertId: `alr_${Math.random().toString(36).substring(2, 7)}`,
        modelId,
        capability,
        regressionType: "LowerQuality",
        degradationPercent: Math.floor(((baselineQualityScore - recentQualityScore) / baselineQualityScore) * 100),
        timestamp: new Date(),
      };
      this.regressionAlerts.push(alert);
      return alert;
    }
    return undefined;
  }
}
