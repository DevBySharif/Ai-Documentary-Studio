import {
  VPProviderName,
  VPNarrationRequest,
  VPNarrationResult,
} from "./types";
import { VPProviderInterface } from "./provider-abstraction";

export interface VPFallbackChain {
  preferred: VPProviderName[];
  retry: VPProviderName[];
  alternative: VPProviderName[];
  offline: VPProviderName[];
  manual: VPProviderName[];
}

const RETRY_LIMITS: Map<VPProviderName, { maxRetries: number; cooldownMs: number }> = new Map([
  ["edge_tts", { maxRetries: 3, cooldownMs: 1000 }],
  ["piper", { maxRetries: 2, cooldownMs: 500 }],
  ["kokoro", { maxRetries: 3, cooldownMs: 2000 }],
  ["google_cloud_tts", { maxRetries: 3, cooldownMs: 3000 }],
  ["azure_speech", { maxRetries: 3, cooldownMs: 3000 }],
  ["elevenlabs", { maxRetries: 2, cooldownMs: 5000 }],
  ["openai_tts", { maxRetries: 3, cooldownMs: 2000 }],
  ["amazon_polly", { maxRetries: 3, cooldownMs: 2000 }],
  ["coqui", { maxRetries: 2, cooldownMs: 1000 }],
  ["cartesia", { maxRetries: 2, cooldownMs: 1000 }],
  ["playht", { maxRetries: 2, cooldownMs: 2000 }],
  ["local_neural", { maxRetries: 1, cooldownMs: 500 }],
]);

export class VPFallbackStrategy {
  private retryCounters: Map<VPProviderName, number> = new Map();
  private lastAttempt: Map<VPProviderName, number> = new Map();
  private chain: VPFallbackChain;

  constructor(chain?: Partial<VPFallbackChain>) {
    this.chain = {
      preferred: chain?.preferred || ["elevenlabs", "openai_tts", "kokoro"],
      retry: chain?.retry || ["kokoro", "google_cloud_tts", "azure_speech"],
      alternative: chain?.alternative || ["edge_tts", "amazon_polly"],
      offline: chain?.offline || ["piper", "local_neural"],
      manual: chain?.manual || [],
    };
  }

  async execute(
    request: VPNarrationRequest,
    primaryProvider: VPProviderName,
    fn: (provider: VPProviderName, req: VPNarrationRequest) => Promise<VPNarrationResult>
  ): Promise<VPNarrationResult> {
    const allProviders = [
      primaryProvider,
      ...this.chain.retry,
      ...this.chain.alternative,
      ...this.chain.offline,
      ...this.chain.manual,
    ];

    const seen = new Set<VPProviderName>();
    const uniqueProviders: VPProviderName[] = [];
    for (const p of allProviders) {
      if (!seen.has(p)) {
        seen.add(p);
        uniqueProviders.push(p);
      }
    }

    for (const provider of uniqueProviders) {
      if (this.canRetry(provider)) {
        try {
          const result = await fn(provider, { ...request });
          if (result.status === "completed" || result.status === "partial") {
            return result;
          }
        } catch {
          this.incrementRetry(provider);
        }
      }
    }

    return {
      narrationId: `nar_failed_${Date.now()}`,
      provider: primaryProvider,
      voiceId: request.voiceId,
      language: request.language,
      duration: 0,
      timingData: {
        sentenceTimestamps: [],
        phraseTimestamps: [],
        wordTimestamps: [],
      },
      ssml: "",
      validated: false,
      status: "failed",
      cost: 0,
    };
  }

  canRetry(provider: VPProviderName): boolean {
    const limit = RETRY_LIMITS.get(provider);
    if (!limit) return false;

    const attempts = this.retryCounters.get(provider) || 0;
    if (attempts >= limit.maxRetries) return false;

    const last = this.lastAttempt.get(provider) || 0;
    const elapsed = Date.now() - last;
    if (elapsed < limit.cooldownMs) return false;

    return true;
  }

  resetRetries(): void {
    this.retryCounters.clear();
    this.lastAttempt.clear();
  }

  resetRetriesFor(provider: VPProviderName): void {
    this.retryCounters.delete(provider);
    this.lastAttempt.delete(provider);
  }

  private incrementRetry(provider: VPProviderName): void {
    const current = this.retryCounters.get(provider) || 0;
    this.retryCounters.set(provider, current + 1);
    this.lastAttempt.set(provider, Date.now());
  }

  getRetryCount(provider: VPProviderName): number {
    return this.retryCounters.get(provider) || 0;
  }

  setChain(chain: VPFallbackChain): void {
    this.chain = chain;
  }

  getChain(): VPFallbackChain {
    return { ...this.chain };
  }
}
