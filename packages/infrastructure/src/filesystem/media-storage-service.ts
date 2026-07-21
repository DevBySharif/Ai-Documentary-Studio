import * as fs from "fs/promises";
import { Asset } from "../../../domain/src/models/asset";
import { AssetRepository } from "../../../domain/src/repositories/asset-repository";
import { AssetImporter, ImportRequest, ImportResult } from "./asset-importer";
import { PathResolver } from "./path-resolver";
import { StorageHealthMonitor, StorageHealthReport } from "./storage-health-monitor";

/**
 * The top-level Media Storage Service.
 * All media operations flow through this service.
 * Consumers never manipulate file paths directly.
 */
export class MediaStorageService {
  constructor(
    private readonly pathResolver: PathResolver,
    private readonly assetRepository: AssetRepository,
    private readonly assetImporter: AssetImporter,
    private readonly healthMonitor: StorageHealthMonitor
  ) {}

  /**
   * Imports a file into the workspace and persists the resulting Asset.
   */
  public async importAsset(request: ImportRequest): Promise<ImportResult> {
    const result = await this.assetImporter.import(request);
    await this.assetRepository.save(result.asset);
    return result;
  }

  /**
   * Resolves the physical file path for a stored asset.
   */
  public async resolveAssetPath(assetId: string): Promise<string | undefined> {
    const asset = await this.assetRepository.getById(assetId);
    return asset?.filePath;
  }

  /**
   * Opens a readable stream to an asset's file content.
   */
  public async openAssetStream(
    assetId: string
  ): Promise<import("fs").ReadStream | undefined> {
    const assetPath = await this.resolveAssetPath(assetId);
    if (!assetPath) return undefined;

    const { createReadStream } = await import("fs");
    return createReadStream(assetPath);
  }

  /**
   * Attempts to locate a missing asset by scanning known workspace directories.
   */
  public async recoverMissingAsset(
    assetId: string
  ): Promise<Asset | undefined> {
    const asset = await this.assetRepository.getById(assetId);
    if (!asset) return undefined;

    // Try to access the known path first
    try {
      await fs.access(asset.filePath);
      return asset; // File found at its registered location
    } catch {
      // File is missing — could search workspace here in a real implementation
      return undefined;
    }
  }

  /**
   * Returns the current storage health report.
   */
  public async checkHealth(): Promise<StorageHealthReport> {
    const allAssets = await this.assetRepository.findAll();
    const paths = allAssets.map(a => a.filePath);
    return this.healthMonitor.check(paths);
  }

  /**
   * Ensures all required workspace directories exist.
   */
  public async ensureWorkspaceDirectories(projectId: string): Promise<void> {
    const dirs = [
      this.pathResolver.projectAssets(projectId),
      this.pathResolver.projectThumbnails(projectId),
      this.pathResolver.projectExports(projectId),
      this.pathResolver.projectMetadata(projectId),
      this.pathResolver.tempDir(),
      this.pathResolver.backupsDir(),
      this.pathResolver.logsDir(),
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}
