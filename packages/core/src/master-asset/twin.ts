import type { DigitalAssetTwin } from "./types.js";

export class DigitalAssetTwinManager {
  private twins = new Map<string, DigitalAssetTwin>();

  sync(twin: DigitalAssetTwin): void {
    if (!twin?.assetId) throw new Error("DigitalAssetTwin with assetId is required");
    twin.lastSyncedAt = new Date().toISOString();
    this.twins.set(twin.assetId, twin);
  }

  get(assetId: string): DigitalAssetTwin | undefined {
    return this.twins.get(assetId);
  }

  searchByTag(tag: string): DigitalAssetTwin[] {
    if (!tag) return [];
    const lower = tag.toLowerCase();
    return Array.from(this.twins.values()).filter((t) =>
      t.semanticTags.some((st) => st.toLowerCase().includes(lower))
    );
  }

  getAll(): DigitalAssetTwin[] {
    return Array.from(this.twins.values());
  }

  count(): number {
    return this.twins.size;
  }
}
