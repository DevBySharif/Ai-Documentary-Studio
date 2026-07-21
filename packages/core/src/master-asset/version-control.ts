import type { MasterAssetVersion } from "./types.js";

export class VersionControlSystem {
  private versions = new Map<string, MasterAssetVersion[]>();

  commit(version: MasterAssetVersion): void {
    if (!version?.assetId) throw new Error("MasterAssetVersion with assetId is required");
    if (!this.versions.has(version.assetId)) this.versions.set(version.assetId, []);
    this.versions.get(version.assetId)!.push(version);
  }

  getHistory(assetId: string): MasterAssetVersion[] {
    return this.versions.get(assetId) ?? [];
  }

  getLatest(assetId: string): MasterAssetVersion | undefined {
    const history = this.versions.get(assetId);
    if (!history || history.length === 0) return undefined;
    return history.reduce((latest, v) => (v.version > latest.version ? v : latest));
  }

  rollback(assetId: string, targetVersion: number): MasterAssetVersion | null {
    const history = this.versions.get(assetId);
    if (!history) return null;
    const target = history.find((v) => v.version === targetVersion);
    return target ?? null;
  }

  getVersionCount(assetId: string): number {
    return this.versions.get(assetId)?.length ?? 0;
  }
}
