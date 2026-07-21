import type { MasterAssetRecord, ImportExportPackage, MasterProjectManifest } from "./types.js";

export class ImportExportManager {
  private packages = new Map<string, ImportExportPackage>();

  createPackage(assets: MasterAssetRecord[], manifest: MasterProjectManifest, format: ImportExportPackage["format"]): ImportExportPackage {
    const pkg: ImportExportPackage = {
      packageId: `pkg_${Date.now()}`,
      assets,
      manifest,
      format,
      createdAt: new Date().toISOString()
    };
    this.packages.set(pkg.packageId, pkg);
    return pkg;
  }

  getPackage(id: string): ImportExportPackage | undefined {
    return this.packages.get(id);
  }

  importPackage(pkg: ImportExportPackage): { imported: number; skipped: number } {
    let imported = 0;
    let skipped = 0;
    for (const asset of pkg.assets) {
      if (!this.packages.has(asset.id)) {
        imported++;
      } else {
        skipped++;
      }
    }
    return { imported, skipped };
  }

  exportPackage(assetIds: string[], getAllAssets: (ids: string[]) => MasterAssetRecord[], manifest: MasterProjectManifest): ImportExportPackage {
    const assets = getAllAssets(assetIds);
    return this.createPackage(assets, manifest, "json");
  }
}
