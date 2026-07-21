import type { APUsageRecord, APProviderName } from "./types.js";

export class APCostTracking {
  private records: APUsageRecord[] = [];

  record(promptTokens: number, completionTokens: number, cost: number, provider: APProviderName, cached: boolean): void {
    this.records.push({ promptTokens, completionTokens, estimatedCost: cost, provider, timestamp: Date.now(), cached });
  }

  getDailyCost(): number {
    const today = new Date().setHours(0, 0, 0, 0);
    return this.records.filter((r) => r.timestamp >= today).reduce((s, r) => s + r.estimatedCost, 0);
  }

  getMonthlyCost(): number {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return this.records.filter((r) => r.timestamp >= monthStart.getTime()).reduce((s, r) => s + r.estimatedCost, 0);
  }

  getPerProjectCost(projectId: string): number {
    return this.records.filter((r) => r.provider === projectId as any).reduce((s, r) => s + r.estimatedCost, 0);
  }

  clear(): void {
    this.records = [];
  }
}
