import type { CacheCategory, CacheEntry, CacheConfig } from "./types.js";

export class CacheManager {
  private store: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      defaultTTLMs: 5 * 60 * 1000,
      maxEntries: 1000,
      ...config,
    };
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    entry.accessCount++;

    if (Date.now() > new Date(entry.expiresAt).getTime()) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  set<T>(key: string, category: CacheCategory, value: T, ttlMs?: number): void {
    if (this.store.size >= this.config.maxEntries) this.evictOldest();

    const now = Date.now();
    const entry: CacheEntry<T> = {
      key,
      category,
      value,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + (ttlMs ?? this.config.defaultTTLMs)).toISOString(),
      accessCount: 0,
    };
    this.store.set(key, entry as CacheEntry);
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  invalidate(category?: CacheCategory): void {
    if (!category) {
      this.store.clear();
      return;
    }
    for (const [key, entry] of this.store) {
      if (entry.category === category) this.store.delete(key);
    }
  }

  getStats(): { size: number; categories: Record<string, number> } {
    const categories: Record<string, number> = {};
    for (const entry of this.store.values()) {
      categories[entry.category] = (categories[entry.category] ?? 0) + 1;
    }
    return { size: this.store.size, categories };
  }

  private evictOldest(): void {
    let oldest: string | undefined;
    let oldestTime = Infinity;
    for (const [key, entry] of this.store) {
      const time = new Date(entry.createdAt).getTime();
      if (time < oldestTime) {
        oldest = key;
        oldestTime = time;
      }
    }
    if (oldest) this.store.delete(oldest);
  }
}
