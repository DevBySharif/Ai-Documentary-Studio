import type { AssetMetadata, AssetHealthCategory } from "./types.js";

const DEFAULT_HEALTH_SCORES: Record<AssetHealthCategory, number> = {
  quality: 50,
  resolution: 50,
  sharpness: 50,
  style_consistency: 50,
  reuse_value: 50,
};

export class MetadataDatabase {
  private store = new Map<string, AssetMetadata>();

  insert(assetId: string, metadata: AssetMetadata): void {
    if (!assetId) throw new Error("assetId is required");
    if (!metadata) throw new Error("AssetMetadata is required");

    this.store.set(assetId, {
      ...metadata,
      healthScores: metadata.healthScores ?? { ...DEFAULT_HEALTH_SCORES },
      overallHealth: metadata.overallHealth ?? 50,
    });
  }

  get(assetId: string): AssetMetadata | undefined {
    return this.store.get(assetId);
  }

  update(assetId: string, partial: Partial<AssetMetadata>): AssetMetadata | undefined {
    const existing = this.store.get(assetId);
    if (!existing) return undefined;
    const updated = { ...existing, ...partial };
    this.store.set(assetId, updated);
    return updated;
  }

  incrementReuseCount(assetId: string): void {
    const meta = this.store.get(assetId);
    if (meta) {
      meta.reuseCount = (meta.reuseCount ?? 0) + 1;
      meta.lastUsed = new Date().toISOString();
    }
  }

  updateHealthScore(assetId: string, category: AssetHealthCategory, score: number): void {
    const meta = this.store.get(assetId);
    if (meta) {
      const healthScores = meta.healthScores ?? { ...DEFAULT_HEALTH_SCORES };
      healthScores[category] = score;
      meta.healthScores = healthScores;
      const scores = Object.values(healthScores);
      meta.overallHealth = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 50;
    }
  }

  findByProject(projectId: string): AssetMetadata[] {
    if (!projectId) return [];
    return Array.from(this.store.values()).filter((m) => m.project === projectId);
  }

  findByChannel(channelId: string): AssetMetadata[] {
    if (!channelId) return [];
    return Array.from(this.store.values()).filter((m) => m.channel === channelId);
  }

  findByModel(model: string): AssetMetadata[] {
    if (!model) return [];
    return Array.from(this.store.values()).filter((m) => m.model === model);
  }

  findByStyle(style: string): AssetMetadata[] {
    if (!style) return [];
    return Array.from(this.store.values()).filter((m) => m.style === style);
  }

  findByMinQuality(minScore: number): AssetMetadata[] {
    const min = typeof minScore === "number" ? minScore : 0;
    return Array.from(this.store.values()).filter((m) => (m.qualityScore ?? 0) >= min);
  }

  getRecentlyUsed(limit = 20): AssetMetadata[] {
    return Array.from(this.store.values())
      .filter((m) => m.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      .slice(0, Math.max(1, limit));
  }

  getMostReused(limit = 20): AssetMetadata[] {
    return Array.from(this.store.values())
      .sort((a, b) => (b.reuseCount ?? 0) - (a.reuseCount ?? 0))
      .slice(0, Math.max(1, limit));
  }

  count(): number {
    return this.store.size;
  }

  getAll(): AssetMetadata[] {
    return Array.from(this.store.values());
  }
}
