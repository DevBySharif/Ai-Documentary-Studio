export type ConnectorCategoryType =
  | "Productivity"
  | "ProjectManagement"
  | "CloudStorage"
  | "AiProviders"
  | "MediaPlatforms"
  | "AutomationServices";

export type ConnectorCapabilityType =
  | "UploadFile"
  | "DownloadFile"
  | "SearchAssets"
  | "SendNotification"
  | "CreateTask"
  | "PublishVideo";

export type ConnectorAuthMethod =
  | "OAuth2"
  | "ApiKey"
  | "ServiceAccount"
  | "JWT"
  | "OrgCredentials";

export interface ConnectorHealthStatus {
  readonly isHealthy: boolean;
  readonly apiLatencyMs: number;
  readonly errorRatePercent: number;
  readonly remainingQuota: number;
  readonly lastCheckedAt: Date;
}

export interface ConnectorDescriptor {
  readonly connectorId: string;
  readonly name: string; // e.g. "YouTube", "Slack", "Google Drive", "Jira"
  readonly category: ConnectorCategoryType;
  readonly version: string;
  readonly provider: string;
  readonly capabilities: ReadonlyArray<ConnectorCapabilityType>;
  readonly authMethod: ConnectorAuthMethod;
  readonly health: ConnectorHealthStatus;
  readonly isEnabled: boolean;
}

export interface AutomationTriggerEvent {
  readonly triggerId: string;
  readonly eventName: string; // e.g. "ProjectApproved", "AssetUploaded", "ExportCompleted"
  readonly targetConnectorId: string;
  readonly actionCapability: ConnectorCapabilityType;
  readonly payloadJson: string;
  readonly timestamp: Date;
}
