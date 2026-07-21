import { HealthStatus } from './models';
import { LogManager } from './logger';

export class HealthMonitor {
  private componentStatus = new Map<string, HealthStatus>();
  private logger = new LogManager().createContextLogger('HealthMonitor');

  /**
   * Reports the health of a specific subsystem.
   */
  reportHealth(component: string, status: HealthStatus, details?: string): void {
    const previous = this.componentStatus.get(component);
    this.componentStatus.set(component, status);

    if (previous !== status) {
      this.logger.info(`Component ${component} transitioned to ${status}`, { details });
    }
  }

  /**
   * Evaluates the overall system health. 
   * If any component is Failed, the system is Failed.
   * If any component is Degraded, the system is Degraded.
   */
  getOverallSystemHealth(): HealthStatus {
    let hasDegraded = false;

    for (const status of this.componentStatus.values()) {
      if (status === 'Failed') return 'Failed';
      if (status === 'Degraded') hasDegraded = true;
    }

    return hasDegraded ? 'Degraded' : 'Healthy';
  }

  getComponentHealth(): Record<string, HealthStatus> {
    return Object.fromEntries(this.componentStatus);
  }
}
