export type WorkerName = "whisper" | "image" | "motion" | "render" | "quality";

export interface WorkerTask {
  worker: WorkerName;
  payload: Record<string, unknown>;
  priority: number;
}

export interface WorkerResult {
  success: boolean;
  output: Record<string, unknown>;
  duration: number;
  error?: string;
}
