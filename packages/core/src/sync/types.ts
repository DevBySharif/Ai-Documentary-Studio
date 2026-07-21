import type { EmotionTag } from "../story/types.js";

export type SyncLayer = "audio" | "meaning" | "image" | "motion" | "subtitle" | "effects" | "camera";

export type SyncEventType =
  | "image_change" | "motion_start" | "motion_end"
  | "word_highlight" | "subtitle_highlight"
  | "transition_start" | "transition_end"
  | "pause" | "silence" | "reveal"
  | "emphasis" | "concept_shift" | "emotion_change";

export type SyncPriority = "critical" | "high" | "medium" | "low";

export type AdaptiveSyncProfile = "documentary" | "educational" | "storytelling" | "motivational" | "news";

export interface SyncEvent {
  id: string;
  start: number;
  end: number;
  layer: SyncLayer;
  type: SyncEventType;
  priority: SyncPriority;
  dependencies: string[];
  data?: Record<string, unknown>;
}

export interface SyncWindow {
  idealTime: number;
  windowStart: number;
  windowEnd: number;
  events: SyncEvent[];
}

export interface SyncLayerState {
  layer: SyncLayer;
  events: SyncEvent[];
  currentIndex: number;
}

export interface MasterSyncTimeline {
  events: SyncEvent[];
  layers: Map<SyncLayer, SyncEvent[]>;
  totalDuration: number;
  clock: "audio";
  metadata: {
    profile: AdaptiveSyncProfile;
    eventCount: number;
    driftCorrections: number;
    latencyCompensations: number;
    generatedAt: string;
  };
}

export interface CognitiveSyncEstimate {
  spokenTime: number;
  heardTime: number;
  understoodTime: number;
  recommendedVisualTime: number;
  delay: number;
}

export interface DriftReport {
  currentPosition: number;
  expectedPosition: number;
  drift: number;
  correction: number;
  correctedPosition: number;
}
