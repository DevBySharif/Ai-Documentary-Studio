import type { EmotionTag } from "../story/types.js";
export type { EmotionTag };

export type MotionType =
  | "hold"
  | "slow_zoom_in"
  | "slow_zoom_out"
  | "pan_left"
  | "pan_right"
  | "pan_up"
  | "pan_down"
  | "push_in"
  | "pull_out"
  | "parallax"
  | "drift"
  | "rotate"
  | "focus_shift"
  | "depth_move"
  | "shake"
  | "float";

export type MotionIntensity = "minimal" | "low" | "medium" | "high" | "extreme";

export type TransitionStyle =
  | "cut"
  | "fade"
  | "cross_fade"
  | "light_fade"
  | "blur_fade"
  | "slide_left"
  | "slide_right"
  | "slide_up"
  | "slide_down"
  | "whip"
  | "soft_dissolve"
  | "push_transition";

export type Easing = "linear" | "ease_in" | "ease_out" | "ease_in_out" | "smooth_step";

export interface EmotionMotionRule {
  emotion: EmotionTag;
  motion: MotionType;
  intensity: MotionIntensity;
  transition?: TransitionStyle;
  holdModifier?: number;
  description: string;
}

export interface HoldRule {
  minDuration: number;
  maxDuration: number;
  baseWordsPerSecond: number;
  importanceBonus: number;
  viewerProcessingTime: number;
  pauseExtension: number;
}

export interface ZoomRule {
  allowed: boolean;
  triggerOnUnderstanding: boolean;
  triggerOnEmotion: boolean;
  triggerOnFocus: boolean;
  triggerOnReveal: boolean;
  minZoom: number;
  maxZoom: number;
  defaultSpeed: number;
}

export interface PanRule {
  allowed: boolean;
  triggerOnNarrationContinue: boolean;
  triggerOnLargeEnvironment: boolean;
  triggerOnObjectRelation: boolean;
  triggerOnJourney: boolean;
  defaultSpeed: number;
  maxDistance: number;
}

export interface ParallaxConfig {
  enabled: boolean;
  foregroundSpeed: number;
  middleSpeed: number;
  backgroundSpeed: number;
  maxDepth: number;
  subtlety: number;
}

export interface WordEmphasisMotion {
  enabled: boolean;
  pauseBefore: number;
  pushDuration: number;
  insertDuration: number;
  returnDuration: number;
  motionType: MotionType;
  intensity: MotionIntensity;
}

export interface TransitionRule {
  fromEmotion: EmotionTag;
  toEmotion: EmotionTag;
  transition: TransitionStyle;
  duration: number;
  easing: Easing;
}

export interface BreathingPattern {
  stillness: number;
  smallMotion: number;
  pushDuration: number;
  holdAfterPush: number;
  panDuration: number;
  repeat: boolean;
}

export interface RhythmProfile {
  fastStoryCutsPerMinute: number;
  slowStoryHoldsPerMinute: number;
  defaultCutsPerMinute: number;
  smoothingWindow: number;
}

export interface MotionValidationRule {
  minSceneDuration: number;
  maxSceneDuration: number;
  voiceTimingTolerance: number;
  minImageQuality: number;
  cropSafetyMargin: number;
  faceSafetyMargin: number;
  objectSafetyMargin: number;
  subtitleSafeBottom: number;
  subtitleSafeTop: number;
}

export interface EffectRule {
  softGlow: boolean;
  lightRays: boolean;
  depthBlur: boolean;
  particleDust: boolean;
  filmGrain: boolean;
  lensBloom: boolean;
  heavyGlitch: boolean;
  rgbSplit: boolean;
  flashOveruse: boolean;
  tiktokEffects: boolean;
}

export interface Whispersync {
  words: Array<{ word: string; start: number; end: number }>;
  phrases: Array<{ text: string; start: number; end: number }>;
  sentences: Array<{ text: string; start: number; end: number }>;
  scenes: Array<{ index: number; start: number; end: number }>;
}

export interface MotionClip {
  scene: number;
  motion: MotionType;
  start: number;
  end: number;
  easing: Easing;
  intensity: MotionIntensity;
  emotion: EmotionTag;
  wordInsert?: { word: string; start: number; end: number };
  transition?: TransitionStyle;
  transitionDuration?: number;
}

export interface MotionValidationReport {
  smoothness: number;
  purpose: number;
  emotionMatch: number;
  voiceMatch: number;
  viewerComfort: number;
  professionalScore: number;
  overall: number;
  issues: string[];
}

export interface EditingPreset {
  name: string;
  description: string;
  defaultMotion: MotionType;
  defaultIntensity: MotionIntensity;
  defaultTransition: TransitionStyle;
  holdRule: HoldRule;
  zoomRule: ZoomRule;
  panRule: PanRule;
  parallax: ParallaxConfig;
  wordEmphasis: WordEmphasisMotion;
  rhythm: RhythmProfile;
  breathing: BreathingPattern;
  effects: EffectRule;
  transitions: TransitionRule[];
  emotionMotionMap: EmotionMotionRule[];
}

export interface MotionTimeline {
  clips: MotionClip[];
  totalDuration: number;
  metadata: {
    preset: string;
    generatedAt: string;
    validated: boolean;
    validationScore: number;
  };
}
