export class ContinuousQualityMonitor {
  private metricsSeries: any[] = [];

  recordBuildMetrics(buildVersion: string, crashRate: number, coveragePct: number): void {
    this.metricsSeries.push({
      buildVersion,
      crashRate,
      coveragePct,
      timestamp: new Date().toISOString()
    });
  }

  getQualityTrend(): any[] {
    return this.metricsSeries;
  }
}
