export interface ASImageProviderSettingsData {
  defaultProvider: string;
  resolution: string;
  aspectRatio: string;
  qualityProfile: 'draft' | 'standard' | 'high' | 'ultra';
  seedStrategy: 'random' | 'fixed' | 'incremental';
  styleLock: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  cachePolicy: {
    enabled: boolean;
    ttlMs: number;
    maxEntries: number;
  };
}

const DEFAULTS: ASImageProviderSettingsData = {
  defaultProvider: 'dall-e',
  resolution: '1024x1024',
  aspectRatio: '1:1',
  qualityProfile: 'standard',
  seedStrategy: 'random',
  styleLock: false,
  retryPolicy: {
    maxRetries: 2,
    backoffMs: 1000,
  },
  cachePolicy: {
    enabled: true,
    ttlMs: 86400000,
    maxEntries: 500,
  },
};

export class ASImageProviderSettings {
  private settings: ASImageProviderSettingsData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASImageProviderSettingsData>(key: K, value: ASImageProviderSettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASImageProviderSettingsData>(key: K): ASImageProviderSettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASImageProviderSettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASImageProviderSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
