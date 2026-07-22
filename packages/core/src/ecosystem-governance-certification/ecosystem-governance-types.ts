export type ApiLifecycleStage =
  | "Experimental"
  | "Preview"
  | "Stable"
  | "Deprecated"
  | "Retired";

export type PluginCertificationLevel =
  | "Community"
  | "Verified"
  | "Certified"
  | "EnterpriseCertified";

export type SecurityAdvisorySeverity = "Low" | "Medium" | "High" | "Critical";

export interface EcosystemHealthSnapshot {
  readonly activeDevelopersCount: number;
  readonly compatibilityRatePercent: number;
  readonly overallSecurityScore: number; // 0.0 - 100.0
  readonly averageUpdateFrequencyDays: number;
  readonly sampledAt: Date;
}

export interface LtsPolicyDescriptor {
  readonly ltsVersion: string;
  readonly supportWindowMonths: number; // e.g. 24 or 36 months
  readonly securityMaintenanceExpiry: Date;
  readonly isActiveLts: boolean;
}

export interface MarketplaceGovernancePolicy {
  readonly isContentModerationEnabled: boolean;
  readonly autoApproveCommunityPackages: boolean;
  readonly disputeResolutionSlaDays: number;
}
