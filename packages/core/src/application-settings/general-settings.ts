export interface ASGeneralSettingsData {
  language: string;
  region: string;
  timeFormat: '12h' | '24h';
  autoSaveInterval: number;
  defaultWorkspace: string;
  startupBehavior: 'restore' | 'new' | 'empty';
  notificationPreferences: {
    projectUpdates: boolean;
    renderComplete: boolean;
    errors: boolean;
    tips: boolean;
  };
}

const DEFAULTS: ASGeneralSettingsData = {
  language: 'en-US',
  region: 'US',
  timeFormat: '12h',
  autoSaveInterval: 300,
  defaultWorkspace: '',
  startupBehavior: 'restore',
  notificationPreferences: {
    projectUpdates: true,
    renderComplete: true,
    errors: true,
    tips: false,
  },
};

export class ASGeneralSettings {
  private settings: ASGeneralSettingsData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASGeneralSettingsData>(key: K, value: ASGeneralSettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASGeneralSettingsData>(key: K): ASGeneralSettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASGeneralSettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASGeneralSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone(data: ASGeneralSettingsData): ASGeneralSettingsData {
    return JSON.parse(JSON.stringify(data));
  }
}
