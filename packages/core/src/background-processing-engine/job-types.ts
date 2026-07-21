export type JobPriorityLevel = "Critical" | "High" | "Normal" | "Low" | "Background";

export type WorkerPoolType =
  | "AiWorkers"
  | "RenderingWorkers"
  | "MediaWorkers"
  | "IndexWorkers"
  | "MaintenanceWorkers";

export type BackgroundJobStatus =
  | "Queued"
  | "Preparing"
  | "Running"
  | "Paused"
  | "Retrying"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Interrupted";

export interface BackgroundJobDescriptor {
  readonly jobId: string;
  readonly projectId: string;
  readonly jobType: string; // e.g. "AiGeneration", "VoiceRendering", "ProxyCreation"
  readonly priority: JobPriorityLevel;
  readonly poolType: WorkerPoolType;
  readonly status: BackgroundJobStatus;
  readonly createdAt: Date;
  readonly startedAt?: Date;
  readonly finishedAt?: Date;
  readonly retryCount: number;
  readonly maxRetries: number;
  readonly timeoutMs: number;
  readonly prerequisiteJobIds: ReadonlyArray<string>;
}

export interface WorkerProgressUpdate {
  readonly jobId: string;
  readonly progressPercent: number;
  readonly currentStage: string;
  readonly estimatedRemainingSecs: number;
  readonly activeWorkerId: string;
  readonly warnings: ReadonlyArray<string>;
}

export interface ResourceLimitsConfig {
  readonly maxConcurrentAiJobs: number;
  readonly maxConcurrentRenderingJobs: number;
  readonly maxCpuUsagePercent: number;
  readonly maxGpuUsagePercent: number;
}
