import type { PACacheEntry } from "./types.js";

export type PACacheType = "image" | "voice" | "prompt" | "render" | "ai_response";

interface CacheStats {
  hits: number;
  misses: number;
}

export class PACacheManagement {
  private caches: Map<PACacheType, Map<string, PACacheEntry>> = new Map();
  private stats: Map<PACacheType, CacheStats> = new Map();

  constructor() {
    const types: PACacheType[] = ["image", "voice", "prompt", "render", "ai_response"];
    for (const t of types) {
      this.caches.set(t, new Map());
      this.stats.set(t, { hits: 0, misses: 0 });
    }
  }

  get(cacheType: PACacheType, key: string): unknown | undefined {
    const cache = this.caches.get(cacheType);
    if (!cache) return undefined;
    const entry = cache.get(key);
    if (!entry) {
      this.stats.get(cacheType)!.misses++;
      return undefined;
    }
    const now = Date.now();
    if (now > entry.ttl) {
      cache.delete(key);
      this.stats.get(cacheType)!.misses++;
      return undefined;
    }
    entry.accessCount++;
    this.stats.get(cacheType)!.hits++;
    return entry.data;
  }

  set(cacheType: PACacheType, key: string, data: unknown, ttlMs?: number): void {
    const cache = this.caches.get(cacheType);
    if (!cache) return;
    const entry: PACacheEntry = {
      key,
      data,
      ttl: Date.now() + (ttlMs ?? 300000),
      createdDate: new Date().toISOString(),
      accessCount: 0,
    };
    cache.set(key, entry);
  }

  invalidate(cacheType: PACacheType, key?: string): void {
    const cache = this.caches.get(cacheType);
    if (!cache) return;
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }

  clearCache(cacheType: PACacheType): void {
    const cache = this.caches.get(cacheType);
    if (cache) cache.clear();
  }

  getStats(cacheType: PACacheType): { size: number; hitRate: number; missRate: number } {
    const cache = this.caches.get(cacheType);
    const stats = this.stats.get(cacheType) ?? { hits: 0, misses: 0 };
    const total = stats.hits + stats.misses;
    return {
      size: cache?.size ?? 0,
      hitRate: total > 0 ? stats.hits / total : 0,
      missRate: total > 0 ? stats.misses / total : 0,
    };
  }
}
