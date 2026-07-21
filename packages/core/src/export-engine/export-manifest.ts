import type { EEManifest } from "./types.js";

export class EEExportManifest {
  generate(productionId: string, version: string, codec: string, resolution: string, duration: number, qaScore: number, checksums: Record<string, string>, assets: string[]): EEManifest {
    return {
      productionId, exportVersion: version, codec, resolution,
      duration, qaScore, fileChecksums: checksums, assetReferences: assets
    };
  }

  toJSON(manifest: EEManifest): string {
    return JSON.stringify(manifest, null, 2);
  }

  verify(manifest: EEManifest, checksums: Record<string, string>): boolean {
    for (const [file, hash] of Object.entries(manifest.fileChecksums)) {
      if (checksums[file] !== hash) return false;
    }
    return true;
  }
}
