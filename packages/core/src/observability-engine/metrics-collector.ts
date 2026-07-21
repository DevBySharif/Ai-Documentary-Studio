export type MetricCategory =
  | "CpuUsagePercent"
  | "GpuUsagePercent"
  | "MemoryUsageMb"
  | "DiskUsageMb"
  | "AiLatencyMs"
  | "RenderDurationMs"
  | "PlaybackFps"
  | "CacheHitRatio";

export interface MetricSample {
  readonly category: MetricCategory;
  readonly value: number;
  readonly timestamp: Date;
  readonly correlationId?: string;
}

/**
 * Low-Overhead Metrics Collector (IB Part 24 - Section 6, Section 23).
 * Samples operational metrics asynchronously without degrading performance.
 */
export class MetricsCollector {
  private samples: MetricSample[] = [];

  public recordMetric(category: MetricCategory, value: number, correlationId?: string): void {
    this.samples.push({
      category,
      value: Math.round(value * 100) / 100,
      timestamp: new Date(),
      correlationId,
    });
  }

  public getLatest(category: MetricCategory): MetricSample | undefined {
    const matching = this.samples.filter((s) => s.category === category);
    return matching[matching.length - 1];
  }

  public getAllSamples(): ReadonlyArray<MetricSample> {
    return this.samples;
  }
}
