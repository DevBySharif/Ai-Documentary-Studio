export type SyncModeType = "RealTime" | "Manual" | "Scheduled" | "Background";

export type ConflictResolutionStrategy =
  | "AutomaticMerge"
  | "LastWriterWins"
  | "ManualMerge"
  | "WorkspacePolicy"
  | "HumanApproval";

export type ObjectLockType = "SoftLock" | "HardLock" | "AiReservation" | "ReviewLock";

export type EditingStrategyType = "Optimistic" | "Pessimistic";

export interface LocalOperationLog {
  readonly operationId: string;
  readonly targetObjectId: string;
  readonly operationType: string; // e.g. "SceneEdited", "PromptUpdated", "ImageReplaced"
  readonly editorUserId: string;
  readonly deltaPayloadJson: string;
  readonly sequenceNumber: number;
  readonly timestamp: Date;
  readonly isSynchronized: boolean;
}

export interface VersionedObjectState {
  readonly objectId: string;
  readonly versionId: string;
  readonly lastModifiedTimestamp: Date;
  readonly editorUserId: string;
  readonly changeSequenceNumber: number;
  readonly dataJson: string;
}

export interface SyncConflictDescriptor {
  readonly conflictId: string;
  readonly objectId: string;
  readonly localOperation: LocalOperationLog;
  readonly remoteState: VersionedObjectState;
  readonly selectedStrategy: ConflictResolutionStrategy;
  readonly resolvedStateJson?: string;
  readonly isResolved: boolean;
}
