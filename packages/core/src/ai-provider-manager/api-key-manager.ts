import type { APAPIKey, APProviderName } from "./types.js";

export class APAPIKeyManager {
  private keys: Map<APProviderName, APAPIKey> = new Map();

  store(provider: APProviderName, key: string, label: string): void {
    this.keys.set(provider, { provider, key, label });
  }

  get(provider: APProviderName): string | undefined {
    return this.keys.get(provider)?.key;
  }

  delete(provider: APProviderName): boolean {
    return this.keys.delete(provider);
  }

  hasKey(provider: APProviderName): boolean {
    return this.keys.has(provider);
  }

  getAllKeys(): APAPIKey[] {
    return Array.from(this.keys.values());
  }

  clear(): void {
    this.keys.clear();
  }
}
