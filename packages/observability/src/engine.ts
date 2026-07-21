import { LogManager } from './logger';
import { MetricsCollector } from './metrics';
import { TraceManager } from './trace';
import { HealthMonitor } from './health';

export class ObservabilityEngineFacade {
  public logs: LogManager;
  public metrics: MetricsCollector;
  public trace: TraceManager;
  public health: HealthMonitor;

  constructor() {
    this.logs = new LogManager();
    this.metrics = new MetricsCollector();
    this.trace = new TraceManager();
    this.health = new HealthMonitor();
  }

  /**
   * Generates a snapshot of system health and metrics for support purposes.
   */
  generateDiagnosticBundle(): any {
    const bundleLogger = this.logs.createContextLogger('Diagnostics');
    bundleLogger.info('Generating diagnostic bundle');

    return {
      timestamp: new Date().toISOString(),
      overallHealth: this.health.getOverallSystemHealth(),
      components: this.health.getComponentHealth(),
      metricsSnapshot: this.metrics.getSnapshot()
    };
  }
}
