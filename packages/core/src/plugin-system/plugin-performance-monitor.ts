interface PerformanceMetrics {
  cpuUsage: number[];
  memoryUsage: number[];
  gpuUsage: number[];
  startupTime: number[];
  eventExecution: number[];
  failures: number;
}

export class PLPluginPerformanceMonitor {
  private metrics = new Map<string, PerformanceMetrics>();

  private ensure(pluginId: string): PerformanceMetrics {
    if (!this.metrics.has(pluginId)) {
      this.metrics.set(pluginId, {
        cpuUsage: [],
        memoryUsage: [],
        gpuUsage: [],
        startupTime: [],
        eventExecution: [],
        failures: 0,
      });
    }
    return this.metrics.get(pluginId)!;
  }

  recordCPUUsage(pluginId: string, percent: number): void {
    this.ensure(pluginId).cpuUsage.push(percent);
  }

  recordMemoryUsage(pluginId: string, bytes: number): void {
    this.ensure(pluginId).memoryUsage.push(bytes);
  }

  recordGPUUsage(pluginId: string, percent: number): void {
    this.ensure(pluginId).gpuUsage.push(percent);
  }

  recordStartupTime(pluginId: string, ms: number): void {
    this.ensure(pluginId).startupTime.push(ms);
  }

  recordEventExecution(pluginId: string, ms: number): void {
    this.ensure(pluginId).eventExecution.push(ms);
  }

  recordFailure(pluginId: string): void {
    this.ensure(pluginId).failures++;
  }

  getPerformanceReport(pluginId: string): Record<string, unknown> {
    const m = this.metrics.get(pluginId);
    if (!m) return { status: 'no_data' };
    const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    return {
      avgCPU: avg(m.cpuUsage),
      avgMemory: avg(m.memoryUsage),
      avgGPU: avg(m.gpuUsage),
      avgStartupTime: avg(m.startupTime),
      avgEventExecution: avg(m.eventExecution),
      failures: m.failures,
    };
  }

  recommendDisable(threshold: number): string[] {
    const result: string[] = [];
    for (const [pluginId, m] of this.metrics) {
      if (m.failures > threshold) {
        result.push(pluginId);
      }
    }
    return result;
  }
}
