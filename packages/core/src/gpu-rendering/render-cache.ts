import type { GRCacheEntry } from "./types.js";

export class GRRenderCache {
  private entries: Map<string, GRCacheEntry> = new Map();
  private maxSize = 512;
  private currentSize = 0;

  configure(maxSizeMB: number): void {
    this.maxSize = maxSizeMB;
  }

  get(key: string): unknown | undefined {
    const entry = this.entries.get(key);
    if (entry) {
      entry.lastUsed = Date.now();
      return entry.data;
    }
    return undefined;
  }

  set(key: string, data: unknown, size: number): boolean {
    if (this.currentSize + size > this.maxSize) {
      this.evict(size);
    }
    if (this.currentSize + size > this.maxSize) return false;

    this.entries.set(key, { key, size, lastUsed: Date.now(), data });
    this.currentSize += size;
    return true;
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  private evict(neededSize: number): void {
    const sorted = Array.from(this.entries.values()).sort((a, b) => a.lastUsed - b.lastUsed);
    for (const entry of sorted) {
      if (this.currentSize + neededSize <= this.maxSize) break;
      this.entries.delete(entry.key);
      this.currentSize -= entry.size;
    }
  }

  clear(): void {
    this.entries.clear();
    this.currentSize = 0;
  }

  getSize(): number {
    return this.currentSize;
  }

  getEntryCount(): number {
    return this.entries.size;
  }
}
