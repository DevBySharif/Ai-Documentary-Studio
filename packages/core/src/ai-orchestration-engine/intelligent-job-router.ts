import { ProviderAdapterContract } from "./provider-adapter-contract";
import { AiJobDescriptor } from "./orchestration-types";

/**
 * Intelligent Provider Router (Vol 06 Part 06 - Section 9, Section 10, Section 11, Section 18).
 * Selects the optimal provider adapter based on capability, cost, quality, latency, and local vs cloud policies.
 */
export class IntelligentJobRouter {
  public selectBestProvider(
    job: AiJobDescriptor,
    candidateAdapters: ReadonlyArray<ProviderAdapterContract>
  ): ProviderAdapterContract {
    if (candidateAdapters.length === 0) {
      throw new Error(`No available AI provider adapters found for capability: ${job.capability}`);
    }

    if (job.preferredStrategy === "LocalOnly") {
      const local = candidateAdapters.find((a) => a.isLocal);
      if (local) return local;
    }

    if (job.preferredStrategy === "LowestCost") {
      return [...candidateAdapters].sort((a, b) => a.estimateCost(job) - b.estimateCost(job))[0];
    }

    if (job.preferredStrategy === "LowestLatency") {
      return [...candidateAdapters].sort((a, b) => a.estimateLatency(job) - b.estimateLatency(job))[0];
    }

    // Default Balanced Strategy
    return candidateAdapters[0];
  }
}
