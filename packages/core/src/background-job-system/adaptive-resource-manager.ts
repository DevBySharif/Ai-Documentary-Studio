import { ResourceMetrics } from './types';

export class AdaptiveResourceManager {
  private currentMetrics: ResourceMetrics = {
    cpuUsage: 0,
    gpuUsage: 0,
    ramUsage: 0,
    diskUsage: 0,
    networkUsage: 0
  };

  private maxParallelJobs: number = 4;

  updateMetrics(metrics: ResourceMetrics): void {
    this.currentMetrics = metrics;
    this.adaptResources();
  }

  getRecommendedMaxParallelJobs(): number {
    return this.maxParallelJobs;
  }

  shouldDelayBackgroundIndexing(): boolean {
    return this.currentMetrics.gpuUsage > 80 || this.currentMetrics.cpuUsage > 90;
  }

  shouldLowerPreviewQuality(): boolean {
    return this.currentMetrics.gpuUsage > 75;
  }

  private adaptResources(): void {
    if (this.currentMetrics.ramUsage > 90 || this.currentMetrics.cpuUsage > 95) {
      // Reduce parallel jobs when RAM or CPU is critical
      this.maxParallelJobs = Math.max(1, this.maxParallelJobs - 1);
    } else if (this.currentMetrics.ramUsage < 50 && this.currentMetrics.cpuUsage < 50) {
      // Increase workers when resources are abundant (up to a sensible max like 8)
      this.maxParallelJobs = Math.min(8, this.maxParallelJobs + 1);
    }
  }
}
