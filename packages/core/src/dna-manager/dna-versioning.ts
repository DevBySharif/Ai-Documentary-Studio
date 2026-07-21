import type { DNAVersion, DNAVersionStatus, DNASection } from "./types.js";

export class DNAVersioning {
  private versions: Map<string, DNAVersion[]> = new Map();
  private counter = 0;

  createVersion(dnaId: string, sections: DNASection, status: DNAVersionStatus): DNAVersion {
    this.counter++;
    const version: DNAVersion = { version: `v${this.counter}`, timestamp: Date.now(), status, sections: { ...sections } };
    if (!this.versions.has(dnaId)) this.versions.set(dnaId, []);
    this.versions.get(dnaId)!.push(version);
    return version;
  }

  getVersions(dnaId: string): DNAVersion[] {
    return (this.versions.get(dnaId) ?? []).map((v) => ({ ...v }));
  }

  getLatest(dnaId: string): DNAVersion | undefined {
    const versions = this.versions.get(dnaId);
    if (!versions || versions.length === 0) return undefined;
    return { ...versions[versions.length - 1] };
  }

  rollback(dnaId: string, version: string): DNAVersion | undefined {
    const versions = this.versions.get(dnaId);
    if (!versions) return undefined;
    const idx = versions.findIndex((v) => v.version === version);
    if (idx < 0) return undefined;
    this.versions.set(dnaId, versions.slice(0, idx + 1));
    return { ...versions[idx] };
  }
}
