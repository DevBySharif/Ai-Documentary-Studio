import { ProviderModelRegistry } from "./provider-model-registry";
import { IntelligentJobRouter } from "./intelligent-job-router";
import { RetryFallbackChainExecutor } from "./retry-fallback-chain-executor";
import { TokenCostHealthMonitor } from "./token-cost-health-monitor";
import { AiCapabilityType, AiRoutingStrategy, NormalizedAiResponse } from "./orchestration-types";

/**
 * Master AI Orchestration Engine (Main Vol 06 Part 06).
 * Core entry point for capability-based AI execution. Abstracts providers, routes requests, handles fallbacks, and normalizes responses.
 */
export class MasterAiOrchestration {
  public readonly registry = new ProviderModelRegistry();
  public readonly router = new IntelligentJobRouter();
  public readonly fallbackExecutor = new RetryFallbackChainExecutor();
  public readonly monitor = new TokenCostHealthMonitor();

  public async requestCapability<T = unknown>(
    projectId: string,
    capability: AiCapabilityType,
    promptInput: string,
    preferredStrategy: AiRoutingStrategy = "Balanced"
  ): Promise<NormalizedAiResponse<T>> {
    const candidateAdapters = this.registry.getProvidersForCapability(capability);
    if (candidateAdapters.length === 0) {
      // Mock Fallback for execution when no external API adapters are registered
      return {
        jobId: `job_ai_${Math.random().toString(36).substring(2, 7)}`,
        result: `Synthesized output for ${capability}: "${promptInput.substring(0, 30)}..."` as unknown as T,
        providerId: "mock_provider_fallback",
        modelId: "mock-v1",
        actualCostUSD: 0.002,
        latencyMs: 120,
        inputTokens: 150,
        outputTokens: 300,
        warnings: [],
      };
    }

    const primaryAdapter = this.router.selectBestProvider(
      {
        jobId: `job_ai_${Math.random().toString(36).substring(2, 7)}`,
        projectId,
        capability,
        promptInput,
        priority: 1,
        timeoutMs: 30000,
        preferredStrategy,
      },
      candidateAdapters
    );

    const response = await this.fallbackExecutor.executeWithFallback(
      {
        jobId: `job_ai_${Math.random().toString(36).substring(2, 7)}`,
        projectId,
        capability,
        promptInput,
        priority: 1,
        timeoutMs: 30000,
        preferredStrategy,
      },
      [primaryAdapter, ...candidateAdapters.filter((a) => a !== primaryAdapter)]
    );

    this.monitor.recordUsage(response.providerId, response.actualCostUSD, response.inputTokens, response.outputTokens, response.latencyMs);
    return response as NormalizedAiResponse<T>;
  }
}
