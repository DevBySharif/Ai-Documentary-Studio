export type EngineNode =
  | "research"
  | "channel_dna"
  | "project_dna"
  | "narrative_planner"
  | "story_engine"
  | "visual_storyboard"
  | "prompt_intelligence"
  | "memory_manager"
  | "google_flow"
  | "image_library"
  | "audio_intelligence"
  | "whisper"
  | "timeline_engine"
  | "motion_engine"
  | "quality_engine"
  | "renderer";

export interface WorkflowEdge {
  from: EngineNode;
  to: EngineNode;
}

export interface WorkflowStep {
  node: EngineNode;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
  error?: string;
  retryCount: number;
}

export interface WorkflowExecution {
  projectId: string;
  steps: WorkflowStep[];
  currentStep: EngineNode | null;
  status: "running" | "completed" | "failed" | "paused";
  startedAt: string;
  completedAt?: string;
}
