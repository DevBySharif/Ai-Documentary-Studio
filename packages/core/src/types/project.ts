export const PROJECT_STATES = [
  "created",
  "researching",
  "planning",
  "writing",
  "scene_planning",
  "prompt_planning",
  "waiting_for_images",
  "image_analysis",
  "voice_processing",
  "timeline_generation",
  "motion_planning",
  "quality_review",
  "rendering",
  "completed",
  "archived",
  "failed",
] as const;

export type ProjectState = (typeof PROJECT_STATES)[number];

export const PROJECT_STATE_TRANSITIONS: Record<ProjectState, ProjectState[]> = {
  created: ["researching"],
  researching: ["planning"],
  planning: ["writing"],
  writing: ["scene_planning"],
  scene_planning: ["prompt_planning"],
  prompt_planning: ["waiting_for_images"],
  waiting_for_images: ["image_analysis"],
  image_analysis: ["voice_processing"],
  voice_processing: ["timeline_generation"],
  timeline_generation: ["motion_planning"],
  motion_planning: ["quality_review"],
  quality_review: ["rendering", "planning"],
  rendering: ["completed"],
  completed: ["archived"],
  archived: [],
  failed: ["created", "researching", "planning", "writing"],
};

export interface ProjectStateChange {
  projectId: string;
  from: ProjectState;
  to: ProjectState;
  timestamp: string;
  reason?: string;
}
