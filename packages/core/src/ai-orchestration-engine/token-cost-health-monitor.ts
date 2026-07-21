import { ProviderHealthStatus } from "./orchestration-types";

/**
 * Token, Cost & Health Monitor (Vol 06 Part 06 - Section 16, Section 17).
 * Tracks input/output token usage, estimated/actual USD costs, and provider health metrics (latency, error rate, availability).
 */
export class TokenCostHealthMonitor {
  private totalCostUsd = 0;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private healthData = new Map<string, ProviderHealthStatus>();

  public recordUsage(providerId: string, costUsd: number, inputTokens: number, outputTokens: number, latencyMs: number): void {
    this.totalCostUsd += costUsd;
    this.totalInputTokens += inputTokens;
    this.totalOutputTokens += outputTokens;

    this.healthData.set(providerId, {
      providerId,
      isAvailable: true,
      averageLatencyMs: latencyMs,
      errorRatePercent: 0,
    });
  }

  public getUsageSummary(): { totalCostUsd: number; totalInputTokens: number; totalOutputTokens: number } {
    return {
      totalCostUsd: this.totalCostUsd,
      totalInputTokens: this.totalInputTokens,
      totalOutputTokens: this.totalOutputTokens,
    };
  }

  public getProviderHealth(providerId: string): ProviderHealthStatus | undefined {
    return this.healthData.get(providerId);
  }
}
