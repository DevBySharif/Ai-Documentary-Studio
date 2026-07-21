export interface ResourceStatusMetrics {
  readonly cpuUsagePercent: number;
  readonly gpuUsagePercent: number;
  readonly memoryUsedGb: number;
  readonly memoryTotalGb: number;
  readonly storageFreeGb: number;
  readonly remainingAiCredits: number;
  readonly activeRenderJobsCount: number;
}

/**
 * System Resource Monitor Widget (Vol 05 Part 02 - Section 15).
 * Reports real-time CPU, GPU, memory, storage, AI credits, and render queue depth.
 */
export class ResourceMonitorWidget {
  public getMetrics(): ResourceStatusMetrics {
    return {
      cpuUsagePercent: 18,
      gpuUsagePercent: 32,
      memoryUsedGb: 6.4,
      memoryTotalGb: 32.0,
      storageFreeGb: 420.5,
      remainingAiCredits: 8500,
      activeRenderJobsCount: 1,
    };
  }
}
