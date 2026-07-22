export type BackupCategoryType =
  | "FullBackup"
  | "IncrementalBackup"
  | "DifferentialBackup"
  | "SnapshotBackup";

export type BackupScheduleType =
  | "Continuous"
  | "Hourly"
  | "Daily"
  | "Weekly"
  | "Monthly";

export type RestoreScopeType =
  | "EntirePlatform"
  | "Organization"
  | "Workspace"
  | "Project"
  | "Scene"
  | "Asset"
  | "Configuration"
  | "IndividualFiles";

export type FailoverType =
  | "AiProviderFailover"
  | "StorageFailover"
  | "DatabaseFailover"
  | "ServiceInstanceFailover";

export interface BackupArchiveDescriptor {
  readonly archiveId: string;
  readonly category: BackupCategoryType;
  readonly schedule: BackupScheduleType;
  readonly checksumSha256: string;
  readonly sizeBytes: number;
  readonly isVerified: boolean;
  readonly createdAt: Date;
}

export interface RecoveryObjectivePolicy {
  readonly targetRpoMinutes: number; // e.g. 5 mins for enterprise, 30 mins for standard
  readonly targetRtoMinutes: number; // e.g. 15 mins for critical services
  readonly autoFailoverEnabled: boolean;
}

export interface IntegrityCheckReport {
  readonly checkId: string;
  readonly archiveId: string;
  readonly isChecksumValid: boolean;
  readonly isConsistent: boolean;
  readonly checkedAt: Date;
}
