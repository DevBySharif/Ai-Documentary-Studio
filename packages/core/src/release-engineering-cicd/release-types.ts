export type ReleaseChannelType = "Alpha" | "Beta" | "ReleaseCandidate" | "Stable" | "LTS";

export type DeploymentStrategyType =
  | "Rolling"
  | "BlueGreen"
  | "Canary"
  | "Manual"
  | "Scheduled";

export type ArtifactCategoryType =
  | "DesktopInstaller"
  | "PortablePackage"
  | "DockerImage"
  | "EnterpriseBundle"
  | "PluginPackage";

export type PipelineStageType =
  | "SourceCode"
  | "Build"
  | "Testing"
  | "SecurityValidation"
  | "Package"
  | "Release"
  | "Deployment"
  | "Monitoring"
  | "PostDeploymentValidation";

export interface BuildArtifactDescriptor {
  readonly artifactId: string;
  readonly category: ArtifactCategoryType;
  readonly version: string;
  readonly sha256Checksum: string;
  readonly sizeBytes: number;
  readonly isImmutable: boolean;
  readonly createdAt: Date;
}

export interface ReleaseApprovalChainRecord {
  readonly approvalId: string;
  readonly releaseVersion: string;
  readonly developerApproved: boolean;
  readonly qaApproved: boolean;
  readonly securityApproved: boolean;
  readonly releaseManagerApproved: boolean;
  readonly isFullyApproved: boolean;
}

export interface PostDeploymentValidationReport {
  readonly reportId: string;
  readonly releaseVersion: string;
  readonly serviceAvailabilityOk: boolean;
  readonly apiFunctionalityOk: boolean;
  readonly aiConnectivityOk: boolean;
  readonly configIntegrityOk: boolean;
  readonly isPassed: boolean;
  readonly validatedAt: Date;
}
