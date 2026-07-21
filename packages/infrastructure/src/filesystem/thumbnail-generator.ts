/**
 * Contract for generating thumbnails from media assets.
 * The implementation is pluggable (FFmpeg, Sharp, etc.).
 */
export interface ThumbnailRequest {
  assetId: string;
  sourcePath: string;
  destinationPath: string;
  /** Desired width in pixels. */
  width: number;
  /** Desired height in pixels. */
  height: number;
  /** For video: timestamp offset (seconds) at which to capture the frame. */
  captureOffsetSeconds?: number;
}

export interface ThumbnailResult {
  assetId: string;
  thumbnailPath: string;
  generatedAt: Date;
  durationMs: number;
}

export interface ThumbnailGenerator {
  generate(request: ThumbnailRequest): Promise<ThumbnailResult>;
  supports(mimeType: string): boolean;
}

/**
 * No-op generator used in test environments or as a safe default.
 */
export class NullThumbnailGenerator implements ThumbnailGenerator {
  public async generate(request: ThumbnailRequest): Promise<ThumbnailResult> {
    return {
      assetId: request.assetId,
      thumbnailPath: request.destinationPath,
      generatedAt: new Date(),
      durationMs: 0,
    };
  }

  public supports(_mimeType: string): boolean {
    return false;
  }
}
