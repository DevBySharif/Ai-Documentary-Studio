import type { EmotionTag } from "../story/types.js";

export type VisualTempo = "slow" | "medium" | "fast" | "dynamic";

export type InformationDensity = "low" | "medium" | "high" | "extreme";

export type RhythmSignature = "documentary" | "educational" | "motivational" | "storytelling" | "news";

export interface RhythmBlock {
  segment: number;
  tempo: VisualTempo;
  holdDuration: number;
  motionDensity: number;
  attentionScore: number;
  informationDensity: InformationDensity;
  cognitiveLoad: number;
  energyLevel: number;
}

export interface AttentionCurvePoint {
  time: number;
  score: number;
  phase: string;
}

export interface CognitiveLoadEstimate {
  load: number;
  factors: { abstract: number; narrationSpeed: number; terminology: number; complexity: number };
  recommendation: string;
}

export interface VisualFatigueReport {
  fatigueLevel: number;
  rapidCuts: number;
  excessiveMotion: boolean;
  frequentChanges: boolean;
  recommendedAction: string;
}

export interface HoldRecommendation {
  currentDuration: number;
  recommendedDuration: number;
  reason: string;
}

export interface VisualBreathingResult {
  moments: Array<{ start: number; end: number; type: "stillness" | "drift" | "pause" }>;
  totalBreathingTime: number;
}

export interface RhythmValidation {
  tooManyCuts: boolean;
  tooManyHolds: boolean;
  motionOverload: boolean;
  emptyTimeline: boolean;
  abruptTempoChanges: boolean;
  viewerFatigueRisk: boolean;
  passed: boolean;
  warnings: string[];
}

export interface ViewerAttentionPrediction {
  time: number;
  currentAttention: number;
  predictedDrop: boolean;
  boredomRisk: number;
  recommendation: string;
}

export interface CognitivePacingResult {
  segment: number;
  informationReceived: number;
  informationProcessed: number;
  understood: boolean;
  shouldExtendHold: boolean;
  shouldReduceMotion: boolean;
  shouldDelayTransition: boolean;
  recommendedHoldExtension: number;
}

export interface RhythmSignatureProfile {
  name: RhythmSignature;
  baseTempo: VisualTempo;
  holdMultiplier: number;
  motionDensity: number;
  breathingFrequency: number;
  cutThreshold: number;
  emphasisLevel: string;
}
