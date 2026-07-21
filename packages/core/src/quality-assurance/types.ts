export type QAVisualMetric = "sharpness" | "frameStability" | "colorConsistency" | "lighting" | "artifacts" | "noise" | "compressionQuality";

export type QAAudioMetric = "narrationClarity" | "musicBalance" | "noise" | "clipping" | "lufs" | "stereoCompatibility" | "dynamicRange";

export type QASubtitleMetric = "wordTiming" | "sentenceTiming" | "readingSpeed" | "safeArea" | "fontConsistency" | "highlightAccuracy";

export type QAMotionMetric = "cameraSmoothness" | "motionSpeed" | "parallaxStability" | "zoomQuality" | "motionContinuity";

export type QAEffectMetric = "bloom" | "grain" | "blur" | "fog" | "glow" | "transitions";

export type QAStyleDimension = "colorStyle" | "motionStyle" | "subtitleStyle" | "cameraStyle" | "lightingStyle" | "visualIdentity";

export type QAArtifactType = "compression" | "ghosting" | "flicker" | "banding" | "aliasing" | "droppedFrames" | "duplicateFrames";

export type QAIssueSeverity = "info" | "warning" | "critical";

export interface QAMetricResult {
  name: string;
  score: number;
  passed: boolean;
  details: string[];
}

export interface QAVisualReport {
  sharpness: number;
  frameStability: number;
  colorConsistency: number;
  lighting: number;
  artifacts: number;
  noise: number;
  compressionQuality: number;
  overall: number;
  issues: QAIssue[];
}

export interface QAAudioReport {
  narrationClarity: number;
  musicBalance: number;
  noise: number;
  clipping: number;
  lufs: number;
  stereoCompatibility: number;
  dynamicRange: number;
  overall: number;
  issues: QAIssue[];
}

export interface QASubtitleReport {
  wordTiming: number;
  sentenceTiming: number;
  readingSpeed: number;
  safeArea: number;
  fontConsistency: number;
  highlightAccuracy: number;
  overall: number;
  issues: QAIssue[];
}

export interface QAMotionReport {
  cameraSmoothness: number;
  motionSpeed: number;
  parallaxStability: number;
  zoomQuality: number;
  motionContinuity: number;
  overall: number;
  issues: QAIssue[];
}

export interface QAEffectReport {
  bloom: number;
  grain: number;
  blur: number;
  fog: number;
  glow: number;
  transitions: number;
  overall: number;
  issues: QAIssue[];
}

export interface QAStyleReport {
  colorStyle: number;
  motionStyle: number;
  subtitleStyle: number;
  cameraStyle: number;
  lightingStyle: number;
  visualIdentity: number;
  overall: number;
  deviations: string[];
}

export interface QAIssue {
  type: string;
  severity: QAIssueSeverity;
  description: string;
  autoFixable: boolean;
  autoFixed: boolean;
  suggestedFix: string;
}

export interface QAAutoFix {
  issueType: string;
  correction: string;
  applied: boolean;
}

export interface QAManualFlag {
  issue: string;
  severity: QAIssueSeverity;
  reason: string;
}

export interface QAArtifactReport {
  compression: number;
  ghosting: number;
  flicker: number;
  banding: number;
  aliasing: number;
  droppedFrames: number;
  duplicateFrames: number;
  overall: number;
  hasIssues: boolean;
}

export interface QASyncReport {
  voiceToSubtitle: number;
  subtitleToMotion: number;
  motionToScene: number;
  sceneToTransition: number;
  overall: number;
  allSynced: boolean;
}

export interface QATimelineReport {
  missingScenes: number;
  emptyTimelines: number;
  subtitleGaps: number;
  audioGaps: number;
  brokenTransitions: number;
  overall: number;
  hasIssues: boolean;
}

export interface QAAccessibilityReport {
  subtitleContrast: number;
  fontSize: number;
  readingSpeed: number;
  colorAccessibility: number;
  mobileVisibility: number;
  overall: number;
  passed: boolean;
}

export interface QAExportReport {
  codec: boolean;
  resolution: boolean;
  frameRate: boolean;
  bitrate: boolean;
  audioCodec: boolean;
  metadata: boolean;
  containerIntegrity: boolean;
  overall: boolean;
}

export interface QAScore {
  visual: number;
  audio: number;
  subtitle: number;
  motion: number;
  consistency: number;
  overall: number;
}

export interface QAOutputContract {
  overallScore: number;
  status: string;
  warnings: number;
  critical: number;
  autoFixed: number;
}

export interface QAValidationResult {
  visual: boolean;
  audio: boolean;
  subtitle: boolean;
  motion: boolean;
  timeline: boolean;
  exportIntegrity: boolean;
  passed: boolean;
}

export interface QAZennProfile {
  pacing: string;
  grading: string;
  motion: string;
  readability: string;
  narration: string;
  effects: string;
  exportQuality: string;
}

export interface QAStyleGuardianReport {
  artStyle: number;
  characterConsistency: number;
  colorPalette: number;
  cameraLanguage: number;
  motionLanguage: number;
  typography: number;
  overall: number;
  flaggedScenes: string[];
  deviations: string[];
}

export interface QAStoryFlowReport {
  sceneTransitions: number;
  emotionalPacing: number;
  informationDensity: number;
  visualRhythm: number;
  pausePlacement: number;
  viewerAttention: number;
  overall: number;
  recommendations: string[];
}

export interface QACertificate {
  productionId: string;
  renderProfile: string;
  channelDnaVersion: string;
  qaScore: number;
  renderDate: string;
  exportFormat: string;
  approvalStatus: string;
}
