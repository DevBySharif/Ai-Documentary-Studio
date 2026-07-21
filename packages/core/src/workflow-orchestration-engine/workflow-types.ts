export type ProjectLifecycleStage =
  | "Created"
  | "Research"
  | "Script"
  | "Storyboard"
  | "PromptPreparation"
  | "ImageProduction"
  | "VoiceProduction"
  | "TimelineEditing"
  | "Review"
  | "Export"
  | "Archived";

export type ActiveProjectState =
  | "Created"
  | "Active"
  | "Waiting"
  | "Processing"
  | "Review"
  | "Completed"
  | "Archived"
  | "Failed"
  | "Recovery";

export type BackgroundJobState =
  | "Queued"
  | "Preparing"
  | "Running"
  | "Paused"
  | "Retrying"
  | "Completed"
  | "Failed"
  | "Cancelled";

export interface StageConditionDescriptor {
  readonly stage: ProjectLifecycleStage;
  readonly requiredUpstreamStages: ReadonlyArray<ProjectLifecycleStage>;
  readonly entryRequirementsMet: boolean;
  readonly exitRequirementsMet: boolean;
}

export interface WorkflowCheckpoint {
  readonly checkpointId: string;
  readonly projectId: string;
  readonly milestoneName: string;
  readonly stage: ProjectLifecycleStage;
  readonly state: ActiveProjectState;
  readonly overallProgressPercent: number;
  readonly createdAt: Date;
}

export interface WorkflowRollbackImpact {
  readonly targetStage: ProjectLifecycleStage;
  readonly invalidatedDownstreamStages: ReadonlyArray<ProjectLifecycleStage>;
  readonly affectedArtifactIds: ReadonlyArray<string>;
}
