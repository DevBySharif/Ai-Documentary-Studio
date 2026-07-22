export type ConfigCategoryType = "Application" | "Infrastructure" | "AI" | "Security";

export type EnvironmentProfileType =
  | "LocalDevelopment"
  | "IntegrationTesting"
  | "Staging"
  | "Production"
  | "EnterpriseProduction";

export type SecretType =
  | "ApiKey"
  | "OAuthCredentials"
  | "DatabasePassword"
  | "EncryptionKey"
  | "AiProviderToken"
  | "ServiceCertificate";

export type ConfigPrecedenceTier =
  | "SystemDefaults"
  | "DeploymentProfile"
  | "Organization"
  | "Workspace"
  | "Project"
  | "RuntimeOverride";

export interface SecretDescriptor {
  readonly secretId: string;
  readonly secretName: string;
  readonly secretType: SecretType;
  readonly maskedValue: string;
  readonly version: number;
  readonly isRotated: boolean;
  readonly expiresAt?: Date;
  readonly updatedAt: Date;
}

export interface ConfigurationVersionRecord {
  readonly versionId: string;
  readonly key: string;
  readonly previousValueJson: string;
  readonly newValueJson: string;
  readonly authorUserId: string;
  readonly timestamp: Date;
}

export interface ConfigAuditRecord {
  readonly auditId: string;
  readonly keyName: string;
  readonly modifiedByUserId: string;
  readonly category: ConfigCategoryType;
  readonly tier: ConfigPrecedenceTier;
  readonly maskedDetails: string;
  readonly timestamp: Date;
}
