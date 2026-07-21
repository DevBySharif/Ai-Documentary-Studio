export type FSFramerate = 24 | 25 | 30 | 50 | 60;

export type FSTransitionType = "crossfade" | "dip_to_black" | "light_fade" | "blur" | "motion_match";

export type FSEventType =
  | "FrameStarted" | "SceneEntered" | "WordHighlighted" | "CameraUpdated"
  | "EffectTriggered" | "FrameRendered" | "SubtitleShown" | "SubtitleHidden"
  | "TransitionStarted" | "TransitionEnded" | "MotionStarted" | "MotionEnded";

export type FSDriftType = "dropped_frame" | "timing" | "audio" | "subtitle" | "motion";

export type FSKeyframeType = "camera" | "subtitle" | "effect" | "opacity" | "scale" | "rotation";

export type FSRecoveryState = "idle" | "storing" | "recovering" | "completed";

export interface FSClockSnapshot {
  frame: number;
  timestamp: number;
  fps: FSFramerate;
  sceneId: string;
  running: boolean;
}

export interface FMFrameState {
  frameNumber: number;
  timestampMs: number;
  scene: string;
  camera: FSCameraState;
  subtitle: FSSubtitleState;
  effect: FSEffectState;
  audio: FSAudioState;
}

export interface FSCameraState {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  zoom: number;
  parallax: number;
}

export interface FSSubtitleState {
  active: boolean;
  text: string;
  highlightedWord: string | null;
  animation: string;
  opacity: number;
}

export interface FSEffectState {
  active: Map<string, number>;
  transitions: string[];
}

export interface FSAudioState {
  position: number;
  speaking: boolean;
  ducking: number;
}

export interface FSScheduledEvent {
  id: string;
  type: string;
  frame: number;
  data: Record<string, unknown>;
}

export interface FSRenderBatch {
  id: string;
  startFrame: number;
  endFrame: number;
  frames: number[];
}

export interface FSFrameCacheData {
  previousFrames: Map<number, FMFrameState>;
  currentBatch: FMFrameState[];
  upcomingFrameCount: number;
}

export interface FSKeyframe {
  type: FSKeyframeType;
  frame: number;
  value: number;
  easing: string;
}

export interface FSTimingCorrection {
  driftType: FSDriftType;
  framesDrifted: number;
  correctionApplied: number;
  autoFixed: boolean;
}

export interface FSOutputContract {
  fps: number;
  frames: number;
  events: number;
  sync: string;
  status: string;
}

export interface FSValidationResult {
  frameCount: boolean;
  audioAlignment: boolean;
  subtitleAlignment: boolean;
  cameraAlignment: boolean;
  effectTiming: boolean;
  timelineIntegrity: boolean;
  passed: boolean;
}

export interface FSAITimingDecision {
  extendHold: number;
  delayTransition: number;
  accelerateScenes: string[];
  emotionalPeaks: Array<{ frame: number; intensity: number }>;
  durationPreserved: boolean;
}

export interface FSCheckpoint {
  frame: number;
  scene: string;
  camera: FSCameraState;
  subtitle: FSSubtitleState;
  effect: FSEffectState;
  audioPosition: number;
  timestamp: number;
}

export interface FSWorkloadUnit {
  frames: number[];
  gpuIntensive: boolean;
  scene: string;
  complexity: number;
  estimatedTime: number;
}

export interface FSZennProfile {
  pacing: string;
  holds: string;
  transitions: string;
  subtitleTiming: string;
  motionSync: string;
  cameraRhythm: string;
  cadence: string;
}
