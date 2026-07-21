import type { APProviderName } from "./types.js";

export class APProviderSettings {
  private settings: Map<APProviderName, Record<string, unknown>> = new Map();

  set(provider: APProviderName, key: string, value: unknown): void {
    if (!this.settings.has(provider)) this.settings.set(provider, {});
    this.settings.get(provider)![key] = value;
  }

  get(provider: APProviderName, key: string): unknown {
    return this.settings.get(provider)?.[key];
  }

  getDefaults(provider: APProviderName): Record<string, unknown> {
    return {
      temperature: 0.7, maxTokens: 4096, topP: 0.95,
      timeout: 30000, retryCount: 3
    };
  }

  getAll(provider: APProviderName): Record<string, unknown> {
    return { ...this.getDefaults(provider), ...(this.settings.get(provider) ?? {}) };
  }
}
