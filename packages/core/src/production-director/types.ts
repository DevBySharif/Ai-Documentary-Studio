export type PDProjectStage = "planning" | "generating" | "review" | "rendering" | "qa" | "export" | "published";

export type PDEngineType =
  | "script" | "prompt" | "image_approval" | "voice" | "timeline"
  | "motion" | "subtitle" | "effects" | "qa" | "export";

export type PDDecision = "approve" | "reject" | "regenerate" | "adjust";

export type PDIssueSeverity = "info" | "warning" | "critical";

export type PDResourceType = "cpu" | "gpu" | "ram" | "disk" | "network";

export type PDScheduleMode = "sequential" | "parallel" | "background";

export interface PDProductionState {
  stage: PDProjectStage;
  completedStages: PDEngineType[];
  currentEngine: PDEngineType | null;
  approvedScenes: number;
  totalScenes: number;
  progress: number;
}

export interface PDDecisionRequest {
  engine: PDEngineType;
  context: string;
  data: Record<string, unknown>;
}

export interface PDDecisionResult {
  decision: PDDecision;
  reason: string;
  requiresRegeneration: boolean;
  affectedEngines: PDEngineType[];
}

export interface PDResourceUsage {
  cpu: number;
  gpu: number;
  ram: number;
  disk: number;
  network: number;
}

export interface PDScheduledTask {
  id: string;
  engine: PDEngineType;
  mode: PDScheduleMode;
  priority: number;
  estimatedDuration: number;
  dependencies: string[];
}

export interface PDContinuityCheck {
  characters: boolean;
  clothing: boolean;
  environment: boolean;
  lighting: boolean;
  cameraDirection: boolean;
  colorPalette: boolean;
  sceneTransitions: boolean;
  allConsistent: boolean;
}

export interface PDRegenerationPlan {
  affectedComponents: string[];
  scope: "single" | "dependent" | "full";
  estimatedTime: number;
}

export interface PDFailureReport {
  failedEngine: PDEngineType;
  failedStage: string;
  preservedWork: boolean;
  restartScope: "module" | "stage" | "full";
  recoverable: boolean;
}

export interface PDChannelDNAEnforcementResult {
  storyStructure: boolean;
  characterStyle: boolean;
  artStyle: boolean;
  promptStyle: boolean;
  motionLanguage: boolean;
  subtitleLanguage: boolean;
  colorLanguage: boolean;
  cameraLanguage: boolean;
  allPassed: boolean;
}

export interface PDPluginCatalog {
  llmProviders: string[];
  imageGenerators: string[];
  ttsEngines: string[];
  transcriptionEngines: string[];
  renderBackends: string[];
  qaModules: string[];
}

export interface PDExplanation {
  decision: string;
  reason: string;
  context: string;
  confidence: number;
}

export interface PDUIInteraction {
  currentStage: string;
  progress: number;
  warnings: string[];
  estimatedTime: string;
  resourceUsage: PDResourceUsage;
  qualityStatus: string;
}

export interface PDMemoryEntry {
  type: string;
  key: string;
  value: unknown;
  timestamp: number;
}

export interface PDOutputContract {
  project: string;
  approvedScenes: number;
  qa: string;
  export: string;
  status: string;
}

export interface PDValidationResult {
  previousStageApproved: boolean;
  assetsAvailable: boolean;
  timelineValid: boolean;
  audioSynchronized: boolean;
  sceneComplete: boolean;
  channelDNAPreserved: boolean;
  passed: boolean;
}

export interface PDZennProfile {
  philosophy: string;
  pacing: string;
  consistency: string;
  effects: string;
  quality: string;
}
