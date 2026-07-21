import type { ProductionLogEntry, ProductionStage } from "./types.js";

export class ProductionLog {
  private entries: ProductionLogEntry[] = [];
  private startTime: string | null = null;
  private endTime: string | null = null;

  start(): void {
    this.startTime = new Date().toISOString();
  }

  finish(): void {
    this.endTime = new Date().toISOString();
  }

  log(stage: ProductionStage, status: ProductionLogEntry["status"], message: string, durationMs?: number, gpuUsage?: number): void {
    this.entries.push({ timestamp: new Date().toISOString(), stage, status, message, durationMs, gpuUsage });
  }

  getEntries(): ProductionLogEntry[] {
    return [...this.entries];
  }

  getSummary(): { startTime: string | null; endTime: string | null; totalEntries: number; warnings: number; errors: number; totalDuration: number } {
    const warnings = this.entries.filter((e) => e.status === "warning").length;
    const errors = this.entries.filter((e) => e.status === "error").length;
    const totalDuration = this.entries.reduce((sum, e) => sum + (e.durationMs ?? 0), 0);
    return { startTime: this.startTime, endTime: this.endTime, totalEntries: this.entries.length, warnings, errors, totalDuration };
  }
}
