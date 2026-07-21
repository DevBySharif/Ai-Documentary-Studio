export type MRMotionPreset =
  | "push_in" | "push_out" | "pan_left" | "pan_right"
  | "tilt_up" | "tilt_down" | "orbit" | "parallax"
  | "reveal" | "drift" | "hold" | "micro_motion";

export type MRCurveType = "linear" | "ease_in" | "ease_out" | "ease_in_out" | "bezier" | "custom";

export interface MRMultiStageSegment {
  type: MRMotionPreset;
  startFrame: number;
  endFrame: number;
  curve: MRCurveType;
  params: Record<string, number>;
}

export interface MRCameraPath {
  segments: MRMultiStageSegment[];
  totalDuration: number;
  totalFrames: number;
}

export interface MRCameraInertia {
  acceleration: number;
  deceleration: number;
  momentum: number;
  weight: number;
}

export interface MRVelocityConfig {
  baseSpeed: number;
  emotionFactor: number;
  narrationFactor: number;
  sceneDurationFactor: number;
  subjectSizeFactor: number;
  dnaFactor: number;
  finalSpeed: number;
}

export interface MRKenBurnsPlan {
  entryPoint: { x: number; y: number; zoom: number };
  exitPoint: { x: number; y: number; zoom: number };
  subjectPriority: number;
  curve: MRCurveType;
}

export interface MRMotionBlend {
  motions: MRMotionPreset[];
  weights: number[];
  blendedPath: MRCameraPath;
}

export interface MRPhysicsConfig {
  cameraWeight: number;
  microDrift: number;
  stabilization: number;
  humanImperfection: number;
}

export interface MRMotionLimit {
  maxZoom: number;
  maxPanSpeed: number;
  maxRotation: number;
  minHoldFrames: number;
}

export interface MRMotionEvent {
  type: "start" | "peak" | "hold" | "transition" | "end";
  frame: number;
  preset: MRMotionPreset;
  duration: number;
}

export interface MRCinematographerDecision {
  sceneIndex: number;
  selectedMotion: MRMotionPreset;
  reason: string;
  confidence: number;
}

export interface MRCameraRhythmReport {
  averageShotLength: number;
  directionChanges: number;
  zoomFrequency: number;
  motionIntensity: number;
  viewerFatigueScore: number;
  isRepetitive: boolean;
}

export interface MRAdaptiveComplexity {
  sceneDuration: number;
  subjectCount: number;
  visualDensity: number;
  emotionLevel: number;
  narrationSpeed: number;
  subtitleDensity: number;
  complexityScore: number;
  recommendation: "reduce_motion" | "extend_holds" | "simplify_parallax" | "allow_richer" | "normal";
}
