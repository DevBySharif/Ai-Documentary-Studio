import { JobManager } from './job-manager';
import { WorkerPool } from './worker-pool';
import { AdaptiveResourceManager } from './adaptive-resource-manager';

export interface DashboardMetrics {
  activeJobsCount: number;
  queuedJobsCount: number;
  completedJobsCount: number;
  failedJobsCount: number;
  workerUtilizationCpu: number;
  workerUtilizationGpu: number;
  estimatedCompletionTimeSeconds?: number;
}

export class JobDashboard {
  constructor(
    private jobManager: JobManager,
    private workerPool: WorkerPool,
    private adaptiveResource: AdaptiveResourceManager
  ) {}

  getDashboardMetrics(): DashboardMetrics {
    // In a real implementation, JobManager would expose getters for these counts
    // We mock the counts here for the architectural structure
    return {
      activeJobsCount: 0, // Should come from jobManager running state count
      queuedJobsCount: 0, // Should come from queue length
      completedJobsCount: 0, // Should come from history store
      failedJobsCount: 0,
      workerUtilizationCpu: this.workerPool.getUtilization("CPU"),
      workerUtilizationGpu: this.workerPool.getUtilization("GPU")
    };
  }

  getSystemRecommendations(): string[] {
    const recommendations: string[] = [];
    if (this.adaptiveResource.shouldDelayBackgroundIndexing()) {
      recommendations.push("System load high. Background indexing is delayed.");
    }
    if (this.adaptiveResource.shouldLowerPreviewQuality()) {
      recommendations.push("GPU usage high. Lowering preview quality is recommended.");
    }
    return recommendations;
  }
}
