export type ASCacheType = 'image' | 'voice' | 'prompt' | 'render' | 'thumbnail';

export interface ASCacheSettingsData {
  image: { enabled: boolean; maxSize: number; ttlMs: number; location: string };
  voice: { enabled: boolean; maxSize: number; ttlMs: number; location: string };
  prompt: { enabled: boolean; maxSize: number; ttlMs: number; location: string };
  render: { enabled: boolean; maxSize: number; ttlMs: number; location: string };
  thumbnail: { enabled: boolean; maxSize: number; ttlMs: number; location: string };
}

const STORE_DEFAULTS: ASCacheSettingsData = {
  image: { enabled: true, maxSize: 512, ttlMs: 86400000, location: '.cache/images' },
  voice: { enabled: true, maxSize: 256, ttlMs: 86400000, location: '.cache/voice' },
  prompt: { enabled: true, maxSize: 64, ttlMs: 43200000, location: '.cache/prompts' },
  render: { enabled: false, maxSize: 2048, ttlMs: 604800000, location: '.cache/render' },
  thumbnail: { enabled: true, maxSize: 128, ttlMs: 7200000, location: '.cache/thumbnails' },
};

export class ASCacheSettings {
  private settings: ASCacheSettingsData;

  constructor() {
    this.settings = this.clone(STORE_DEFAULTS);
  }

  set(cacheType: ASCacheType, key: string, value: unknown): void {
    const cache = this.settings[cacheType] as Record<string, unknown>;
    if (cache && key in cache) {
      (cache as Record<string, unknown>)[key] = value;
    }
  }

  get(cacheType: ASCacheType, key: string): unknown | undefined {
    const cache = this.settings[cacheType] as Record<string, unknown>;
    if (cache && key in cache) {
      return cache[key];
    }
    return undefined;
  }

  cleanupCache(cacheType: ASCacheType): void {
    this.settings[cacheType] = {
      ...this.clone(STORE_DEFAULTS[cacheType]),
      enabled: false,
    };
  }

  cleanupAllCache(): void {
    for (const cacheType of Object.keys(this.settings) as ASCacheType[]) {
      this.cleanupCache(cacheType);
    }
  }

  getDefaults(): ASCacheSettingsData {
    return this.clone(STORE_DEFAULTS);
  }

  getAll(): ASCacheSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(STORE_DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
