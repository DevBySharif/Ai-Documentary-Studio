import type { EEVersionEntry, EEPlatform } from "./types.js";

export class EEVersionManager {
  private versions: EEVersionEntry[] = [];
  private versionIndex = 1;

  createEntry(platform: EEPlatform, checksum: string): EEVersionEntry {
    const entry: EEVersionEntry = {
      version: `v${this.versionIndex++}`,
      date: new Date().toISOString(),
      platform,
      checksum,
      status: "draft"
    };
    this.versions.push(entry);
    return entry;
  }

  finalize(version: string): void {
    const entry = this.versions.find((v) => v.version === version);
    if (entry) entry.status = "final";
  }

  publish(version: string): void {
    const entry = this.versions.find((v) => v.version === version);
    if (entry) entry.status = "published";
  }

  getHistory(): EEVersionEntry[] {
    return [...this.versions];
  }

  getLatest(): EEVersionEntry | null {
    if (this.versions.length === 0) return null;
    return { ...this.versions[this.versions.length - 1] };
  }
}
