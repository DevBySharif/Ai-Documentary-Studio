import type { APProviderName } from "./types.js";

export class APFallbackEngine {
  private retryCount: Map<string, number> = new Map();
  private maxRetries = 3;

  async executeWithFallback<T>(
    primary: APProviderName,
    fallbacks: APProviderName[],
    fn: (provider: APProviderName) => Promise<T>
  ): Promise<{ result: T; provider: APProviderName }> {
    const chain = [primary, ...fallbacks];
    for (const provider of chain) {
      try {
        const result = await fn(provider);
        return { result, provider };
      } catch {
        continue;
      }
    }
    throw new Error("All providers failed");
  }

  canRetry(provider: APProviderName): boolean {
    const count = this.retryCount.get(provider) ?? 0;
    return count < this.maxRetries;
  }

  recordRetry(provider: APProviderName): void {
    this.retryCount.set(provider, (this.retryCount.get(provider) ?? 0) + 1);
  }

  resetRetries(): void {
    this.retryCount.clear();
  }
}
