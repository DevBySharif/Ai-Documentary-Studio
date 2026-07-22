export type MarketplacePackageType =
  | "Plugins"
  | "AiModules"
  | "WorkflowPackages"
  | "UiExtensions"
  | "ConnectorPackages";

export type LicensingModelType =
  | "Free"
  | "OpenSource"
  | "Commercial"
  | "EnterpriseSubscription"
  | "InternalOrganizationOnly";

export type PublishingStageType =
  | "Upload"
  | "Validation"
  | "SecurityScan"
  | "CompatibilityCheck"
  | "Approval"
  | "Publication";

export interface DeveloperProfileDescriptor {
  readonly publisherId: string;
  readonly name: string;
  readonly organization?: string;
  readonly isVerified: boolean;
  readonly publishedCount: number;
}

export interface TrustSignalDescriptor {
  readonly isVerifiedPublisher: boolean;
  readonly isSignedPackage: boolean;
  readonly isSecurityReviewed: boolean;
  readonly communityRating: number; // 0.0 - 5.0
  readonly downloadCount: number;
}

export interface EnterpriseRepoDescriptor {
  readonly repoId: string;
  readonly organizationId: string;
  readonly internalPackageCount: number;
  readonly isIsolated: boolean;
}
