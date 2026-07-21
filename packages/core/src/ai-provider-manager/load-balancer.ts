import type { APProviderName } from "./types.js";

export class APLoadBalancer {
  private usage: Map<APProviderName, number> = new Map();

  select(providers: APProviderName[]): APProviderName {
    let leastUsed = providers[0];
    let minUsage = this.usage.get(leastUsed) ?? 0;

    for (const p of providers) {
      const u = this.usage.get(p) ?? 0;
      if (u < minUsage) { leastUsed = p; minUsage = u; }
    }

    this.usage.set(leastUsed, minUsage + 1);
    return leastUsed;
  }

  getUsage(provider: APProviderName): number {
    return this.usage.get(provider) ?? 0;
  }

  reset(): void {
    this.usage.clear();
  }
}
