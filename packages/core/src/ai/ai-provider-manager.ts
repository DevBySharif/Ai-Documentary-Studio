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

export interface FallbackAttemptLog {
  providerName: string;
  attempt: number;
  error: string;
  timestamp: string;
}

export interface FallbackExecutionTelemetry {
  result: TextGenerationResult;
  attempts: FallbackAttemptLog[];
  fallbackChain: string[];
}

/**
 * Thrown when every provider in the fallback chain has failed.
 * Controllers must catch this and respond with HTTP 503.
 * No fabricated data is ever returned.
 */
export class AllProvidersFailedError extends Error {
  readonly providerFailures: FallbackAttemptLog[];

  constructor(failures: FallbackAttemptLog[]) {
    super(`All AI providers failed. ${failures.length} attempt(s) made.`);
    this.name = 'AllProvidersFailedError';
    this.providerFailures = failures;
  }
}

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProviderName: string;
  private fallbackOrder: string[];
  private timeoutMs: number;
  private maxRetries: number;

  constructor(options?: ProviderManagerOptions) {
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new AnthropicProvider());

    this.defaultProviderName = options?.defaultProvider || 'openai';
    this.fallbackOrder = options?.fallbackOrder || ['openai', 'gemini', 'anthropic'];
    this.timeoutMs = options?.timeoutMs || 15000;
    this.maxRetries = options?.maxRetries || 1;
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
          hasApiKey: false,
          latencyMs: -1,
          lastChecked: new Date()
        });
      }
    }
    return statuses;
  }

  public async generateTextWithTelemetry(
    prompt: string,
    options?: TextGenerationOptions,
    preferredProvider?: string
  ): Promise<FallbackExecutionTelemetry> {
    const chain = preferredProvider
      ? [preferredProvider.toLowerCase(), ...this.fallbackOrder.filter(p => p !== preferredProvider.toLowerCase())]
      : this.fallbackOrder;

    const attemptsLog: FallbackAttemptLog[] = [];

    for (const providerName of chain) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          const result = await this.executeWithTimeout(
            provider.generateText(prompt, options),
            this.timeoutMs
          );

          return {
            result,
            attempts: attemptsLog,
            fallbackChain: chain
          };
        } catch (error: any) {
          const errMessage = error.message || String(error);
          attemptsLog.push({
            providerName,
            attempt,
            error: errMessage,
            timestamp: new Date().toISOString()
          });
          console.warn(`[AIProviderManager] Provider '${providerName}' attempt ${attempt} failed: ${errMessage}`);
        }
      }
    }

    // Every provider in the fallback chain has failed.
    // Throw — never fabricate data.
    throw new AllProvidersFailedError(attemptsLog);
  }

  public async generateTextWithFallback(
    prompt: string,
    options?: TextGenerationOptions,
    preferredProvider?: string
  ): Promise<TextGenerationResult> {
    const telemetry = await this.generateTextWithTelemetry(prompt, options, preferredProvider);
    return telemetry.result;
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
