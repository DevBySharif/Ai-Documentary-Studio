import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

export interface RenderPackage {
  projectId: string;
  script: StoryScript;
  promptPlan: PromptPlan;
  audio: AudioIntelligenceResult;
  motionTimeline: MotionTimeline;
  subtitles: Array<{ start: number; end: number; text: string; highlighted: string[] }>;
  imageUrls: Array<{ sceneIndex: number; url: string; duration: number }>;
  metadata: {
    totalDuration: number;
    imageCount: number;
    sceneCount: number;
    qualityScore: number;
    createdAt: string;
  };
  sealed: boolean;
}

export interface RenderConfig {
  fps: number;
  resolution: { width: number; height: number };
  codec: string;
  outputFormat: string;
}
