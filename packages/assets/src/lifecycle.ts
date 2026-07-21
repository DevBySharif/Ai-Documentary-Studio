import { AssetRegistry } from './registry';
import { AssetStatus, AssetMetadata } from './models';
import pino from 'pino';

const logger = pino({ name: 'asset-lifecycle' });

export class AssetLifecycleManager {
  constructor(private registry: AssetRegistry) {}

  addReference(assetId: string): void {
    const asset = this.registry.findById(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);
    
    asset.references += 1;
    this.registry.update(asset);
    logger.debug({ assetId, references: asset.references }, 'Added reference');
  }

  removeReference(assetId: string): void {
    const asset = this.registry.findById(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);
    
    if (asset.references > 0) {
      asset.references -= 1;
      this.registry.update(asset);
      logger.debug({ assetId, references: asset.references }, 'Removed reference');
    }
  }

  softDelete(assetId: string): void {
    const asset = this.registry.findById(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);
    
    if (asset.references > 0) {
      throw new Error(`Cannot delete asset ${assetId} - it has ${asset.references} active references`);
    }

    asset.status = AssetStatus.Deleted;
    this.registry.update(asset);
    logger.info({ assetId }, 'Soft deleted asset');
  }

  archive(assetId: string): void {
    const asset = this.registry.findById(assetId);
    if (!asset) throw new Error(`Asset ${assetId} not found`);

    asset.status = AssetStatus.Archived;
    this.registry.update(asset);
    logger.info({ assetId }, 'Archived asset');
  }
}
