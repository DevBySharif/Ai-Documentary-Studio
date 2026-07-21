import * as fs from "fs/promises";

export interface StorageHealthReport {
  checkedAt: Date;
  workspaceRoot: string;
  availableBytes: number;
  totalBytes: number;
  usedBytes: number;
  usagePercent: number;
  cacheSize: number;
  brokenReferenceCount: number;
  warnings: string[];
}

const LOW_DISK_THRESHOLD_PERCENT = 90;
const CRITICAL_DISK_THRESHOLD_PERCENT = 95;

/**
 * Monitors storage health and surfaces warnings before failures occur.
 */
export class StorageHealthMonitor {
  constructor(private readonly workspaceRoot: string) {}

  public async check(knownAssetPaths: string[] = []): Promise<StorageHealthReport> {
    const checkedAt = new Date();
    const warnings: string[] = [];

    // Disk usage via statvfs-equivalent (Node stat on workspace root)
    // Note: Node.js doesn't expose statvfs natively; real implementation
    // would use a native binding or `check-disk-space` package.
    // We provide a typed contract with mocked values here.
    const diskStats = await this.getDiskStats();

    const usagePercent = (diskStats.used / diskStats.total) * 100;

    if (usagePercent >= CRITICAL_DISK_THRESHOLD_PERCENT) {
      warnings.push(`CRITICAL: Disk usage at ${usagePercent.toFixed(1)}% — immediate action required.`);
    } else if (usagePercent >= LOW_DISK_THRESHOLD_PERCENT) {
      warnings.push(`WARNING: Disk usage at ${usagePercent.toFixed(1)}% — consider cleanup.`);
    }

    // Check for broken asset references
    const brokenReferenceCount = await this.countBrokenReferences(knownAssetPaths);
    if (brokenReferenceCount > 0) {
      warnings.push(`${brokenReferenceCount} asset reference(s) point to missing files.`);
    }

    // Estimate cache size
    const cacheSize = await this.estimateDirectorySize(`${this.workspaceRoot}/Cache`);

    return {
      checkedAt,
      workspaceRoot: this.workspaceRoot,
      availableBytes: diskStats.available,
      totalBytes: diskStats.total,
      usedBytes: diskStats.used,
      usagePercent,
      cacheSize,
      brokenReferenceCount,
      warnings,
    };
  }

  private async getDiskStats(): Promise<{ available: number; total: number; used: number }> {
    // Placeholder — a real implementation integrates a native disk-space binding.
    return { available: 50 * 1024 ** 3, total: 100 * 1024 ** 3, used: 50 * 1024 ** 3 };
  }

  private async countBrokenReferences(assetPaths: string[]): Promise<number> {
    let broken = 0;
    for (const assetPath of assetPaths) {
      try {
        await fs.access(assetPath);
      } catch {
        broken++;
      }
    }
    return broken;
  }

  private async estimateDirectorySize(dirPath: string): Promise<number> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      let total = 0;
      for (const entry of entries) {
        if (entry.isFile()) {
          const stats = await fs.stat(`${dirPath}/${entry.name}`);
          total += stats.size;
        }
      }
      return total;
    } catch {
      return 0;
    }
  }
}
