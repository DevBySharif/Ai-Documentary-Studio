import type { AssetOptimizationReport } from "./types.js";
import type { ArchiveCandidate } from "./archiver.js";
import type { RegenerationQueueItem } from "./types.js";
import type { UpscaleRecommendation } from "./upscale.js";

export class AssetCleanupPlan {
  generate(
    archiveCandidates: ArchiveCandidate[],
    regenerationQueue: RegenerationQueueItem[],
    upscaleRecommendations: UpscaleRecommendation[],
    keepCount: number,
    libraryHealthScore: number
  ): AssetOptimizationReport {
    return {
      libraryHealth: libraryHealthScore,
      archiveCount: archiveCandidates.length,
      regenerateCount: regenerationQueue.length,
      upscaleCount: upscaleRecommendations.length,
      keepCount,
      reusePriorityUpdated: true
    };
  }
}
