import type { APProviderName, APHealthStatus } from "./types.js";

export class APProviderHealthMonitor {
  private health: Map<APProviderName, APHealthStatus> = new Map();

  setHealth(provider: APProviderName, status: APHealthStatus): void {
    this.health.set(provider, status);
  }

  getHealth(provider: APProviderName): APHealthStatus {
    return this.health.get(provider) ?? "unavailable";
  }

  isHealthy(provider: APProviderName): boolean {
    return this.health.get(provider) === "healthy";
  }

  getUnhealthyProviders(): APProviderName[] {
    return Array.from(this.health.entries()).filter(([, s]) => s !== "healthy").map(([p]) => p);
  }

  getHealthSummary(): Record<APProviderName, APHealthStatus> {
    const summary: Record<string, APHealthStatus> = {};
    for (const [provider, status] of this.health) summary[provider] = status;
    return summary;
  }
}
