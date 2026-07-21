import { AssetRegistry } from './registry';
import { AssetLifecycleManager } from './lifecycle';
import { IStorageProvider } from './storage';
import { AssetFingerprintEngine } from './fingerprint';
import { PreviewGenerator } from './preview';
import { AssetMetadata, AssetStatus } from './models';
import { randomUUID } from 'crypto';
import pino from 'pino';

const logger = pino({ name: 'asset-engine' });

export class AssetEngine {
  constructor(
    private registry: AssetRegistry,
    private storage: IStorageProvider,
    private lifecycle: AssetLifecycleManager,
    private preview: PreviewGenerator
  ) {}

  /**
   * Main entry point for ingesting a new asset into the system.
   * Handles deduplication, fingerprinting, storage, and preview generation.
   */
  async ingest(buffer: Buffer, logicalName: string, tags: string[] = []): Promise<AssetMetadata> {
    const hash = AssetFingerprintEngine.computeHash(buffer);

    // 1. Deduplication Check
    const existing = this.registry.findByHash(hash);
    if (existing) {
      logger.info({ assetId: existing.id, hash }, 'Asset deduplicated. Reusing existing asset.');
      // Optionally update tags or logical name if needed, but we return the existing asset.
      return existing;
    }

    // 2. Extract Metadata
    const extMatch = logicalName.match(/\.([^.]+)$/);
    const fallbackExt = extMatch ? extMatch[1] : 'bin';
    const { mimeType, extension } = AssetFingerprintEngine.inferMimeType(buffer, fallbackExt);

    const assetId = randomUUID();
    const storageKey = `imported/${assetId}.${extension}`;

    // 3. Store Binary
    await this.storage.store(storageKey, buffer);

    // 4. Register Metadata
    const metadata: AssetMetadata = {
      id: assetId,
      hash,
      logicalName,
      mimeType,
      fileExtension: extension,
      sizeBytes: buffer.length,
      status: AssetStatus.Indexed,
      version: 1,
      storageKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      references: 0,
      tags
    };

    this.registry.register(metadata);

    // 5. Generate Preview (non-blocking if possible, but awaited here for simplicity)
    try {
      await this.preview.generatePreview(metadata, buffer);
    } catch (error) {
      logger.warn({ assetId, error }, 'Failed to generate preview, but asset was indexed successfully');
    }

    logger.info({ assetId, hash }, 'Asset successfully ingested and indexed');
    return metadata;
  }

  getRegistry(): AssetRegistry {
    return this.registry;
  }

  getLifecycle(): AssetLifecycleManager {
    return this.lifecycle;
  }
}
