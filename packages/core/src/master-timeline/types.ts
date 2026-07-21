import type { EmotionTag } from "../story/types.js";

export type MasterLayerType =
  | "narration" | "semantic" | "image" | "camera" | "motion"
  | "subtitle" | "word_insert" | "transition" | "effects" | "metadata";

export type ExportProfile = "youtube_1080p" | "youtube_shorts" | "tiktok" | "instagram_reels" | "4k_documentary" | "archive_master";

export type RenderQuality = "draft" | "preview" | "quality" | "production" | "archive";

export interface MasterEvent {
  id: string;
  scene: number;
  segment: number;
  start: number;
  end: number;
  layer: MasterLayerType;
  duration: number;
  frameDuration: number;
  startFrame: number;
  endFrame: number;
  priority: "critical" | "high" | "medium" | "low";
  dependencies: string[];
  data: Record<string, unknown>;
}

export interface EventSchedulerState {
  events: MasterEvent[];
  currentIndex: number;
  currentTime: number;
  completed: string[];
}

export interface DependencyGraph {
  nodes: Map<string, MasterEvent>;
  edges: Array<{ from: string; to: string }>;
}

export interface MasterRenderPackage {
  timeline: MasterEvent[];
  images: string[];
  motionPaths: string[];
  voice: string;
  subtitles: Array<{ start: number; end: number; text: string }>;
  wordInserts: Array<{ time: number; word: string; duration: number }>;
  effects: string[];
  metadata: Record<string, unknown>;
  projectManifest: Record<string, unknown>;
  sealed: boolean;
}

export interface TimelineSnapshot {
  id: string;
  version: number;
  reason: string;
  timestamp: string;
  timeline: MasterEvent[];
}

export interface RenderManifest {
  project: string;
  runtime: number;
  fps: number;
  sceneCount: number;
  segments: number;
  images: number;
  reuseRate: number;
  motionEvents: number;
  subtitleBlocks: number;
  qualityScore: number;
}

export interface ExportConfig {
  profile: ExportProfile;
  resolution: { width: number; height: number };
  fps: number;
  bitrate: string;
  codec: string;
}

export interface TimelineAnalytics {
  averageHoldTime: number;
  averageMotionLength: number;
  reusePercentage: number;
  cutDensity: number;
  motionDensity: number;
  transitionUsage: Record<string, number>;
  subtitleDensity: number;
  syncAccuracy: number;
}

export interface ProductionGraphNode {
  id: string;
  type: "story" | "concept" | "image" | "motion" | "timeline" | "render";
  connections: string[];
  data: Record<string, unknown>;
}

export interface ProductionGraph {
  nodes: ProductionGraphNode[];
  edges: Array<{ from: string; to: string; type: string }>;
}
