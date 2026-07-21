import type { APProviderName } from "./types.js";

export class APRateLimitManager {
  private requestsPerMin: Map<APProviderName, number> = new Map();
  private resetTime: Map<APProviderName, number> = new Map();
  private maxRPM = 60;

  configure(maxRPM: number): void {
    this.maxRPM = maxRPM;
  }

  canSend(provider: APProviderName): boolean {
    const count = this.requestsPerMin.get(provider) ?? 0;
    const reset = this.resetTime.get(provider) ?? 0;

    if (Date.now() > reset) {
      this.requestsPerMin.set(provider, 0);
      this.resetTime.set(provider, Date.now() + 60000);
      return true;
    }

    return count < this.maxRPM;
  }

  recordRequest(provider: APProviderName): void {
    this.requestsPerMin.set(provider, (this.requestsPerMin.get(provider) ?? 0) + 1);
  }

  getRemainingQuota(provider: APProviderName): number {
    return this.maxRPM - (this.requestsPerMin.get(provider) ?? 0);
  }
}
