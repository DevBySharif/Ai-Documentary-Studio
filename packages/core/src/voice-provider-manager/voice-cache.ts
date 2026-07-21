import { VPNarrationResult } from "./types";

interface VPCacheEntry {
  result: VPNarrationResult;
  timestamp: number;
  ttl: number;
}

export class VPVoiceCache {
  private cache: Map<string, VPCacheEntry> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLMs: number = 3600000) {
    this.defaultTTL = defaultTTLMs;
  }

  private computeHash(script: string): string {
    let hash = 0;
    for (let i = 0; i < script.length; i++) {
      const char = script.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}_${script.length}`;
  }

  get(scriptHash?: string): VPNarrationResult | undefined {
    const key = scriptHash || "";
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return { ...entry.result, timingData: { ...entry.result.timingData } };
  }

  getByScript(script: string): VPNarrationResult | undefined {
    return this.get(this.computeHash(script));
  }

  set(scriptHash: string, result: VPNarrationResult, ttl?: number): void {
    this.cache.set(scriptHash, {
      result: { ...result, timingData: { ...result.timingData } },
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  setByScript(script: string, result: VPNarrationResult, ttl?: number): void {
    this.set(this.computeHash(script), result, ttl);
  }

  has(scriptHash: string): boolean {
    const entry = this.cache.get(scriptHash);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(scriptHash);
      return false;
    }
    return true;
  }

  hasScript(script: string): boolean {
    return this.has(this.computeHash(script));
  }

  clear(): void {
    this.cache.clear();
  }

  remove(scriptHash: string): boolean {
    return this.cache.delete(scriptHash);
  }

  size(): number {
    this.evictExpired();
    return this.cache.size;
  }

  setDefaultTTL(ms: number): void {
    this.defaultTTL = ms;
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
