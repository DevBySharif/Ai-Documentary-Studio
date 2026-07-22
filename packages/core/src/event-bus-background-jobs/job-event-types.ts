export type BackgroundJobType =
  | "AiImageGeneration"
  | "AiVideoGeneration"
  | "VoiceSynthesis"
  | "EmbeddingGeneration"
  | "SearchIndexing"
  | "BackupCreation"
  | "ThumbnailGeneration"
  | "LargeExportRendering";

export type JobLifecycleState =
  | "Queued"
  | "Scheduled"
  | "Running"
  | "Completed"
  | "Archived"
  | "Failed"
  | "Cancelled"
  | "TimedOut";

export type JobPriorityLevel = "Critical" | "High" | "Normal" | "Low" | "Background";

export interface EventBusMessage {
  readonly eventId: string;
  readonly eventName: string; // e.g. "ProjectCreated", "ScriptGenerated", "ImageCompleted", "ReviewApproved", "ExportFinished"
  readonly publisherId: string;
  readonly payloadJson: string;
  readonly publishedAt: Date;
}

export interface RetryPolicyConfig {
  readonly maxAttempts: number;
  readonly initialDelayMs: number;
  readonly backoffMultiplier: number;
}

export interface BackgroundJobDescriptor {
  readonly jobId: string;
  readonly jobType: BackgroundJobType;
  readonly priority: JobPriorityLevel;
  readonly currentState: JobLifecycleState;
  readonly progressPercent: number;
  readonly payloadJson: string;
  readonly attemptsMade: number;
  readonly retryPolicy: RetryPolicyConfig;
  readonly resultJson?: string;
  readonly errorMessage?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface DeadLetterQueueItem {
  readonly dlqId: string;
  readonly originalJob: BackgroundJobDescriptor;
  readonly failureReason: string;
  readonly movedToDlqAt: Date;
}
