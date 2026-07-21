export type JobPriority = "Critical" | "High" | "Normal" | "Low" | "Background";
export type JobState = "Queued" | "Waiting" | "Running" | "Paused" | "Completed" | "Failed" | "Cancelled";
export type JobType = 
  | "ScriptGeneration" | "PromptGeneration" | "ImageGeneration" 
  | "VoiceGeneration" | "WhisperTranscription" | "TimelineGeneration" 
  | "MotionGeneration" | "EffectsProcessing" | "SubtitleGeneration" 
  | "SceneRendering" | "FullVideoRendering" | "QAAnalysis" 
  | "ThumbnailGeneration" | "CacheCleanup" | "Export";

export type WorkerCategory = "CPU" | "GPU" | "AI" | "IO";
export type WorkerNodeLocation = "Local" | "Remote" | "Cloud";

export interface ResourceMetrics {
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  networkUsage: number;
}

export interface JobEvent {
  jobId: string;
  type: JobType;
  event: "JobCreated" | "JobStarted" | "JobPaused" | "JobResumed" | "JobCompleted" | "JobFailed" | "JobCancelled";
  timestamp: string;
  payload?: any;
}

export interface JobHistoryEntry {
  jobId: string;
  type: JobType;
  startTime?: string;
  finishTime?: string;
  duration?: number;
  result?: any;
  error?: string;
  retryCount: number;
}

export interface Job {
  id: string;
  type: JobType;
  priority: JobPriority;
  state: JobState;
  dependencies: string[]; // Job IDs that must complete before this starts
  payload: Record<string, any>;
  result?: any;
  error?: string;
  retryCount: number;
  maxRetries: number;
  progress: number;
  workerId?: string;
  checkpoint?: any; // For pause/resume
  history: JobHistoryEntry;
}

export interface JobOutputContract {
  jobId: string;
  type: string;
  status: string;
  progress: number;
  worker?: string;
}

export interface BatchPipeline {
  batchId: string;
  name: string;
  jobs: Job[];
  status: "Running" | "Paused" | "Completed" | "Failed";
  progress: number;
}
