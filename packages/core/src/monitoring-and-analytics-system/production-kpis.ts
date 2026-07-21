import { ProductionKPIs } from './types';

export class ProductionKPITracker {
  private kpis: ProductionKPIs = {
    videosProduced: 0,
    averageProductionTimeMs: 0,
    averageQaScore: 0,
    averageRenderDurationMs: 0,
    aiSuccessRatePct: 100,
    reuseRatePct: 0,
    automationRatePct: 100
  };

  recordVideoProduced(productionTimeMs: number, qaScore: number, renderDurationMs: number): void {
    this.kpis.videosProduced++;
    // Running averages logic mock
    this.kpis.averageProductionTimeMs = productionTimeMs;
    this.kpis.averageQaScore = qaScore;
    this.kpis.averageRenderDurationMs = renderDurationMs;
  }

  updateRates(aiSuccess: number, reuse: number, automation: number): void {
    this.kpis.aiSuccessRatePct = aiSuccess;
    this.kpis.reuseRatePct = reuse;
    this.kpis.automationRatePct = automation;
  }

  getKPIs(): ProductionKPIs {
    return this.kpis;
  }
}
