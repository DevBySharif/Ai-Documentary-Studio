import { ModelPerformanceMetricsRecord } from "./benchmarking-types";

/**
 * Production Metrics Collector & Benchmark Database (Vol 07 Part 09 - Section 3, Section 4, Section 8).
 * Collects runtime performance metrics (latency, success rate, tokens, cost, quality) and maintains longitudinal performance logs.
 */
export class PerformanceCollectorDatabase {
  private records: ModelPerformanceMetricsRecord[] = [];

  public recordExecutionMetrics(
    modelId: string,
    capability: string,
    latencyMs: number,
    success: boolean,
    qualityScore: number,
    humanCorrectionRequired: boolean,
    tokensConsumed: number,
    costUSD: number
  ): ModelPerformanceMetricsRecord {
    const record: ModelPerformanceMetricsRecord = {
      recordId: `rec_${Math.random().toString(36).substring(2, 7)}`,
      modelId,
      capability,
      latencyMs,
      success,
      qualityScore,
      humanCorrectionRequired,
      tokensConsumed,
      costUSD,
      timestamp: new Date(),
    };

    this.records.push(record);
    return record;
  }

  public getMetricsForModel(modelId: string): ReadonlyArray<ModelPerformanceMetricsRecord> {
    return this.records.filter((r) => r.modelId === modelId);
  }

  public getMetricsForCapability(capability: string): ReadonlyArray<ModelPerformanceMetricsRecord> {
    return this.records.filter((r) => r.capability === capability);
  }
}
