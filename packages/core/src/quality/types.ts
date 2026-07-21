export interface CategoryScore {
  score: number;
  maxScore: number;
  passed: boolean;
  warnings: string[];
  failures: string[];
}

export interface QualityScorecard {
  story: CategoryScore;
  script: CategoryScore;
  prompt: CategoryScore;
  image: CategoryScore;
  visualContinuity: CategoryScore;
  audio: CategoryScore;
  synchronization: CategoryScore;
  motion: CategoryScore;
  timeline: CategoryScore;
  overall: number;
  status: ProductionStatus;
}

export type ProductionStatus = "ready" | "minor_fix_needed" | "major_revision_needed" | "rejected";

export interface RetentionPrediction {
  viewerDropRisk: number;
  slowSections: number[];
  overloadedSections: number[];
  repeatedVisuals: number;
  weakCuriosity: boolean;
  weakEnding: boolean;
  estimatedRetention: number;
}

export interface SelfCritiqueReport {
  engine: string;
  passed: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

export interface CrossEngineIssue {
  engines: [string, string];
  description: string;
  severity: "low" | "medium" | "high";
  recommendedAction: string;
}

export type AutoRepairActionType =
  | "regenerate_prompt"
  | "replace_image"
  | "adjust_motion"
  | "rewrite_hook"
  | "retime_scene"
  | "adjust_audio"
  | "fix_transition"
  | "retry_generation";

export interface AutoRepairAction {
  type: AutoRepairActionType;
  targetId: string;
  description: string;
  priority: number;
  automatic: boolean;
}

export interface FailureReport {
  issue: string;
  cause: string;
  affectedModule: string;
  suggestedFix: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface QualityGate {
  name: string;
  index: number;
  passed: boolean;
  score: number;
  requiredScore: number;
  failures: string[];
}

export interface ProductionCommandCenter {
  storyScore: number;
  promptScore: number;
  imageScore: number;
  audioScore: number;
  motionScore: number;
  syncScore: number;
  renderReadiness: ProductionStatus;
  autoRepairSuggestions: AutoRepairAction[];
  estimatedRenderTime: number;
  estimatedImageReusePercentage: number;
  estimatedViewerRetentionScore: number;
  gates: QualityGate[];
  report: QualityScorecard;
}

export interface QualityMemoryEntry {
  projectId: string;
  scorecard: QualityScorecard;
  retentionPrediction: RetentionPrediction;
  renderSuccess: boolean;
  viewerAnalytics?: Record<string, unknown>;
  createdAt: string;
}

export interface QualityInspectionResult {
  passed: boolean;
  scorecard: QualityScorecard;
  retention: RetentionPrediction;
  selfCritiques: SelfCritiqueReport[];
  crossEngineIssues: CrossEngineIssue[];
  autoRepairs: AutoRepairAction[];
  failures: FailureReport[];
  commandCenter: ProductionCommandCenter;
  summary: string;
}
