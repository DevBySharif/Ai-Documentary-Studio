export type SnapshotCategoryType =
  | "ManualSnapshot"
  | "AutomaticCheckpoint"
  | "MilestoneSnapshot"
  | "ReleaseSnapshot"
  | "BackupSnapshot";

export type MergeStrategyType =
  | "AutomaticMerge"
  | "ManualMerge"
  | "SelectiveMerge"
  | "AssetOnlyMerge"
  | "ScriptOnlyMerge";

export type ReleaseTagType =
  | "v1.0 Draft"
  | "Client Approved"
  | "Final Narration"
  | "Release Candidate"
  | "Published Version";

export interface ProjectSnapshotDescriptor {
  readonly snapshotId: string;
  readonly projectId: string;
  readonly branchName: string;
  readonly category: SnapshotCategoryType;
  readonly label: string;
  readonly stateHash: string;
  readonly isImmutable: boolean;
  readonly createdAt: Date;
}

export interface ProjectBranchDescriptor {
  readonly branchId: string;
  readonly projectId: string;
  readonly branchName: string;
  readonly parentBranchName?: string;
  readonly purpose: string;
  readonly isProtected: boolean;
  readonly createdByUserId: string;
  readonly createdAt: Date;
}

export interface StructuredChangeset {
  readonly changeId: string;
  readonly projectId: string;
  readonly branchName: string;
  readonly authorUserId: string;
  readonly description: string;
  readonly deltaType: string; // e.g. "SceneAdded", "CharacterRenamed", "TimelineAdjusted"
  readonly timestamp: Date;
}

export interface VersionDiffReport {
  readonly diffId: string;
  readonly sourceVersion: string;
  readonly targetVersion: string;
  readonly scriptDifferencesCount: number;
  readonly storyboardDifferencesCount: number;
  readonly assetDifferencesCount: number;
  readonly timelineDifferencesCount: number;
}
