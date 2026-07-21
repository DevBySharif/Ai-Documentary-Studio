import type { DAHealthStatus } from "./types.js";

export class DAAppHealthMonitor {
  private memoryUsage = 0;
  private cpuUsage = 0;
  private gpuUsage = 0;
  private activeJobs = 0;
  private databaseHealthy = true;
  private pluginStatus = "healthy";

  updateMemory(percent: number): void {
    this.memoryUsage = percent;
  }

  updateCPU(percent: number): void {
    this.cpuUsage = percent;
  }

  updateGPU(percent: number): void {
    this.gpuUsage = percent;
  }

  setActiveJobs(count: number): void {
    this.activeJobs = count;
  }

  setDatabaseHealthy(healthy: boolean): void {
    this.databaseHealthy = healthy;
  }

  setPluginStatus(status: string): void {
    this.pluginStatus = status;
  }

  getStatus(): DAHealthStatus {
    const issues = [this.memoryUsage > 90, this.cpuUsage > 90, !this.databaseHealthy, this.pluginStatus !== "healthy"];
    const critical = issues.filter(Boolean).length;

    return {
      memoryUsage: this.memoryUsage,
      cpuUsage: this.cpuUsage,
      gpuUsage: this.gpuUsage,
      activeJobs: this.activeJobs,
      databaseHealth: this.databaseHealthy,
      pluginStatus: this.pluginStatus,
      overall: critical >= 2 ? "Critical" : critical >= 1 ? "Warning" : "Healthy"
    };
  }
}
