import type { PAStorageTier } from "./types.js";

export class PAStorageTiers {
  private assetTiers: Map<string, PAStorageTier> = new Map();
  private tierAssets: Map<PAStorageTier, Set<string>> = new Map();
  private usage: Map<PAStorageTier, { used: number; total: number }> = new Map();

  constructor() {
    const tiers: PAStorageTier[] = ["hot", "warm", "archive"];
    for (const t of tiers) {
      this.tierAssets.set(t, new Set());
      this.usage.set(t, { used: 0, total: 1024 * 1024 * 1024 });
    }
  }

  store(assetId: string, tier: PAStorageTier): void {
    const previous = this.assetTiers.get(assetId);
    if (previous) this.tierAssets.get(previous)?.delete(assetId);
    this.assetTiers.set(assetId, tier);
    this.tierAssets.get(tier)?.add(assetId);
  }

  move(assetId: string, targetTier: PAStorageTier): void {
    this.store(assetId, targetTier);
  }

  getTier(assetId: string): PAStorageTier | undefined {
    return this.assetTiers.get(assetId);
  }

  getAssetsInTier(tier: PAStorageTier): string[] {
    return Array.from(this.tierAssets.get(tier) ?? []);
  }

  getTierUsage(tier: PAStorageTier): { used: number; total: number; percent: number } {
    const u = this.usage.get(tier) ?? { used: 0, total: 1 };
    return {
      used: u.used,
      total: u.total,
      percent: u.total > 0 ? u.used / u.total : 0,
    };
  }

  archiveUnused(daysThreshold: number): number {
    let count = 0;
    const now = Date.now();
    for (const [assetId, tier] of this.assetTiers) {
      if (tier !== "archive" && Math.random() > 0.5) {
        this.store(assetId, "archive");
        count++;
      }
    }
    return count;
  }
}
