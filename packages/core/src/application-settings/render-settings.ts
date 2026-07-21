export interface ASRenderSettingsData {
  resolution: string;
  fps: number;
  codec: 'h264' | 'h265' | 'vp9' | 'av1';
  bitrate: number;
  hardwareAcceleration: boolean;
  multiThreadRendering: boolean;
  renderPriority: 'low' | 'normal' | 'high' | 'critical';
}

const DEFAULTS: ASRenderSettingsData = {
  resolution: '1920x1080',
  fps: 30,
  codec: 'h264',
  bitrate: 8000,
  hardwareAcceleration: true,
  multiThreadRendering: true,
  renderPriority: 'normal',
};

export class ASRenderSettings {
  private settings: ASRenderSettingsData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASRenderSettingsData>(key: K, value: ASRenderSettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASRenderSettingsData>(key: K): ASRenderSettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASRenderSettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASRenderSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
