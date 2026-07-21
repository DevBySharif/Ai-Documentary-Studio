import { ProductionKPIs } from './types';

export class ProductionBenchmarkCenter {
  private benchmarks: Map<string, ProductionKPIs> = new Map();
  private globalAverage: Partial<ProductionKPIs> = {};

  recordBenchmark(projectId: string, kpis: ProductionKPIs): void {
    this.benchmarks.set(projectId, kpis);
    this.recalculateGlobalAverages();
  }

  compareProjectToAverage(projectId: string): any {
    const projectKPIs = this.benchmarks.get(projectId);
    if (!projectKPIs) return null;

    return {
      project: projectKPIs,
      average: this.globalAverage,
      renderEfficiencyDiff: projectKPIs.averageRenderDurationMs - (this.globalAverage.averageRenderDurationMs || 0)
    };
  }

  private recalculateGlobalAverages(): void {
    if (this.benchmarks.size === 0) return;

    let totalRender = 0;
    let totalQa = 0;
    
    for (const kpis of this.benchmarks.values()) {
      totalRender += kpis.averageRenderDurationMs;
      totalQa += kpis.averageQaScore;
    }

    this.globalAverage = {
      averageRenderDurationMs: totalRender / this.benchmarks.size,
      averageQaScore: totalQa / this.benchmarks.size
    };
  }
}
