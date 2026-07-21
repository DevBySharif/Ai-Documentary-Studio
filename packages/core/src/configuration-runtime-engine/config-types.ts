export type ConfigResolutionLevel =
  | "RuntimeOverride"
  | "ProjectConfig"
  | "UserPreferences"
  | "ApplicationDefaults"
  | "BuiltinDefaults";

export type FeatureFlagState = "Stable" | "Beta" | "Experimental" | "DeveloperOnly";

export type EnvironmentProfile = "Development" | "Testing" | "Beta" | "Production";

export interface ApplicationSettingsDescriptor {
  readonly language: string;
  readonly theme: "Dark" | "Light" | "System";
  readonly updatePolicy: "Automatic" | "Manual";
  readonly defaultStorageLocation: string;
  readonly defaultExportFormat: string;
  readonly loggingLevel: "Debug" | "Info" | "Warning" | "Error";
}

export interface UserSettingsDescriptor {
  readonly defaultAiModel: string;
  readonly autosaveIntervalSecs: number;
  readonly timelineSnapSensitivity: number;
}

export interface ProjectSettingsDescriptor {
  readonly resolution: string;
  readonly frameRate: number;
  readonly reviewWorkflowEnabled: boolean;
}

export interface ProviderConfigDescriptor {
  readonly providerId: string;
  readonly endpointUrl: string;
  readonly apiKeySecretRef: string;
  readonly timeoutMs: number;
  readonly maxRetries: number;
}

export interface ConfigAuditEntry {
  readonly changeId: string;
  readonly category: string;
  readonly key: string;
  readonly previousValueJson: string;
  readonly newValueJson: string;
  readonly changedBy: string;
  readonly timestamp: Date;
  readonly source: "Manual" | "Import" | "Migration" | "RuntimeOverride";
}
