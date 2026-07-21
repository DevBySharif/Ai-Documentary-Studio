import { ImageProviderId, GenerationPolicy } from "./orchestrator-types";

/**
 * Policy-Driven Provider Selector (Vol 04 Part 07 - Section 5, Section 6, Section 14).
 * Selects image providers based on task intent, historical accuracy needs, speed, cost, and budget limits.
 */
export class ProviderSelector {
  public selectBestProvider(
    needsPhotorealism: boolean,
    requiresHistoricalAccuracy: boolean,
    policy: GenerationPolicy
  ): ImageProviderId {
    if (policy.maxCostPerImageDollars < 0.02) {
      return "SDXL"; // Budget option
    }

    if (requiresHistoricalAccuracy) {
      return "FLUX";
    }

    if (needsPhotorealism) {
      return "Midjourney";
    }

    return "GPTImage";
  }
}
