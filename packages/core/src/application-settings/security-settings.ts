export interface ASSecuritySettingsData {
  apiKeyStorage: 'os-keychain' | 'encrypted-file' | 'environment' | 'memory-only';
  pluginPermissions: 'strict' | 'standard' | 'permissive';
  workspaceEncryption: boolean;
  auditLogging: boolean;
  telemetryPreferences: {
    enabled: boolean;
    crashReports: boolean;
    usageData: boolean;
    performanceData: boolean;
  };
}

const DEFAULTS: ASSecuritySettingsData = {
  apiKeyStorage: 'os-keychain',
  pluginPermissions: 'standard',
  workspaceEncryption: false,
  auditLogging: true,
  telemetryPreferences: {
    enabled: false,
    crashReports: true,
    usageData: false,
    performanceData: false,
  },
};

export class ASSecuritySettings {
  private settings: ASSecuritySettingsData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASSecuritySettingsData>(key: K, value: ASSecuritySettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASSecuritySettingsData>(key: K): ASSecuritySettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASSecuritySettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASSecuritySettingsData {
    return this.clone(this.settings);
  }

  isEncryptionEnabled(): boolean {
    return this.settings.workspaceEncryption;
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
