import { ProviderAdapterContract } from "./provider-adapter-contract";
import { AiJobDescriptor, NormalizedAiResponse } from "./orchestration-types";

/**
 * Retry & Fallback Chain Executor (Vol 06 Part 06 - Section 12, Section 13).
 * Executes AI jobs through policy-driven fallback chains (Primary Provider -> Retry -> Secondary Provider -> Manual).
 */
export class RetryFallbackChainExecutor {
  public async executeWithFallback(
    job: AiJobDescriptor,
    fallbackChain: ReadonlyArray<ProviderAdapterContract>
  ): Promise<NormalizedAiResponse> {
    let lastError: Error | undefined;

    for (const adapter of fallbackChain) {
      try {
        return await adapter.execute(job);
      } catch (err) {
        lastError = err as Error;
      }
    }

    throw new Error(`AI Job Execution Failed across all fallback providers for ${job.capability}. Last error: ${lastError?.message}`);
  }
}
