import type { AssetVersion } from "./types.js";

export class ImageVersionManager {
  private versions = new Map<string, AssetVersion[]>();

  createVersion(assetId: string, change: string, previousImageData?: string): AssetVersion {
    const history = this.versions.get(assetId) ?? [];
    const version: AssetVersion = {
      version: history.length + 1,
      change,
      timestamp: new Date().toISOString(),
      previousImageData,
    };
    history.push(version);
    this.versions.set(assetId, history);
    return version;
  }

  getHistory(assetId: string): AssetVersion[] {
    return this.versions.get(assetId) ?? [];
  }

  getVersion(assetId: string, versionNumber: number): AssetVersion | undefined {
    return this.versions.get(assetId)?.find((v) => v.version === versionNumber);
  }

  getLatestVersion(assetId: string): AssetVersion | undefined {
    const history = this.versions.get(assetId);
    return history && history.length > 0 ? history[history.length - 1] : undefined;
  }

  rollback(assetId: string, versionNumber: number): AssetVersion | undefined {
    const history = this.versions.get(assetId);
    if (!history) return undefined;
    const target = history.find((v) => v.version === versionNumber);
    if (!target) return undefined;

    const rollbackIdx = history.indexOf(target);
    this.versions.set(assetId, history.slice(0, rollbackIdx + 1));

    return target;
  }

  getVersionCount(assetId: string): number {
    return this.versions.get(assetId)?.length ?? 0;
  }

  getAllVersionedAssets(): string[] {
    return Array.from(this.versions.keys());
  }
}
