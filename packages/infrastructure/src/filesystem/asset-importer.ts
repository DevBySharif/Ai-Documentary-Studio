import * as fs from "fs/promises";
import * as path from "path";
import { Asset } from "../../../domain/src/models/asset";
import { AssetCategory } from "../../../domain/src/models/asset-lifecycle";
import { AssetHasher } from "./asset-hasher";
import { PathResolver } from "./path-resolver";
import { ThumbnailGenerator } from "./thumbnail-generator";

export interface ImportRequest {
  projectId: string;
  sourcePath: string;
}

export interface ImportResult {
  asset: Asset;
  deduplicated: boolean;
  thumbnailPath?: string;
}

/**
 * Resolves the AssetCategory from a MIME type string.
 */
function resolveCategoryFromMime(mimeType: string): AssetCategory {
  if (mimeType.startsWith("video/")) return AssetCategory.Video;
  if (mimeType.startsWith("audio/")) return AssetCategory.Audio;
  if (mimeType.startsWith("image/")) return AssetCategory.Image;
  return AssetCategory.Document;
}

/**
 * Orchestrates the full deterministic asset import pipeline:
 * Validate → Hash → Deduplicate → Copy → Index → Thumbnail
 */
export class AssetImporter {
  constructor(
    private readonly pathResolver: PathResolver,
    private readonly hasher: AssetHasher,
    private readonly thumbnailGenerator: ThumbnailGenerator,
    private readonly knownHashes: Map<string, string> = new Map()
  ) {}

  public async import(request: ImportRequest): Promise<ImportResult> {
    const { projectId, sourcePath } = request;

    // 1. Validate source file exists
    await fs.access(sourcePath);
    const stats = await fs.stat(sourcePath);

    // 2. Generate content hash
    const hash = await this.hasher.hash(sourcePath);

    // 3. Deduplication check
    const existingAssetId = this.knownHashes.get(hash);
    const deduplicated = existingAssetId !== undefined;

    // 4. Build asset ID and destination
    const assetId = existingAssetId ?? crypto.randomUUID();
    const extension = path.extname(sourcePath);
    const destinationPath = this.pathResolver.contentAddressedPath(hash, extension);

    // 5. Copy to content-addressable storage (skip if deduplicated)
    if (!deduplicated) {
      await fs.mkdir(path.dirname(destinationPath), { recursive: true });
      await fs.copyFile(sourcePath, destinationPath);
      this.knownHashes.set(hash, assetId);
    }

    // 6. Resolve MIME type from extension (real impl uses file-type library)
    const mimeType = this.resolveMimeType(extension);

    // 7. Build domain asset entity
    const asset: Asset = {
      id: assetId,
      name: path.basename(sourcePath),
      filePath: destinationPath,
      mimeType,
      sizeBytes: stats.size,
      projectId,
      createdAt: new Date(),
    };

    // 8. Generate thumbnail asynchronously
    let thumbnailPath: string | undefined;
    if (this.thumbnailGenerator.supports(mimeType)) {
      const thumbDest = this.pathResolver.thumbnailPath(projectId, assetId);
      await fs.mkdir(path.dirname(thumbDest), { recursive: true });
      const result = await this.thumbnailGenerator.generate({
        assetId,
        sourcePath: destinationPath,
        destinationPath: thumbDest,
        width: 320,
        height: 180,
        captureOffsetSeconds: 2,
      });
      thumbnailPath = result.thumbnailPath;
    }

    return { asset, deduplicated, thumbnailPath };
  }

  private resolveMimeType(extension: string): string {
    const mimeMap: Record<string, string> = {
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf",
    };
    return mimeMap[extension.toLowerCase()] ?? "application/octet-stream";
  }
}
