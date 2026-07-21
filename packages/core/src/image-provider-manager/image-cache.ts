import { IPImageResult } from "./types";
import * as crypto from "crypto";

interface IPCacheEntry {
  result: IPImageResult;
  timestamp: number;
}

export class IPImageCache {
  private cache: Map<string, IPCacheEntry> = new Map();
  private ttlMs: number;

  constructor(ttlMs: number = 5 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  private hashPrompt(prompt: string): string {
    return crypto.createHash("sha256").update(prompt).digest("hex");
  }

  get(prompt: string): IPImageResult | undefined {
    const hash = this.hashPrompt(prompt);
    const entry = this.cache.get(hash);
    if (!entry) {
      return undefined;
    }
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(hash);
      return undefined;
    }
    return entry.result;
  }

  set(prompt: string, result: IPImageResult): void {
    const hash = this.hashPrompt(prompt);
    this.cache.set(hash, {
      result,
      timestamp: Date.now(),
    });
  }

  has(prompt: string): boolean {
    const hash = this.hashPrompt(prompt);
    const entry = this.cache.get(hash);
    if (!entry) {
      return false;
    }
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(hash);
      return false;
    }
    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  removeExpired(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        this.cache.delete(key);
        removed++;
      }
    }
    return removed;
  }

  size(): number {
    return this.cache.size;
  }
}
