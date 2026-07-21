import { AssetMetadata } from './models';

export class AssetRegistry {
  private assetsById: Map<string, AssetMetadata> = new Map();
  private assetsByHash: Map<string, AssetMetadata> = new Map();

  /**
   * Registers a new asset metadata record in the index.
   */
  register(asset: AssetMetadata): void {
    if (this.assetsById.has(asset.id)) {
      throw new Error(`Asset ${asset.id} already exists.`);
    }
    this.assetsById.set(asset.id, asset);
    this.assetsByHash.set(asset.hash, asset);
  }

  /**
   * Returns an existing asset by its content hash to prevent duplicate storage.
   */
  findByHash(hash: string): AssetMetadata | undefined {
    return this.assetsByHash.get(hash);
  }

  findById(id: string): AssetMetadata | undefined {
    return this.assetsById.get(id);
  }

  update(asset: AssetMetadata): void {
    if (!this.assetsById.has(asset.id)) {
      throw new Error(`Asset ${asset.id} not found.`);
    }
    this.assetsById.set(asset.id, asset);
    this.assetsByHash.set(asset.hash, asset);
  }

  delete(id: string): void {
    const asset = this.assetsById.get(id);
    if (asset) {
      this.assetsById.delete(id);
      this.assetsByHash.delete(asset.hash);
    }
  }

  /**
   * Stub for a more complex query system.
   */
  findActiveAssets(): AssetMetadata[] {
    return Array.from(this.assetsById.values()).filter(a => a.status !== 'Deleted' && a.status !== 'Purged');
  }
}
