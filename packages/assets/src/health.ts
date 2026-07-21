import { AssetRegistry } from './registry';
import { IStorageProvider } from './storage';
import { AssetFingerprintEngine } from './fingerprint';
import pino from 'pino';

const logger = pino({ name: 'asset-health-checker' });

export class AssetHealthChecker {
  constructor(
    private registry: AssetRegistry,
    private storage: IStorageProvider
  ) {}

  /**
   * Scans all active assets, verifying that the file exists on disk
   * and its hash matches the indexed hash.
   */
  async verifyAll(): Promise<{ missing: string[], corrupted: string[] }> {
    const activeAssets = this.registry.findActiveAssets();
    const missing: string[] = [];
    const corrupted: string[] = [];

    for (const asset of activeAssets) {
      const exists = await this.storage.exists(asset.storageKey);
      
      if (!exists) {
        logger.error({ assetId: asset.id, storageKey: asset.storageKey }, 'Asset file missing from storage');
        missing.push(asset.id);
        continue;
      }

      const buffer = await this.storage.retrieve(asset.storageKey);
      const computedHash = AssetFingerprintEngine.computeHash(buffer);

      if (computedHash !== asset.hash) {
        logger.error({ assetId: asset.id, expected: asset.hash, actual: computedHash }, 'Asset hash mismatch (Corruption detected)');
        corrupted.push(asset.id);
      }
    }

    return { missing, corrupted };
  }
}
