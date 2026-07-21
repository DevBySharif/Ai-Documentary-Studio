import { FrameIndex } from "../timeline-engine/time";

export interface CachedFrame {
  readonly frame: FrameIndex;
  readonly width: number;
  readonly height: number;
  readonly textureId: string;
  readonly createdAt: number;
}

/**
 * LRU Frame Cache storing decoded & composited textures.
 */
export class FrameCache {
  private cache = new Map<FrameIndex, CachedFrame>();
  private readonly maxCapacity: number;

  constructor(maxCapacity = 60) {
    this.maxCapacity = maxCapacity;
  }

  public get(frame: FrameIndex): CachedFrame | undefined {
    const cached = this.cache.get(frame);
    if (cached) {
      // Re-insert to update LRU order
      this.cache.delete(frame);
      this.cache.set(frame, cached);
    }
    return cached;
  }

  public put(cachedFrame: CachedFrame): void {
    if (this.cache.has(cachedFrame.frame)) {
      this.cache.delete(cachedFrame.frame);
    } else if (this.cache.size >= this.maxCapacity) {
      // Evict oldest (first key in Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(cachedFrame.frame, cachedFrame);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}
