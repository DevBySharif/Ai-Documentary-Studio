import type { MasterTimeline } from "../timeline/types.js";

export type OptimizationPass = "semantic" | "image" | "motion" | "rhythm" | "sync" | "final";

export interface OptimizationResult {
  pass: OptimizationPass;
  changes: number;
  improvements: string[];
  score: number;
}

export interface TimelineCandidate {
  id: string;
  timeline: MasterTimeline;
  scores: TimelineScores;
  totalScore: number;
}

export interface TimelineScores {
  storyFlow: number;
  visualFlow: number;
  synchronization: number;
  motion: number;
  retention: number;
  viewerComfort: number;
  semanticContinuity: number;
  overall: number;
}

export interface OptimizationReport {
  originalScore: number;
  finalScore: number;
  passes: OptimizationResult[];
  improvements: string[];
  autoRepairs: number;
  totalChanges: number;
}

export interface HoldOptimization {
  segment: number;
  currentDuration: number;
  recommendedDuration: number;
  viewerProcessingTime: number;
  adjusted: boolean;
}

export interface TransitionOptimization {
  segment: number;
  currentTransition: string;
  recommendedTransition: string;
  issue: string;
}

export interface ProductionOptimization {
  target: string;
  issue: string;
  recommendation: string;
  expectedImprovement: number;
  crossEngine: boolean;
}
