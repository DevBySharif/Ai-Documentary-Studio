import type { AssetQuality, RegenerationQueueItem } from "./types.js";

export class RegenerationDetector {
  private queue: RegenerationQueueItem[] = [];

  analyze(assets: AssetQuality[]): RegenerationQueueItem[] {
    this.queue = [];

    for (const asset of assets) {
      if (asset.styleConsistency < 40) {
        this.queue.push({ assetId: asset.assetId, reason: "Poor Style Match", priority: 90 });
      } else if (asset.overall < 30) {
        this.queue.push({ assetId: asset.assetId, reason: "Low Resolution", priority: 80 });
      } else if (asset.composition < 35) {
        this.queue.push({ assetId: asset.assetId, reason: "Weak Composition", priority: 70 });
      } else if (asset.promptQuality < 40) {
        this.queue.push({ assetId: asset.assetId, reason: "Prompt Error", priority: 60 });
      }
    }

    this.queue.sort((a, b) => b.priority - a.priority);
    return this.queue;
  }

  getQueue(): RegenerationQueueItem[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
  }
}
