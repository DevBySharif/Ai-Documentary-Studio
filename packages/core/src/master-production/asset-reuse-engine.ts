import type { MPAssetReuseEntry } from "./types.js";

export class MPAssetReuseEngine {
  private entries: Map<string, MPAssetReuseEntry> = new Map();

  register(fingerprint: string, assetType: string, assetId: string): void {
    const existing = this.entries.get(fingerprint);
    if (existing) {
      existing.reuseCount++;
      existing.lastUsed = Date.now();
    } else {
      this.entries.set(fingerprint, { fingerprint, assetType, assetId, reuseCount: 1, lastUsed: Date.now() });
    }
  }

  findExisting(fingerprint: string): MPAssetReuseEntry | undefined {
    const entry = this.entries.get(fingerprint);
    return entry ? { ...entry } : undefined;
  }

  getReuseCount(fingerprint: string): number {
    return this.entries.get(fingerprint)?.reuseCount ?? 0;
  }

  getMostReused(limit: number): MPAssetReuseEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => b.reuseCount - a.reuseCount).slice(0, limit).map((e) => ({ ...e }));
  }

  clear(): void {
    this.entries.clear();
  }
}
