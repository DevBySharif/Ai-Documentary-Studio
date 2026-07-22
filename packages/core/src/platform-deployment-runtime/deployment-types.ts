export type DeploymentModeType =
  | "Desktop"
  | "Cloud"
  | "Hybrid"
  | "EnterpriseOnPremises";

export type RuntimeEnvironmentType =
  | "NativeDesktop"
  | "DockerContainers"
  | "Kubernetes"
  | "VirtualMachines"
  | "BareMetalServers";

export type ConfigProfileType =
  | "Development"
  | "Testing"
  | "Staging"
  | "Production"
  | "EnterpriseProduction";

export interface ServiceDiscoveryDescriptor {
  readonly serviceId: string;
  readonly serviceName: string; // e.g. "AiGateway", "MemoryService", "SearchService", "ConnectorService", "AnalyticsService"
  readonly serviceEndpoint: string;
  readonly healthStatus: "Healthy" | "Degraded" | "Unreachable";
  readonly registeredAt: Date;
}

export interface FeatureFlagDescriptor {
  readonly flagId: string;
  readonly featureName: string;
  readonly isEnabled: boolean;
  readonly rolloutScope: "Global" | "Organization" | "Workspace" | "User";
  readonly targetId?: string;
}

export interface DeploymentValidationReport {
  readonly validationId: string;
  readonly configCompleteness: boolean;
  readonly requiredServicesAvailable: boolean;
  readonly databaseConnected: boolean;
  readonly aiProvidersAccessible: boolean;
  readonly storageAccessible: boolean;
  readonly securityValid: boolean;
  readonly isPassed: boolean;
  readonly timestamp: Date;
}
