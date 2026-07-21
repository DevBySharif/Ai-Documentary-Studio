import { Metric, MetricSchema } from './models';
import { LogManager } from './logger';

export class MetricsCollector {
  private metrics: Metric[] = [];
  private logger = new LogManager().createContextLogger('MetricsCollector');

  /**
   * Records a performance metric.
   */
  record(metricInput: Omit<Metric, 'timestamp'>): void {
    try {
      const metric = MetricSchema.parse({
        ...metricInput,
        timestamp: new Date()
      });

      this.metrics.push(metric);
      
      // In production, metrics should be batched and sent to a TSDB (e.g. Prometheus/Datadog)
      this.logger.debug(`Recorded metric: ${metric.name} = ${metric.value}${metric.unit}`);
      
    } catch (err) {
      this.logger.error('Failed to record metric', err as Error);
    }
  }

  /**
   * Retrieves all collected metrics (useful for Diagnostic Bundles).
   */
  getSnapshot(): Metric[] {
    return [...this.metrics];
  }

  /**
   * Clears in-memory metrics.
   */
  flush(): void {
    this.metrics = [];
  }
}
