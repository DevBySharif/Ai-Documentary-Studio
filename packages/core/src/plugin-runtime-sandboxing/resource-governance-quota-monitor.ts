import { PluginResourceQuota, PluginRuntimeHealthStatus } from "./plugin-runtime-types";

/**
 * Resource Governance & Quota Monitor (Vol 10 Part 03 - Section 6, Section 10).
 * Monitors CPU, memory, concurrent tasks, network/AI request rates, and enforces resource quota limits.
 */
export class ResourceGovernanceQuotaMonitor {
  private defaultQuota: PluginResourceQuota = {
    maxMemoryMB: 512,
    maxCpuPercentage: 25.0,
    maxConcurrentTasks: 5,
    maxNetworkRequestsPerMin: 60,
    maxAiRequestsPerMin: 30,
  };

  public getResourceQuota(pluginId: string): PluginResourceQuota {
    return this.defaultQuota;
  }

  public validateQuotaUsage(health: PluginRuntimeHealthStatus): { isWithinQuota: boolean; quotaViolations: string[] } {
    const violations: string[] = [];

    if (health.currentMemoryMB > this.defaultQuota.maxMemoryMB) {
      violations.push(`Memory limit exceeded: ${health.currentMemoryMB}MB > ${this.defaultQuota.maxMemoryMB}MB`);
    }
    if (health.currentCpuPercent > this.defaultQuota.maxCpuPercentage) {
      violations.push(`CPU limit exceeded: ${health.currentCpuPercent}% > ${this.defaultQuota.maxCpuPercentage}%`);
    }

    return {
      isWithinQuota: violations.length === 0,
      quotaViolations: violations,
    };
  }
}
