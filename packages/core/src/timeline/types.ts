import type { EmotionTag } from "../story/types.js";

export type TimelineBlockPriority = "critical" | "high" | "medium" | "low";

export type TimelineLayerType = "audio" | "image" | "motion" | "subtitle" | "effects" | "metadata";

export type TimelineMarkerType =
  | "scene_start"
  | "scene_end"
  | "emotion_change"
  | "concept_shift"
  | "word_highlight"
  | "image_change"
  | "motion_change"
  | "pause"
  | "silence"
  | "transition";

export type TransitionVisibility = "visible" | "invisible" | "subtle";

export interface TimelineBlock {
  id: string;
  start: number;
  end: number;
  scene: number;
  concept: string;
  imageId: string;
  imageType: string;
  motion: string;
  motionIntensity: string;
  transition: string;
  transitionVisibility: TransitionVisibility;
  priority: TimelineBlockPriority;
  subtitle: string;
  emotion: EmotionTag;
  wordInsert?: { word: string; start: number; end: number };
  effects: string[];
  reuse?: boolean;
}

export interface TimelineDecision {
  moment: number;
  scene: number;
  question: string;
  answer: string;
  confidence: number;
  reason: string;
}

export interface TimelineMarker {
  time: number;
  type: TimelineMarkerType;
  label: string;
  data?: Record<string, unknown>;
}

export interface TimelineLayer {
  type: TimelineLayerType;
  blocks: TimelineBlock[];
  markers: TimelineMarker[];
}

export interface MasterTimeline {
  projectId: string;
  layers: TimelineLayer[];
  blocks: TimelineBlock[];
  markers: TimelineMarker[];
  totalDuration: number;
  clock: "audio";
  decisions: TimelineDecision[];
  metadata: {
    version: number;
    semanticSegments: number;
    wordInserts: number;
    imageChanges: number;
    transitions: number;
    generatedAt: string;
  };
}

export interface TimelineVersion {
  version: number;
  timeline: MasterTimeline;
  changelog: string;
  createdAt: string;
}
