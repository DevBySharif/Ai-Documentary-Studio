import type { MasterAssetRecord, MasterProjectManifest } from "./types.js";

export class ProjectManifestBuilder {
  build(projectId: string, assets: MasterAssetRecord[], dependencies: string[], createdBy: string): MasterProjectManifest {
    return {
      projectId,
      assets,
      dependencies,
      createdBy,
      createdAt: new Date().toISOString(),
      version: 1
    };
  }

  validate(manifest: MasterProjectManifest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!manifest.projectId) errors.push("Missing projectId");
    if (!Array.isArray(manifest.assets)) errors.push("Missing assets array");
    if (!manifest.createdBy) errors.push("Missing createdBy");
    return { valid: errors.length === 0, errors };
  }
}
