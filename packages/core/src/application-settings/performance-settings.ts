export interface ASPerformanceSettingsData {
  cpuUsageLimit: number;
  gpuUsageLimit: number;
  ramLimit: number;
  backgroundRendering: boolean;
  concurrentJobs: number;
  cacheSize: number;
  previewQuality: 'low' | 'medium' | 'high' | 'original';
}

const DEFAULTS: ASPerformanceSettingsData = {
  cpuUsageLimit: 80,
  gpuUsageLimit: 85,
  ramLimit: 4096,
  backgroundRendering: true,
  concurrentJobs: 2,
  cacheSize: 1024,
  previewQuality: 'medium',
};

export class ASPerformanceSettings {
  private settings: ASPerformanceSettingsData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASPerformanceSettingsData>(key: K, value: ASPerformanceSettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASPerformanceSettingsData>(key: K): ASPerformanceSettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASPerformanceSettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASPerformanceSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
