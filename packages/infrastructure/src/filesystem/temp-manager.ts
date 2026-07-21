import * as fs from "fs/promises";
import * as path from "path";

const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Manages temporary files used during import staging, transcoding, and rendering.
 * All temp files have expiration policies enforced on cleanup.
 */
export class TempManager {
  constructor(private readonly tempDir: string) {}

  /**
   * Returns a stable temp file path for a given purpose and extension.
   * Does NOT create the file — caller is responsible for writing to it.
   */
  public allocate(purpose: string, extension: string): string {
    const id = `${purpose}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return path.join(this.tempDir, `${id}${extension}`);
  }

  /**
   * Removes a single temp file if it exists.
   */
  public async release(filePath: string): Promise<void> {
    try {
      await fs.rm(filePath, { force: true });
    } catch {
      // Non-fatal — temp files may already be gone
    }
  }

  /**
   * Scans the temp directory and removes all files older than maxAgeMs.
   */
  public async purgeExpired(maxAgeMs = DEFAULT_MAX_AGE_MS): Promise<number> {
    const now = Date.now();
    let removed = 0;

    try {
      const entries = await fs.readdir(this.tempDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const fullPath = path.join(this.tempDir, entry.name);
        const stats = await fs.stat(fullPath);

        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.rm(fullPath, { force: true });
          removed++;
        }
      }
    } catch {
      // If tempDir doesn't exist yet, nothing to purge
    }

    return removed;
  }
}
