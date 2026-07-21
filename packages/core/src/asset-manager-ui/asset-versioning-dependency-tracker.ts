import { AssetItem, AssetVersion, AssetDependency } from "./asset-ui-types";

/**
 * Asset Versioning, Dependency Linker & Usage Analytics Tracker (Vol 05 Part 07 - Section 10, Section 11, Section 12).
 * Tracks asset version history (Original -> Upscaled -> Color Corrected), links active usage dependencies, and prevents accidental deletion.
 */
export class AssetVersioningDependencyTracker {
  public addAssetVersion(asset: AssetItem, versionName: string, fileUrl: string): AssetItem {
    const newVersionNumber = asset.versionHistory.length + 1;
    const version: AssetVersion = {
      versionNumber: newVersionNumber,
      versionName,
      fileUrl,
      createdAt: new Date(),
    };

    return {
      ...asset,
      currentVersion: version,
      versionHistory: [...asset.versionHistory, version],
    };
  }

  public linkDependency(asset: AssetItem, dependency: AssetDependency): AssetItem {
    return {
      ...asset,
      dependencies: [...asset.dependencies, dependency],
      usageCount: asset.usageCount + 1,
    };
  }

  public canSafeDelete(asset: AssetItem): { safe: boolean; activeDependenciesCount: number } {
    return {
      safe: asset.dependencies.length === 0,
      activeDependenciesCount: asset.dependencies.length,
    };
  }
}
