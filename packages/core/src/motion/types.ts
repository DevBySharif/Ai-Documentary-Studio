import type { EmotionTag } from "../story/types.js";

export type MotionType = "hold" | "push_in" | "push_out" | "diagonal_push" | "corner_push" | "pan_left" | "pan_right" | "pan_up" | "pan_down" | "vertical_pan" | "horizontal_pan" | "zoom_in" | "zoom_out" | "slow_zoom_in" | "slow_zoom_out" | "parallax" | "drift" | "focus_shift" | "multi_stage" | "shake" | "float" | "rotate";

export type EasingType = "linear" | "ease_in" | "ease_out" | "ease_in_out" | "cinematic_ease";

export type CameraTarget = "face" | "main_object" | "highlighted_word" | "symbol" | "environment";

export type MotionDensity = "low" | "medium" | "high";

export interface CameraPath {
  id: string;
  start: number;
  end: number;
  segments: CameraPathSegment[];
  totalDuration: number;
}

export interface CameraPathSegment {
  motion: MotionType;
  start: number;
  end: number;
  easing: EasingType;
  speed: number;
  direction?: string;
  intensity: string;
  target: CameraTarget;
  targetLabel?: string;
}

export interface AttentionPriority {
  target: CameraTarget;
  score: number;
  label: string;
}

export interface MultiStagePath {
  stages: Array<{
    motion: MotionType;
    start: number;
    end: number;
    easing: EasingType;
    description: string;
  }>;
  totalDuration: number;
}

export interface MotionSafetyReport {
  faceCropping: boolean;
  objectCropping: boolean;
  subtitleCollision: boolean;
  rapidDirectionChanges: boolean;
  motionSickness: boolean;
  passed: boolean;
  warnings: string[];
}

export interface MotionScore {
  purpose: number;
  emotion: number;
  smoothness: number;
  viewerComfort: number;
  narrative: number;
  overall: number;
}

export interface CameraDirectorPlan {
  target: CameraTarget;
  targetLabel: string;
  path: CameraPathSegment[];
  reason: string;
  confidence: number;
}

export interface CognitiveCameraTarget {
  target: CameraTarget;
  label: string;
  narrativeImportance: number;
  visualImportance: number;
  voiceEmphasis: number;
  emotion: number;
  totalScore: number;
}
