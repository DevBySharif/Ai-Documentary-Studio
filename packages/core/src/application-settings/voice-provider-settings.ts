export interface ASVoiceProviderSettingsData {
  defaultVoice: string;
  language: string;
  speakingRate: number;
  pitch: number;
  emotionProfile: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'custom';
  outputFormat: 'mp3' | 'wav' | 'ogg' | 'aac';
  offlineVoicePreference: {
    enabled: boolean;
    voicePack: string;
    quality: 'low' | 'medium' | 'high';
  };
}

const DEFAULTS: ASVoiceProviderSettingsData = {
  defaultVoice: 'en-US-Wavenet-D',
  language: 'en-US',
  speakingRate: 1.0,
  pitch: 0,
  emotionProfile: 'neutral',
  outputFormat: 'mp3',
  offlineVoicePreference: {
    enabled: false,
    voicePack: 'standard',
    quality: 'medium',
  },
};

export class ASVoiceProviderSettings {
  private settings: ASVoiceProviderSettingsData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASVoiceProviderSettingsData>(key: K, value: ASVoiceProviderSettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASVoiceProviderSettingsData>(key: K): ASVoiceProviderSettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASVoiceProviderSettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASVoiceProviderSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
