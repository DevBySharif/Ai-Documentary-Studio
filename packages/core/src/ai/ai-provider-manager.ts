import { AIProvider, ProviderHealthStatus, TextGenerationOptions, TextGenerationResult } from './ai-provider.js';
import { OpenAIProvider } from './adapters/openai-provider.js';
import { GeminiProvider } from './adapters/gemini-provider.js';
import { AnthropicProvider } from './adapters/anthropic-provider.js';

export interface ProviderManagerOptions {
  defaultProvider?: string;
  fallbackOrder?: string[];
  timeoutMs?: number;
  maxRetries?: number;
}

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProviderName: string;
  private fallbackOrder: string[];
  private timeoutMs: number;
  private maxRetries: number;

  constructor(options?: ProviderManagerOptions) {
    // Register standard provider instances
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new AnthropicProvider());

    this.defaultProviderName = options?.defaultProvider || 'openai';
    this.fallbackOrder = options?.fallbackOrder || ['openai', 'gemini', 'anthropic'];
    this.timeoutMs = options?.timeoutMs || 10000;
    this.maxRetries = options?.maxRetries || 2;
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  public getProvider(name?: string): AIProvider {
    const targetName = (name || this.defaultProviderName).toLowerCase();
    const provider = this.providers.get(targetName);
    if (!provider) {
      throw new Error(`AI Provider '${targetName}' is not registered`);
    }
    return provider;
  }

  public async getHealthStatuses(): Promise<ProviderHealthStatus[]> {
    const statuses: ProviderHealthStatus[] = [];
    for (const provider of this.providers.values()) {
      try {
        const health = await provider.isHealthy();
        statuses.push(health);
      } catch (err: any) {
        statuses.push({
          providerName: provider.name,
          isAvailable: false,
          latencyMs: -1,
          lastChecked: new Date()
        });
      }
    }
    return statuses;
  }

  public async generateTextWithFallback(
    prompt: string,
    options?: TextGenerationOptions,
    preferredProvider?: string
  ): Promise<TextGenerationResult> {
    const chain = preferredProvider
      ? [preferredProvider.toLowerCase(), ...this.fallbackOrder.filter(p => p !== preferredProvider.toLowerCase())]
      : this.fallbackOrder;

    let lastError: Error | null = null;

    for (const providerName of chain) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          const result = await this.executeWithTimeout(
            provider.generateText(prompt, options),
            this.timeoutMs
          );
          return result;
        } catch (error: any) {
          lastError = error;
          console.warn(`[AIProviderManager] Attempt ${attempt} failed on provider '${providerName}': ${error.message}`);
        }
      }
    }

    throw new Error(`[AIProviderManager] All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  private executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`AI Provider request timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }
}
