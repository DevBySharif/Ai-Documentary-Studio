export type ProjectLifecycleStage =
  | "Idea"
  | "Planning"
  | "Research"
  | "Writing"
  | "Storyboard"
  | "AssetProduction"
  | "Voice"
  | "Timeline"
  | "Review"
  | "Export"
  | "Published"
  | "Archived";

export interface ProjectMetadata {
  readonly projectId: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly description: string;
  readonly keywords: ReadonlyArray<string>;
  readonly language: string;
  readonly category: string;
  readonly targetAudience: string;
  readonly creator: string;
  readonly targetPlatform: string;
  readonly resolution: string;
  readonly aspectRatio: string;
  readonly creationDate: Date;
  readonly lastModified: Date;
  readonly currentStage: ProjectLifecycleStage;
  readonly completionPercent: number;
  readonly isLocked: boolean;
}

export interface ProjectSnapshot {
  readonly snapshotId: string;
  readonly milestoneName: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly isImmutable: boolean;
}

export interface ProjectBranch {
  readonly branchId: string;
  readonly branchName: string; // e.g. "Experimental Intro"
  readonly parentBranchId?: string;
  readonly createdAt: Date;
  readonly isActive: boolean;
}

export interface ProjectBackupRecord {
  readonly backupId: string;
  readonly type: "Manual" | "Scheduled" | "Incremental";
  readonly backupPath: string;
  readonly createdAt: Date;
  readonly isVerified: boolean;
}
