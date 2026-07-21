export type Difficulty = "beginner" | "intermediate" | "advanced";
export type AgeGroup = "13-17" | "18-24" | "25-34" | "35-44" | "45+";
export type ViewingIntent = "learn" | "explore" | "be_inspired" | "be_entertained";
export type WatchMotivation = "curiosity" | "self_improvement" | "entertainment" | "education";
export type ExpectedKnowledge = "none" | "basic" | "moderate" | "advanced";

export type CoreEmotion =
  | "curiosity" | "fear" | "wonder" | "hope" | "suspense"
  | "calm" | "mystery" | "urgency" | "reflection";

export type StoryObjective =
  | "introduce" | "explain" | "compare" | "reveal"
  | "challenge_beliefs" | "teach" | "inspire" | "warn";

export type VisualObjective =
  | "minimal" | "symbolic" | "scientific" | "cinematic"
  | "emotional" | "abstract" | "literal" | "metaphorical";

export type EditingObjective =
  | "slow_documentary" | "fast_documentary" | "explainer"
  | "educational" | "cinematic" | "minimal" | "dynamic";

export type VoiceEnergy = "low" | "medium" | "high";
export type SpeakingSpeed = "slow" | "normal" | "fast";
export type PauseFrequency = "few" | "normal" | "many";
export type SilenceUsage = "minimal" | "moderate" | "purposeful";
export type SubtitleDensity = "none" | "key_points" | "full";

export interface AudienceProfile {
  level: Difficulty;
  ageGroup: AgeGroup;
  viewingIntent: ViewingIntent;
  watchMotivation: WatchMotivation;
  expectedKnowledge: ExpectedKnowledge;
}

export interface ProjectIdentity {
  projectName: string;
  topic: string;
  category: string;
  keywords: string[];
  primarySubject: string;
  secondarySubject?: string;
  difficulty: Difficulty;
  estimatedRuntime: number;
  language: string;
}

export interface AudioObjective {
  voiceEnergy: VoiceEnergy;
  speakingSpeed: SpeakingSpeed;
  pauseFrequency: PauseFrequency;
  emotion: CoreEmotion;
  silenceUsage: SilenceUsage;
  subtitleDensity: SubtitleDensity;
}

export interface VisualMetaphorEntry {
  concept: string;
  metaphor: string;
  description: string;
  promptTemplate: string;
}

export interface ProjectColorLanguage {
  dominant: string[];
  accent: string[];
  background: string[];
  emotion: string;
}

export interface CameraLanguage {
  reflection: string;
  explanation: string;
  concept: string;
  emotion: string;
  default: string;
}

export interface ProjectPacingProfile {
  averageSceneDuration: number;
  informationDensity: number;
  pauseFrequency: number;
  transitionFrequency: number;
  zoomFrequency: number;
  motionFrequency: number;
}

export interface ImageStrategy {
  maxNewImages: number;
  maxImageReuse: number;
  wordLevelImages: number;
  conceptImages: number;
  sceneImages: number;
  backgroundImages: number;
}

export interface NarrativeMemory {
  mainQuestion: string;
  miniQuestions: string[];
  solvedQuestions: Array<{ question: string; answer: string }>;
  pendingReveals: string[];
  sceneProgression: {
    total: number;
    completed: number[];
    currentIndex: number;
  };
  emotionalProgression: CoreEmotion[];
}

export interface ProjectIntelligenceProfile {
  avoidList: string[];
  preferredPatterns: string[];
  riskDetection: Array<{
    risk: string;
    severity: "low" | "medium" | "high";
    condition: string;
    action: string;
  }>;
}

export interface ProjectQualityRules {
  minimumStoryScore: number;
  minimumPromptScore: number;
  minimumVisualScore: number;
  minimumRetentionScore: number;
  minimumTimelineScore: number;
}

export interface ProjectBlueprint {
  videoGoal: string;
  coreQuestion: string;
  coreMessage: string;
  learningObjective: string;
  emotionTimeline: Array<{
    phase: string;
    emotion: CoreEmotion;
    duration: number;
    intensity: number;
  }>;
  storyArc: string;
  visualIdentity: string;
  editingIdentity: string;
  estimatedRuntime: number;
  sceneCount: number;
  approved: boolean;
}

export interface ProjectDNA {
  identity: ProjectIdentity;
  audience: AudienceProfile;
  coreEmotion: CoreEmotion;
  learningObjective: string;
  storyObjective: StoryObjective;
  visualObjective: VisualObjective;
  editingObjective: EditingObjective;
  audio: AudioObjective;
  metaphorLibrary: VisualMetaphorEntry[];
  colorLanguage: ProjectColorLanguage;
  cameraLanguage: CameraLanguage;
  pacing: ProjectPacingProfile;
  imageStrategy: ImageStrategy;
  narrativeMemory: NarrativeMemory;
  intelligence: ProjectIntelligenceProfile;
  quality: ProjectQualityRules;
  blueprint: ProjectBlueprint;
  metadata: ProjectMetadata;
}

export interface ProjectMetadata {
  id: string;
  channelDnaId: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  changeLog: string[];
  generationTime?: number;
}

export interface CompiledProjectProfile {
  source: ProjectDNA;
  compiledAt: string;
  version: string;
  runtime: {
    identity: Record<string, unknown>;
    emotion: Record<string, unknown>;
    visual: Record<string, unknown>;
    editing: Record<string, unknown>;
    pacing: Record<string, unknown>;
    intelligence: ProjectIntelligenceProfile;
  };
  cache: {
    metaphorLookup: Record<string, string>;
    colorMap: Record<string, string[]>;
    cameraMap: Record<string, string>;
    avoidSet: Set<string>;
    patternSet: Set<string>;
  };
  validation: {
    passed: boolean;
    score: number;
    checks: Array<{ field: string; status: "pass" | "warn" | "fail"; message: string }>;
  };
}
