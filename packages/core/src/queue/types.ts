export type QueueName = "research" | "prompt" | "image" | "audio" | "timeline" | "render" | "motion" | "quality";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "retrying" | "cancelled";

export interface Job {
  id: string;
  queue: QueueName;
  priority: number;
  retryCount: number;
  maxRetries: number;
  status: JobStatus;
  progress: number;
  payload: Record<string, unknown>;
  result?: unknown;
  error?: string;
  logs: string[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface QueueMetrics {
  queue: QueueName;
  queued: number;
  running: number;
  completed: number;
  failed: number;
  avgDuration: number;
}

export interface QueueConfig {
  maxRetries: number;
  retryDelayMs: number;
  concurrency: number;
}
