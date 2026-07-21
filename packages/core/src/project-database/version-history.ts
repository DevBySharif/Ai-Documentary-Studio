import { PDEntityRecord } from "./types";

interface VersionEntry {
  versionNumber: number;
  data: PDEntityRecord;
  timestamp: Date;
}

export class PDVersionHistory {
  private history = new Map<string, VersionEntry[]>();

  createVersion(entityId: string, data: PDEntityRecord): number {
    if (!this.history.has(entityId)) {
      this.history.set(entityId, []);
    }
    const versions = this.history.get(entityId)!;
    const versionNumber = versions.length + 1;
    versions.push({ versionNumber, data: { ...data, version: versionNumber }, timestamp: new Date() });
    return versionNumber;
  }

  getVersion(entityId: string, versionNumber: number): PDEntityRecord | undefined {
    const versions = this.history.get(entityId);
    if (!versions) return undefined;
    const entry = versions.find((v) => v.versionNumber === versionNumber);
    return entry ? { ...entry.data } : undefined;
  }

  getLatestVersion(entityId: string): PDEntityRecord {
    const versions = this.history.get(entityId);
    if (!versions || versions.length === 0) {
      throw new Error(`No versions found for entity ${entityId}`);
    }
    return { ...versions[versions.length - 1].data };
  }

  getAllVersions(entityId: string): PDEntityRecord[] {
    const versions = this.history.get(entityId);
    if (!versions) return [];
    return versions.map((v) => ({ ...v.data }));
  }

  compareVersions(
    entityId: string,
    v1: number,
    v2: number
  ): { added: string[]; removed: string[]; modified: string[] } {
    const version1 = this.getVersion(entityId, v1);
    const version2 = this.getVersion(entityId, v2);

    if (!version1 || !version2) {
      throw new Error(`Version not found for entity ${entityId}`);
    }

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    const keys1 = new Set(Object.keys(version1.data));
    const keys2 = new Set(Object.keys(version2.data));

    for (const key of keys1) {
      if (!keys2.has(key)) {
        removed.push(key);
      } else if (JSON.stringify(version1.data[key]) !== JSON.stringify(version2.data[key])) {
        modified.push(key);
      }
    }

    for (const key of keys2) {
      if (!keys1.has(key)) {
        added.push(key);
      }
    }

    return { added, removed, modified };
  }
}
