import type { PAAssetMetadata, PAAssetType } from "./types.js";

export class PAAssetMetadataStore {
  private store: Map<string, PAAssetMetadata> = new Map();

  create(metadata: PAAssetMetadata): void {
    this.store.set(metadata.assetId, metadata);
  }

  get(assetId: string): PAAssetMetadata | undefined {
    return this.store.get(assetId);
  }

  update(assetId: string, updates: Partial<PAAssetMetadata>): void {
    const existing = this.store.get(assetId);
    if (existing) {
      this.store.set(assetId, { ...existing, ...updates, modifiedDate: new Date().toISOString() });
    }
  }

  delete(assetId: string): void {
    this.store.delete(assetId);
  }

  search(criteria: Partial<PAAssetMetadata>): PAAssetMetadata[] {
    return Array.from(this.store.values()).filter((entry) =>
      Object.entries(criteria).every(([key, value]) => (entry as unknown as Record<string, unknown>)[key] === value)
    );
  }

  getByType(type: PAAssetType): PAAssetMetadata[] {
    return Array.from(this.store.values()).filter((entry) => entry.assetType === type);
  }
}
