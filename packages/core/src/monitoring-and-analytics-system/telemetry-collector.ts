import { HardwareMetrics } from './types';

export class TelemetryCollector {
  private currentMetrics: HardwareMetrics = {
    cpuUsagePct: 0,
    gpuUsagePct: 0,
    ramUsageMB: 0,
    diskUsageMB: 0,
    diskSpeedMBps: 0,
    networkSpeedMBps: 0,
    workerUtilizationPct: 0,
    renderFps: 0
  };

  private listeners: Array<(metrics: HardwareMetrics) => void> = [];
  private pollingInterval?: NodeJS.Timeout;

  startPolling(intervalMs: number = 1000): void {
    if (this.pollingInterval) return;
    this.pollingInterval = setInterval(() => this.collectMetrics(), intervalMs);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
  }

  subscribe(listener: (metrics: HardwareMetrics) => void): void {
    this.listeners.push(listener);
  }

  getLatestMetrics(): HardwareMetrics {
    return this.currentMetrics;
  }

  private collectMetrics(): void {
    // In a real environment, use os/systeminformation libraries to populate this
    // We mock values here
    this.currentMetrics = {
      cpuUsagePct: Math.random() * 100,
      gpuUsagePct: Math.random() * 100,
      ramUsageMB: 4096 + Math.random() * 2048,
      diskUsageMB: 500000,
      diskSpeedMBps: Math.random() * 500,
      networkSpeedMBps: Math.random() * 100,
      workerUtilizationPct: Math.random() * 100,
      renderFps: 24 + Math.random() * 36
    };

    for (const listener of this.listeners) {
      listener(this.currentMetrics);
    }
  }
}
