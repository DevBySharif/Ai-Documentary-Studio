export interface ASAIProviderSettingsData {
  defaultProvider: string;
  model: string;
  routingPolicy: 'fastest' | 'cheapest' | 'most-capable' | 'manual';
  temperature: number;
  maxTokens: number;
  timeout: number;
  retryCount: number;
  budgetLimits: {
    monthly: number;
    perRequest: number;
    warningThreshold: number;
  };
}

const DEFAULTS: ASAIProviderSettingsData = {
  defaultProvider: 'openai',
  model: 'gpt-4o',
  routingPolicy: 'fastest',
  temperature: 0.7,
  maxTokens: 4096,
  timeout: 30000,
  retryCount: 3,
  budgetLimits: {
    monthly: 100,
    perRequest: 0.1,
    warningThreshold: 80,
  },
};

export interface ProjectOverride {
  projectId: string;
  settings: Partial<ASAIProviderSettingsData>;
}

export class ASAIProviderSettings {
  private settings: ASAIProviderSettingsData;
  private projectOverrides: Map<string, Partial<ASAIProviderSettingsData>> = new Map();

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  set<K extends keyof ASAIProviderSettingsData>(key: K, value: ASAIProviderSettingsData[K]): void {
    this.settings[key] = value;
  }

  get<K extends keyof ASAIProviderSettingsData>(key: K): ASAIProviderSettingsData[K] {
    return this.settings[key];
  }

  getDefaults(): ASAIProviderSettingsData {
    return this.clone(DEFAULTS);
  }

  getAll(): ASAIProviderSettingsData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  setProjectOverride(projectId: string, overrides: Partial<ASAIProviderSettingsData>): void {
    this.projectOverrides.set(projectId, this.clone(overrides));
  }

  getProjectOverride(projectId: string): Partial<ASAIProviderSettingsData> | undefined {
    const override = this.projectOverrides.get(projectId);
    return override ? this.clone(override) : undefined;
  }

  removeProjectOverride(projectId: string): void {
    this.projectOverrides.delete(projectId);
  }

  getResolvedSettings(projectId?: string): ASAIProviderSettingsData {
    if (!projectId) return this.getAll();
    const override = this.projectOverrides.get(projectId);
    if (!override) return this.getAll();
    return { ...this.settings, ...override } as ASAIProviderSettingsData;
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
