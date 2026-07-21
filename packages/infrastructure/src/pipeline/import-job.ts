export type ImportJobStatus =
  | "Queued"
  | "Validating"
  | "Importing"
  | "Analyzing"
  | "Processing"
  | "Completed"
  | "Failed"
  | "Retrying";

export interface ImportJobCheckpoint {
  lastCompletedStage: string;
  savedAt: Date;
}

/**
 * Represents a single unit of work in the import queue.
 * State is persisted so jobs can resume after crashes or restarts.
 */
export interface ImportJob {
  readonly id: string;
  readonly projectId: string;
  readonly sourcePath: string;
  readonly priority: number;
  status: ImportJobStatus;
  retryCount: number;
  readonly maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  lastError?: string;
  checkpoint?: ImportJobCheckpoint;
  assetId?: string;
}

export const IMPORT_JOB_DEFAULTS = {
  maxRetries: 3,
  priority: 5,
} as const;

/**
 * Creates a new ImportJob with defaults applied.
 */
export function createImportJob(
  projectId: string,
  sourcePath: string,
  overrides: Partial<Pick<ImportJob, "priority" | "maxRetries">> = {}
): ImportJob {
  return {
    id: crypto.randomUUID(),
    projectId,
    sourcePath,
    priority: overrides.priority ?? IMPORT_JOB_DEFAULTS.priority,
    maxRetries: overrides.maxRetries ?? IMPORT_JOB_DEFAULTS.maxRetries,
    status: "Queued",
    retryCount: 0,
    createdAt: new Date(),
  };
}
