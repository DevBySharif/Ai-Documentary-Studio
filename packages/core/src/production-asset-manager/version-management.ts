import type { PAAssetVersion } from "./types.js";

export class PAVersionManagement {
  private versions: Map<string, PAAssetVersion[]> = new Map();

  createVersion(assetId: string, data: Omit<PAAssetVersion, "versionNumber" | "assetId" | "createdDate">): PAAssetVersion {
    const list = this.versions.get(assetId) ?? [];
    const versionNumber = list.length + 1;
    const version: PAAssetVersion = {
      versionNumber,
      assetId,
      filePath: data.filePath,
      hash: data.hash,
      createdDate: new Date().toISOString(),
      createdBy: data.createdBy,
      changes: data.changes,
    };
    list.push(version);
    this.versions.set(assetId, list);
    return version;
  }

  getVersion(assetId: string, versionNumber: number): PAAssetVersion | undefined {
    return this.versions.get(assetId)?.find((v) => v.versionNumber === versionNumber);
  }

  getLatestVersion(assetId: string): PAAssetVersion | undefined {
    const list = this.versions.get(assetId);
    return list ? list[list.length - 1] : undefined;
  }

  getAllVersions(assetId: string): PAAssetVersion[] {
    return this.versions.get(assetId) ?? [];
  }

  rollback(assetId: string, versionNumber: number): PAAssetVersion | undefined {
    const target = this.getVersion(assetId, versionNumber);
    if (!target) return undefined;
    const list = this.versions.get(assetId)!;
    const newVersion: PAAssetVersion = {
      ...target,
      versionNumber: list.length + 1,
      createdDate: new Date().toISOString(),
      createdBy: "system",
      changes: `Rollback to version ${versionNumber}`,
    };
    list.push(newVersion);
    return newVersion;
  }
}
