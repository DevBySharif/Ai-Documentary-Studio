import type { AssetLifecycle } from "./types.js";

export class AssetLifecyclePredictor {
  private lifecycles = new Map<string, AssetLifecycle>();

  predict(assetId: string, reuseCount: number, daysSinceCreated: number, recentReuseTrend: "increasing" | "stable" | "decreasing"): AssetLifecycle {
    let stage: AssetLifecycle["stage"];
    let daysInStage = daysSinceCreated;

    if (reuseCount === 0 && daysSinceCreated < 30) {
      stage = "new";
    } else if (reuseCount < 5 && daysSinceCreated < 90) {
      stage = "growing";
    } else if (reuseCount >= 5 && recentReuseTrend !== "decreasing") {
      stage = "frequently_used";
    } else if (reuseCount >= 10) {
      stage = "mature";
    } else {
      stage = "archive_candidate";
    }

    const lifecycle: AssetLifecycle = { assetId, stage, daysInStage, reuseTrend: recentReuseTrend };
    this.lifecycles.set(assetId, lifecycle);
    return lifecycle;
  }

  get(assetId: string): AssetLifecycle | undefined {
    return this.lifecycles.get(assetId);
  }

  getArchiveCandidates(): AssetLifecycle[] {
    return Array.from(this.lifecycles.values()).filter((l) => l.stage === "archive_candidate");
  }
}
